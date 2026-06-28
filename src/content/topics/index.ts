import type { Topic } from '@/shared/types'

export const topics: Topic[] = [
  {
    id: 'addition',
    name: 'Addition',
    techniqueIds: [
      // Speed foundation drills (learn these first)
      'add-speed-1d2d',
      'add-speed-2d2d',
      'add-speed-3d',
      // Trick-based techniques
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
      // Speed foundation drills
      'sub-speed-2d1d',
      'sub-speed-2d2d',
      'sub-speed-3d',
      // Trick-based techniques
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
      // Memory foundation drills (times tables)
      'mul-table-2to9',
      'mul-table-10to19',
      'mul-table-20to29',
      'mul-by-5',
      'mul-whole-numbers',
      // Squares & roots foundation
      'mul-squares-foundation',
      'mul-squares-advanced',
      'mul-roots-foundation',
      'mul-roots-practice',
      // Trick-based techniques
      'mul-by-11',
      'mul-by-9',
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
