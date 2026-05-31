import type { TechniqueContent } from '@/features/technique-card'

export const divBy9DigitSum: TechniqueContent = {
  techniqueId: 'div-by-9-digit-sum',
  slides: [
    {
      kind: 'concept',
      heading: '9 + digit sums are a divisibility shortcut',
      body: 'A number is divisible by 9 exactly when its digit sum is. To divide cleanly, scan the digits left to right and accumulate a running sum — each running total becomes the next quotient digit.',
      mentalModel: 'Running digit sum doubles as the quotient.',
    },
    {
      kind: 'worked',
      problem: '234 ÷ 9',
      steps: [
        'First quotient digit = first dividend digit: 2.',
        'Running sum = 2 + 3 = 5 → next quotient digit.',
        'Running sum = 5 + 4 = 9 — equals 9, so divides evenly.',
        'Quotient: 26.',
      ],
      answer: 26,
    },
    {
      kind: 'worked',
      problem: '432 ÷ 9',
      steps: [
        'Start with 4.',
        '4 + 3 = 7.',
        '7 + 2 = 9 (clean).',
        'Quotient: 48.',
      ],
      answer: 48,
    },
    {
      kind: 'edge-case',
      heading: 'Running sum ≥ 10 means a carry',
      body: 'When the running total reaches 10 or more, write its units digit and carry 1 into the next quotient digit. Skip this technique if the digit sum is not divisible by 9 — use estimate-and-adjust instead.',
    },
    {
      kind: 'try-it',
      problem: '351 ÷ 9',
      answer: 39,
      hint: '3, 3+5=8, 8+1=9 → 39.',
    },
  ],
}
