import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type {
  UserProgress,
  TechniqueProgress,
  SessionSummary,
  UserSettings,
  DailyChallengeResult,
  MasteryStars,
  MasteryThresholds,
  Difficulty,
} from '@/shared/types'
import { ALL_DIFFICULTIES } from '@/shared/types'
import { computeXp } from '@/features/session/xp'

// ── Schema / retention constants ─────────────────────────────

export const SCHEMA_VERSION = 1

/** Hard cap on per-technique session history. Older sessions are dropped FIFO. */
export const MAX_SESSIONS_RETAINED = 20

/** Window used by mastery-star calculations (last N sessions). */
export const MASTERY_WINDOW = 5

/** Minimum sessions in the window before the Accuracy star may be earned —
 *  guards against single-session noise. */
export const MIN_SESSIONS_FOR_ACCURACY_STAR = 5

/** Cap on persisted daily challenge results (most recent N). */
export const MAX_DAILY_CHALLENGES_RETAINED = 90

// ── Defaults ─────────────────────────────────────────────────

const defaultTechniqueProgress = (): TechniqueProgress => ({
  techniqueRead: false,
  challengePassed: false,
  sessions: [],
  stars: { speed: false, accuracy: false, range: false },
  totalCorrect: 0,
  totalAttempted: 0,
  bestSpeedPerMin: 0,
  difficultiesCovered: [],
})

const initialState: UserProgress = {
  xp: 0,
  level: 0,
  techniqueProgress: {},
  dailyChallenges: {},
  settings: { pactModeEnabled: false },
  schemaVersion: SCHEMA_VERSION,
}

// ── Mastery Star Calculation ─────────────────────────────────

/** Stars are monotonic — once earned, never lost. Merges a freshly computed
 *  star set with the existing one by OR-ing each flag. */
function mergeStars(prev: MasteryStars, next: MasteryStars): MasteryStars {
  return {
    speed: prev.speed || next.speed,
    accuracy: prev.accuracy || next.accuracy,
    range: prev.range || next.range,
  }
}

function computeStars(
  progress: TechniqueProgress,
  thresholds: MasteryThresholds
): MasteryStars {
  // Speed star: avg speedPerMin over the last MASTERY_WINDOW drill sessions
  // meets or exceeds the technique's speed threshold. (Challenge sessions are
  // a separate gate — see `challengePassed`.)
  const recentDrills = progress.sessions
    .filter((s) => s.type === 'drill')
    .slice(-MASTERY_WINDOW)
  const avgSpeed =
    recentDrills.length > 0
      ? recentDrills.reduce((sum, s) => sum + s.speedPerMin, 0) / recentDrills.length
      : 0
  const avgAccuracy =
    recentDrills.length > 0
      ? recentDrills.reduce((sum, s) => sum + s.accuracyPct, 0) / recentDrills.length
      : 0

  return {
    speed:
      recentDrills.length >= MASTERY_WINDOW && avgSpeed >= thresholds.speedPerMin,
    accuracy:
      recentDrills.length >= MIN_SESSIONS_FOR_ACCURACY_STAR &&
      avgAccuracy >= thresholds.accuracyPct,
    range: ALL_DIFFICULTIES.every((d) => progress.difficultiesCovered.includes(d)),
  }
}

