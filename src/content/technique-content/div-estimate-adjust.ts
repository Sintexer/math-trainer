import type { TechniqueContent } from '@/features/technique-card'

export const divEstimateAdjust: TechniqueContent = {
  techniqueId: 'div-estimate-adjust',
  slides: [
    {
      kind: 'concept',
      heading: 'Guess close, then refine',
      body: 'For awkward divisions, round the divisor (or dividend) to something friendlier, divide quickly, then check by multiplying back and adjusting up or down.',
      mentalModel: 'Estimate → verify by multiplying → tweak.',
    },
    {
      kind: 'worked',
      problem: '196 ÷ 14',
      steps: [
        'Round to 200 ÷ 14 ≈ 14.',
        'Check: 14 × 14 = 196. Exact.',
      ],
      answer: 14,
    },
    {
      kind: 'worked',
      problem: '288 ÷ 18',
      steps: [
        'Round to 300 ÷ 20 = 15.',
        'Check 15 × 18 = 270, too low by 18.',
        'Try 16 × 18 = 288. Exact.',
      ],
      answer: 16,
    },
    {
      kind: 'try-it',
      problem: '266 ÷ 14',
      answer: 19,
      hint: 'Try 20 × 14 = 280 (too high by 14), so 19.',
    },
  ],
}
