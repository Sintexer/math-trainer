import type { TechniqueContent } from '@/features/technique-card'

export const divFactorDecompose: TechniqueContent = {
  techniqueId: 'div-factor-decompose',
  slides: [
    {
      kind: 'concept',
      heading: 'Split the divisor into easy pieces',
      body: 'Dividing by a composite number is the same as dividing by each of its factors in turn. Replace one hard division with two easy ones.',
      mentalModel: 'n ÷ (a × b) = n ÷ a ÷ b.',
    },
    {
      kind: 'worked',
      problem: '168 ÷ 12',
      steps: [
        '12 = 4 × 3.',
        '168 ÷ 4 = 42.',
        '42 ÷ 3 = 14.',
      ],
      answer: 14,
    },
    {
      kind: 'worked',
      problem: '450 ÷ 18',
      steps: [
        '18 = 2 × 9.',
        '450 ÷ 2 = 225.',
        '225 ÷ 9 = 25.',
      ],
      answer: 25,
    },
    {
      kind: 'edge-case',
      heading: 'Pick the order that keeps numbers clean',
      body: 'Divide by the bigger factor first when the dividend is large; that keeps the intermediate result smaller. Always pick a factoring where each step has no remainder.',
    },
    {
      kind: 'try-it',
      problem: '360 ÷ 24',
      answer: 15,
      hint: '24 = 8 × 3. 360 ÷ 8 = 45, ÷ 3 = 15.',
    },
  ],
}
