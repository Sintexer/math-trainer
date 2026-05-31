import type { TechniqueContent } from '@/features/technique-card'

export const addComplement100: TechniqueContent = {
  techniqueId: 'add-complement-100',
  slides: [
    {
      kind: 'concept',
      heading: 'Use the gap to 100',
      body: "When both numbers sit close to 100, find each one's complement (the gap up to 100). Subtract both complements from 200 instead of adding messy two-digit numbers.",
      mentalModel: 'a + b = 200 − (100−a) − (100−b).',
    },
    {
      kind: 'worked',
      problem: '97 + 85',
      steps: [
        'Complement of 97 is 3. Complement of 85 is 15.',
        'Subtract from 200: 200 − 3 − 15 = 182.',
      ],
      answer: 182,
    },
    {
      kind: 'worked',
      problem: '93 + 88',
      steps: [
        'Complements: 7 and 12.',
        '200 − 7 − 12 = 181.',
      ],
      answer: 181,
    },
    {
      kind: 'edge-case',
      heading: 'Only worth it when both are near 100',
      body: 'If one number is far from 100 (say below 70), the complement is large and the trick offers no advantage over straight addition. Use only when both numbers are in roughly the 80–99 range.',
    },
    {
      kind: 'try-it',
      problem: '96 + 91',
      answer: 187,
      hint: 'Complements 4 and 9. 200 − 4 − 9 = 187.',
    },
  ],
}
