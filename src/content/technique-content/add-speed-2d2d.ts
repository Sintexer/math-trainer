import type { TechniqueContent } from '@/features/technique-card'

export const addSpeed2d2d: TechniqueContent = {
  techniqueId: 'add-speed-2d2d',
  slides: [
    {
      kind: 'concept',
      heading: 'Two-digit fluency: the workhorse of mental addition',
      body: 'Most real-world mental arithmetic reduces to adding two two-digit numbers. There is no single "trick" — speed comes from repetition. Work left to right: add tens, then units, absorb any carry. With enough practice the answer arrives as a unit, not as a computation.',
      mentalModel: 'Tens first, then units, collapse carry in one beat.',
    },
    {
      kind: 'worked',
      problem: '37 + 48',
      steps: [
        'Tens: 30 + 40 = 70.',
        'Units: 7 + 8 = 15.',
        'Combine: 70 + 15 = 85.',
      ],
      answer: 85,
    },
    {
      kind: 'worked',
      problem: '65 + 27',
      steps: [
        'Tens: 60 + 20 = 80.',
        'Units: 5 + 7 = 12.',
        'Combine: 80 + 12 = 92.',
      ],
      answer: 92,
    },
    {
      kind: 'try-it',
      problem: '43 + 59',
      answer: 102,
      hint: 'Tens 40 + 50 = 90. Units 3 + 9 = 12. Total 90 + 12 = 102.',
    },
  ],
}
