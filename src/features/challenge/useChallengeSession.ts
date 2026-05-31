import { useCallback, useEffect, useReducer } from 'react'
import type { Problem } from '@/shared/types'
import {
  createIdleState,
  sessionReducer,
  type SessionAction,
  type SessionConfig,
  type SessionState,
} from '@/features/session'
import { generateMixedProblems, defaultRng, type Rng } from '@/features/generators'

/** Default Challenge session length in seconds (Phase 7 spec). */
export const DEFAULT_CHALLENGE_DURATION_SECONDS = 60

/** How often the countdown ticks the reducer (ms). */
const TICK_INTERVAL_MS = 200

/** Upper bound on problems generated up-front. 60s × ~5/s solves is unrealistic;
 *  200 problems trivially covers any plausible run and avoids running out of
 *  the problem queue mid-session. */
const PROBLEM_POOL_SIZE = 200

export interface UseChallengeSessionOptions {
  techniqueId: string
  /** Total challenge duration in seconds. Defaults to 60. */
  durationSeconds?: number
  /** Injectable wall-clock source. Defaults to Date.now in production. */
  now?: () => number
  /** Injectable RNG for tests. Defaults to defaultRng. */
  rng?: Rng
  /** Override the tick interval. Tests can use a coarser value. */
  tickIntervalMs?: number
}

export interface UseChallengeSessionApi {
  state: SessionState
  /** Problem currently being shown, or null if not running. */
  currentProblem: Problem | null
  /** Remaining time in ms (mirrors reducer state for ergonomic UI access). */
  timeRemainingMs: number
  /** Total configured duration in ms. */
  totalDurationMs: number
  start: () => void
  submitAnswer: (answer: number) => void
  advance: () => void
  reset: () => void
}

// Local meta-action so the consumer can return to the entry screen without
// unmounting. The pure reducer never sees 'reset'.
type ChallengeAction = SessionAction | { type: 'reset' }

function challengeReducer(state: SessionState, action: ChallengeAction): SessionState {
  if (action.type === 'reset') return createIdleState()
  return sessionReducer(state, action)
}

/**
 * Hook that wraps the pure session reducer for Challenge mode.
 *
 * Unlike Drill, Challenge has a global countdown timer. The hook drives the
 * 'tick' action on a setInterval while running/evaluating; the reducer
 * decrements `timeRemainingMs` and transitions to 'complete' on expiry.
 *
 * `now` and `rng` are injected so tests stay deterministic and can drive
 * fake timers without touching the real wall clock.
 */
export function useChallengeSession({
  techniqueId,
  durationSeconds = DEFAULT_CHALLENGE_DURATION_SECONDS,
  now: nowFn = Date.now,
  rng = defaultRng,
  tickIntervalMs = TICK_INTERVAL_MS,
}: UseChallengeSessionOptions): UseChallengeSessionApi {
  const [state, dispatch] = useReducer(challengeReducer, createIdleState())

  // tickIntervalMs is included as an effect dep — in practice callers never
  // change it post-mount, but treating it as a dep keeps the project's
  // react-hooks lint happy without resorting to render-time ref writes.
  useEffect(() => {
    if (state.status !== 'running' && state.status !== 'evaluating') return
    if (state.config.type !== 'challenge') return
    const id = window.setInterval(() => {
      dispatch({ type: 'tick', elapsedMs: tickIntervalMs })
    }, tickIntervalMs)
    return () => window.clearInterval(id)
  }, [state.status, state.config.type, tickIntervalMs])

  const start = useCallback(() => {
    const now = nowFn()
    const problems = generateMixedProblems([techniqueId], PROBLEM_POOL_SIZE, rng)
    const config: SessionConfig = {
      type: 'challenge',
      techniqueId,
      durationSeconds,
    }
    dispatch({ type: 'start', config, problems, now })
  }, [techniqueId, durationSeconds, rng, nowFn])

  const submitAnswer = useCallback(
    (answer: number) => {
      dispatch({ type: 'submitAnswer', answer, now: nowFn() })
    },
    [nowFn],
  )

  const advance = useCallback(() => {
    dispatch({ type: 'advance', now: nowFn() })
  }, [nowFn])

  const reset = useCallback(() => {
    dispatch({ type: 'reset' })
  }, [])

  const currentProblem =
    state.status === 'idle' || state.status === 'complete'
      ? null
      : (state.problems[state.currentIndex] ?? null)

  return {
    state,
    currentProblem,
    timeRemainingMs: state.timeRemainingMs,
    totalDurationMs: durationSeconds * 1000,
    start,
    submitAnswer,
    advance,
    reset,
  }
}
