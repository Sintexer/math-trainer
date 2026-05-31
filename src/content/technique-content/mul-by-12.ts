import type { TechniqueContent } from '@/features/technique-card'

export const mulBy12: TechniqueContent = {
  techniqueId: 'mul-by-12',
  slides: [
    {
      kind: 'concept',
      heading: '12 is 10 plus 2',
      body: 'Split 12 into 10 and 2. Multiplying by 10 is shifting digits; multiplying by 2 is doubling. Add the two results.',
      mentalModel: 'n × 12 = n × 10 + n × 2.',
    },
    {
      kind: 'worked',
      problem: '34 × 12',
      steps: [
        '34 × 10 = 340.',
        '34 × 2 = 68.',
        '340 + 68 = 408.',
      ],
      answer: 408,
    },
    {
      kind: 'worked',
      problem: '57 × 12',
      steps: [
        '570 (× 10).',
        '114 (× 2).',
        '570 + 114 = 684.',
      ],
      answer: 684,
    },
    {
      kind: 'try-it',
      problem: '46 × 12',
      answer: 552,
      hint: '460 + 92 = 552.',
    },
  ],
}
