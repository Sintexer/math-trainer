import type { TechniqueContent } from '@/features/technique-card'

export const mulTimesTable: TechniqueContent = {
  techniqueId: 'mul-times-table',
  slides: [
    {
      kind: 'concept',
      heading: 'The foundation of all fast multiplication',
      body: 'Every multiplication shortcut — multiplying by 9, 11, 25, near-100 — ultimately leans on instant recall of small multiplication facts. The classic 9×9 table is non-negotiable; extending to 19×19 unlocks significantly more mental multiplication. Beyond that, the hard difficulty trains raw speed on any pair up to 99×99 through sheer repetition.',
      mentalModel: 'Know the fact, not the method. Recall, not compute.',
    },
    {
      kind: 'worked',
      problem: '7 × 8',
      steps: [
        '7 × 8 is a core table fact: 56.',
        'If uncertain: 7 × 8 = 7 × 4 × 2 = 28 × 2 = 56.',
        'Or: 7 × 8 = (5 + 2) × 8 = 40 + 16 = 56.',
      ],
      answer: 56,
    },
    {
      kind: 'worked',
      problem: '13 × 7',
      steps: [
        'Decompose: 13 × 7 = (10 + 3) × 7 = 70 + 21 = 91.',
        'With practice this fact becomes direct recall.',
      ],
      answer: 91,
    },
    {
      kind: 'edge-case',
      heading: 'Beyond 9×9: the teen table',
      body: 'For the medium drill (up to 19×19), a useful scaffold is: (10 + a)(10 + b) = 100 + 10a + 10b + ab = 100 + 10(a + b) + ab. E.g. 14 × 17: a=4, b=7 → 100 + 10×11 + 28 = 100 + 110 + 28 = 238. After many repetitions the result is direct, not computed.',
    },
    {
      kind: 'try-it',
      problem: '8 × 9',
      answer: 72,
      hint: '8 × 9 = 8 × 10 − 8 = 80 − 8 = 72. Or simply recall: 72.',
    },
  ],
}
