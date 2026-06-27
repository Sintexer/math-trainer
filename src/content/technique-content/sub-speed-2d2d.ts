import type { TechniqueContent } from '@/features/technique-card'

export const subSpeed2d2d: TechniqueContent = {
  techniqueId: 'sub-speed-2d2d',
  slides: [
    {
      kind: 'concept',
      heading: 'Two-digit subtraction: the core mental workout',
      body: 'Two-digit minus two-digit subtraction spans all borrowing patterns. Unlike trick-based approaches (which optimise specific cases), this drill builds raw fluency across the entire space — straightforward subtractions, single-borrow cases, and double-borrow cases alike. Drill with equal intensity on all of them; the tricky ones become automatic through repetition.',
      mentalModel: 'Tens minus tens, units minus units; borrow if units are insufficient.',
    },
    {
      kind: 'worked',
      problem: '73 − 38',
      steps: [
        'Units: 3 − 8 requires borrow. Borrow 10: 13 − 8 = 5.',
        'Tens: 70 − 30 = 40; minus the borrow = 30.',
        'Answer: 35.',
      ],
      answer: 35,
    },
    {
      kind: 'worked',
      problem: '85 − 47',
      steps: [
        'Units: 5 − 7 requires borrow. 15 − 7 = 8.',
        'Tens: 80 − 40 = 40; minus borrow = 30.',
        'Answer: 38.',
      ],
      answer: 38,
    },
    {
      kind: 'try-it',
      problem: '62 − 25',
      answer: 37,
      hint: 'Units 2 − 5, borrow: 12 − 5 = 7. Tens 60 − 20 = 40, minus borrow = 30. Total 37.',
    },
  ],
}
