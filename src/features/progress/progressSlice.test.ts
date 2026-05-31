import { describe, it, expect } from 'vitest'
import { store } from '@/app/store'
import {
  markTechniqueRead,
  completeSession,
  togglePactMode,
  resetProgress,
} from '@/features/progress/progressSlice'
import {
  selectTechniqueRead,
  selectMasteryStars,
  selectXp,
  selectPactMode,
  selectChallengePassed,
} from '@/features/progress/selectors'
import type { SessionSummary } from '@/shared/types'

const THRESHOLDS = { speedPerMin: 6, accuracyPct: 90 }

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
    ...overrides,
  }
}

describe('progressSlice', () => {
  beforeEach(() => {
    store.dispatch(resetProgress())
  })

  it('starts with no technique read', () => {
    expect(selectTechniqueRead('mul-by-11')(store.getState())).toBe(false)
  })

  it('markTechniqueRead sets techniqueRead to true', () => {
    store.dispatch(markTechniqueRead('mul-by-11'))
    expect(selectTechniqueRead('mul-by-11')(store.getState())).toBe(true)
  })

  it('markTechniqueRead does not affect other techniques', () => {
    store.dispatch(markTechniqueRead('mul-by-11'))
    expect(selectTechniqueRead('mul-by-9')(store.getState())).toBe(false)
  })

  it('completeSession adds XP for correct answers', () => {
    store.dispatch(completeSession({ summary: makeSummary({ correct: 10, accuracyPct: 70, speedPerMin: 3 }), thresholds: THRESHOLDS }))
    // 10 correct × 10 = 100 XP base
    expect(selectXp(store.getState())).toBeGreaterThanOrEqual(100)
  })

  it('completeSession grants accuracy bonus for >= 95% accuracy', () => {
    store.dispatch(completeSession({ summary: makeSummary({ correct: 10, accuracyPct: 95, speedPerMin: 3 }), thresholds: THRESHOLDS }))
    // 100 base + 50 accuracy bonus
    expect(selectXp(store.getState())).toBeGreaterThanOrEqual(150)
  })

  it('completeSession grants speed bonus for >= 8 correct/min', () => {
    store.dispatch(completeSession({ summary: makeSummary({ correct: 10, accuracyPct: 70, speedPerMin: 8 }), thresholds: THRESHOLDS }))
    // 100 base + 20 speed bonus
    expect(selectXp(store.getState())).toBeGreaterThanOrEqual(120)
  })

  it('challenge pass earns speed star', () => {
    store.dispatch(completeSession({
      summary: makeSummary({ type: 'challenge', accuracyPct: 95, speedPerMin: 8 }),
      thresholds: THRESHOLDS,
      passed: true,
    }))
    expect(selectChallengePassed('mul-by-11')(store.getState())).toBe(true)
    expect(selectMasteryStars('mul-by-11')(store.getState()).speed).toBe(true)
  })

  it('challenge fail does not earn speed star', () => {
    store.dispatch(completeSession({
      summary: makeSummary({ type: 'challenge', accuracyPct: 60, speedPerMin: 3 }),
      thresholds: THRESHOLDS,
      passed: false,
    }))
    expect(selectMasteryStars('mul-by-11')(store.getState()).speed).toBe(false)
  })

  it('accuracy star earned after 3+ sessions at threshold', () => {
    for (let i = 0; i < 3; i++) {
      store.dispatch(completeSession({
        summary: makeSummary({ id: `s${i}`, accuracyPct: 92, speedPerMin: 5 }),
        thresholds: THRESHOLDS,
      }))
    }
    expect(selectMasteryStars('mul-by-11')(store.getState()).accuracy).toBe(true)
  })

  it('accuracy star not earned below threshold', () => {
    for (let i = 0; i < 3; i++) {
      store.dispatch(completeSession({
        summary: makeSummary({ id: `s${i}`, accuracyPct: 75, speedPerMin: 5 }),
        thresholds: THRESHOLDS,
      }))
    }
    expect(selectMasteryStars('mul-by-11')(store.getState()).accuracy).toBe(false)
  })

  it('togglePactMode flips the setting', () => {
    expect(selectPactMode(store.getState())).toBe(false)
    store.dispatch(togglePactMode())
    expect(selectPactMode(store.getState())).toBe(true)
    store.dispatch(togglePactMode())
    expect(selectPactMode(store.getState())).toBe(false)
  })
})
