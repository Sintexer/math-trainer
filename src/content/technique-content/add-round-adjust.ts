import type { TechniqueContent } from '@/features/technique-card'

export const addRoundAdjust: TechniqueContent = {
  techniqueId: 'add-round-adjust',
  slides: [
    {
      kind: 'concept',
      heading: 'Round up, then pay back the change',
      body: 'Adding round numbers is easy. Bump one of the addends up to the nearest 10 (or 100), do the easy addition, then subtract the small amount you added.',
      mentalModel: 'Easy first, correction second.',
    },
    {
      kind: 'worked',
      problem: '47 + 38',
      steps: [
        'Round 38 up to 40 (added 2).',
        '47 + 40 = 87.',
        'Subtract the 2 you added: 87 − 2 = 85.',
      ],
      answer: 85,
    },
    {
      kind: 'worked',
      problem: '156 + 89',
      steps: [
        'Round 89 up to 90 (added 1).',
        '156 + 90 = 246.',
        '246 − 1 = 245.',
      ],
      answer: 245,
    },
    {
      kind: 'try-it',
      problem: '64 + 29',
      answer: 93,
      hint: '64 + 30 = 94, then subtract 1.',
    },
  ],
}
