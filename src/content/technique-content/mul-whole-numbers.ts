import type { TechniqueContent } from '@/features/technique-card'

export const mulWholeNumbers: TechniqueContent = {
  techniqueId: 'mul-whole-numbers',
  slides: [
    {
      kind: 'concept',
      heading: 'Mixed multiplication (2–99)',
      body: 'Capstone drill: any two-number multiplication from 2 to 99. Tests your reflexive recall and decomposition skills across the full range.',
      mentalModel: 'See any pair, instantly recall or decompose into manageable sub-problems.',
    },
    {
      kind: 'worked',
      problem: '37 × 8',
      steps: ['Decompose: (30 + 7) × 8 = 240 + 56 = 296.'],
      answer: 296,
    },
    {
      kind: 'worked',
      problem: '42 × 25',
      steps: ['Use ×25 trick: 42 ÷ 2 = 21, then 21 × 100 = 2100. But verify: 42 × 25 = 42 × 100 ÷ 4 = 4200 ÷ 4 = 1050.'],
      answer: 1050,
    },
    {
      kind: 'edge-case',
      heading: 'Choosing your strategy',
      body: 'For 37 × 8: decompose by tens. For 42 × 25: use the ×25 trick. For 34 × 27: FOIL. The more you practice, the faster you spot the right approach.',
    },
    {
      kind: 'try-it',
      problem: '56 × 7',
      answer: 392,
      hint: '(50 + 6) × 7 = 350 + 42 = 392.',
    },
  ],
}
