import type { TechniqueContent } from '@/features/technique-card'

export const addLeftToRight: TechniqueContent = {
  techniqueId: 'add-left-to-right',
  slides: [
    {
      kind: 'concept',
      heading: 'Build the answer from the top down',
      body: 'School arithmetic adds the right column first and carries left. For mental math, do the opposite: start from the largest place value and build the answer left to right. By the time you finish you can already say the result without having to "remember" carried digits.',
      mentalModel: 'Big places first, then refine.',
    },
    {
      kind: 'worked',
      problem: '456 + 327',
      steps: [
        'Hundreds: 400 + 300 = 700.',
        'Tens: 50 + 20 = 70 → running total 770.',
        'Units: 6 + 7 = 13 → 770 + 13 = 783.',
      ],
      answer: 783,
    },
    {
      kind: 'worked',
      problem: '68 + 25',
      steps: [
        'Tens: 60 + 20 = 80.',
        'Units: 8 + 5 = 13.',
        'Combine: 80 + 13 = 93.',
      ],
      answer: 93,
    },
    {
      kind: 'try-it',
      problem: '74 + 58',
      answer: 132,
      hint: 'Tens 70 + 50 = 120. Units 4 + 8 = 12. Total 132.',
    },
  ],
}
