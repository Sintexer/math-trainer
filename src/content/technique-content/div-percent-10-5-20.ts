import type { TechniqueContent } from '@/features/technique-card'

export const divPercent10520: TechniqueContent = {
  techniqueId: 'div-percent-10-5-20',
  slides: [
    {
      kind: 'concept',
      heading: 'Everything builds on 10%',
      body: '10% of a number = divide by 10 (shift one place). From there: 5% is half of 10%, 20% is double, 15% is 10% + 5%. Almost every "percentage of" question can be assembled from these.',
      mentalModel: 'Get 10% first; combine pieces.',
    },
    {
      kind: 'worked',
      problem: '15% of 80',
      steps: [
        '10% of 80 = 8.',
        '5% = half of 8 = 4.',
        '8 + 4 = 12.',
      ],
      answer: 12,
    },
    {
      kind: 'worked',
      problem: '20% of 145',
      steps: [
        '10% of 145 = 14.5.',
        'Double → 29.',
      ],
      answer: 29,
    },
    {
      kind: 'edge-case',
      heading: '25% has its own shortcut',
      body: '25% is a quarter, so just divide by 4. Faster than 10% + 10% + 5%.',
      examples: ['25% of 240 = 60'],
    },
    {
      kind: 'try-it',
      problem: '15% of 60',
      answer: 9,
      hint: '10% = 6, 5% = 3. Total 9.',
    },
  ],
}
