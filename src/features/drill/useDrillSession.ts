import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import type { Problem } from '@/shared/types'
import {
  createIdleState,
  sessionReducer,
  type SessionAction,
  type SessionConfig,
  type SessionState,
} from '@/features/session'
import { generateMixedProblems, defaultRng, type Rng } from '@/features/generators'

/** Default number of problems in a Drill session. */
export const DEFAULT_DRILL_PROBLEM_COUNT = 15

/** How often the live elapsed-time counter ticks (ms). */
const ELAPSED_TICK_MS = 200

export interface UseDrillSessionOptions {
  techniqueId: string
  problemCount?: number
  /** Injectable wall-clock source. Defaults to Date.now in production. */
  now?: () => number
  /** Injectable RNG for tests. Defaults to defaultRng. */
  rng?: Rng
}

export interface UseDrillSessionApi {
  state: SessionState
  /** Wall-clock ms elapsed since the session started; 0 when idle/complete. */
  elapsedMs: number
  /** Problem currently being shown, or null if not running. */
  currentProblem: Problem | null
  start: () => void
  submitAnswer: (answer: number) => void
  advance: () => void
  reset: () => void
}

// Local wrapper around the pure session reducer that adds a 'reset' meta-
// action so the hook can return to the entry screen without unmounting.
// The engine itself stays pure — no reset capability leaks into other
// consumers.
type DrillAction = SessionAction | { type: 'reset' }

function drillReducer(state: SessionState, action: DrillAction): SessionState {
  if (action.type === 'reset') return createIdleState()
  return sessionReducer(state, action)
}

/**
 * Hook that wraps the pure session reducer for Drill mode.
 *
 * Session state lives in a local useReducer — never in Redux — to keep the
 * engine and the ephemeral UI workflow co-located. Only the final summary
 * (via the consumer dispatching completeSession on the progress slice) is
 * persisted.
 *
 * `now` is injected so tests can drive deterministic timestamps. In
 * production the caller relies on the Date.now() default.
 */
export function useDrillSession({
  techniqueId,
  problemCount = DEFAULT_DRILL_PROBLEM_COUNT,
  now: nowFn = Date.now,
  rng = defaultRng,
}: UseDrillSessionOptions): UseDrillSessionApi {
  const [state, dispatch] = useReducer(drillReducer, createIdleState())

  // Wall-clock elapsed time for the live SessionProgress display. We store
  // `startedAt` in state (set in the start callback, cleared in reset) and
  // recompute `elapsedMs` on each tick. setState happens only inside the
  // setInterval callback — never directly in an effect body — which keeps
  // the React 19 "set-state-in-effect" rule satisfied.
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [, setTick] = useState(0)

  useEffect(() => {
    if (state.status === 'idle' || state.status === 'complete') return
    const id = window.setInterval(() => setTick((t) => t + 1), ELAPSED_TICK_MS)
    return () => window.clearInterval(id)
  }, [state.status])

  const start = useCallback(() => {
    const now = nowFn()
    setStartedAt(now)
    const problems = generateMixedProblems([techniqueId], problemCount, rng)
    const config: SessionConfig = { type: 'drill', techniqueId, problemCount }
    dispatch({ type: 'start', config, problems, now })
  }, [techniqueId, problemCount, rng, nowFn])

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
    setStartedAt(null)
    dispatch({ type: 'reset' })
  }, [])

  const currentProblem = useMemo(() => {
    if (state.status === 'idle' || state.status === 'complete') return null
    return state.problems[state.currentIndex] ?? null
  }, [state])

  // Derived — recomputed each render. Re-renders are driven by the tick
  // counter while running, and by reducer transitions otherwise.
  const elapsedMs =
    state.status === 'idle' || state.status === 'complete' || startedAt === null
      ? 0
      : Math.max(0, nowFn() - startedAt)

  return { state, elapsedMs, currentProblem, start, submitAnswer, advance, reset }
}
