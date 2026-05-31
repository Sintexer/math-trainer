import type { TechniqueContent } from '@/features/technique-card'

export const mulBy5: TechniqueContent = {
  techniqueId: 'mul-by-5',
  slides: [
    {
      kind: 'concept',
      heading: '5 is half of 10',
      body: 'Halving and multiplying by ten are both easy. Combine them: halve the number first, then append a zero. Works perfectly when the number is even.',
      mentalModel: 'n × 5 = (n ÷ 2) × 10.',
    },
    {
      kind: 'worked',
      problem: '48 × 5',
      steps: [
        'Halve 48 → 24.',
        'Append a zero → 240.',
      ],
      answer: 240,
    },
    {
      kind: 'edge-case',
      heading: 'Odd numbers leave a half',
      body: 'For odd n, halving leaves a .5 — equivalent to ending the answer in a 5. Easiest path: subtract 1, halve, append 0, add 5. Example: 47 × 5 → (46/2)·10 + 5 = 230 + 5 = 235.',
    },
    {
      kind: 'worked',
      problem: '47 × 5',
      steps: [
        '47 − 1 = 46.',
        '46 ÷ 2 = 23, append 0 → 230.',
        '230 + 5 = 235.',
      ],
      answer: 235,
    },
    {
      kind: 'try-it',
      problem: '86 × 5',
      answer: 430,
      hint: 'Half 86 = 43, append 0 → 430.',
    },
  ],
}
