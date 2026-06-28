import type { TechniqueContent } from '@/features/technique-card'

import { addLeftToRight } from './add-left-to-right'
import { addComplement100 } from './add-complement-100'
import { addRoundAdjust } from './add-round-adjust'
import { addNearDoubles } from './add-near-doubles'
import { addColumnGrouping } from './add-column-grouping'
import { addSpeed1d2d } from './add-speed-1d2d'
import { addSpeed2d2d } from './add-speed-2d2d'
import { addSpeed3d } from './add-speed-3d'

import { subComplement10 } from './sub-complement-10'
import { subBorrowFree } from './sub-borrow-free'
import { subRoundAdjust } from './sub-round-adjust'
import { subCountingUp } from './sub-counting-up'
import { subSpeed2d1d } from './sub-speed-2d1d'
import { subSpeed2d2d } from './sub-speed-2d2d'
import { subSpeed3d } from './sub-speed-3d'

import { mulBy11 } from './mul-by-11'
import { mulBy9 } from './mul-by-9'
import { mulBy5 } from './mul-by-5'
import { mulBy25 } from './mul-by-25'
import { mulBy12 } from './mul-by-12'
import { mulSqEnding5 } from './mul-sq-ending-5'
import { mulNear100 } from './mul-near-100'
import { mulDoubleHalve } from './mul-double-halve'
import { mulBy99101 } from './mul-by-99-101'
import { mulFoilMental } from './mul-foil-mental'
import { mulTable2to9 } from './mul-table-2to9'
import { mulTable10to19 } from './mul-table-10to19'
import { mulTable20to29 } from './mul-table-20to29'
import { mulWholeNumbers } from './mul-whole-numbers'
import { mulSquaresFoundation } from './mul-squares-foundation'
import { mulSquaresAdvanced } from './mul-squares-advanced'
import { mulRootsFoundation } from './mul-roots-foundation'
import { mulRootsPractice } from './mul-roots-practice'

import { divBy5 } from './div-by-5'
import { divBy25 } from './div-by-25'
import { divBy9DigitSum } from './div-by-9-digit-sum'
import { divPercent10520 } from './div-percent-10-5-20'
import { divEstimateAdjust } from './div-estimate-adjust'
import { divFactorDecompose } from './div-factor-decompose'

const allContent: readonly TechniqueContent[] = [
  // Addition (8)
  addLeftToRight,
  addComplement100,
  addRoundAdjust,
  addNearDoubles,
  addColumnGrouping,
  addSpeed1d2d,
  addSpeed2d2d,
  addSpeed3d,
  // Subtraction (7)
  subComplement10,
  subBorrowFree,
  subRoundAdjust,
  subCountingUp,
  subSpeed2d1d,
  subSpeed2d2d,
  subSpeed3d,
  // Multiplication (18)
  mulBy11,
  mulBy9,
  mulBy5,
  mulBy25,
  mulBy12,
  mulSqEnding5,
  mulNear100,
  mulDoubleHalve,
  mulBy99101,
  mulFoilMental,
  mulTable2to9,
  mulTable10to19,
  mulTable20to29,
  mulWholeNumbers,
  mulSquaresFoundation,
  mulSquaresAdvanced,
  mulRootsFoundation,
  mulRootsPractice,
  // Division (6)
  divBy5,
  divBy25,
  divBy9DigitSum,
  divPercent10520,
  divEstimateAdjust,
  divFactorDecompose,
] as const

const contentMap = new Map<string, TechniqueContent>(
  allContent.map((c) => [c.techniqueId, c]),
)

/** All technique content entries in curriculum order. */
export function getAllTechniqueContent(): readonly TechniqueContent[] {
  return allContent
}

/** Look up slide content for a technique by id. Throws on miss — content
 *  completeness is enforced by tests, so a miss is a content-data bug. */
export function getTechniqueContent(techniqueId: string): TechniqueContent {
  const c = contentMap.get(techniqueId)
  if (!c) throw new Error(`Technique content not found: "${techniqueId}"`)
  return c
}

/** Non-throwing variant. */
export function findTechniqueContent(
  techniqueId: string,
): TechniqueContent | undefined {
  return contentMap.get(techniqueId)
}
