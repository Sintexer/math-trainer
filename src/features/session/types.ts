// Session feature types. Public API re-exports the consumer-facing names
// from src/features/session/index.ts.

import type { Difficulty, Problem } from '@/shared/types'

export type SessionType = 'drill' | 'challenge'

export type SessionStatus = 'idle' | 'running' | 'evaluating' | 'complete'

export interface SessionConfig {
  type: SessionType
  techniqueId: string
  /** Drill only: total number of problems. */
  problemCount?: number
  /** Challenge only: total duration in seconds. */
  durationSeconds?: number
}

export interface SessionSummary {
  id: string
  type: SessionType
  techniqueId: string
  date: string
  correct: number
  attempted: number
  accuracyPct: number
  speedPerMin: number
  /** Populated by the progress slice on persistence — buildSummary leaves it at 0. */
  xpEarned: number
  weakTechniqueIds: string[]
  techniqueBreakdown: Record<string, { correct: number; attempted: number }>
  /** Difficulties the user CORRECTLY solved at least once during this session. */
  difficultiesAttempted: Difficulty[]
  /** Only meaningful for challenge sessions. */
  passed?: boolean
}

/** A problem the user has already responded to. */
export interface AnsweredProblem {
  problem: Problem
  userAnswer: number
  correct: boolean
  timeMs: number
}

export interface SessionState {
  status: SessionStatus
  config: SessionConfig
  problems: Problem[]
  currentIndex: number
  /** Timestamp (ms) when the current problem was displayed. */
  problemStartedAt: number
  /** Wall-clock time (ms) of the most recent action. Drives `summary.date`
   *  and id generation so the session engine stays pure. */
  currentTimeMs: number
  answers: AnsweredProblem[]
  /** Correct-answer streak for the current session. Resets on a wrong answer. */
  streak: number
  /** Challenge only; -1 for drill. */
  timeRemainingMs: number
  /** Populated once status === 'complete'. */
  summary: SessionSummary | null
}

// ── Actions ──────────────────────────────────────────────────

export interface StartAction {
  type: 'start'
  config: SessionConfig
  problems: Problem[]
  now: number
}

export interface SubmitAnswerAction {
  type: 'submitAnswer'
  answer: number
  now: number
}

export interface AdvanceAction {
  type: 'advance'
  now: number
}

export interface TickAction {
  type: 'tick'
  elapsedMs: number
}

export type SessionAction = StartAction | SubmitAnswerAction | AdvanceAction | TickAction

export function createIdleState(): SessionState {
  return {
    status: 'idle',
    config: { type: 'drill', techniqueId: '' },
    problems: [],
    currentIndex: 0,
    problemStartedAt: 0,
    currentTimeMs: 0,
    answers: [],
    streak: 0,
    timeRemainingMs: -1,
    summary: null,
  }
}
