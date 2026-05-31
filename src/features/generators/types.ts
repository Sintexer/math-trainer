import type { Difficulty, Problem } from '@/shared/types'

/**
 * Every technique generator implements this contract.
 * It receives a difficulty and returns a fully-populated Problem
 * (minus `userAnswer`, `correct`, and `timeMs` which are filled in during a session).
 */
export type ProblemGenerator = (difficulty: Difficulty) => Problem
