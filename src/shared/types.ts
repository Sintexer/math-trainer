// Pure domain types shared across all features. Feature-local types live
// alongside the feature (src/features/<x>/types.ts).

export type Difficulty = 'easy' | 'medium' | 'hard'

export const ALL_DIFFICULTIES: readonly Difficulty[] = ['easy', 'medium', 'hard'] as const

export type TopicId = 'addition' | 'subtraction' | 'multiplication' | 'division'

export interface Problem {
  id: string
  techniqueId: string
  topicId: TopicId
  difficulty: Difficulty
  prompt: string
  answer: number
  // Populated after the user answers:
  userAnswer?: number
  correct?: boolean
  timeMs?: number
}

export interface MasteryThresholds {
  speedPerMin: number
}

export interface Technique {
  id: string
  name: string
  topicId: TopicId
  description: string
  difficulty: Difficulty
  relatedTechniqueIds: string[]
  masteryThresholds: MasteryThresholds
}

export interface Topic {
  id: TopicId
  name: string
  techniqueIds: string[]
}

export interface ConstellationNode {
  techniqueId: string
  x: number
  y: number
}

export interface ConstellationEdge {
  from: string
  to: string
}

export interface ConstellationGraph {
  nodes: ConstellationNode[]
  edges: ConstellationEdge[]
}

export interface MasteryStars {
  speed: boolean
  range: boolean
}

/** Module-level frozen default returned by selectors for techniques with no
 *  progress yet — preserves referential equality across renders. */
export const DEFAULT_MASTERY_STARS: MasteryStars = Object.freeze({
  speed: false,
  range: false,
})

/**
 * A learning topic is a semantic sub-domain that groups one or more techniques
 * into a single hub for learners. Unlike the broad `Topic` (addition /
 * subtraction / …), a LearningTopic is granular enough to have a coherent
 * learning narrative (e.g. "Addition Speed" or "Multiplication Tricks").
 *
 * A technique may appear in more than one LearningTopic (cross-topic
 * references). Progress is always keyed by techniqueId so cross-topic
 * completion is automatically shared.
 *
 * The `techniqueIds` array is ordered: the UI renders challenges in this order.
 * Adding or reordering IDs in this array is the only change needed to update
 * what appears in a topic hub — no UI code changes required.
 */
export interface LearningTopic {
  id: string
  name: string
  description: string
  techniqueIds: readonly string[]
  /**
   * Whether the techniques in this topic have theory slides (TechniqueCardScreen).
   * Defaults to `true`. Speed/repetition topics (e.g. add-speed, sub-speed,
   * times-tables) set this to `false` — they are pure repetition drills with no
   * conceptual trick to explain, so the "Read Theory" button is omitted.
   */
  hasTheory?: boolean
}
