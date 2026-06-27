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
    masteryThresholds: { speedPerMin: 6 },
  },
  {
    id: 'add-complement-100',
    name: 'Complement of 100',
    topicId: 'addition',
    description:
      "When adding numbers close to 100 (e.g. 97 + 85), find each number's complement to 100, subtract those complements from 200.",
    difficulty: 'easy',
    relatedTechniqueIds: ['add-round-adjust', 'sub-complement-10'],
    masteryThresholds: { speedPerMin: 6 },
  },
  {
    id: 'add-round-adjust',
    name: 'Round and Adjust',
    topicId: 'addition',
    description:
      'Round one number to the nearest 10 or 100, add, then adjust. E.g. 47 + 38 → 47 + 40 − 2 = 85.',
    difficulty: 'easy',
    relatedTechniqueIds: ['add-left-to-right', 'sub-round-adjust'],
    masteryThresholds: { speedPerMin: 6 },
  },
  {
    id: 'add-near-doubles',
    name: 'Near-Doubles Shortcut',
    topicId: 'addition',
    description:
      'When two numbers are close to each other (e.g. 47 + 48), double the smaller and add the difference. 47 + 48 = 47 × 2 + 1 = 95.',
    difficulty: 'easy',
    relatedTechniqueIds: ['add-left-to-right', 'mul-double-halve'],
    masteryThresholds: { speedPerMin: 7 },
  },
  {
    id: 'add-column-grouping',
    name: 'Column Grouping',
    topicId: 'addition',
    description:
      'Group digits that sum to 10 or 20 first, then add remaining digits. Works especially well for adding three or more numbers.',
    difficulty: 'medium',
    relatedTechniqueIds: ['add-left-to-right', 'add-round-adjust'],
    masteryThresholds: { speedPerMin: 5 },
  },
  {
    id: 'add-speed-1d2d',
    name: '1-Digit + 2-Digit (Speed)',
    topicId: 'addition',
    description:
      'Build reflexive speed adding a single digit to any two-digit number. Drill until the answer appears instantly — no counting up, no hesitation.',
    difficulty: 'easy',
    relatedTechniqueIds: ['add-speed-2d2d'],
    masteryThresholds: { speedPerMin: 10 },
  },
  {
    id: 'add-speed-2d2d',
    name: '2-Digit + 2-Digit (Speed)',
    topicId: 'addition',
    description:
      'Pure repetition drill for adding two two-digit numbers. No tricks — train your brain to handle all carry patterns by reflex.',
    difficulty: 'easy',
    relatedTechniqueIds: ['add-speed-1d2d', 'add-speed-3d', 'add-left-to-right'],
    masteryThresholds: { speedPerMin: 8 },
  },
  {
    id: 'add-speed-3d',
    name: '3-Digit Addition (Speed)',
    topicId: 'addition',
    description:
      'Speed drill for three-digit addition covering all carry combinations. The goal is fluency through repetition, not specific shortcuts.',
    difficulty: 'medium',
    relatedTechniqueIds: ['add-speed-2d2d', 'sub-speed-3d'],
    masteryThresholds: { speedPerMin: 5 },
  },
]
