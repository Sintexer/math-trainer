import type { TechniqueContent } from '@/features/technique-card'

export const mulPerfectSquares: TechniqueContent = {
  techniqueId: 'mul-perfect-squares',
  slides: [
    {
      kind: 'concept',
      heading: 'Squares: anchor points for all of mental math',
      body: 'Perfect squares are reference points that power a huge range of mental calculations: n²±k factoring, near-square multiplication (a² − b²), the Squares-Ending-in-5 trick, and many estimation shortcuts. Memorise 2²–12² first; they appear constantly. Then 13²–25², which appear in everyday estimation. Hard difficulty extends to 50².',
      mentalModel: 'Squares are vocabulary, not calculations. Learn them like words.',
    },
    {
      kind: 'worked',
      problem: '12²',
      steps: [
        '12² = (10 + 2)² = 100 + 2×20 + 4 = 144.',
        'Direct recall target: 144.',
      ],
      answer: 144,
    },
    {
      kind: 'worked',
      problem: '15²',
      steps: [
        '15² = (10 + 5)² = 100 + 100 + 25 = 225.',
        'Or via the ×5 trick: 15² = 1 × 2 × 100 + 25 = 225.',
        'Direct recall target: 225.',
      ],
      answer: 225,
    },
    {
      kind: 'edge-case',
      heading: 'Anchor squares worth memorising first',
      body: 'Start with these: 5²=25, 10²=100, 11²=121, 12²=144, 15²=225, 20²=400, 25²=625, 50²=2500. These cover the most common mental math situations. The harder ones (26²–50²) come through repetition in the hard drill.',
    },
    {
      kind: 'try-it',
      problem: '9²',
      answer: 81,
      hint: '9² = (10 − 1)² = 100 − 20 + 1 = 81. Memorise: 81.',
    },
  ],
}
