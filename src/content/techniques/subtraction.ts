import type { Technique } from '@/shared/types'

export const subtractionTechniques: Technique[] = [
  {
    id: 'sub-complement-10',
    name: 'Complement of 10',
    topicId: 'subtraction',
    description:
      "Find the complement: the number you add to reach the next 10. E.g. 83 − 7 → 7's complement to 10 is 3, so borrow 10 and adjust. Eliminates mental borrowing.",
    difficulty: 'easy',
    relatedTechniqueIds: ['add-complement-100', 'sub-borrow-free'],
    masteryThresholds: { speedPerMin: 6, accuracyPct: 85 },
  },
  {
    id: 'sub-borrow-free',
    name: 'Borrow-Free Subtraction',
    topicId: 'subtraction',
    description:
      'Adjust both numbers by the same amount to avoid borrowing. E.g. 82 − 47 → 85 − 50 = 35. Add to both to make the subtractor end in 0.',
    difficulty: 'easy',
    relatedTechniqueIds: ['sub-complement-10', 'sub-round-adjust'],
    masteryThresholds: { speedPerMin: 6, accuracyPct: 85 },
  },
  {
    id: 'sub-round-adjust',
    name: 'Round and Adjust (Subtract)',
    topicId: 'subtraction',
    description:
      'Round the subtractor to the nearest 10, subtract, then add back the difference. E.g. 94 − 38 → 94 − 40 + 2 = 56.',
    difficulty: 'easy',
    relatedTechniqueIds: ['add-round-adjust', 'sub-borrow-free'],
    masteryThresholds: { speedPerMin: 6, accuracyPct: 85 },
  },
  {
    id: 'sub-counting-up',
    name: 'Counting Up Method',
    topicId: 'subtraction',
    description:
      "Count up from the subtractor to the minuend. E.g. 72 − 45: count up from 45 → 50 (+5) → 72 (+22) = 27. Turns subtraction into addition.",
    difficulty: 'medium',
    relatedTechniqueIds: ['sub-complement-10', 'add-left-to-right'],
    masteryThresholds: { speedPerMin: 5, accuracyPct: 85 },
  },
  {
    id: 'sub-speed-2d1d',
    name: '2-Digit − 1-Digit (Speed)',
    topicId: 'subtraction',
    description:
      'Build automatic recall for subtracting a single digit from a two-digit number. Essential groundwork before tackling subtraction shortcuts.',
    difficulty: 'easy',
    relatedTechniqueIds: ['sub-speed-2d2d'],
    masteryThresholds: { speedPerMin: 10, accuracyPct: 90 },
  },
  {
    id: 'sub-speed-2d2d',
    name: '2-Digit − 2-Digit (Speed)',
    topicId: 'subtraction',
    description:
      'Repetition drill for two-digit subtraction with and without borrowing. Trains your working memory to handle all carry-back patterns smoothly.',
    difficulty: 'easy',
    relatedTechniqueIds: ['sub-speed-2d1d', 'sub-speed-3d', 'sub-complement-10'],
    masteryThresholds: { speedPerMin: 8, accuracyPct: 90 },
  },
  {
    id: 'sub-speed-3d',
    name: '3-Digit Subtraction (Speed)',
    topicId: 'subtraction',
    description:
      'Speed drill for three-digit subtraction covering all borrowing patterns. Builds the fluency needed for advanced subtraction techniques.',
    difficulty: 'medium',
    relatedTechniqueIds: ['sub-speed-2d2d', 'add-speed-3d'],
    masteryThresholds: { speedPerMin: 5, accuracyPct: 88 },
  },
]
