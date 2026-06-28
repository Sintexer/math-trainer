/**
 * Generator Registry
 *
 * Maps every techniqueId to its generator function.
 * This is the only file that imports from the individual technique files;
 * all other consumers go through the public API in index.ts.
 */

import type { ProblemGenerator } from './types'

// Addition
import {
  generateAddLeftToRight,
  generateAddComplement100,
  generateAddRoundAdjust,
  generateAddNearDoubles,
  generateAddColumnGrouping,
  generateAddSpeed1d2d,
  generateAddSpeed2d2d,
  generateAddSpeed3d,
} from './techniques/addition'

// Subtraction
import {
  generateSubComplement10,
  generateSubBorrowFree,
  generateSubRoundAdjust,
  generateSubCountingUp,
  generateSubSpeed2d1d,
  generateSubSpeed2d2d,
  generateSubSpeed3d,
} from './techniques/subtraction'

// Multiplication
import {
  generateMulBy11,
  generateMulBy9,
  generateMulBy5,
  generateMulBy25,
  generateMulBy12,
  generateMulSqEnding5,
  generateMulNear100,
  generateMulDoubleHalve,
  generateMulBy99101,
  generateMulFoilMental,
  generateMulTable2to9,
  generateMulTable10to19,
  generateMulTable20to29,
  generateMulWholeNumbers,
  generateMulSquaresFoundation,
  generateMulSquaresAdvanced,
  generateMulRootsFoundation,
  generateMulRootsPractice,
} from './techniques/multiplication'

// Division
import {
  generateDivBy5,
  generateDivBy25,
  generateDivBy9DigitSum,
  generateDivPercent,
  generateDivEstimateAdjust,
  generateDivFactorDecompose,
} from './techniques/division'

export const generatorRegistry: Readonly<Record<string, ProblemGenerator>> = {
  // Addition (8)
  'add-left-to-right': generateAddLeftToRight,
  'add-complement-100': generateAddComplement100,
  'add-round-adjust': generateAddRoundAdjust,
  'add-near-doubles': generateAddNearDoubles,
  'add-column-grouping': generateAddColumnGrouping,
  'add-speed-1d2d': generateAddSpeed1d2d,
  'add-speed-2d2d': generateAddSpeed2d2d,
  'add-speed-3d': generateAddSpeed3d,

  // Subtraction (7)
  'sub-complement-10': generateSubComplement10,
  'sub-borrow-free': generateSubBorrowFree,
  'sub-round-adjust': generateSubRoundAdjust,
  'sub-counting-up': generateSubCountingUp,
  'sub-speed-2d1d': generateSubSpeed2d1d,
  'sub-speed-2d2d': generateSubSpeed2d2d,
  'sub-speed-3d': generateSubSpeed3d,

  // Multiplication (18 → 10 tricks + 8 foundations)
  'mul-by-11': generateMulBy11,
  'mul-by-9': generateMulBy9,
  'mul-by-5': generateMulBy5,
  'mul-by-25': generateMulBy25,
  'mul-by-12': generateMulBy12,
  'mul-sq-ending-5': generateMulSqEnding5,
  'mul-near-100': generateMulNear100,
  'mul-double-halve': generateMulDoubleHalve,
  'mul-by-99-101': generateMulBy99101,
  'mul-foil-mental': generateMulFoilMental,
  // Multiplication foundations (times tables)
  'mul-table-2to9': generateMulTable2to9,
  'mul-table-10to19': generateMulTable10to19,
  'mul-table-20to29': generateMulTable20to29,
  'mul-whole-numbers': generateMulWholeNumbers,
  // Multiplication foundations (squares & roots)
  'mul-squares-foundation': generateMulSquaresFoundation,
  'mul-squares-advanced': generateMulSquaresAdvanced,
  'mul-roots-foundation': generateMulRootsFoundation,
  'mul-roots-practice': generateMulRootsPractice,

  // Division (6)
  'div-by-5': generateDivBy5,
  'div-by-25': generateDivBy25,
  'div-by-9-digit-sum': generateDivBy9DigitSum,
  'div-percent-10-5-20': generateDivPercent,
  'div-estimate-adjust': generateDivEstimateAdjust,
  'div-factor-decompose': generateDivFactorDecompose,
}
