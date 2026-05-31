/**
 * Session Reducer — the core engine.
 *
 * A pure function: (SessionState, SessionAction) → SessionState.
 * No side effects, no Date.now(), no randomness. All timestamps are
 * injected via action payloads so tests are fully deterministic.
 *
 * State machine:
 *
 *   idle ──start──► running ──submitAnswer──► evaluating ──advance──► running
 *                                                                  └──► complete  (drill: queue exhausted)
 *        tick fires in running/evaluating (challenge only) ──────────► complete  (timer expired)
 */

import type { SessionState, SessionAction } from './types'
import { createIdleState } from './types'
import { buildSummary } from './sessionSummary'

export { createIdleState }

export function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case 'start': {
      if (state.status !== 'idle') {
        // Ignore start if already running — caller should reset first
        return state
      }
      if (action.problems.length === 0) {
        throw new Error('sessionReducer: cannot start with an empty problem list')
      }

      const isDrill = action.config.type === 'drill'
      const durationSeconds = action.config.durationSeconds ?? 60

      return {
        ...createIdleState(),
        status: 'running',
        config: action.config,
        problems: action.problems,
        currentIndex: 0,
        problemStartedAt: action.now,
        answers: [],
        streak: 0,
        timeRemainingMs: isDrill ? -1 : durationSeconds * 1000,
        summary: null,
      }
    }

    case 'submitAnswer': {
      if (state.status !== 'running') return state

      const problem = state.problems[state.currentIndex]
      if (!problem) return state

      const timeMs = Math.max(0, action.now - state.problemStartedAt)
      const correct = action.answer === problem.answer

      const answeredProblem = {
        problem,
        userAnswer: action.answer,
        correct,
        timeMs,
      }

      return {
        ...state,
        status: 'evaluating',
        answers: [...state.answers, answeredProblem],
        streak: correct ? state.streak + 1 : 0,
      }
    }

    case 'advance': {
      if (state.status !== 'evaluating') return state

      const nextIndex = state.currentIndex + 1
      const isDrill = state.config.type === 'drill'
      const drillComplete = isDrill && nextIndex >= state.problems.length

      // Challenge: check whether timer already expired (race between advance and tick)
      const challengeComplete =
        state.config.type === 'challenge' && state.timeRemainingMs <= 0

      if (drillComplete || challengeComplete) {
        const summary = buildSummary({
          ...state,
          currentIndex: nextIndex,
        })
        return {
          ...state,
          status: 'complete',
          currentIndex: nextIndex,
          summary,
        }
      }

      return {
        ...state,
        status: 'running',
        currentIndex: nextIndex,
        problemStartedAt: action.now,
      }
    }

    case 'tick': {
      // Only meaningful for challenge mode; ignore for drill
      if (state.config.type !== 'challenge') return state
      if (state.status !== 'running' && state.status !== 'evaluating') return state

      const newRemaining = state.timeRemainingMs - action.elapsedMs

      if (newRemaining <= 0) {
        // Time's up — if we're mid-answer (evaluating), that answer is already recorded.
        // Complete the session with whatever answers we have.
        const summary = buildSummary({
          ...state,
          timeRemainingMs: 0,
        })
        return {
          ...state,
          status: 'complete',
          timeRemainingMs: 0,
          summary,
        }
      }

      return {
        ...state,
        timeRemainingMs: newRemaining,
      }
    }

    default: {
      // Exhaustive check — TypeScript will error if a case is missed
      const _exhaustive: never = action
      return state
    }
  }
}

/**
 * Convenience: run a sequence of actions against an idle state.
 * Useful in tests to avoid writing long chains manually.
 */
export function applyActions(
  actions: SessionAction[],
  initial: SessionState = createIdleState(),
): SessionState {
  return actions.reduce((s, a) => sessionReducer(s, a), initial)
}
