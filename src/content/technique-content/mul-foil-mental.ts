import type { TechniqueContent } from '@/features/technique-card'

export const mulFoilMental: TechniqueContent = {
  techniqueId: 'mul-foil-mental',
  slides: [
    {
      kind: 'concept',
      heading: 'Expand both numbers into tens and units',
      body: 'Any two-digit product (a+b)(c+d) expands to four partials: ac + ad + bc + bd. Splitting at the tens digit gives one big easy term and three small ones — manageable to hold in your head.',
      mentalModel: '(10a + b)(10c + d) = 100ac + 10(ad + bc) + bd.',
    },
    {
      kind: 'worked',
      problem: '34 × 27',
      steps: [
        'Split: (30 + 4)(20 + 7).',
        'F: 30 × 20 = 600.',
        'O + I: 30 × 7 + 4 × 20 = 210 + 80 = 290.',
        'L: 4 × 7 = 28.',
        '600 + 290 + 28 = 918.',
      ],
      answer: 918,
    },
    {
      kind: 'worked',
      problem: '23 × 41',
      steps: [
        '(20+3)(40+1).',
        '20 × 40 = 800.',
        '20 × 1 + 3 × 40 = 20 + 120 = 140.',
        '3 × 1 = 3.',
        '800 + 140 + 3 = 943.',
      ],
      answer: 943,
    },
    {
      kind: 'edge-case',
      heading: 'Carry the running total',
      body: 'The hard part is holding the running total. Many people add F + (O+I) first, then add L at the end. Build the answer in place-value order — hundreds, tens, units — so you can speak it as you go.',
    },
    {
      kind: 'try-it',
      problem: '26 × 32',
      answer: 832,
      hint: '20×30=600, 20×2 + 6×30 = 220, 6×2 = 12. Sum: 832.',
    },
  ],
}
