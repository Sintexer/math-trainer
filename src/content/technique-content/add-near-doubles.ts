import type { TechniqueContent } from '@/features/technique-card'

export const addNearDoubles: TechniqueContent = {
  techniqueId: 'add-near-doubles',
  slides: [
    {
      kind: 'concept',
      heading: 'Doubles are easy — lean on them',
      body: 'Your brain knows doubles (47+47, 30+30, …) faster than mixed sums. When two numbers are close, double the smaller one and add the small difference.',
      mentalModel: 'a + (a+d) = 2a + d.',
    },
    {
      kind: 'worked',
      problem: '47 + 48',
      steps: [
        'Smaller is 47. Difference is 1.',
        'Double 47 → 94.',
        '94 + 1 = 95.',
      ],
      answer: 95,
    },
    {
      kind: 'worked',
      problem: '63 + 65',
      steps: [
        'Smaller is 63, difference is 2.',
        'Double 63 → 126.',
        '126 + 2 = 128.',
      ],
      answer: 128,
    },
    {
      kind: 'edge-case',
      heading: 'Skip it when the gap is large',
      body: 'If the two numbers differ by more than ~5, the doubling shortcut loses its edge over plain addition. Use it for tight pairs.',
    },
    {
      kind: 'try-it',
      problem: '36 + 38',
      answer: 74,
      hint: 'Double 36 = 72, then add 2.',
    },
  ],
}
