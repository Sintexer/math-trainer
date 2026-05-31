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
} from './techniques/addition'

// Subtraction
import {
  generateSubComplement10,
  generateSubBorrowFree,
  generateSubRoundAdjust,
  generateSubCountingUp,
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
  // Addition (5)
  'add-left-to-right': generateAddLeftToRight,
  'add-complement-100': generateAddComplement100,
  'add-round-adjust': generateAddRoundAdjust,
  'add-near-doubles': generateAddNearDoubles,
  'add-column-grouping': generateAddColumnGrouping,

  // Subtraction (4)
  'sub-complement-10': generateSubComplement10,
  'sub-borrow-free': generateSubBorrowFree,
  'sub-round-adjust': generateSubRoundAdjust,
  'sub-counting-up': generateSubCountingUp,

  // Multiplication (10)
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

  // Division (6)
  'div-by-5': generateDivBy5,
  'div-by-25': generateDivBy25,
  'div-by-9-digit-sum': generateDivBy9DigitSum,
  'div-percent-10-5-20': generateDivPercent,
  'div-estimate-adjust': generateDivEstimateAdjust,
  'div-factor-decompose': generateDivFactorDecompose,
}
