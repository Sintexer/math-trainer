import type { TechniqueContent } from '@/features/technique-card'

export const divBy25: TechniqueContent = {
  techniqueId: 'div-by-25',
  slides: [
    {
      kind: 'concept',
      heading: 'Divide by 25 = quadruple, then shift twice',
      body: 'Since 25 is a quarter of 100, dividing by 25 is the same as multiplying by 4 and then dividing by 100 (move two places left).',
      mentalModel: 'n ÷ 25 = (4n) ÷ 100.',
    },
    {
      kind: 'worked',
      problem: '325 ÷ 25',
      steps: [
        '325 × 4 = 1300.',
        '1300 ÷ 100 = 13.',
      ],
      answer: 13,
    },
    {
      kind: 'worked',
      problem: '1750 ÷ 25',
      steps: [
        '1750 × 4 = 7000.',
        '7000 ÷ 100 = 70.',
      ],
      answer: 70,
    },
    {
      kind: 'try-it',
      problem: '475 ÷ 25',
      answer: 19,
      hint: '475 × 4 = 1900, divide by 100.',
    },
  ],
}
