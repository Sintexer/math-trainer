import type { LearningTopic } from '@/shared/types'

/**
 * Learning topic definitions — the semantic sub-domain groups shown in the
 * app's home screen and topic hub.
 *
 * Each entry drives exactly what appears in the topic hub: add a techniqueId
 * to a group, and that challenge card appears automatically. A technique may
 * appear in more than one group (cross-topic) — progress is always shared
 * since it is keyed by techniqueId in the Redux slice.
 *
 * Order within `techniqueIds` controls the rendering order in the hub.
 */
export const learningTopics: LearningTopic[] = [
  // ── Addition ──────────────────────────────────────────────────────────────
  {
    id: 'add-speed',
    name: 'Addition Speed',
    description:
      'Build reflexive speed adding numbers of increasing digit count until answers come instantly.',
    techniqueIds: [
      'add-speed-1d2d',
      'add-speed-2d2d',
      'add-speed-3d',
    ],
    hasTheory: false,
  },
  {
    id: 'add-tricks',
    name: 'Addition Tricks',
    description:
      'Mental shortcuts that exploit rounding, complements, and number patterns to add faster.',
    techniqueIds: [
      'add-left-to-right',
      'add-complement-100',
      'add-round-adjust',
      'add-near-doubles',
      'add-column-grouping',
    ],
  },

  // ── Subtraction ───────────────────────────────────────────────────────────
  {
    id: 'sub-speed',
    name: 'Subtraction Speed',
    description:
      'Build reflexive speed subtracting numbers of increasing complexity.',
    techniqueIds: [
      'sub-speed-2d1d',
      'sub-speed-2d2d',
      'sub-speed-3d',
    ],
    hasTheory: false,
  },
  {
    id: 'sub-tricks',
    name: 'Subtraction Tricks',
    description:
      'Techniques that reframe subtraction problems to avoid borrowing and reduce mental load.',
    techniqueIds: [
      'sub-complement-10',
      'sub-borrow-free',
      'sub-round-adjust',
      'sub-counting-up',
    ],
  },

  // ── Multiplication ────────────────────────────────────────────────────────
  {
    id: 'times-tables',
    name: 'Times Tables',
    description:
      'Master multiplication tables and perfect squares for instant recall — the foundation for all multiplication tricks.',
    techniqueIds: [
      'mul-times-table',
      'mul-perfect-squares',
    ],
    hasTheory: false,
  },
  {
    id: 'mul-tricks',
    name: 'Multiplication Tricks',
    description:
      'Speed up multiplication using special properties of common multipliers.',
    techniqueIds: [
      'mul-by-11',
      'mul-by-9',
      'mul-by-5',
      'mul-by-25',
      'mul-by-12',
    ],
  },
  {
    id: 'mul-advanced',
    name: 'Advanced Multiplication',
    description:
      'Powerful techniques for larger and more complex multiplication using pattern recognition.',
    techniqueIds: [
      'mul-sq-ending-5',
      'mul-near-100',
      'mul-double-halve',
      'mul-by-99-101',
      'mul-foil-mental',
    ],
  },

  // ── Division ──────────────────────────────────────────────────────────────
  {
    id: 'div-shortcuts',
    name: 'Division Shortcuts',
    description:
      'Clever routes to division answers that bypass long division entirely.',
    techniqueIds: [
      'div-by-5',
      'div-by-25',
      'div-by-9-digit-sum',
      'div-percent-10-5-20',
      'div-estimate-adjust',
      'div-factor-decompose',
    ],
  },
]
