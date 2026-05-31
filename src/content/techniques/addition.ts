import type { Technique } from '@/shared/types'

export const additionTechniques: Technique[] = [
  {
    id: 'add-left-to-right',
    name: 'Left-to-Right Addition',
    topicId: 'addition',
    description:
      'Add from left to right (hundreds → tens → units) instead of carrying from right. Faster for mental math since you build the answer progressively.',
    difficulty: 'easy',
    relatedTechniqueIds: ['add-round-adjust', 'add-column-grouping'],
    masteryThresholds: { speedPerMin: 6, accuracyPct: 85 },
  },
  {
    id: 'add-complement-100',
    name: 'Complement of 100',
    topicId: 'addition',
    description:
      "When adding numbers close to 100 (e.g. 97 + 85), find each number's complement to 100, subtract those complements from 200.",
    difficulty: 'easy',
    relatedTechniqueIds: ['add-round-adjust', 'sub-complement-10'],
    masteryThresholds: { speedPerMin: 6, accuracyPct: 85 },
  },
  {
    id: 'add-round-adjust',
    name: 'Round and Adjust',
    topicId: 'addition',
    description:
      'Round one number to the nearest 10 or 100, add, then adjust. E.g. 47 + 38 → 47 + 40 − 2 = 85.',
    difficulty: 'easy',
    relatedTechniqueIds: ['add-left-to-right', 'sub-round-adjust'],
    masteryThresholds: { speedPerMin: 6, accuracyPct: 85 },
  },
  {
    id: 'add-near-doubles',
    name: 'Near-Doubles Shortcut',
    topicId: 'addition',
    description:
      'When two numbers are close to each other (e.g. 47 + 48), double the smaller and add the difference. 47 + 48 = 47 × 2 + 1 = 95.',
    difficulty: 'easy',
    relatedTechniqueIds: ['add-left-to-right', 'mul-double-halve'],
    masteryThresholds: { speedPerMin: 7, accuracyPct: 85 },
  },
  {
    id: 'add-column-grouping',
    name: 'Column Grouping',
    topicId: 'addition',
    description:
      'Group digits that sum to 10 or 20 first, then add remaining digits. Works especially well for adding three or more numbers.',
    difficulty: 'medium',
    relatedTechniqueIds: ['add-left-to-right', 'add-round-adjust'],
    masteryThresholds: { speedPerMin: 5, accuracyPct: 85 },
  },
]
