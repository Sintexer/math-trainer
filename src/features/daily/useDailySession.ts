import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import type { Problem } from '@/shared/types'
import {
  createIdleState,
  sessionReducer,
  type SessionAction,
  type SessionConfig,
  type SessionState,
} from '@/features/session'
import { getDailyProblems, DAILY_PROBLEM_COUNT } from './dailyChallenge'

/** How often the live elapsed-time counter ticks (ms). */
const ELAPSED_TICK_MS = 200

export interface UseDailySessionOptions {
  /** YYYY-MM-DD — determines the problem seed. */
  date: string
  /** Injectable wall-clock source. Defaults to Date.now in production. */
  now?: () => number
}

export interface UseDailySessionApi {
  state: SessionState
  /** Wall-clock ms elapsed since the session started; 0 when idle. */
  elapsedMs: number
  /**
   * Final elapsed ms, captured at the moment the session completed.
   * This stays non-zero (unlike elapsedMs which resets to 0 on complete)
   * so the result screen can show the total time taken.
   */
  finalElapsedMs: number
  /** Problem currently being shown, or null if not running. */
  currentProblem: Problem | null
  start: () => void
  submitAnswer: (answer: number) => void
  advance: () => void
}

// Extend the session actions with a daily-specific reset so the hook can
// internally handle error recovery without leaking into the pure engine.
type DailyAction = SessionAction | { type: 'reset' }

function dailyReducer(state: SessionState, action: DailyAction): SessionState {
  if (action.type === 'reset') return createIdleState()
  return sessionReducer(state, action)
}

/**
 * Hook that drives a Daily Challenge session.
 *
 * Key differences from useDrillSession:
 *  - Problems are pre-generated from a date-seeded RNG so every user sees the
 *    same 10 problems on a given calendar day.
 *  - There is no "try again" — the caller decides whether to allow a restart.
 *  - `finalElapsedMs` is frozen at completion so the result screen can show the
 *    correct total time even after elapsedMs resets to 0.
 *  - techniqueId in the session config is set to the literal string 'daily'.
 *    The daily challenge is NOT persisted via completeSession; the calling
 *    component dispatches completeDailyChallenge directly.
 */
export function useDailySession({
  date,
  now: nowFn = Date.now,
}: UseDailySessionOptions): UseDailySessionApi {
  // Problems are stable for the entire calendar day.
  const problems = useMemo(() => getDailyProblems(date), [date])

  const [state, dispatch] = useReducer(dailyReducer, createIdleState())
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [, setTick] = useState(0)
  const [finalElapsedMs, setFinalElapsedMs] = useState(0)

  // Tick the live elapsed counter while a session is in flight.
  useEffect(() => {
    if (state.status === 'idle' || state.status === 'complete') return
    const id = window.setInterval(() => setTick((t) => t + 1), ELAPSED_TICK_MS)
    return () => window.clearInterval(id)
  }, [state.status])

  // Freeze the total elapsed time as soon as the session completes.
  useEffect(() => {
    if (state.status === 'complete' && startedAt !== null) {
      setFinalElapsedMs(nowFn() - startedAt)
    }
  }, [state.status, startedAt, nowFn])

  const start = useCallback(() => {
    const now = nowFn()
    setStartedAt(now)
    setFinalElapsedMs(0)
    const config: SessionConfig = {
      type: 'drill',
      techniqueId: 'daily',
      problemCount: DAILY_PROBLEM_COUNT,
    }
    dispatch({ type: 'start', config, problems, now })
  }, [problems, nowFn])

  const submitAnswer = useCallback(
    (answer: number) => {
      dispatch({ type: 'submitAnswer', answer, now: nowFn() })
    },
    [nowFn],
  )

  const advance = useCallback(() => {
    dispatch({ type: 'advance', now: nowFn() })
  }, [nowFn])

  const currentProblem = useMemo(() => {
    if (state.status === 'idle' || state.status === 'complete') return null
    return state.problems[state.currentIndex] ?? null
  }, [state])

  const elapsedMs =
    state.status === 'idle' || state.status === 'complete' || startedAt === null
      ? 0
      : Math.max(0, nowFn() - startedAt)

  return { state, elapsedMs, finalElapsedMs, currentProblem, start, submitAnswer, advance }
}
