import type { Topic } from '@/shared/types'

export const topics: Topic[] = [
  {
    id: 'addition',
    name: 'Addition',
    techniqueIds: [
      'add-left-to-right',
      'add-complement-100',
      'add-round-adjust',
      'add-near-doubles',
      'add-column-grouping',
    ],
  },
  {
    id: 'subtraction',
    name: 'Subtraction',
    techniqueIds: [
      'sub-complement-10',
      'sub-borrow-free',
      'sub-round-adjust',
      'sub-counting-up',
    ],
  },
  {
    id: 'multiplication',
    name: 'Multiplication',
    techniqueIds: [
      'mul-by-11',
      'mul-by-9',
      'mul-by-5',
      'mul-by-25',
      'mul-by-12',
      'mul-sq-ending-5',
      'mul-near-100',
      'mul-double-halve',
      'mul-by-99-101',
      'mul-foil-mental',
    ],
  },
  {
    id: 'division',
    name: 'Division',
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
