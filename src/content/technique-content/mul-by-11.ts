import type { TechniqueContent } from '@/features/technique-card'

export const mulBy11: TechniqueContent = {
  techniqueId: 'mul-by-11',
  slides: [
    {
      kind: 'concept',
      heading: 'Split the digits, drop the sum in the middle',
      body: 'For a two-digit number AB × 11, the result is A_(A+B)_B. Multiplying by 11 is really 10× + 1×, which lines up the digits one place apart so they overlap by their sum.',
      mentalModel: 'Outer digits stay; middle is their sum.',
    },
    {
      kind: 'worked',
      problem: '43 × 11',
      steps: [
        'Outer digits: 4 _ 3.',
        'Middle digit: 4 + 3 = 7.',
        'Read off: 4-7-3 → 473.',
      ],
      answer: 473,
    },
    {
      kind: 'edge-case',
      heading: 'When the digit sum is 10 or more, carry',
      body: 'If A + B ≥ 10, write the units digit in the middle and add 1 to the leading digit. Same idea as long-form carry.',
      examples: ['78 × 11 → 7 _ (7+8=15) _ 8 → carry 1 → 858'],
    },
    {
      kind: 'worked',
      problem: '67 × 11',
      steps: [
        'Outer: 6 _ 7.',
        'Middle: 6 + 7 = 13 → write 3, carry 1.',
        'Leading 6 + 1 = 7 → 737.',
      ],
      answer: 737,
    },
    {
      kind: 'try-it',
      problem: '52 × 11',
      answer: 572,
      hint: '5 _ (5+2=7) _ 2 → 572.',
    },
  ],
}
