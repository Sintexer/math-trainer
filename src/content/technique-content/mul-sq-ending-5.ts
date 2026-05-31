import type { TechniqueContent } from '@/features/technique-card'

export const mulSqEnding5: TechniqueContent = {
  techniqueId: 'mul-sq-ending-5',
  slides: [
    {
      kind: 'concept',
      heading: 'Square anything ending in 5',
      body: 'For a number n5 (where n is the leading part), the square always ends in 25. The leading portion is n × (n+1). The pattern comes from (10n+5)² = 100·n·(n+1) + 25.',
      mentalModel: 'n5 squared → [n × (n+1)] then "25".',
    },
    {
      kind: 'worked',
      problem: '75²',
      steps: [
        'Leading digit n = 7. Next integer = 8.',
        '7 × 8 = 56.',
        'Append 25 → 5625.',
      ],
      answer: 5625,
    },
    {
      kind: 'worked',
      problem: '35²',
      steps: [
        'n = 3, next = 4. 3 × 4 = 12.',
        'Append 25 → 1225.',
      ],
      answer: 1225,
    },
    {
      kind: 'try-it',
      problem: '85²',
      answer: 7225,
      hint: '8 × 9 = 72, append 25.',
    },
  ],
}
