import type { TechniqueContent } from '@/features/technique-card'

export const addSpeed1d2d: TechniqueContent = {
  techniqueId: 'add-speed-1d2d',
  slides: [
    {
      kind: 'concept',
      heading: 'The first rung: single digit meets two digits',
      body: 'Adding a single-digit number to a two-digit number is the most basic mental addition. The goal here is not a trick — it is speed and automaticity. Drill until your brain produces the answer before you finish reading the problem. Think of it as building a reflex, not solving a puzzle.',
      mentalModel: 'Hear the problem → answer appears. No intermediate steps.',
    },
    {
      kind: 'worked',
      problem: '43 + 7',
      steps: [
        'Units digit of 43 is 3. Add 7: 3 + 7 = 10.',
        'Carry 1 to tens: 40 + 10 = 50.',
        'Answer: 50.',
      ],
      answer: 50,
    },
    {
      kind: 'worked',
      problem: '58 + 6',
      steps: [
        'Units: 8 + 6 = 14. Write 4, carry 1.',
        'Tens: 50 + 10 = 60.',
        'Answer: 64.',
      ],
      answer: 64,
    },
    {
      kind: 'try-it',
      problem: '74 + 8',
      answer: 82,
      hint: 'Units 4 + 8 = 12. Tens 70 + 10 = 80. Total 82.',
    },
  ],
}
