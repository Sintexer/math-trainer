import { describe, it, expect } from 'vitest'
import {
  flashSessionReducer,
  createFlashIdleState,
  computeCardsPerMin,
  type FlashSessionState,
  type FlashAction,
} from './flashSessionReducer'
import type { Problem } from '@/shared/types'

function makeProblems(count: number): Problem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `p${i}`,
    techniqueId: 'add-speed-1d2d',
    topicId: 'addition' as const,
    difficulty: 'easy' as const,
    prompt: `${i} + 1 = ?`,
    answer: i + 1,
  }))
}

function applyActions(actions: FlashAction[], initial: FlashSessionState = createFlashIdleState()): FlashSessionState {
  return actions.reduce((s, a) => flashSessionReducer(s, a), initial)
}

describe('flashSessionReducer', () => {
  it('starts from idle with problems', () => {
    const problems = makeProblems(3)
    const state = applyActions([{ type: 'start', problems, now: 1000 }])
    expect(state.status).toBe('running')
    expect(state.currentIndex).toBe(0)
    expect(state.problems).toHaveLength(3)
    expect(state.sessionStartedAt).toBe(1000)
    expect(state.cardStartedAt).toBe(1000)
  })

  it('ignores start when not idle', () => {
    const problems = makeProblems(2)
    const state = applyActions([
      { type: 'start', problems, now: 1000 },
      { type: 'start', problems: makeProblems(5), now: 2000 },
    ])
    expect(state.problems).toHaveLength(2)
  })

  it('throws when started with empty problems', () => {
    expect(() =>
      flashSessionReducer(createFlashIdleState(), { type: 'start', problems: [], now: 0 }),
    ).toThrow()
  })

  it('advance moves to the next card and records card time', () => {
    const problems = makeProblems(3)
    const state = applyActions([
      { type: 'start', problems, now: 1000 },
      { type: 'advance', now: 1800 },
    ])
    expect(state.status).toBe('running')
    expect(state.currentIndex).toBe(1)
    expect(state.cardTimes).toEqual([800])
    expect(state.cardStartedAt).toBe(1800)
  })

  it('advance is ignored when not running', () => {
    const state = flashSessionReducer(createFlashIdleState(), { type: 'advance', now: 1000 })
    expect(state.status).toBe('idle')
  })

  it('advance on last card transitions to complete', () => {
    const problems = makeProblems(2)
    const state = applyActions([
      { type: 'start', problems, now: 0 },
      { type: 'advance', now: 500 },
      { type: 'advance', now: 900 },
    ])
    expect(state.status).toBe('complete')
    expect(state.currentIndex).toBe(2)
    expect(state.cardTimes).toEqual([500, 400])
  })

  it('full 3-card session records all card times', () => {
    const problems = makeProblems(3)
    const state = applyActions([
      { type: 'start', problems, now: 0 },
      { type: 'advance', now: 1000 },
      { type: 'advance', now: 1600 },
      { type: 'advance', now: 2000 },
    ])
    expect(state.status).toBe('complete')
    expect(state.cardTimes).toEqual([1000, 600, 400])
  })
})

describe('computeCardsPerMin', () => {
  it('returns 0 for idle state', () => {
    expect(computeCardsPerMin(createFlashIdleState(), 5000)).toBe(0)
  })

  it('computes cards per minute correctly', () => {
    const problems = makeProblems(5)
    // Advance 2 cards in 30s (0.5 min) → 4/min
    const state = applyActions([
      { type: 'start', problems, now: 0 },
      { type: 'advance', now: 10000 },
      { type: 'advance', now: 20000 },
    ])
    expect(computeCardsPerMin(state, 30000)).toBe(4)
  })
})
