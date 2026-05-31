/**
 * Division technique generators (6 techniques)
 *
 * div-by-5            — ×2 ÷ 10
 * div-by-25           — ×4 ÷ 100
 * div-by-9-digit-sum  — running digit-sum pattern
 * div-percent-10-5-20 — 10%, 5%, 20%, 15%, 25% of a number
 * div-estimate-adjust — round divisor, divide, verify/adjust
 * div-factor-decompose — split divisor into factors, divide stepwise
 */

import type { Difficulty, Problem } from '@/shared/types'
import { makeId, randInt, pick } from '../utils'

// ── div-by-5 ──────────────────────────────────────────────────────────────────

export function generateDivBy5(difficulty: Difficulty): Problem {
  let n: number

  switch (difficulty) {
    case 'easy':
      // 2-digit ÷ 5 (multiple of 5, 15–95)
      n = randInt(3, 19) * 5 // 15, 20, 25, ..., 95
      break
    case 'medium':
      // 3-digit ÷ 5 (multiple of 5, 105–995)
      n = randInt(21, 199) * 5
      break
    case 'hard':
      // 4-digit ÷ 5 (multiple of 5, 1005–4995)
      n = randInt(201, 999) * 5
      break
  }

  return {
    id: makeId('div-by-5'),
    techniqueId: 'div-by-5',
    topicId: 'division',
    difficulty,
    prompt: `${n} ÷ 5 = ?`,
    answer: n / 5,
  }
}

// ── div-by-25 ─────────────────────────────────────────────────────────────────

export function generateDivBy25(difficulty: Difficulty): Problem {
  let n: number

  switch (difficulty) {
    case 'easy':
      // 2–3-digit ÷ 25 (multiples of 25: 25, 50, 75, ... 475)
      n = randInt(1, 19) * 25
      break
    case 'medium':
      // 3-digit ÷ 25 (larger multiples: 500–2375)
      n = randInt(20, 95) * 25
      break
    case 'hard':
      // 4-digit ÷ 25
      n = randInt(100, 399) * 25
      break
  }

  return {
    id: makeId('div-by-25'),
    techniqueId: 'div-by-25',
    topicId: 'division',
    difficulty,
    prompt: `${n} ÷ 25 = ?`,
    answer: n / 25,
  }
}

// ── div-by-9-digit-sum ────────────────────────────────────────────────────────

/**
 * Divides a number that is a multiple of 9.
 * The technique: running digit-sum shortcut for the quotient.
 */
export function generateDivBy9DigitSum(difficulty: Difficulty): Problem {
  let quotient: number, n: number

  switch (difficulty) {
    case 'easy':
      // Quotient 2–9 (single digit), n = quotient × 9
      quotient = randInt(2, 9)
      n = quotient * 9
      break
    case 'medium':
      // Quotient 11–99 (2-digit), n = quotient × 9
      quotient = randInt(11, 99)
      n = quotient * 9
      break
    case 'hard':
      // Quotient 100–499, n = quotient × 9
      quotient = randInt(100, 499)
      n = quotient * 9
      break
  }

  return {
    id: makeId('div-by-9-digit-sum'),
    techniqueId: 'div-by-9-digit-sum',
    topicId: 'division',
    difficulty,
    prompt: `${n} ÷ 9 = ?`,
    answer: n / 9,
  }
}

// ── div-percent-10-5-20 ───────────────────────────────────────────────────────

type PercentType = { pct: number; label: string }

/**
 * Find X% of a number, using the shortcut routes for 5/10/15/20/25%.
 */
