/**
 * Multi-technique generator
 *
 * Produces a balanced mix of problems across multiple techniqueIds
 * with a fixed difficulty distribution: 40% easy, 40% medium, 20% hard.
 *
 * Used by the Daily Challenge and any future "global" run modes.
 */

import type { Difficulty, Problem } from '@/shared/types'
import { getAllTechniques } from '@/content'
import { generatorRegistry } from './registry'
import { shuffle } from './utils'

/** Canonical difficulty distribution for mixed batches. */
const DIFFICULTY_DISTRIBUTION: ReadonlyArray<{ difficulty: Difficulty; weight: number }> = [
  { difficulty: 'easy', weight: 0.4 },
  { difficulty: 'medium', weight: 0.4 },
  { difficulty: 'hard', weight: 0.2 },
]

/**
 * Build a difficulty array of length `count` honouring the 40/40/20 split.
 * The array is shuffled so difficulties are not grouped together.
 */
function buildDifficultySequence(count: number): Difficulty[] {
  const result: Difficulty[] = []
  for (const { difficulty, weight } of DIFFICULTY_DISTRIBUTION) {
    const n = Math.round(count * weight)
    for (let i = 0; i < n; i++) result.push(difficulty)
  }
  // Fill any rounding gaps (or trim extras) to reach exactly `count`
  while (result.length < count) result.push('medium')
  while (result.length > count) result.pop()
  return shuffle(result)
}

/**
 * Generate a balanced mix of problems.
 *
 * @param techniqueIds  Which techniques to draw from. Pass null for all 25.
 * @param count         Total number of problems to generate.
 */
export function generateMixedProblems(
  techniqueIds: string[] | null,
  count: number,
): Problem[] {
  const ids =
    techniqueIds !== null
      ? techniqueIds
      : getAllTechniques().map((t) => t.id)

  if (ids.length === 0) throw new Error('generateMixedProblems: no techniqueIds provided')

  // Validate all requested IDs have generators
  for (const id of ids) {
    if (!generatorRegistry[id]) throw new Error(`No generator registered for technique: "${id}"`)
  }

  const difficulties = buildDifficultySequence(count)

  return difficulties.map((difficulty, i) => {
    // Round-robin across techniques so each is represented roughly equally
    const techniqueId = ids[i % ids.length]
    return generatorRegistry[techniqueId](difficulty)
  })
}
