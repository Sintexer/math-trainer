import type { TechniqueContent } from '@/features/technique-card'

export const mulBy25: TechniqueContent = {
  techniqueId: 'mul-by-25',
  slides: [
    {
      kind: 'concept',
      heading: '25 is a quarter of 100',
      body: 'Dividing by 4 is fast, and ×100 is just two trailing zeros. So n × 25 = (n ÷ 4) × 100. Cleanest when n is divisible by 4.',
      mentalModel: 'n × 25 = (n ÷ 4) × 100.',
    },
    {
      kind: 'worked',
      problem: '36 × 25',
      steps: [
        '36 ÷ 4 = 9.',
        '9 × 100 = 900.',
      ],
      answer: 900,
    },
    {
      kind: 'worked',
      problem: '48 × 25',
      steps: [
        '48 ÷ 4 = 12.',
        '12 × 100 = 1200.',
      ],
      answer: 1200,
    },
    {
      kind: 'edge-case',
      heading: 'Not divisible by 4? Track the remainder',
      body: 'If n isn\'t a multiple of 4, the remainder r contributes r × 25 to the answer. Example: 17 × 25 = 16×25 + 25 = 400 + 25 = 425.',
    },
    {
      kind: 'try-it',
      problem: '52 × 25',
      answer: 1300,
      hint: '52 ÷ 4 = 13, then × 100.',
    },
  ],
}
