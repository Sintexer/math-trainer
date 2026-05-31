// Session Reducer — pure state machine.
//
//   idle ──start──► running ──submitAnswer──► evaluating ──advance──► running
//                                                                  └──► complete  (drill: queue exhausted)
//        tick fires in running/evaluating (challenge only) ─────────► complete  (timer expired)

import { createIdleState } from './types'
import type { SessionAction, SessionState } from './types'
import { buildSummary } from './sessionSummary'

export { createIdleState }

export function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case 'start': {
      if (state.status !== 'idle') return state
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
        currentTimeMs: action.now,
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

      return {
        ...state,
        status: 'evaluating',
        currentTimeMs: action.now,
        answers: [
          ...state.answers,
          { problem, userAnswer: action.answer, correct, timeMs },
        ],
        streak: correct ? state.streak + 1 : 0,
      }
    }

    case 'advance': {
      if (state.status !== 'evaluating') return state

      const nextIndex = state.currentIndex + 1
      const isDrill = state.config.type === 'drill'
      const drillComplete = isDrill && nextIndex >= state.problems.length
      // Challenge: timer may have expired during the feedback delay.
      const challengeComplete =
        state.config.type === 'challenge' && state.timeRemainingMs <= 0

      const baseNext: SessionState = {
        ...state,
        currentIndex: nextIndex,
        currentTimeMs: action.now,
      }

      if (drillComplete || challengeComplete) {
        return { ...baseNext, status: 'complete', summary: buildSummary(baseNext) }
      }

      return { ...baseNext, status: 'running', problemStartedAt: action.now }
    }

    case 'tick': {
      if (state.config.type !== 'challenge') return state
      if (state.status !== 'running' && state.status !== 'evaluating') return state

      const newRemaining = state.timeRemainingMs - action.elapsedMs
      const nextNow = state.currentTimeMs + action.elapsedMs

      if (newRemaining <= 0) {
        const baseNext: SessionState = {
          ...state,
          timeRemainingMs: 0,
          currentTimeMs: nextNow,
        }
        return { ...baseNext, status: 'complete', summary: buildSummary(baseNext) }
      }

      return { ...state, timeRemainingMs: newRemaining, currentTimeMs: nextNow }
    }

    default: {
      // Exhaustive check — TypeScript will error if a case is missed.
      action satisfies never
      return state
    }
  }
}

/** Convenience for tests: run a sequence of actions from an idle state. */
export function applyActions(
  actions: SessionAction[],
  initial: SessionState = createIdleState(),
): SessionState {
  return actions.reduce((s, a) => sessionReducer(s, a), initial)
}