// ── Slice ─────────────────────────────────────────────────────

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    markTechniqueRead(state, action: PayloadAction<string>) {
      const id = action.payload
      if (!state.techniqueProgress[id]) {
        state.techniqueProgress[id] = defaultTechniqueProgress()
      }
      state.techniqueProgress[id].techniqueRead = true
    },

    completeSession(
      state,
      action: PayloadAction<{
        summary: SessionSummary
        thresholds: MasteryThresholds
        passed?: boolean
      }>
    ) {
      const { summary, thresholds, passed } = action.payload
      const id = summary.techniqueId

      if (!state.techniqueProgress[id]) {
        state.techniqueProgress[id] = defaultTechniqueProgress()
      }
      const progress = state.techniqueProgress[id]

      // ── XP: first-session bonus requires state — compute here, overwrite summary ──
      const prevSessionsForTier = progress.sessions.filter((s) => s.type === summary.type)
      const isFirstSession = prevSessionsForTier.length === 0
      const xpEarned = computeXp({
        correct: summary.correct,
        accuracyPct: summary.accuracyPct,
        speedPerMin: summary.speedPerMin,
        isFirstSession,
      })
      const persistedSummary: SessionSummary = { ...summary, xpEarned }

      // Sessions (FIFO trim)
      progress.sessions = [...progress.sessions, persistedSummary].slice(
        -MAX_SESSIONS_RETAINED
      )

      // Aggregates
      progress.totalCorrect += persistedSummary.correct
      progress.totalAttempted += persistedSummary.attempted
      if (persistedSummary.speedPerMin > progress.bestSpeedPerMin) {
        progress.bestSpeedPerMin = persistedSummary.speedPerMin
      }

      // Difficulties: union with this session's correctly-solved difficulties
      for (const d of persistedSummary.difficultiesAttempted) {
        if (!progress.difficultiesCovered.includes(d)) {
          progress.difficultiesCovered.push(d)
        }
      }

      // Challenge pass — separate one-way gate from the Speed star
      if (persistedSummary.type === 'challenge' && passed) {
        progress.challengePassed = true
      }

      // Stars: compute fresh, then OR with prior (monotonic)
      progress.stars = mergeStars(progress.stars, computeStars(progress, thresholds))

      // Global XP / level
      state.xp += xpEarned
      state.level = Math.floor(state.xp / 1000)
    },

    completeDailyChallenge(state, action: PayloadAction<DailyChallengeResult>) {
      const result = action.payload
      state.dailyChallenges[result.date] = result

      // Cap retention to the most recent MAX_DAILY_CHALLENGES_RETAINED dates.
      const dates = Object.keys(state.dailyChallenges).sort()
      const excess = dates.length - MAX_DAILY_CHALLENGES_RETAINED
      if (excess > 0) {
        for (const oldDate of dates.slice(0, excess)) {
          delete state.dailyChallenges[oldDate]
        }
      }
    },

    togglePactMode(state) {
      state.settings.pactModeEnabled = !state.settings.pactModeEnabled
    },

    updateSettings(state, action: PayloadAction<Partial<UserSettings>>) {
      state.settings = { ...state.settings, ...action.payload }
    },

    /** Replace all progress. Caller is responsible for validation (see
     *  isValidUserProgress) — invalid payloads will simply overwrite state
     *  and may corrupt subsequent operations. */
    importProgress(_state, action: PayloadAction<UserProgress>) {
      return action.payload
    },

    resetProgress() {
      return initialState
    },
  },
})

// ── Import validation ────────────────────────────────────────

/** Minimal structural validator for imported progress JSON. Does not
 *  attempt deep semantic validation; just rejects payloads that would
 *  immediately throw in selectors / reducers. */
export function isValidUserProgress(value: unknown): value is UserProgress {
  if (!value || typeof value !== 'object') return false
  const v = value as Record<string, unknown>
  if (typeof v.xp !== 'number' || typeof v.level !== 'number') return false
  if (typeof v.schemaVersion !== 'number') return false
  if (!v.settings || typeof v.settings !== 'object') return false
  if (typeof (v.settings as { pactModeEnabled: unknown }).pactModeEnabled !== 'boolean') {
    return false
  }
  if (!v.techniqueProgress || typeof v.techniqueProgress !== 'object') return false
  if (!v.dailyChallenges || typeof v.dailyChallenges !== 'object') return false
  return true
}

export const {
  markTechniqueRead,
  completeSession,
  completeDailyChallenge,
  togglePactMode,
  updateSettings,
  importProgress,
  resetProgress,
} = progressSlice.actions

export default progressSlice.reducer

// Re-export so tests / migrations can construct fresh state without poking
// at module internals.
export { defaultTechniqueProgress, initialState as initialProgressState }
export type { Difficulty }
