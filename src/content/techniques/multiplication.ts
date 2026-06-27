import type { Technique } from '@/shared/types'

export const multiplicationTechniques: Technique[] = [
  {
    id: 'mul-by-11',
    name: 'Multiply by 11',
    topicId: 'multiplication',
    description:
      'For two-digit numbers: place the sum of the digits in the middle. E.g. 43 × 11 = 4_(4+3)_3 = 473. For three-digit: carry when the middle sum > 9.',
    difficulty: 'easy',
    relatedTechniqueIds: ['mul-by-12', 'mul-by-99-101'],
    masteryThresholds: { speedPerMin: 7, accuracyPct: 85 },
  },
  {
    id: 'mul-by-9',
    name: 'Multiply by 9',
    topicId: 'multiplication',
    description:
      'Multiply by 10 and subtract the original number. E.g. 37 × 9 = 37 × 10 − 37 = 370 − 37 = 333. Fast and reliable for any number.',
    difficulty: 'easy',
    relatedTechniqueIds: ['mul-by-5', 'mul-by-99-101'],
    masteryThresholds: { speedPerMin: 7, accuracyPct: 85 },
  },
  {
    id: 'mul-by-5',
    name: 'Multiply by 5',
    topicId: 'multiplication',
    description:
      'Divide by 2, then multiply by 10. E.g. 48 × 5 = 48 ÷ 2 × 10 = 24 × 10 = 240. For odd numbers: (n−1)/2 × 10 + 5.',
    difficulty: 'easy',
    relatedTechniqueIds: ['mul-by-25', 'div-by-5'],
    masteryThresholds: { speedPerMin: 8, accuracyPct: 85 },
  },
  {
    id: 'mul-by-25',
    name: 'Multiply by 25',
    topicId: 'multiplication',
    description:
      'Divide by 4, then multiply by 100. E.g. 36 × 25 = 36 ÷ 4 × 100 = 9 × 100 = 900. When not divisible by 4, use: n × 25 = n × 100 ÷ 4.',
    difficulty: 'easy',
    relatedTechniqueIds: ['mul-by-5', 'div-by-25'],
    masteryThresholds: { speedPerMin: 7, accuracyPct: 85 },
  },
  {
    id: 'mul-by-12',
    name: 'Multiply by 12',
    topicId: 'multiplication',
    description:
      'Multiply by 10, then add double the original. E.g. 34 × 12 = 340 + 68 = 408. Equivalent to n × 10 + n × 2.',
    difficulty: 'easy',
    relatedTechniqueIds: ['mul-by-11', 'mul-double-halve'],
    masteryThresholds: { speedPerMin: 7, accuracyPct: 85 },
  },
  {
    id: 'mul-sq-ending-5',
    name: 'Squares Ending in 5',
    topicId: 'multiplication',
    description:
      'For any number ending in 5: multiply the leading digit(s) by the next integer, then append 25. E.g. 75² = 7 × 8 = 56, append 25 → 5625.',
    difficulty: 'medium',
    relatedTechniqueIds: ['mul-by-5', 'mul-foil-mental'],
    masteryThresholds: { speedPerMin: 5, accuracyPct: 85 },
  },
  {
    id: 'mul-near-100',
    name: 'Multiply Numbers Near 100',
    topicId: 'multiplication',
    description:
      'For numbers close to 100: find each number\'s difference from 100 (d1, d2). Result = (first number − d2) × 100 + d1 × d2. E.g. 97 × 96: d1=3, d2=4 → (97−4)×100 + 3×4 = 9300 + 12 = 9312.',
    difficulty: 'medium',
    relatedTechniqueIds: ['mul-by-99-101', 'mul-foil-mental'],
    masteryThresholds: { speedPerMin: 4, accuracyPct: 85 },
  },
  {
    id: 'mul-double-halve',
    name: 'Doubling and Halving',
    topicId: 'multiplication',
    description:
      'Double one factor and halve the other until the calculation is easy. E.g. 35 × 16 → 70 × 8 → 140 × 4 → 280 × 2 → 560. Works when one factor can be halved to a round number.',
    difficulty: 'medium',
    relatedTechniqueIds: ['mul-by-5', 'mul-by-25'],
    masteryThresholds: { speedPerMin: 5, accuracyPct: 85 },
  },
  {
    id: 'mul-by-99-101',
    name: 'Multiply by 99 or 101',
    topicId: 'multiplication',
    description:
      'For ×99: multiply by 100 and subtract original. For ×101: multiply by 100 and add original. E.g. 47 × 99 = 4700 − 47 = 4653. E.g. 47 × 101 = 4700 + 47 = 4747.',
    difficulty: 'medium',
    relatedTechniqueIds: ['mul-by-9', 'mul-near-100'],
    masteryThresholds: { speedPerMin: 6, accuracyPct: 85 },
  },
  {
    id: 'mul-foil-mental',
    name: 'FOIL Mental Multiplication',
    topicId: 'multiplication',
    description:
      'Expand two-digit × two-digit using FOIL: (a+b)(c+d) = ac + ad + bc + bd. E.g. 34 × 27 = (30+4)(20+7) = 600 + 210 + 80 + 28 = 918. The hardest mental math technique.',
    difficulty: 'hard',
    relatedTechniqueIds: ['mul-near-100', 'mul-sq-ending-5'],
    masteryThresholds: { speedPerMin: 3, accuracyPct: 80 },
  },
  {
    id: 'mul-times-table',
    name: 'Times Table (×2–99)',
    topicId: 'multiplication',
    description:
      'Build reflexive recall for multiplication facts. Easy covers the classic 9×9 table. Medium extends to 19×19 (the "teen" table). Hard drills any pair up to 99×99 through repetition.',
    difficulty: 'easy',
    relatedTechniqueIds: ['mul-perfect-squares', 'mul-by-9'],
    masteryThresholds: { speedPerMin: 8, accuracyPct: 90 },
  },
  {
    id: 'mul-perfect-squares',
    name: 'Perfect Squares',
    topicId: 'multiplication',
    description:
      'Build instant recall of perfect squares from 2² to 50². Fluency with squares is essential for factoring, estimation, and unlocking tricks like Squares Ending in 5.',
    difficulty: 'medium',
    relatedTechniqueIds: ['mul-times-table', 'mul-sq-ending-5'],
    masteryThresholds: { speedPerMin: 6, accuracyPct: 90 },
  },
]
