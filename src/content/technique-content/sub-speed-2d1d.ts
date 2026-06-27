import type { TechniqueContent } from '@/features/technique-card'

export const subSpeed2d1d: TechniqueContent = {
  techniqueId: 'sub-speed-2d1d',
  slides: [
    {
      kind: 'concept',
      heading: 'The mirror of single-digit addition',
      body: 'Subtracting a single digit from a two-digit number is the direct inverse of 1-digit + 2-digit addition. If you drilled the addition table cold, the subtraction answers are already in there — you just need to flip the direction. Focus on the cases that cross a tens boundary (e.g. 52 − 7): these require a tiny mental borrow and are where most hesitation lives.',
      mentalModel: 'Does the units digit cover the subtractor? If yes, direct. If no, borrow from tens.',
    },
    {
      kind: 'worked',
      problem: '47 − 8',
      steps: [
        'Units: 7 − 8 is negative, so borrow. Think: (47 − 7) − 1 = 40 − 1 = 39.',
        'Or: 47 − 8 = 47 − 10 + 2 = 37 + 2 = 39.',
        'Answer: 39.',
      ],
      answer: 39,
    },
    {
      kind: 'worked',
      problem: '63 − 7',
      steps: [
        'Units: 3 < 7, borrow. 63 − 3 = 60, then − 4 more = 56.',
        'Answer: 56.',
      ],
      answer: 56,
    },
    {
      kind: 'try-it',
      problem: '82 − 5',
      answer: 77,
      hint: 'Units 2 < 5, borrow. 82 − 2 = 80, then − 3 = 77.',
    },
  ],
}
