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
  accuracyPct: number
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
  accuracy: boolean
  range: boolean
}

/** Module-level frozen default returned by selectors for techniques with no
 *  progress yet — preserves referential equality across renders. */
export const DEFAULT_MASTERY_STARS: MasteryStars = Object.freeze({
  speed: false,
  accuracy: false,
  range: false,
})
