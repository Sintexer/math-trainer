import type { TechniqueContent } from '@/features/technique-card'

export const mulBy99101: TechniqueContent = {
  techniqueId: 'mul-by-99-101',
  slides: [
    {
      kind: 'concept',
      heading: 'Hug 100',
      body: 'Multiplying by 99 is "×100 then take one away". Multiplying by 101 is "×100 then add one back". Both reuse the ease of multiplying by 100.',
      mentalModel: 'n × 99 = 100n − n;  n × 101 = 100n + n.',
    },
    {
      kind: 'worked',
      problem: '47 × 99',
      steps: [
        '47 × 100 = 4700.',
        '4700 − 47 = 4653.',
      ],
      answer: 4653,
    },
    {
      kind: 'worked',
      problem: '47 × 101',
      steps: [
        '47 × 100 = 4700.',
        '4700 + 47 = 4747.',
      ],
      answer: 4747,
    },
    {
      kind: 'try-it',
      problem: '63 × 99',
      answer: 6237,
      hint: '6300 − 63 = 6237.',
    },
  ],
}
