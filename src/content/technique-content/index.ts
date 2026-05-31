import type { TechniqueContent } from '@/features/technique-card'

import { addLeftToRight } from './add-left-to-right'
import { addComplement100 } from './add-complement-100'
import { addRoundAdjust } from './add-round-adjust'
import { addNearDoubles } from './add-near-doubles'
import { addColumnGrouping } from './add-column-grouping'

import { subComplement10 } from './sub-complement-10'
import { subBorrowFree } from './sub-borrow-free'
import { subRoundAdjust } from './sub-round-adjust'
import { subCountingUp } from './sub-counting-up'

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

import { divBy5 } from './div-by-5'
import { divBy25 } from './div-by-25'
import { divBy9DigitSum } from './div-by-9-digit-sum'
import { divPercent10520 } from './div-percent-10-5-20'
import { divEstimateAdjust } from './div-estimate-adjust'
import { divFactorDecompose } from './div-factor-decompose'

const allContent: readonly TechniqueContent[] = [
  addLeftToRight,
  addComplement100,
  addRoundAdjust,
  addNearDoubles,
  addColumnGrouping,
  subComplement10,
  subBorrowFree,
  subRoundAdjust,
  subCountingUp,
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
