import type { TechniqueContent } from '@/features/technique-card'

export const divBy5: TechniqueContent = {
  techniqueId: 'div-by-5',
  slides: [
    {
      kind: 'concept',
      heading: 'Divide by 5 = double, then shift',
      body: 'Doubling and dividing by 10 are both effortless. Combine them: n ÷ 5 = (n × 2) ÷ 10. Move the decimal one place left after doubling.',
      mentalModel: 'n ÷ 5 = (2n) ÷ 10.',
    },
    {
      kind: 'worked',
      problem: '135 ÷ 5',
      steps: [
        '135 × 2 = 270.',
        '270 ÷ 10 = 27.',
      ],
      answer: 27,
    },
    {
      kind: 'worked',
      problem: '420 ÷ 5',
      steps: [
        '420 × 2 = 840.',
        '840 ÷ 10 = 84.',
      ],
      answer: 84,
    },
    {
      kind: 'try-it',
      problem: '245 ÷ 5',
      answer: 49,
      hint: 'Double → 490, shift → 49.',
    },
  ],
}
