import type { TechniqueContent } from '@/features/technique-card'

export const mulTable10to19: TechniqueContent = {
  techniqueId: 'mul-table-10to19',
  slides: [
    {
      kind: 'concept',
      heading: 'The 10–19 multiplication table',
      body: 'Extend your foundation with the teen table. These facts are used constantly in mental math tricks.',
      mentalModel: 'See 13 × 17, compute instantly using teen-table scaffold or direct recall.',
    },
    {
      kind: 'worked',
      problem: '13 × 7',
      steps: ['Decompose: (10 + 3) × 7 = 70 + 21 = 91.', 'With practice: direct recall.'],
      answer: 91,
    },
    {
      kind: 'worked',
      problem: '14 × 12',
      steps: ['Decompose: 14 × 12 = (10 + 4) × 12 = 120 + 48 = 168.'],
      answer: 168,
    },
    {
      kind: 'edge-case',
      heading: 'Teen table scaffold',
      body: '(10 + a)(10 + b) = 100 + 10(a + b) + ab. E.g. 17 × 18: 100 + 10(7+8) + 7×8 = 100 + 150 + 56 = 306.',
    },
    {
      kind: 'try-it',
      problem: '15 × 16',
      answer: 240,
      hint: '(10+5)(10+6) = 100 + 110 + 30 = 240.',
    },
  ],
}
