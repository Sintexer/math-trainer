import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import {
  ALL_DIFFICULTIES,
  type Difficulty,
  type MasteryStars,
  type MasteryThresholds,
} from '@/shared/types'
import type { SessionSummary } from '@/features/session'
import type {
  DailyChallengeResult,
  TechniqueProgress,
  UserProgress,
  UserSettings,
} from './types'
import { computeXp } from '@/features/session/xp'

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

// Stars are monotonic — once earned, never lost.
function mergeStars(prev: MasteryStars, next: MasteryStars): MasteryStars {
  return {
    speed: prev.speed || next.speed,
    accuracy: prev.accuracy || next.accuracy,
    range: prev.range || next.range,
  }
}

function computeStars(
  progress: TechniqueProgress,
  thresholds: MasteryThresholds,
): MasteryStars {
  // Speed/Accuracy stars use the avg over recent drill sessions only —
  // challenge sessions are a separate gate (see challengePassed).
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
      }>,
    ) {
      const { summary, thresholds, passed } = action.payload
      const id = summary.techniqueId

      if (!state.techniqueProgress[id]) {
        state.techniqueProgress[id] = defaultTechniqueProgress()
      }
      const progress = state.techniqueProgress[id]

      // XP requires knowledge of session history (first-session bonus) — the
      // session engine cannot compute it; we do it here as the single source.
      const isFirstSession =
        progress.sessions.filter((s) => s.type === summary.type).length === 0
      const xpEarned = computeXp({
        correct: summary.correct,
        accuracyPct: summary.accuracyPct,
        speedPerMin: summary.speedPerMin,
        isFirstSession,
      })
      const persistedSummary: SessionSummary = { ...summary, xpEarned }

      progress.sessions = [...progress.sessions, persistedSummary].slice(
        -MAX_SESSIONS_RETAINED,
      )

      progress.totalCorrect += persistedSummary.correct
      progress.totalAttempted += persistedSummary.attempted
      if (persistedSummary.speedPerMin > progress.bestSpeedPerMin) {
        progress.bestSpeedPerMin = persistedSummary.speedPerMin
      }

      for (const d of persistedSummary.difficultiesAttempted) {
        if (!progress.difficultiesCovered.includes(d)) {
          progress.difficultiesCovered.push(d)
        }
      }

      if (persistedSummary.type === 'challenge' && passed) {
        progress.challengePassed = true
      }

      progress.stars = mergeStars(progress.stars, computeStars(progress, thresholds))

      state.xp += xpEarned
      state.level = Math.floor(state.xp / 1000)
    },

    completeDailyChallenge(state, action: PayloadAction<DailyChallengeResult>) {
      const result = action.payload
      state.dailyChallenges[result.date] = result

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

    /** Replace all progress. Caller must validate first (see isValidUserProgress). */
    importProgress(_state, action: PayloadAction<UserProgress>) {
      return action.payload
    },

    resetProgress() {
      return initialState
    },
  },
})

/** Minimal structural validator for imported progress JSON. */
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

export { defaultTechniqueProgress, initialState as initialProgressState }
export type { Difficulty }
