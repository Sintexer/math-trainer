// Flash Session Reducer — pure state machine for speed card training.
//
//   idle ──start──► running ──advance──► running
//                                    └──► complete (queue exhausted)

import type { Problem } from '@/shared/types'

export type FlashStatus = 'idle' | 'running' | 'complete'

export interface FlashSessionState {
  status: FlashStatus
  problems: Problem[]
  currentIndex: number
  /** Timestamp when the current card was shown (ms). */
  cardStartedAt: number
  /** Time spent on each card before tapping Next (ms). */
  cardTimes: number[]
  /** Timestamp when the session started (ms). */
  sessionStartedAt: number
}

export interface FlashStartAction {
  type: 'start'
  problems: Problem[]
  now: number
}

export interface FlashAdvanceAction {
  type: 'advance'
  now: number
}

export type FlashAction = FlashStartAction | FlashAdvanceAction

export function createFlashIdleState(): FlashSessionState {
  return {
    status: 'idle',
    problems: [],
    currentIndex: 0,
    cardStartedAt: 0,
    cardTimes: [],
    sessionStartedAt: 0,
  }
}

export function flashSessionReducer(
  state: FlashSessionState,
  action: FlashAction,
): FlashSessionState {
  switch (action.type) {
    case 'start': {
      if (state.status !== 'idle') return state
      if (action.problems.length === 0) {
        throw new Error('flashSessionReducer: cannot start with an empty problem list')
      }
      return {
        status: 'running',
        problems: action.problems,
        currentIndex: 0,
        cardStartedAt: action.now,
        cardTimes: [],
        sessionStartedAt: action.now,
      }
    }

    case 'advance': {
      if (state.status !== 'running') return state
      const cardTime = Math.max(0, action.now - state.cardStartedAt)
      const nextIndex = state.currentIndex + 1
      if (nextIndex >= state.problems.length) {
        return {
          ...state,
          status: 'complete',
          currentIndex: nextIndex,
          cardTimes: [...state.cardTimes, cardTime],
        }
      }
      return {
        ...state,
        currentIndex: nextIndex,
        cardStartedAt: action.now,
        cardTimes: [...state.cardTimes, cardTime],
      }
    }

    default: {
      action satisfies never
      return state
    }
  }
}

/** Cards per minute based on session elapsed time. */
export function computeCardsPerMin(state: FlashSessionState, nowMs: number): number {
  if (state.status === 'idle') return 0
  const elapsedMin = (nowMs - state.sessionStartedAt) / 60_000
  if (elapsedMin <= 0) return 0
  return Math.round(state.currentIndex / elapsedMin)
}

/** Total elapsed session time in ms. */
export function computeTotalTimeMs(state: FlashSessionState, nowMs: number): number {
  if (state.status === 'idle') return 0
  return Math.max(0, nowMs - state.sessionStartedAt)
}
