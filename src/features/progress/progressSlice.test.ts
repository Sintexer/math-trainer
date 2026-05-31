import { describe, it, expect, beforeEach } from 'vitest'
import progressReducer, {
  markTechniqueRead,
  completeSession,
  togglePactMode,
  resetProgress,
  initialProgressState,
  isValidUserProgress,
  MASTERY_WINDOW,
  MIN_SESSIONS_FOR_ACCURACY_STAR,
} from '@/features/progress/progressSlice'
import type { SessionSummary, UserProgress, MasteryThresholds } from '@/shared/types'

const THRESHOLDS: MasteryThresholds = { speedPerMin: 6, accuracyPct: 90 }

// ── Helpers ──────────────────────────────────────────────────
//
// Tests drive the pure reducer directly. We avoid the persisted singleton
// store so test files cannot cross-contaminate.

function makeSummary(overrides: Partial<SessionSummary> = {}): SessionSummary {
  return {
    id: 'test-session-1',
    type: 'drill',
    techniqueId: 'mul-by-11',
    date: new Date().toISOString(),
    correct: 12,
    attempted: 15,
    accuracyPct: 80,
    speedPerMin: 4,
    xpEarned: 0,
    weakTechniqueIds: [],
    techniqueBreakdown: {},
    difficultiesAttempted: ['easy'],
    ...overrides,
  }
}

let state: UserProgress

beforeEach(() => {
  state = progressReducer(undefined, resetProgress())
})

describe('progressSlice — basics', () => {
  it('starts with empty progress', () => {
    expect(state.xp).toBe(0)
    expect(state.level).toBe(0)
    expect(state.techniqueProgress).toEqual({})
  })

  it('markTechniqueRead sets the flag and creates the record lazily', () => {
    state = progressReducer(state, markTechniqueRead('mul-by-11'))
    expect(state.techniqueProgress['mul-by-11'].techniqueRead).toBe(true)
    expect(state.techniqueProgress['mul-by-9']).toBeUndefined()
  })

  it('togglePactMode flips the setting', () => {
    expect(state.settings.pactModeEnabled).toBe(false)
    state = progressReducer(state, togglePactMode())
    expect(state.settings.pactModeEnabled).toBe(true)
    state = progressReducer(state, togglePactMode())
    expect(state.settings.pactModeEnabled).toBe(false)
  })
})

describe('progressSlice — XP', () => {
  it('awards 10 XP per correct answer (no bonuses)', () => {
    state = progressReducer(
      state,
      completeSession({
        summary: makeSummary({ correct: 10, accuracyPct: 70, speedPerMin: 3 }),
        thresholds: THRESHOLDS,
      })
    )
    expect(state.xp).toBe(100)
  })

  it('adds the ≥95% accuracy bonus (+50)', () => {
    state = progressReducer(
      state,
      completeSession({
        summary: makeSummary({ correct: 10, accuracyPct: 95, speedPerMin: 3 }),
        thresholds: THRESHOLDS,
      })
    )
    expect(state.xp).toBe(150)
  })

  it('adds the ≥80% accuracy bonus (+25) without the higher tier', () => {
    state = progressReducer(
      state,
      completeSession({
        summary: makeSummary({ correct: 10, accuracyPct: 80, speedPerMin: 3 }),
        thresholds: THRESHOLDS,
      })
    )
    expect(state.xp).toBe(125)
  })

  it('adds the ≥8/min speed bonus (+20)', () => {
    state = progressReducer(
      state,
      completeSession({
        summary: makeSummary({ correct: 10, accuracyPct: 70, speedPerMin: 8 }),
        thresholds: THRESHOLDS,
      })
    )
    expect(state.xp).toBe(120)
  })

  it('writes computed xpEarned back onto the persisted session summary', () => {
    state = progressReducer(
      state,
      completeSession({
        summary: makeSummary({ correct: 10, accuracyPct: 95, speedPerMin: 8 }),
        thresholds: THRESHOLDS,
      })
    )
    const session = state.techniqueProgress['mul-by-11'].sessions[0]
    // 100 base + 50 accuracy + 20 speed = 170
    expect(session.xpEarned).toBe(170)
    expect(state.xp).toBe(170)
  })

  it('updates level as XP crosses 1000', () => {
    for (let i = 0; i < 10; i++) {
      state = progressReducer(
        state,
        completeSession({
          summary: makeSummary({ id: `s${i}`, correct: 12, accuracyPct: 95, speedPerMin: 8 }),
          thresholds: THRESHOLDS,
        })
      )
    }
    // 10 sessions × (120 base + 50 + 20) = 1900 → level 1
    expect(state.level).toBe(1)
  })
})

describe('progressSlice — challenge gate', () => {
  it('passing a challenge sets challengePassed', () => {
    state = progressReducer(
      state,
      completeSession({
        summary: makeSummary({ type: 'challenge', accuracyPct: 95, speedPerMin: 8 }),
        thresholds: THRESHOLDS,
        passed: true,
      })
    )
    expect(state.techniqueProgress['mul-by-11'].challengePassed).toBe(true)
  })

  it('failing a challenge does NOT set challengePassed', () => {
    state = progressReducer(
      state,
      completeSession({
        summary: makeSummary({ type: 'challenge', accuracyPct: 60, speedPerMin: 3 }),
        thresholds: THRESHOLDS,
        passed: false,
      })
    )
    expect(state.techniqueProgress['mul-by-11'].challengePassed).toBe(false)
  })

  it('challengePassed is monotonic — a later failure does not clear it', () => {
    state = progressReducer(
      state,
      completeSession({
        summary: makeSummary({ id: 'pass', type: 'challenge', accuracyPct: 95, speedPerMin: 8 }),
        thresholds: THRESHOLDS,
        passed: true,
      })
    )
    state = progressReducer(
      state,
      completeSession({
        summary: makeSummary({ id: 'fail', type: 'challenge', accuracyPct: 30, speedPerMin: 2 }),
        thresholds: THRESHOLDS,
        passed: false,
      })
    )
    expect(state.techniqueProgress['mul-by-11'].challengePassed).toBe(true)
  })
})

