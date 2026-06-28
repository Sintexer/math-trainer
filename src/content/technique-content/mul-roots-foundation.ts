import type { TechniqueContent } from '@/features/technique-card'

export const mulRootsFoundation: TechniqueContent = {
  techniqueId: 'mul-roots-foundation',
  slides: [
    {
      kind: 'concept',
      heading: 'Square roots: the inverse of squares',
      body: 'If you know 15² = 225, then √225 = 15. Roots are just the reverse. Perfect roots (answers 2–10) should be instant. Hard mode includes estimation for non-perfect roots.',
      mentalModel: 'See √144, think 12 immediately. See √150, estimate 12.something.',
    },
    {
      kind: 'worked',
      problem: '√64',
      steps: ['8² = 64, so √64 = 8. Direct recall.'],
      answer: 8,
    },
    {
      kind: 'worked',
      problem: '√100',
      steps: ['10² = 100, so √100 = 10. Direct recall.'],
      answer: 10,
    },
    {
      kind: 'edge-case',
      heading: 'Estimation for non-perfect roots',
      body: 'For √150: note 12² = 144 and 13² = 169. Since 150 is closer to 144, √150 ≈ 12. Use perfect squares as anchors.',
    },
    {
      kind: 'try-it',
      problem: '√81',
      answer: 9,
      hint: '9² = 81, so √81 = 9.',
    },
  ],
}
