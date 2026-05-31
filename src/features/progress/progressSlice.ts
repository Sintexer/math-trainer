import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type {
  UserProgress,
  TopicProgress,
  SessionSummary,
  UserSettings,
  DailyChallengeResult,
  MasteryStars,
} from '@/shared/types'

export const SCHEMA_VERSION = 1

const defaultTopicProgress = (): TopicProgress => ({
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
  topicProgress: {},
  dailyChallenges: {},
  settings: { pactModeEnabled: false },
  schemaVersion: SCHEMA_VERSION,
}

// ── XP Formula ───────────────────────────────────────────────

function calculateXp(summary: SessionSummary): number {
  let xp = summary.correct * 10
  if (summary.accuracyPct >= 95) xp += 50
  else if (summary.accuracyPct >= 80) xp += 25
  if (summary.speedPerMin >= 8) xp += 20
  else if (summary.speedPerMin >= 5) xp += 10
  return xp
}

// ── Mastery Star Calculation ──────────────────────────────────

function recalculateStars(progress: TopicProgress, thresholds: { speedPerMin: number; accuracyPct: number }): MasteryStars {
  const recentSessions = progress.sessions.slice(-5)

  const avgAccuracy =
    recentSessions.length > 0
      ? recentSessions.reduce((sum, s) => sum + s.accuracyPct, 0) / recentSessions.length
      : 0

  return {
    // Speed star: must pass the challenge
    speed: progress.challengePassed,
    // Accuracy star: avg accuracy over last 5 sessions hits threshold
    accuracy: recentSessions.length >= 3 && avgAccuracy >= thresholds.accuracyPct,
    // Range star: has attempted all 3 difficulties
    range: ['easy', 'medium', 'hard'].every((d) =>
      progress.difficultiesCovered.includes(d as never)
    ),
  }
}

// ── Slice ─────────────────────────────────────────────────────

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    markTechniqueRead(state, action: PayloadAction<string>) {
      const id = action.payload
      if (!state.topicProgress[id]) {
        state.topicProgress[id] = defaultTopicProgress()
      }
      state.topicProgress[id].techniqueRead = true
    },

    completeSession(
      state,
      action: PayloadAction<{
        summary: SessionSummary
        thresholds: { speedPerMin: number; accuracyPct: number }
        passed?: boolean
      }>
    ) {
      const { summary, thresholds, passed } = action.payload
      const id = summary.techniqueId

      if (!state.topicProgress[id]) {
        state.topicProgress[id] = defaultTopicProgress()
      }

      const progress = state.topicProgress[id]

      // Update sessions (keep last 20)
      progress.sessions = [...progress.sessions, summary].slice(-20)

      // Update aggregates
      progress.totalCorrect += summary.correct
      progress.totalAttempted += summary.attempted

      if (summary.speedPerMin > progress.bestSpeedPerMin) {
        progress.bestSpeedPerMin = summary.speedPerMin
      }

      // Track difficulties covered from breakdown data
      if (!progress.difficultiesCovered.includes('easy')) {
        progress.difficultiesCovered.push('easy')
      }

      // Challenge pass
      if (summary.type === 'challenge' && passed) {
        progress.challengePassed = true
      }

      // Recalculate stars
      progress.stars = recalculateStars(progress, thresholds)

      // Add XP and level
      const xp = calculateXp(summary)
      state.xp += xp
      state.level = Math.floor(state.xp / 1000)
    },

    completeDailyChallenge(state, action: PayloadAction<DailyChallengeResult>) {
      const result = action.payload
      state.dailyChallenges[result.date] = result
    },

    togglePactMode(state) {
      state.settings.pactModeEnabled = !state.settings.pactModeEnabled
    },

    updateSettings(state, action: PayloadAction<Partial<UserSettings>>) {
      state.settings = { ...state.settings, ...action.payload }
    },

    importProgress(_state, action: PayloadAction<UserProgress>) {
      return action.payload
    },

    resetProgress() {
      return initialState
    },
  },
})

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
