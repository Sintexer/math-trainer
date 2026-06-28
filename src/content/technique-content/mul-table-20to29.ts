import type { TechniqueContent } from '@/features/technique-card'

export const mulTable20to29: TechniqueContent = {
  techniqueId: 'mul-table-20to29',
  slides: [
    {
      kind: 'concept',
      heading: 'The 20–29 multiplication table',
      body: 'Bridge from teen facts to larger multiplications. Practice variety to build pattern recognition.',
      mentalModel: 'See 23 × 7, decompose as (20 + 3) × 7 or use direct recall if practiced enough.',
    },
    {
      kind: 'worked',
      problem: '23 × 7',
      steps: ['Decompose: (20 + 3) × 7 = 140 + 21 = 161.'],
      answer: 161,
    },
    {
      kind: 'worked',
      problem: '24 × 15',
      steps: ['Decompose: 24 × 15 = 24 × (10 + 5) = 240 + 120 = 360.'],
      answer: 360,
    },
    {
      kind: 'edge-case',
      heading: 'Mixed multiplications',
      body: 'Not all multiplications in this range involve 20+. Practice 23 × 18, 25 × 12, 21 × 31 — variety builds resilience.',
    },
    {
      kind: 'try-it',
      problem: '25 × 8',
      answer: 200,
      hint: '25 × 8 = (20 + 5) × 8 = 160 + 40 = 200.',
    },
  ],
}
