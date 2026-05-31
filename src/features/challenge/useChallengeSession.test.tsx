import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { createSeededRng } from '@/features/generators'
import {
  DEFAULT_CHALLENGE_DURATION_SECONDS,
  useChallengeSession,
} from './useChallengeSession'

const TECH = 'mul-by-11'

function setup(opts: { durationSeconds?: number; nowStart?: number } = {}) {
  let current = opts.nowStart ?? 1_000_000
  const now = vi.fn(() => current)
  const advanceTime = (ms: number) => {
    current += ms
  }
  const rng = createSeededRng(123)
  const view = renderHook(() =>
    useChallengeSession({
      techniqueId: TECH,
      durationSeconds: opts.durationSeconds,
      now,
      rng,
      tickIntervalMs: 100,
    }),
  )
  return { view, now, advanceTime }
}

describe('useChallengeSession', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts idle with full configured time remaining only after start()', () => {
    const { view } = setup()
    expect(view.result.current.state.status).toBe('idle')
    expect(view.result.current.currentProblem).toBeNull()
    // Idle state defaults timeRemainingMs to -1; the totalDurationMs
    // reflects the configured duration regardless.
    expect(view.result.current.totalDurationMs).toBe(
      DEFAULT_CHALLENGE_DURATION_SECONDS * 1000,
    )
  })

  it('start() transitions to running with the configured countdown loaded', () => {
    const { view } = setup({ durationSeconds: 30 })
    act(() => view.result.current.start())
    expect(view.result.current.state.status).toBe('running')
    expect(view.result.current.state.config.type).toBe('challenge')
    expect(view.result.current.timeRemainingMs).toBe(30_000)
    expect(view.result.current.currentProblem).not.toBeNull()
  })

  it('countdown ticks down while running and completes on expiry', () => {
    const { view } = setup({ durationSeconds: 1 })
    act(() => view.result.current.start())
    expect(view.result.current.timeRemainingMs).toBe(1_000)

    // Advance just past the configured duration in tick increments.
    act(() => {
      vi.advanceTimersByTime(1_200)
    })

    expect(view.result.current.state.status).toBe('complete')
    expect(view.result.current.timeRemainingMs).toBe(0)
    expect(view.result.current.state.summary).not.toBeNull()
  })

  it('summary.passed is true when speed and accuracy meet thresholds', () => {
    const { view, advanceTime } = setup({ durationSeconds: 60 })
    act(() => view.result.current.start())

    // mul-by-11 thresholds: speedPerMin 7, accuracyPct 85.
    // 8 correct in 60s = 8/min (meets 7/min). 100% accuracy meets 85%.
    for (let i = 0; i < 8; i++) {
      const p = view.result.current.currentProblem!
      advanceTime(500)
      act(() => view.result.current.submitAnswer(p.answer))
      act(() => view.result.current.advance())
    }

    // Let the timer expire.
    act(() => {
      vi.advanceTimersByTime(61_000)
    })

    const summary = view.result.current.state.summary!
    expect(summary.attempted).toBe(8)
    expect(summary.correct).toBe(8)
    expect(summary.accuracyPct).toBe(100)
    expect(summary.passed).toBe(true)
  })

  it('summary.passed is false when accuracy is below threshold', () => {
    const { view, advanceTime } = setup({ durationSeconds: 60 })
    act(() => view.result.current.start())

    // 10 attempts, all wrong → 0% accuracy → fail.
    for (let i = 0; i < 10; i++) {
      const p = view.result.current.currentProblem!
      advanceTime(500)
      act(() => view.result.current.submitAnswer(p.answer + 999))
      act(() => view.result.current.advance())
    }

    act(() => {
      vi.advanceTimersByTime(61_000)
    })

    const summary = view.result.current.state.summary!
    expect(summary.passed).toBe(false)
  })

  it('reset returns the hook to idle', () => {
    const { view } = setup({ durationSeconds: 1 })
    act(() => view.result.current.start())
    act(() => {
      vi.advanceTimersByTime(1_200)
    })
    expect(view.result.current.state.status).toBe('complete')

    act(() => view.result.current.reset())
    expect(view.result.current.state.status).toBe('idle')
    expect(view.result.current.currentProblem).toBeNull()
  })

  it('all generated problems carry the requested techniqueId', () => {
    const { view } = setup()
    act(() => view.result.current.start())
    for (const p of view.result.current.state.problems) {
      expect(p.techniqueId).toBe(TECH)
    }
  })
})
