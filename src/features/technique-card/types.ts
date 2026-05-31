// Slide content schema for Tier 1 (Technique cards).
//
// Authors compose a TechniqueContent from 3–5 slides drawn from this
// discriminated union. The viewer dispatches on `kind`.

export interface ConceptSlide {
  kind: 'concept'
  heading: string
  body: string
  /** Optional one-liner that summarises the mental model. */
  mentalModel?: string
}

export interface WorkedSlide {
  kind: 'worked'
  problem: string
  steps: readonly string[]
  answer: number | string
}

export interface EdgeCaseSlide {
  kind: 'edge-case'
  heading: string
  body: string
  examples?: readonly string[]
}

export interface TryItSlide {
  kind: 'try-it'
  problem: string
  /** The numerically correct answer. Shown when the user reveals the hint. */
  answer: number
  hint: string
}

export type Slide = ConceptSlide | WorkedSlide | EdgeCaseSlide | TryItSlide

export interface TechniqueContent {
  techniqueId: string
  slides: readonly Slide[]
}
