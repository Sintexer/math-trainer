import type { TechniqueContent } from '@/features/technique-card'

export const subCountingUp: TechniqueContent = {
  techniqueId: 'sub-counting-up',
  slides: [
    {
      kind: 'concept',
      heading: 'Count up — turn subtraction into addition',
      body: 'Subtraction is just "how far apart". Start at the smaller number, walk up to the next round number, then up to the bigger number, and add the two jumps. Often easier than backwards counting.',
      mentalModel: 'a − b = how much further b needs to go to reach a.',
    },
    {
      kind: 'worked',
      problem: '72 − 45',
      steps: [
        'From 45 up to 50: +5.',
        'From 50 up to 72: +22.',
        'Total jumps: 5 + 22 = 27.',
      ],
      answer: 27,
    },
    {
      kind: 'worked',
      problem: '134 − 87',
      steps: [
        '87 → 100 = +13.',
        '100 → 134 = +34.',
        '13 + 34 = 47.',
      ],
      answer: 47,
    },
    {
      kind: 'try-it',
      problem: '63 − 28',
      answer: 35,
      hint: '28 → 30 (+2), 30 → 63 (+33). Total 35.',
    },
  ],
}
