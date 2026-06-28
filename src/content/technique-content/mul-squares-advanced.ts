import type { TechniqueContent } from '@/features/technique-card'

export const mulSquaresAdvanced: TechniqueContent = {
  techniqueId: 'mul-squares-advanced',
  slides: [
    {
      kind: 'concept',
      heading: 'Perfect squares 21–50',
      body: 'Master larger perfect squares. These underpin factoring, complex estimation, and advanced tricks like Squares Ending in 5.',
      mentalModel: 'See 37², instantly recall 1369 (or compute if needed). Either way, solid fluency.',
    },
    {
      kind: 'worked',
      problem: '25²',
      steps: ['25² = (20 + 5)² = 400 + 200 + 25 = 625.', 'Or ×5 trick: 2 × 3 = 6, append 25 → 625.'],
      answer: 625,
    },
    {
      kind: 'worked',
      problem: '30²',
      steps: ['30² = 900. Round squares are easiest.'],
      answer: 900,
    },
    {
      kind: 'edge-case',
      heading: 'The ×5 ending trick',
      body: 'For any square ending in 5: n5 = n × (n + 1), append 25. E.g. 35² → 3 × 4 = 12, append 25 → 1225. Always ends in 25.',
    },
    {
      kind: 'try-it',
      problem: '20²',
      answer: 400,
      hint: '20² = (2 × 10)² = 4 × 100 = 400.',
    },
  ],
}
