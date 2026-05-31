/**
 * Public API for the Problem Generator Engine (Phase 2).
 *
 * All consumers of generators import from here — never from the
 * individual technique files or the registry directly.
 */

import type { Difficulty, Problem } from '@/shared/types'
import { generatorRegistry } from './registry'

export { generateMixedProblems } from './multiTechniqueGenerator'
export type { ProblemGenerator } from './types'

/**
 * Generate a single problem for the given technique and difficulty.
 *
 * @throws if the techniqueId is not registered.
 */
export function generateProblem(techniqueId: string, difficulty: Difficulty): Problem {
  const generator = generatorRegistry[techniqueId]
  if (!generator) {
    throw new Error(`No generator registered for technique: "${techniqueId}"`)
  }
  return generator(difficulty)
}

/**
 * Generate `count` problems for the given technique and difficulty.
 * Convenience wrapper around `generateProblem`.
 */
export function generateProblems(
  techniqueId: string,
  difficulty: Difficulty,
  count: number,
): Problem[] {
  const problems: Problem[] = []
  for (let i = 0; i < count; i++) {
    problems.push(generateProblem(techniqueId, difficulty))
  }
  return problems
}

/**
 * The set of all registered technique IDs.
 * Useful for testing and for the multi-technique generator.
 */
export const registeredTechniqueIds: readonly string[] = Object.freeze(
  Object.keys(generatorRegistry),
)
