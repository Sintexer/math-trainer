import type { TechniqueContent } from '@/features/technique-card'

export const mulBy9: TechniqueContent = {
  techniqueId: 'mul-by-9',
  slides: [
    {
      kind: 'concept',
      heading: '9 is 10 minus 1',
      body: 'Multiplying by 9 is one step away from multiplying by 10, which is trivial. Tack on a zero, then subtract the original number.',
      mentalModel: 'n × 9 = n × 10 − n.',
    },
    {
      kind: 'worked',
      problem: '37 × 9',
      steps: [
        '37 × 10 = 370.',
        '370 − 37 = 333.',
      ],
      answer: 333,
    },
    {
      kind: 'worked',
      problem: '84 × 9',
      steps: [
        '84 × 10 = 840.',
        '840 − 84 = 756.',
      ],
      answer: 756,
    },
    {
      kind: 'try-it',
      problem: '56 × 9',
      answer: 504,
      hint: '560 − 56 = 504.',
    },
  ],
}
