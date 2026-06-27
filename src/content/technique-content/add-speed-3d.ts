import type { TechniqueContent } from '@/features/technique-card'

export const addSpeed3d: TechniqueContent = {
  techniqueId: 'add-speed-3d',
  slides: [
    {
      kind: 'concept',
      heading: 'Three digits: left to right, one column at a time',
      body: 'Three-digit addition by heart means processing hundreds, then tens, then units — keeping a running total as you go. The key is to hold the partial sum confidently while you process the next column. This is a working-memory workout as much as an arithmetic one. Speed comes only through repetition.',
      mentalModel: 'Running total: hundreds → add tens → add units.',
    },
    {
      kind: 'worked',
      problem: '342 + 215',
      steps: [
        'Hundreds: 300 + 200 = 500.',
        'Tens: 40 + 10 = 50 → running total 550.',
        'Units: 2 + 5 = 7 → total 557.',
      ],
      answer: 557,
    },
    {
      kind: 'worked',
      problem: '476 + 138',
      steps: [
        'Hundreds: 400 + 100 = 500.',
        'Tens: 70 + 30 = 100 → running total 600.',
        'Units: 6 + 8 = 14 → total 614.',
      ],
      answer: 614,
    },
    {
      kind: 'try-it',
      problem: '253 + 194',
      answer: 447,
      hint: 'Hundreds 200 + 100 = 300. Tens 50 + 90 = 140 → 440. Units 3 + 4 = 7 → 447.',
    },
  ],
}
