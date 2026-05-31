import type { TechniqueContent } from '@/features/technique-card'

export const mulDoubleHalve: TechniqueContent = {
  techniqueId: 'mul-double-halve',
  slides: [
    {
      kind: 'concept',
      heading: 'Shuffle factors of 2 to make life easier',
      body: 'Doubling one factor and halving the other leaves the product unchanged. Keep shuffling until one side becomes a round number — then the multiplication is trivial.',
      mentalModel: 'a × b = (2a) × (b/2).',
    },
    {
      kind: 'worked',
      problem: '35 × 16',
      steps: [
        'Double 35, halve 16 → 70 × 8.',
        'Double, halve → 140 × 4.',
        'Again → 280 × 2 = 560.',
      ],
      answer: 560,
    },
    {
      kind: 'worked',
      problem: '25 × 14',
      steps: [
        'Halve 14, double 25 → 50 × 7.',
        '50 × 7 = 350.',
      ],
      answer: 350,
    },
    {
      kind: 'edge-case',
      heading: 'Only works while one side is even',
      body: 'You can only halve an even number cleanly. Stop shuffling when both sides are odd or one side is already round enough to handle.',
    },
    {
      kind: 'try-it',
      problem: '24 × 15',
      answer: 360,
      hint: 'Halve 24, double 15 → 12 × 30 = 360.',
    },
  ],
}
