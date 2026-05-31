import type { TechniqueContent } from '@/features/technique-card'

export const subBorrowFree: TechniqueContent = {
  techniqueId: 'sub-borrow-free',
  slides: [
    {
      kind: 'concept',
      heading: 'Shift both sides — the gap stays the same',
      body: 'The difference between two numbers does not change if you add the same amount to both. Bump both numbers up so the subtractor ends in 0, then subtract trivially.',
      mentalModel: '(a + k) − (b + k) = a − b.',
    },
    {
      kind: 'worked',
      problem: '82 − 47',
      steps: [
        'Add 3 to both so 47 becomes 50.',
        '85 − 50 = 35.',
      ],
      answer: 35,
    },
    {
      kind: 'worked',
      problem: '143 − 78',
      steps: [
        'Add 2 to both → 145 − 80.',
        '145 − 80 = 65.',
      ],
      answer: 65,
    },
    {
      kind: 'try-it',
      problem: '91 − 36',
      answer: 55,
      hint: 'Add 4 → 95 − 40 = 55.',
    },
  ],
}
