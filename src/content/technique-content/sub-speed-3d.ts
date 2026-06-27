import type { TechniqueContent } from '@/features/technique-card'

export const subSpeed3d: TechniqueContent = {
  techniqueId: 'sub-speed-3d',
  slides: [
    {
      kind: 'concept',
      heading: 'Three-digit subtraction: managing cascading borrows',
      body: 'Three-digit subtraction requires tracking borrows across two column boundaries, which taxes working memory more than any previous drill. Work right to left for borrowing purposes even if you prefer left-to-right for addition — the cascade borrow (units → tens → hundreds) is cleanest that way. Speed here means reliable, automatic borrowing with no mental backtracking.',
      mentalModel: 'Units column first; propagate borrow to tens, then to hundreds if needed.',
    },
    {
      kind: 'worked',
      problem: '543 − 187',
      steps: [
        'Units: 3 − 7, borrow. 13 − 7 = 6. Tens now 130 → 130 − 1 = 120.',
        'Tens: 4(borrowed) → 3 tens. 3 − 8 tens, need borrow. 13 − 8 = 5. Hundreds: 500 − 100 = 300.',
        'Hundreds: 5 − 1 = 4; minus borrow = 3. Total: 300 + 50 + 6 = 356.',
      ],
      answer: 356,
    },
    {
      kind: 'edge-case',
      heading: 'Double-borrow: when tens are also 0',
      body: 'Problems like 503 − 248 require borrowing from hundreds directly into units (via the tens). Treat 503 as 4 hundreds + 10 tens + 3 units before subtracting. 503 − 248: units 13 − 8 = 5, tens 9 − 4 = 5 (borrowed 1 for units, 1 from hundreds), hundreds 4 − 2 = 2. Answer: 255.',
    },
    {
      kind: 'try-it',
      problem: '734 − 256',
      answer: 478,
      hint: 'Units 14 − 6 = 8 (borrow). Tens 2 (after borrow) → 12 − 5 = 7 (borrow). Hundreds 7 − 1(borrow) − 2 = 4. Answer: 478.',
    },
  ],
}
