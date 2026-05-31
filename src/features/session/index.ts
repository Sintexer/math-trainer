/**
 * Session Engine — Public API (Phase 3)
 *
 * All consumers (UI, tests, daily challenge) import from here.
 */

export { sessionReducer, createIdleState, applyActions } from './sessionReducer'
export { buildSummary, detectWeakTechniques } from './sessionSummary'
export { computeXp } from './xp'
export type { SessionState, SessionAction, SessionStatus, AnsweredProblem } from './types'
export type { XpInputs } from './xp'
