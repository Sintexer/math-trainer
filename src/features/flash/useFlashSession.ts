import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import type { Difficulty, Problem } from '@/shared/types'
import { generateMixedProblems, generateProblems, defaultRng, type Rng } from '@/features/generators'
import {
  createFlashIdleState,
  flashSessionReducer,
  type FlashAction,
  type FlashSessionState,
} from './flashSessionReducer'

export const DEFAULT_FLASH_PROBLEM_COUNT = 30

/** How often the live elapsed-time counter ticks (ms). */
const ELAPSED_TICK_MS = 200

export interface UseFlashSessionOptions {
  techniqueId: string
  problemCount?: number
  difficulty?: Difficulty | 'mixed'
  now?: () => number
  rng?: Rng
}

export interface UseFlashSessionApi {
  state: FlashSessionState
  currentProblem: Problem | null
  /** Total time elapsed since start in ms (for live display). */
  elapsedMs: number
  /** Frozen total time at completion (ms). */
  finalElapsedMs: number
  start: () => void
  advance: () => void
  reset: () => void
}

type LocalAction = FlashAction | { type: 'reset' }

function localReducer(state: FlashSessionState, action: LocalAction): FlashSessionState {
  if (action.type === 'reset') return createFlashIdleState()
  return flashSessionReducer(state, action)
}

export function useFlashSession({
  techniqueId,
  problemCount = DEFAULT_FLASH_PROBLEM_COUNT,
  difficulty,
  now: nowFn = Date.now,
  rng = defaultRng,
}: UseFlashSessionOptions): UseFlashSessionApi {
  const [state, dispatch] = useReducer(localReducer, createFlashIdleState())
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [finalElapsedMs, setFinalElapsedMs] = useState(0)
  const [, setTick] = useState(0)

  // Elapsed-time tick while session is active.
  useEffect(() => {
    if (state.status === 'idle' || state.status === 'complete') return
    const id = window.setInterval(() => setTick((t) => t + 1), ELAPSED_TICK_MS)
    return () => window.clearInterval(id)
  }, [state.status])

  // Capture final elapsed on completion.
  useEffect(() => {
    if (state.status === 'complete' && startedAt !== null) {
      setFinalElapsedMs(Math.max(0, nowFn() - startedAt))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status])

  const start = useCallback(() => {
    const now = nowFn()
    setStartedAt(now)
    setFinalElapsedMs(0)
    const problems =
      difficulty && difficulty !== 'mixed'
        ? generateProblems(techniqueId, difficulty, problemCount, rng)
        : generateMixedProblems([techniqueId], problemCount, rng)
    dispatch({ type: 'start', problems, now })
  }, [techniqueId, problemCount, difficulty, rng, nowFn])

  const advance = useCallback(() => {
    dispatch({ type: 'advance', now: nowFn() })
  }, [nowFn])

  const reset = useCallback(() => {
    setStartedAt(null)
    setFinalElapsedMs(0)
    dispatch({ type: 'reset' })
  }, [])

  const currentProblem = useMemo(() => {
    if (state.status === 'idle' || state.status === 'complete') return null
    return state.problems[state.currentIndex] ?? null
  }, [state])

  const elapsedMs =
    state.status === 'idle' || state.status === 'complete' || startedAt === null
      ? 0
      : Math.max(0, nowFn() - startedAt)

  return { state, currentProblem, elapsedMs, finalElapsedMs, start, advance, reset }
}
