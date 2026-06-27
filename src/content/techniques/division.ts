import type { Technique } from '@/shared/types'

export const divisionTechniques: Technique[] = [
  {
    id: 'div-by-5',
    name: 'Divide by 5',
    topicId: 'division',
    description:
      'Multiply by 2, then divide by 10 (move decimal one place left). E.g. 135 ÷ 5 = 135 × 2 ÷ 10 = 270 ÷ 10 = 27. Always exact for integers divisible by 5.',
    difficulty: 'easy',
    relatedTechniqueIds: ['mul-by-5', 'div-by-25'],
    masteryThresholds: { speedPerMin: 7 },
  },
  {
    id: 'div-by-25',
    name: 'Divide by 25',
    topicId: 'division',
    description:
      'Multiply by 4, then divide by 100. E.g. 325 ÷ 25 = 325 × 4 ÷ 100 = 1300 ÷ 100 = 13. Works cleanly when result is a whole number.',
    difficulty: 'easy',
    relatedTechniqueIds: ['mul-by-25', 'div-by-5'],
    masteryThresholds: { speedPerMin: 7 },
  },
  {
    id: 'div-by-9-digit-sum',
    name: 'Divide by 9 — Digit Sum',
    topicId: 'division',
    description:
      "A number is divisible by 9 when its digit sum is divisible by 9. The quotient digit pattern: the first remainder becomes the next digit's helper. E.g. 234 ÷ 9: 2, then 2+3=5, then 5+4=9 → quotient 26.",
    difficulty: 'medium',
    relatedTechniqueIds: ['mul-by-9', 'div-factor-decompose'],
    masteryThresholds: { speedPerMin: 5 },
  },
  {
    id: 'div-percent-10-5-20',
    name: 'Percentage Shortcuts',
    topicId: 'division',
    description:
      'Quick percentage calculations: 10% = divide by 10. 5% = half of 10%. 20% = double of 10%. 15% = 10% + 5%. 25% = divide by 4. E.g. 15% of 80 = 8 + 4 = 12.',
    difficulty: 'easy',
    relatedTechniqueIds: ['div-by-5', 'mul-by-25'],
    masteryThresholds: { speedPerMin: 6 },
  },
  {
    id: 'div-estimate-adjust',
    name: 'Estimate and Adjust',
    topicId: 'division',
    description:
      'Round the divisor to the nearest easy number, divide, then adjust. E.g. 196 ÷ 14 ≈ 200 ÷ 14 ≈ 14. Verify: 14 × 14 = 196. Good for non-obvious divisions.',
    difficulty: 'medium',
    relatedTechniqueIds: ['div-factor-decompose', 'add-round-adjust'],
    masteryThresholds: { speedPerMin: 4 },
  },
  {
    id: 'div-factor-decompose',
    name: 'Factor Decomposition',
    topicId: 'division',
    description:
      'Break the divisor into factors and divide step by step. E.g. 168 ÷ 12 = 168 ÷ 4 ÷ 3 = 42 ÷ 3 = 14. Reduces hard divisions into two easy ones.',
    difficulty: 'medium',
    relatedTechniqueIds: ['div-by-9-digit-sum', 'div-estimate-adjust'],
    masteryThresholds: { speedPerMin: 5 },
  },
]