describe('progressSlice — mastery stars', () => {
  it('Speed star requires MASTERY_WINDOW drill sessions at or above threshold', () => {
    // One session over threshold: not enough.
    state = progressReducer(
      state,
      completeSession({
        summary: makeSummary({ id: 's0', accuracyPct: 70, speedPerMin: 10 }),
        thresholds: THRESHOLDS,
      })
    )
    expect(state.techniqueProgress['mul-by-11'].stars.speed).toBe(false)

    // Fill the window with passing drills.
    for (let i = 1; i < MASTERY_WINDOW; i++) {
      state = progressReducer(
        state,
        completeSession({
          summary: makeSummary({ id: `s${i}`, accuracyPct: 70, speedPerMin: 10 }),
          thresholds: THRESHOLDS,
        })
      )
    }
    expect(state.techniqueProgress['mul-by-11'].stars.speed).toBe(true)
  })

  it('Speed star does NOT come from passing the challenge alone', () => {
    state = progressReducer(
      state,
      completeSession({
        summary: makeSummary({ type: 'challenge', accuracyPct: 95, speedPerMin: 20 }),
        thresholds: THRESHOLDS,
        passed: true,
      })
    )
    expect(state.techniqueProgress['mul-by-11'].challengePassed).toBe(true)
    expect(state.techniqueProgress['mul-by-11'].stars.speed).toBe(false)
  })

  it(`Accuracy star requires at least ${MIN_SESSIONS_FOR_ACCURACY_STAR} drills at threshold`, () => {
    for (let i = 0; i < MIN_SESSIONS_FOR_ACCURACY_STAR - 1; i++) {
      state = progressReducer(
        state,
        completeSession({
          summary: makeSummary({ id: `s${i}`, accuracyPct: 95, speedPerMin: 3 }),
          thresholds: THRESHOLDS,
        })
      )
    }
    expect(state.techniqueProgress['mul-by-11'].stars.accuracy).toBe(false)
    state = progressReducer(
      state,
      completeSession({
        summary: makeSummary({ id: 'last', accuracyPct: 95, speedPerMin: 3 }),
        thresholds: THRESHOLDS,
      })
    )
    expect(state.techniqueProgress['mul-by-11'].stars.accuracy).toBe(true)
  })

  it('Accuracy star not earned below the threshold', () => {
    for (let i = 0; i < MIN_SESSIONS_FOR_ACCURACY_STAR; i++) {
      state = progressReducer(
        state,
        completeSession({
          summary: makeSummary({ id: `s${i}`, accuracyPct: 75, speedPerMin: 3 }),
          thresholds: THRESHOLDS,
        })
      )
    }
    expect(state.techniqueProgress['mul-by-11'].stars.accuracy).toBe(false)
  })

  it('Range star requires the user to cover all three difficulties', () => {
    state = progressReducer(
      state,
      completeSession({
        summary: makeSummary({ id: 'e', difficultiesAttempted: ['easy'] }),
        thresholds: THRESHOLDS,
      })
    )
    state = progressReducer(
      state,
      completeSession({
        summary: makeSummary({ id: 'm', difficultiesAttempted: ['medium'] }),
        thresholds: THRESHOLDS,
      })
    )
    expect(state.techniqueProgress['mul-by-11'].stars.range).toBe(false)
    state = progressReducer(
      state,
      completeSession({
        summary: makeSummary({ id: 'h', difficultiesAttempted: ['hard'] }),
        thresholds: THRESHOLDS,
      })
    )
    expect(state.techniqueProgress['mul-by-11'].stars.range).toBe(true)
  })

  it('Stars are monotonic — once earned, never lost', () => {
    // Earn accuracy star.
    for (let i = 0; i < MIN_SESSIONS_FOR_ACCURACY_STAR; i++) {
      state = progressReducer(
        state,
        completeSession({
          summary: makeSummary({ id: `s${i}`, accuracyPct: 95, speedPerMin: 3 }),
          thresholds: THRESHOLDS,
        })
      )
    }
    expect(state.techniqueProgress['mul-by-11'].stars.accuracy).toBe(true)

    // Tank accuracy enough that the window average would drop below threshold.
    for (let i = 0; i < MIN_SESSIONS_FOR_ACCURACY_STAR; i++) {
      state = progressReducer(
        state,
        completeSession({
          summary: makeSummary({ id: `b${i}`, accuracyPct: 10, speedPerMin: 3 }),
          thresholds: THRESHOLDS,
        })
      )
    }
    expect(state.techniqueProgress['mul-by-11'].stars.accuracy).toBe(true)
  })
})

describe('progressSlice — import validation', () => {
  it('rejects non-object payloads', () => {
    expect(isValidUserProgress(null)).toBe(false)
    expect(isValidUserProgress(42)).toBe(false)
    expect(isValidUserProgress('xp')).toBe(false)
  })

  it('rejects payloads missing required keys', () => {
    expect(isValidUserProgress({ xp: 0 })).toBe(false)
    expect(
      isValidUserProgress({
        xp: 0,
        level: 0,
        schemaVersion: 1,
        settings: { pactModeEnabled: true },
        techniqueProgress: {},
      })
    ).toBe(false) // missing dailyChallenges
  })

  it('accepts a freshly initialised state', () => {
    expect(isValidUserProgress(initialProgressState)).toBe(true)
  })
})
