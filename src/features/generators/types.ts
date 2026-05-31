import type { Difficulty, Problem } from '@/shared/types'
import type { Rng } from './rng'

/**
 * Every technique generator implements this contract.
 * `rng` is injected so the same generator can be driven by Math.random() in
 * regular sessions and by a seeded RNG for the Daily Challenge / tests.
 */
export type ProblemGenerator = (difficulty: Difficulty, rng: Rng) => Problem
