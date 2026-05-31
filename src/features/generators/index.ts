// Public API for the Problem Generator Engine.
//
// All consumers go through this barrel — never the individual technique
// files or the registry directly.

import type { Difficulty, Problem } from '@/shared/types'
import { getAllTechniques } from '@/content'
import { generatorRegistry } from './registry'
import { defaultRng, type Rng } from './rng'

export { defaultRng, createSeededRng, seedFromDate } from './rng'
export type { Rng } from './rng'
export type { ProblemGenerator } from './types'

/** Canonical difficulty distribution for mixed batches (Daily Challenge). */
const DIFFICULTY_DISTRIBUTION: ReadonlyArray<{ difficulty: Difficulty; weight: number }> = [
  { difficulty: 'easy', weight: 0.4 },
  { difficulty: 'medium', weight: 0.4 },
  { difficulty: 'hard', weight: 0.2 },
]

/**
 * Generate a single problem for the given technique and difficulty.
 *
 * @throws if the techniqueId is not registered.
 */
export function generateProblem(
  techniqueId: string,
  difficulty: Difficulty,
  rng: Rng = defaultRng,
): Problem {
  const generator = generatorRegistry[techniqueId]
  if (!generator) {
    throw new Error(`No generator registered for technique: "${techniqueId}"`)
  }
  return generator(difficulty, rng)
}

/** Generate `count` problems for the given technique and difficulty. */
export function generateProblems(
  techniqueId: string,
  difficulty: Difficulty,
  count: number,
  rng: Rng = defaultRng,
): Problem[] {
  const problems: Problem[] = []
  for (let i = 0; i < count; i++) {
    problems.push(generateProblem(techniqueId, difficulty, rng))
  }
  return problems
}

/**
 * Build a difficulty array of length `count` honouring the 40/40/20 split,
 * shuffled so difficulties are not grouped together.
 */
function buildDifficultySequence(count: number, rng: Rng): Difficulty[] {
  const result: Difficulty[] = []
  for (const { difficulty, weight } of DIFFICULTY_DISTRIBUTION) {
    const n = Math.round(count * weight)
    for (let i = 0; i < n; i++) result.push(difficulty)
  }
  while (result.length < count) result.push('medium')
  while (result.length > count) result.pop()
  return rng.shuffle(result)
}

/**
 * Generate a balanced mix of problems across multiple techniques.
 *
 * @param techniqueIds  Which techniques to draw from. Pass null for all 25.
 * @param count         Total number of problems to generate.
 * @param rng           Pass a seeded RNG for the Daily Challenge.
 */
export function generateMixedProblems(
  techniqueIds: string[] | null,
  count: number,
  rng: Rng = defaultRng,
): Problem[] {
  const ids = techniqueIds !== null ? techniqueIds : getAllTechniques().map((t) => t.id)

  if (ids.length === 0) {
    throw new Error('generateMixedProblems: no techniqueIds provided')
  }
  for (const id of ids) {
    if (!generatorRegistry[id]) {
      throw new Error(`No generator registered for technique: "${id}"`)
    }
  }

  const difficulties = buildDifficultySequence(count, rng)

  return difficulties.map((difficulty, i) => {
    // Round-robin across techniques so each is represented roughly equally.
    const techniqueId = ids[i % ids.length]
    return generatorRegistry[techniqueId](difficulty, rng)
  })
}

/** All registered technique IDs — useful for tests and the multi-technique generator. */
export const registeredTechniqueIds: readonly string[] = Object.freeze(
  Object.keys(generatorRegistry),
)