export function generateDivPercent(difficulty: Difficulty): Problem {
  let base: number
  let chosen: PercentType

  switch (difficulty) {
    case 'easy': {
      // 10% of a 2-digit multiple of 10 (trivial move decimal)
      base = randInt(2, 12) * 10
      chosen = { pct: 10, label: '10%' }
      break
    }
    case 'medium': {
      // 5% or 20% of a 2-3 digit number
      const opts: PercentType[] = [
        { pct: 5, label: '5%' },
        { pct: 20, label: '20%' },
      ]
      chosen = pick(opts)
      base = randInt(2, 19) * 10 // multiples of 10 keep answers whole
      break
    }
    case 'hard': {
      // 15% or 25% of a 2–3 digit number
      const opts: PercentType[] = [
        { pct: 15, label: '15%' },
        { pct: 25, label: '25%' },
      ]
      chosen = pick(opts)
      // For 25%: divisible by 4; for 15%: divisible by 20 for whole answer
      if (chosen.pct === 25) {
        base = randInt(1, 24) * 4 // multiples of 4
      } else {
        base = randInt(2, 12) * 20 // multiples of 20 → clean 15%
      }
      break
    }
  }

  const answer = (base * chosen!.pct) / 100

  return {
    id: makeId('div-percent-10-5-20'),
    techniqueId: 'div-percent-10-5-20',
    topicId: 'division',
    difficulty,
    prompt: `${chosen!.label} of ${base} = ?`,
    answer,
  }
}

// ── div-estimate-adjust ───────────────────────────────────────────────────────

/**
 * Exact-quotient problems where the divisor is not trivial but the answer
 * is a whole number the student can verify / adjust from a rounded estimate.
 */
export function generateDivEstimateAdjust(difficulty: Difficulty): Problem {
  let divisor: number, quotient: number

  switch (difficulty) {
    case 'easy':
      // Divisors: 11, 14, 15 with small quotients 4–15
      divisor = pick([11, 14, 15])
      quotient = randInt(4, 15)
      break
    case 'medium':
      // Divisors: 13, 17, 19 with quotients 5–20
      divisor = pick([13, 17, 19])
      quotient = randInt(5, 20)
      break
    case 'hard':
      // Larger divisors: 21, 22, 23 with quotients 8–30
      divisor = pick([21, 22, 23])
      quotient = randInt(8, 30)
      break
  }

  const n = divisor * quotient

  return {
    id: makeId('div-estimate-adjust'),
    techniqueId: 'div-estimate-adjust',
    topicId: 'division',
    difficulty,
    prompt: `${n} ÷ ${divisor} = ?`,
    answer: quotient,
  }
}

// ── div-factor-decompose ──────────────────────────────────────────────────────

/**
 * Break the divisor into two factors, divide in two steps.
 * Divisors: 12 = 4×3, 15 = 5×3, 16 = 4×4, 18 = 2×9, 21 = 3×7, 24 = 4×6, etc.
 */

const DECOMPOSABLE_DIVISORS: ReadonlyArray<{ divisor: number; factors: [number, number] }> = [
  { divisor: 12, factors: [4, 3] },
  { divisor: 15, factors: [5, 3] },
  { divisor: 16, factors: [4, 4] },
  { divisor: 18, factors: [2, 9] },
  { divisor: 21, factors: [3, 7] },
  { divisor: 24, factors: [4, 6] },
  { divisor: 28, factors: [4, 7] },
  { divisor: 36, factors: [4, 9] },
]

export function generateDivFactorDecompose(difficulty: Difficulty): Problem {
  let quotient: number
  let entry: (typeof DECOMPOSABLE_DIVISORS)[number]

  switch (difficulty) {
    case 'easy':
      // Small divisors, small quotients
      entry = pick(DECOMPOSABLE_DIVISORS.slice(0, 3)) // 12, 15, 16
      quotient = randInt(3, 12)
      break
    case 'medium':
      // Mid divisors
      entry = pick(DECOMPOSABLE_DIVISORS.slice(2, 6)) // 16, 18, 21, 24
      quotient = randInt(5, 20)
      break
    case 'hard':
      // Larger divisors
      entry = pick(DECOMPOSABLE_DIVISORS.slice(5)) // 24, 28, 36
      quotient = randInt(8, 25)
      break
  }

  const n = entry.divisor * quotient

  return {
    id: makeId('div-factor-decompose'),
    techniqueId: 'div-factor-decompose',
    topicId: 'division',
    difficulty,
    prompt: `${n} ÷ ${entry.divisor} = ?`,
    answer: quotient,
  }
}
