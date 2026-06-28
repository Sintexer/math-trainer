import type { TechniqueContent } from '@/features/technique-card'

export const mulTable2to9: TechniqueContent = {
  techniqueId: 'mul-table-2to9',
  slides: [
    {
      kind: 'concept',
      heading: 'The 2–9 multiplication table',
      body: 'The foundation of all mental math. These 36 facts (6 unique pairs) must become instant reflexive recall.',
      mentalModel: 'See 7 × 8, think 56 immediately. No computation.',
    },
    {
      kind: 'worked',
      problem: '7 × 8',
      steps: ['Core table fact: 56.', 'Build automaticity through repetition.'],
      answer: 56,
    },
    {
      kind: 'worked',
      problem: '6 × 9',
      steps: ['6 × 9 = 54. Direct recall.'],
      answer: 54,
    },
    {
      kind: 'edge-case',
      heading: 'Building speed',
      body: 'At first, you may decompose: 7 × 8 = 7 × 4 × 2 = 28 × 2 = 56. With practice, this becomes instant.',
    },
    {
      kind: 'try-it',
      problem: '8 × 9',
      answer: 72,
      hint: 'Recall: 72.',
    },
  ],
}
