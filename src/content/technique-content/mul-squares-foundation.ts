import type { TechniqueContent } from '@/features/technique-card'

export const mulSquaresFoundation: TechniqueContent = {
  techniqueId: 'mul-squares-foundation',
  slides: [
    {
      kind: 'concept',
      heading: 'Perfect squares 2–20',
      body: 'Build instant recall of perfect squares from 2² to 20². Squares are the anchor for factoring, estimation, and tricks like Squares Ending in 5.',
      mentalModel: 'See 13², think 169 immediately. No computation.',
    },
    {
      kind: 'worked',
      problem: '12²',
      steps: ['12² = 144. Core perfect square fact.'],
      answer: 144,
    },
    {
      kind: 'worked',
      problem: '15²',
      steps: ['15² = (10 + 5)² = 100 + 100 + 25 = 225.', 'Or use the ×5 ending trick: 1 × 2 = 2, append 25 → 225.'],
      answer: 225,
    },
    {
      kind: 'edge-case',
      heading: 'Pattern recognition',
      body: 'Notice: each square increases by (2n + 1). E.g. 5² = 25, 6² = 25 + 11 = 36, 7² = 36 + 13 = 49. The gaps are 11, 13, 15... (odd numbers).',
    },
    {
      kind: 'try-it',
      problem: '11²',
      answer: 121,
      hint: '11² = (10 + 1)² = 100 + 20 + 1 = 121.',
    },
  ],
}
