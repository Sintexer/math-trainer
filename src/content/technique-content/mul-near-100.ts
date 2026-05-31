import type { TechniqueContent } from '@/features/technique-card'

export const mulNear100: TechniqueContent = {
  techniqueId: 'mul-near-100',
  slides: [
    {
      kind: 'concept',
      heading: 'Pivot around 100',
      body: 'For two numbers a, b close to 100, write their distances below 100 as d₁ and d₂. The product is (a − d₂) × 100 + d₁ × d₂. The "cross" subtraction works because (100−d₁)(100−d₂) = 100(100 − d₁ − d₂) + d₁d₂.',
      mentalModel: 'Subtract one gap from the other, append the product of gaps.',
    },
    {
      kind: 'worked',
      problem: '97 × 96',
      steps: [
        'Gaps below 100: d₁ = 3, d₂ = 4.',
        '97 − 4 = 93 (or 96 − 3 = 93). Prepend it as hundreds → 9300.',
        'Product of gaps 3 × 4 = 12.',
        '9300 + 12 = 9312.',
      ],
      answer: 9312,
    },
    {
      kind: 'worked',
      problem: '94 × 92',
      steps: [
        'Gaps: 6 and 8.',
        '94 − 8 = 86 → 8600.',
        '6 × 8 = 48.',
        '8600 + 48 = 8648.',
      ],
      answer: 8648,
    },
    {
      kind: 'edge-case',
      heading: 'Above 100 works too — flip the signs',
      body: 'For numbers just above 100 (e.g. 103 × 106), use positive offsets: (a + d₂) × 100 + d₁ × d₂.',
      examples: ['103 × 106 → (103+6)·100 + 3·6 = 10918'],
    },
    {
      kind: 'try-it',
      problem: '98 × 95',
      answer: 9310,
      hint: 'Gaps 2 and 5. 98 − 5 = 93 → 9300, plus 2 × 5 = 10.',
    },
  ],
}
