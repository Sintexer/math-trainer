import type { TechniqueContent } from '@/features/technique-card'

export const addColumnGrouping: TechniqueContent = {
  techniqueId: 'add-column-grouping',
  slides: [
    {
      kind: 'concept',
      heading: 'Spot the tens, sum them first',
      body: 'When adding several numbers, scan each column for pairs (or triples) that combine to a clean 10 or 20. Add those groups first to lock in round chunks, then sweep up the leftovers.',
      mentalModel: 'Tens are free brain space.',
    },
    {
      kind: 'worked',
      problem: '7 + 3 + 6 + 4 + 8',
      steps: [
        'Pair 7+3 = 10 and 6+4 = 10.',
        'That leaves 8.',
        '10 + 10 + 8 = 28.',
      ],
      answer: 28,
    },
    {
      kind: 'worked',
      problem: '24 + 16 + 35 + 25',
      steps: [
        'Pair 24+16 = 40 and 35+25 = 60.',
        '40 + 60 = 100.',
      ],
      answer: 100,
    },
    {
      kind: 'try-it',
      problem: '9 + 6 + 4 + 1 + 7',
      answer: 27,
      hint: '9+1 = 10, 6+4 = 10, leaves 7. Total 27.',
    },
  ],
}
