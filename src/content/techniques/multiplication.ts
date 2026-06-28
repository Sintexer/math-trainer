import type { Technique } from '@/shared/types'

// ── Multiplication Tricks ─────────────────────────────────────────────────────

export const multiplicationTechniques: Technique[] = [
  {
    id: 'mul-by-11',
    name: 'Multiply by 11',
    topicId: 'multiplication',
    description:
      'For two-digit numbers: place the sum of the digits in the middle. E.g. 43 × 11 = 4_(4+3)_3 = 473. For three-digit: carry when the middle sum > 9.',
    difficulty: 'easy',
    relatedTechniqueIds: ['mul-by-12', 'mul-by-99-101'],
    masteryThresholds: { speedPerMin: 7 },
  },
  {
    id: 'mul-by-9',
    name: 'Multiply by 9',
    topicId: 'multiplication',
    description:
      'Multiply by 10 and subtract the original number. E.g. 37 × 9 = 37 × 10 − 37 = 370 − 37 = 333. Fast and reliable for any number.',
    difficulty: 'easy',
    relatedTechniqueIds: ['mul-by-5', 'mul-by-99-101'],
    masteryThresholds: { speedPerMin: 7 },
  },
  {
    id: 'mul-by-25',
    name: 'Multiply by 25',
    topicId: 'multiplication',
    description:
      'Divide by 4, then multiply by 100. E.g. 36 × 25 = 36 ÷ 4 × 100 = 9 × 100 = 900. When not divisible by 4, use: n × 25 = n × 100 ÷ 4.',
    difficulty: 'easy',
    relatedTechniqueIds: ['mul-by-5', 'div-by-25'],
    masteryThresholds: { speedPerMin: 7 },
  },
  {
    id: 'mul-by-12',
    name: 'Multiply by 12',
    topicId: 'multiplication',
    description:
      'Multiply by 10, then add double the original. E.g. 34 × 12 = 340 + 68 = 408. Equivalent to n × 10 + n × 2.',
    difficulty: 'easy',
    relatedTechniqueIds: ['mul-by-11', 'mul-double-halve'],
    masteryThresholds: { speedPerMin: 7 },
  },
  {
    id: 'mul-sq-ending-5',
    name: 'Squares Ending in 5',
    topicId: 'multiplication',
    description:
      'For any number ending in 5: multiply the leading digit(s) by the next integer, then append 25. E.g. 75² = 7 × 8 = 56, append 25 → 5625.',
    difficulty: 'medium',
    relatedTechniqueIds: ['mul-by-5', 'mul-foil-mental'],
    masteryThresholds: { speedPerMin: 5 },
  },
  {
    id: 'mul-near-100',
    name: 'Multiply Numbers Near 100',
    topicId: 'multiplication',
    description:
      'For numbers close to 100: find each number\'s difference from 100 (d1, d2). Result = (first number − d2) × 100 + d1 × d2. E.g. 97 × 96: d1=3, d2=4 → (97−4)×100 + 3×4 = 9300 + 12 = 9312.',
    difficulty: 'medium',
    relatedTechniqueIds: ['mul-by-99-101', 'mul-foil-mental'],
    masteryThresholds: { speedPerMin: 4 },
  },
  {
    id: 'mul-double-halve',
    name: 'Doubling and Halving',
    topicId: 'multiplication',
    description:
      'Double one factor and halve the other until the calculation is easy. E.g. 35 × 16 → 70 × 8 → 140 × 4 → 280 × 2 → 560. Works when one factor can be halved to a round number.',
    difficulty: 'medium',
    relatedTechniqueIds: ['mul-by-5', 'mul-by-25'],
    masteryThresholds: { speedPerMin: 5 },
  },
  {
    id: 'mul-by-99-101',
    name: 'Multiply by 99 or 101',
    topicId: 'multiplication',
    description:
      'For ×99: multiply by 100 and subtract original. For ×101: multiply by 100 and add original. E.g. 47 × 99 = 4700 − 47 = 4653. E.g. 47 × 101 = 4700 + 47 = 4747.',
    difficulty: 'medium',
    relatedTechniqueIds: ['mul-by-9', 'mul-near-100'],
    masteryThresholds: { speedPerMin: 6 },
  },
  {
    id: 'mul-foil-mental',
    name: 'FOIL Mental Multiplication',
    topicId: 'multiplication',
    description:
      'Expand two-digit × two-digit using FOIL: (a+b)(c+d) = ac + ad + bc + bd. E.g. 34 × 27 = (30+4)(20+7) = 600 + 210 + 80 + 28 = 918. The hardest mental math technique.',
    difficulty: 'hard',
    relatedTechniqueIds: ['mul-near-100', 'mul-sq-ending-5'],
    masteryThresholds: { speedPerMin: 3 },
  },

  // ── Multiplication Foundations (Times Tables) ──────────────────────────────

  {
    id: 'mul-table-2to9',
    name: 'Times Table 2–9',
    topicId: 'multiplication',
    description:
      'Master the classic 2–9 multiplication table. The foundation for all mental math. Build instant reflexive recall.',
    difficulty: 'easy',
    relatedTechniqueIds: ['mul-table-10to19', 'mul-squares-foundation'],
    masteryThresholds: { speedPerMin: 12 },
  },
  {
    id: 'mul-table-10to19',
    name: 'Times Table 10–19',
    topicId: 'multiplication',
    description:
      'Extend to 10–19 multiplication (the "teen table"). Bridge between basic tables and larger multiplications.',
    difficulty: 'medium',
    relatedTechniqueIds: ['mul-table-2to9', 'mul-table-20to29'],
    masteryThresholds: { speedPerMin: 10 },
  },
  {
    id: 'mul-table-20to29',
    name: 'Times Table 20–29',
    topicId: 'multiplication',
    description:
      'Master 20–29 multiplication. Practice mixed multiplications to build pattern recognition for larger numbers.',
    difficulty: 'medium',
    relatedTechniqueIds: ['mul-table-10to19', 'mul-whole-numbers'],
    masteryThresholds: { speedPerMin: 9 },
  },
  {
    id: 'mul-by-5',
    name: 'Multiply by 5',
    topicId: 'multiplication',
    description:
      'Divide by 2, then multiply by 10. E.g. 48 × 5 = 48 ÷ 2 × 10 = 24 × 10 = 240. For odd numbers: (n−1)/2 × 10 + 5. A fast reflex, not a trick.',
    difficulty: 'easy',
    relatedTechniqueIds: ['mul-table-2to9', 'mul-by-25'],
    masteryThresholds: { speedPerMin: 11 },
  },
  {
    id: 'mul-whole-numbers',
    name: 'Multiply Mixed Numbers',
    topicId: 'multiplication',
    description:
      'Practice reflexive recall for any two-number multiplication (2–99). Capstone drill to build automaticity across the full range.',
    difficulty: 'hard',
    relatedTechniqueIds: ['mul-table-20to29', 'mul-foil-mental'],
    masteryThresholds: { speedPerMin: 7 },
  },

  // ── Multiplication Foundations (Squares & Roots) ──────────────────────────

  {
    id: 'mul-squares-foundation',
    name: 'Perfect Squares 2–20',
    topicId: 'multiplication',
    description:
      'Build instant recall of perfect squares from 2² to 20². Squares are essential for factoring, estimation, and advanced multiplication tricks.',
    difficulty: 'easy',
    relatedTechniqueIds: ['mul-table-2to9', 'mul-squares-advanced'],
    masteryThresholds: { speedPerMin: 10 },
  },
  {
    id: 'mul-squares-advanced',
    name: 'Perfect Squares 21–50',
    topicId: 'multiplication',
    description:
      'Master larger perfect squares (21² through 50²). These underpin techniques like Squares Ending in 5 and estimation strategies.',
    difficulty: 'medium',
    relatedTechniqueIds: ['mul-squares-foundation', 'mul-sq-ending-5'],
    masteryThresholds: { speedPerMin: 8 },
  },
  {
    id: 'mul-roots-foundation',
    name: 'Square Roots Foundation',
    topicId: 'multiplication',
    description:
      'Learn square roots as the inverse of squares. Perfect roots up to √100. Hard mode includes estimation for non-perfect roots.',
    difficulty: 'medium',
    relatedTechniqueIds: ['mul-squares-foundation', 'mul-roots-practice'],
    masteryThresholds: { speedPerMin: 8 },
  },
  {
    id: 'mul-roots-practice',
    name: 'Square Roots Practice',
    topicId: 'multiplication',
    description:
      'Extended practice with square roots, including both perfect roots and estimation for non-perfect squares. Build fluency with root calculation.',
    difficulty: 'medium',
    relatedTechniqueIds: ['mul-roots-foundation', 'mul-squares-advanced'],
    masteryThresholds: { speedPerMin: 7 },
  },
]
