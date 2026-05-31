import type { TechniqueContent } from '@/features/technique-card'

export const subComplement10: TechniqueContent = {
  techniqueId: 'sub-complement-10',
  slides: [
    {
      kind: 'concept',
      heading: 'Bridge through the next ten',
      body: "When subtracting a single digit that's bigger than the units digit, break the jump into two: down to the previous ten, then the rest. Removes the mental borrow.",
      mentalModel: 'a − b = (a − units) − (b − units).',
    },
    {
      kind: 'worked',
      problem: '83 − 7',
      steps: [
        'Step down to 80: 83 − 3 = 80.',
        'Still need to remove 4 more (7 − 3).',
        '80 − 4 = 76.',
      ],
      answer: 76,
    },
    {
      kind: 'worked',
      problem: '62 − 8',
      steps: [
        '62 − 2 = 60.',
        '60 − 6 = 54.',
      ],
      answer: 54,
    },
    {
      kind: 'try-it',
      problem: '54 − 9',
      answer: 45,
      hint: '54 − 4 = 50, then 50 − 5 = 45.',
    },
  ],
}
