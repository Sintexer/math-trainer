/**
 * Content Registry
 *
 * The single public API for all static content: techniques, topics, and the
 * constellation graph. All features import from here — never directly from
 * the individual content files.
 */

import type { Technique, Topic, TopicId, ConstellationGraph, MasteryThresholds, LearningTopic } from '@/shared/types'
import { topics } from './topics'
import {
  additionTechniques,
  subtractionTechniques,
  multiplicationTechniques,
  divisionTechniques,
} from './techniques'
import { constellationGraph } from './graph'
import { learningTopics } from './learning-topics'

export {
  getAllTechniqueContent,
  getTechniqueContent,
  findTechniqueContent,
} from './technique-content'

// ── Compiled registry ──────────────────────────────────────────

const allTechniques: Technique[] = [
  ...additionTechniques,
  ...subtractionTechniques,
  ...multiplicationTechniques,
  ...divisionTechniques,
]

const techniqueMap = new Map<string, Technique>(
  allTechniques.map((t) => [t.id, t])
)

const topicMap = new Map<TopicId, Topic>(
  topics.map((t) => [t.id, t])
)

// ── Learning topic registry ────────────────────────────────────

const learningTopicMap = new Map<string, LearningTopic>(
  learningTopics.map((lt) => [lt.id, lt])
)

/**
 * Index of techniqueId → the ID of the first LearningTopic that lists it.
 * Used to resolve "which topic hub should I navigate to?" for a given technique.
 * If a technique appears in multiple topics, the first listing wins for routing.
 */
const techniqueToLearningTopicId = new Map<string, string>()
for (const lt of learningTopics) {
  for (const tid of lt.techniqueIds) {
    if (!techniqueToLearningTopicId.has(tid)) {
      techniqueToLearningTopicId.set(tid, lt.id)
    }
  }
}

// ── Public API ─────────────────────────────────────────────────

/** All technique definitions in content order. */
export function getAllTechniques(): Technique[] {
  return allTechniques
}

/** Look up a single technique by ID. Throws if not found. */
export function getTechnique(id: string): Technique {
  const technique = techniqueMap.get(id)
  if (!technique) throw new Error(`Technique not found: "${id}"`)
  return technique
}

/** Look up a technique by ID without throwing — returns undefined if missing. */
export function findTechnique(id: string): Technique | undefined {
  return techniqueMap.get(id)
}

/** All techniques for a given topic. */
export function getTechniquesByTopic(topicId: TopicId): Technique[] {
  return allTechniques.filter((t) => t.topicId === topicId)
}

/** All topic definitions. */
export function getAllTopics(): Topic[] {
  return topics
}

/** Look up a single topic by ID. Throws if not found. */
export function getTopic(id: TopicId): Topic {
  const topic = topicMap.get(id)
  if (!topic) throw new Error(`Topic not found: "${id}"`)
  return topic
}

/**
 * The techniques related to a given technique (i.e. its neighbours
 * in the constellation graph, by relatedTechniqueIds).
 *
 * Throws if any referenced ID is unknown — content tests enforce that this
 * cannot happen at build time, so a failure here means a content-data bug.
 */
export function getRelatedTechniques(id: string): Technique[] {
  const technique = getTechnique(id)
  return technique.relatedTechniqueIds.map((relId) => getTechnique(relId))
}

/** The full constellation graph (nodes + edges). */
export function getConstellationGraph(): ConstellationGraph {
  return constellationGraph
}

/** Mastery thresholds for a given technique ID. */
export function getMasteryThresholds(techniqueId: string): MasteryThresholds {
  return getTechnique(techniqueId).masteryThresholds
}

// ── Learning topic API ─────────────────────────────────────────

/** All learning topic definitions in display order. */
export function getAllLearningTopics(): LearningTopic[] {
  return learningTopics
}

/** Look up a learning topic by ID. Throws if not found. */
export function getLearningTopic(id: string): LearningTopic {
  const lt = learningTopicMap.get(id)
  if (!lt) throw new Error(`LearningTopic not found: "${id}"`)
  return lt
}

/** Look up a learning topic by ID without throwing — returns undefined if missing. */
export function findLearningTopic(id: string): LearningTopic | undefined {
  return learningTopicMap.get(id)
}

/**
 * Returns the first LearningTopic that contains the given techniqueId, or
 * undefined if no topic lists it. Useful for resolving navigation targets
 * (e.g. constellation node tap → navigate to that technique's topic hub).
 */
export function getLearningTopicForTechnique(techniqueId: string): LearningTopic | undefined {
  const topicId = techniqueToLearningTopicId.get(techniqueId)
  return topicId ? learningTopicMap.get(topicId) : undefined
}

/**
 * Suggested pact-mode learning sequence.
 * Returns technique IDs in recommended learning order.
 */
export function getPactSequence(): string[] {
  return [
    // Foundation speed drills — build raw arithmetic fluency first
    'add-speed-1d2d',
    'add-speed-2d2d',
    'sub-speed-2d1d',
    'sub-speed-2d2d',
    'add-speed-3d',
    'sub-speed-3d',
    // Multiplication foundations — progressive table difficulty
    'mul-table-2to9',
    'mul-table-10to19',
    'mul-table-20to29',
    'mul-by-5',
    'mul-whole-numbers',
    // Squares & roots foundation
    'mul-squares-foundation',
    'mul-squares-advanced',
    'mul-roots-foundation',
    'mul-roots-practice',
    // Addition tricks (build on speed foundation)
    'add-left-to-right',
    'add-round-adjust',
    'add-complement-100',
    'add-near-doubles',
    'add-column-grouping',
    // Subtraction builds on addition patterns
    'sub-complement-10',
    'sub-borrow-free',
    'sub-round-adjust',
    'sub-counting-up',
    // Multiplication tricks — easy ones first
    'mul-by-9',
    'mul-by-11',
    'mul-by-12',
    'mul-by-25',
    'mul-by-99-101',
    'mul-double-halve',
    'mul-sq-ending-5',
    'mul-near-100',
    'mul-foil-mental',
    // Division — mirrors multiplication patterns
    'div-by-5',
    'div-by-25',
    'div-percent-10-5-20',
    'div-by-9-digit-sum',
    'div-estimate-adjust',
    'div-factor-decompose',
  ]
}
