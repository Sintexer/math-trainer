import type { TechniqueContent } from '@/features/technique-card'

export const subRoundAdjust: TechniqueContent = {
  techniqueId: 'sub-round-adjust',
  slides: [
    {
      kind: 'concept',
      heading: 'Overshoot, then add back',
      body: 'Round the subtractor up to the nearest 10 (or 100), subtract the round number, then add back the amount you rounded up by. Mirror image of round-and-adjust for addition.',
      mentalModel: 'Subtract too much, then forgive yourself.',
    },
    {
      kind: 'worked',
      problem: '94 − 38',
      steps: [
        'Round 38 up to 40 (extra 2).',
        '94 − 40 = 54.',
        '54 + 2 = 56.',
      ],
      answer: 56,
    },
    {
      kind: 'worked',
      problem: '215 − 89',
      steps: [
        'Round 89 up to 90 (extra 1).',
        '215 − 90 = 125.',
        '125 + 1 = 126.',
      ],
      answer: 126,
    },
    {
      kind: 'try-it',
      problem: '83 − 27',
      answer: 56,
      hint: '83 − 30 = 53, then add 3.',
    },
  ],
}
