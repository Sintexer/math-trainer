import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { createSeededRng } from '@/features/generators'
import { useDrillSession, DEFAULT_DRILL_PROBLEM_COUNT } from './useDrillSession'

const TECH = 'mul-by-11'

function setup(opts: { problemCount?: number; nowStart?: number } = {}) {
  let current = opts.nowStart ?? 1_000_000
  const now = vi.fn(() => current)
  const advanceTime = (ms: number) => {
    current += ms
  }
  const rng = createSeededRng(42)
  const view = renderHook(() =>
    useDrillSession({
      techniqueId: TECH,
      problemCount: opts.problemCount,
      now,
      rng,
    }),
  )
  return { view, now, advanceTime }
}

describe('useDrillSession', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts idle with no problems queued', () => {
    const { view } = setup()
    expect(view.result.current.state.status).toBe('idle')
    expect(view.result.current.currentProblem).toBeNull()
    expect(view.result.current.elapsedMs).toBe(0)
  })

  it('start() transitions to running and exposes the first problem', () => {
    const { view } = setup()
    act(() => view.result.current.start())
    expect(view.result.current.state.status).toBe('running')
    expect(view.result.current.state.problems).toHaveLength(DEFAULT_DRILL_PROBLEM_COUNT)
    expect(view.result.current.currentProblem).toBe(view.result.current.state.problems[0])
  })

  it('submitAnswer evaluates and records the answer', () => {
    const { view, advanceTime } = setup()
    act(() => view.result.current.start())
    const problem = view.result.current.currentProblem!
    advanceTime(2_000)
    act(() => view.result.current.submitAnswer(problem.answer))
    const s = view.result.current.state
    expect(s.status).toBe('evaluating')
    expect(s.answers).toHaveLength(1)
    expect(s.answers[0].correct).toBe(true)
    expect(s.answers[0].timeMs).toBe(2_000)
  })

  it('advance moves to the next problem', () => {
    const { view, advanceTime } = setup()
    act(() => view.result.current.start())
    const first = view.result.current.currentProblem!
    advanceTime(1_000)
    act(() => view.result.current.submitAnswer(first.answer))
    act(() => view.result.current.advance())
    expect(view.result.current.state.status).toBe('running')
    expect(view.result.current.state.currentIndex).toBe(1)
    expect(view.result.current.currentProblem?.id).not.toBe(first.id)
  })

  it('full drill — completes after every problem answered', () => {
    const { view, advanceTime } = setup({ problemCount: 3 })
    act(() => view.result.current.start())
    for (let i = 0; i < 3; i++) {
      const p = view.result.current.currentProblem!
      advanceTime(1_000)
      // Alternate correct/incorrect to exercise both branches.
      const answer = i === 1 ? p.answer + 1 : p.answer
      act(() => view.result.current.submitAnswer(answer))
      act(() => view.result.current.advance())
    }
    const s = view.result.current.state
    expect(s.status).toBe('complete')
    expect(s.summary).not.toBeNull()
    expect(s.summary?.attempted).toBe(3)
    expect(s.summary?.correct).toBe(2)
    expect(s.summary?.techniqueId).toBe(TECH)
  })

  it('elapsedMs ticks while running', () => {
    const { view, advanceTime } = setup()
    act(() => view.result.current.start())
    act(() => {
      advanceTime(600)
      vi.advanceTimersByTime(600)
    })
    expect(view.result.current.elapsedMs).toBeGreaterThanOrEqual(600)
  })

  it('reset returns the hook to idle', () => {
    const { view, advanceTime } = setup({ problemCount: 1 })
    act(() => view.result.current.start())
    advanceTime(500)
    act(() =>
      view.result.current.submitAnswer(view.result.current.currentProblem!.answer),
    )
    act(() => view.result.current.advance())
    expect(view.result.current.state.status).toBe('complete')
    act(() => view.result.current.reset())
    expect(view.result.current.state.status).toBe('idle')
    expect(view.result.current.currentProblem).toBeNull()
    expect(view.result.current.elapsedMs).toBe(0)
  })

  it('all generated problems carry the requested techniqueId', () => {
    const { view } = setup({ problemCount: 5 })
    act(() => view.result.current.start())
    for (const p of view.result.current.state.problems) {
      expect(p.techniqueId).toBe(TECH)
    }
  })
})
