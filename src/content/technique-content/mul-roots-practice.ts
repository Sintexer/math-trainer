import type { TechniqueContent } from '@/features/technique-card'

export const mulRootsPractice: TechniqueContent = {
  techniqueId: 'mul-roots-practice',
  slides: [
    {
      kind: 'concept',
      heading: 'Square roots: extended practice',
      body: 'Deepen your root fluency. Master perfect roots instantly and develop estimation confidence for non-perfect roots across a wider range.',
      mentalModel: 'See √150, instantly estimate 12–13 using perfect square anchors. No memorization needed, just reasoning.',
    },
    {
      kind: 'worked',
      problem: '√36',
      steps: ['6² = 36, so √36 = 6. Perfect square.'],
      answer: 6,
    },
    {
      kind: 'worked',
      problem: '√200',
      steps: ['14² = 196, 15² = 225. √200 is between 14 and 15, closer to 14. Estimate 14.1.', 'Rounded: 14.'],
      answer: 14,
    },
    {
      kind: 'edge-case',
      heading: 'Estimation framework',
      body: 'For any √N: find the closest perfect square on each side. Use linear interpolation or intuition to estimate. E.g. √120 is between 10²=100 and 11²=121, closer to 11, so ≈ 10.9.',
    },
    {
      kind: 'try-it',
      problem: '√49',
      answer: 7,
      hint: '7² = 49, so √49 = 7.',
    },
  ],
}
