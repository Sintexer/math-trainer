/**
 * Multiplication technique generators
 *
 * mul-by-11              — digit-sum trick (2- and 3-digit × 11)
 * mul-by-9               — ×9 = ×10 − n
 * mul-by-5               — ÷2 × 10 (repositioned as foundation drill)
 * mul-by-25              — ÷4 × 100
 * mul-by-12              — ×10 + ×2
 * mul-sq-ending-5        — squares ending in 5
 * mul-near-100           — numbers near 100 using difference from 100
 * mul-double-halve       — double one factor, halve the other
 * mul-by-99-101          — ×99 = ×100 − n, ×101 = ×100 + n
 * mul-foil-mental        — FOIL on two 2-digit numbers
 *
 * ── Times Table Foundation (split from original mul-times-table) ──
 * mul-table-2to9         — classic 2–9 × 2–9 table
 * mul-table-10to19       — 10–19 multiplication (teen table)
 * mul-table-20to29       — 20–29 multiplication
 * mul-whole-numbers      — mixed 2–99 drill (capstone)
 *
 * ── Squares & Roots (split from original mul-perfect-squares) ──
 * mul-squares-foundation — squares 2²–20²
 * mul-squares-advanced   — squares 21²–50²
 * mul-roots-foundation   — square roots (perfect squares up to 100)
 * mul-roots-practice     — roots with estimation
 */

import type { Difficulty, Problem } from '@/shared/types'
import { makeId } from '../utils'
import type { Rng } from '../rng'

// ── mul-by-11 ─────────────────────────────────────────────────────────────────

export function generateMulBy11(difficulty: Difficulty, rng: Rng): Problem {
  let n: number

  switch (difficulty) {
    case 'easy':
      // 2-digit, digit sum < 10 (no carry needed)
      do {
        n = rng.int(11, 99)
      } while (Math.floor(n / 10) + (n % 10) >= 10)
      break
    case 'medium':
      // 2-digit, digit sum ≥ 10 (carry required)
      do {
        n = rng.int(11, 99)
      } while (Math.floor(n / 10) + (n % 10) < 10)
      break
    case 'hard':
      // 3-digit × 11
      n = rng.int(100, 899)
      break
  }

  return {
    id: makeId('mul-by-11'),
    techniqueId: 'mul-by-11',
    topicId: 'multiplication',
    difficulty,
    prompt: `${n} × 11 = ?`,
    answer: n * 11,
  }
}

// ── mul-by-9 ──────────────────────────────────────────────────────────────────

export function generateMulBy9(difficulty: Difficulty, rng: Rng): Problem {
  let n: number

  switch (difficulty) {
    case 'easy':
      n = rng.int(2, 9)
      break
    case 'medium':
      n = rng.int(11, 99)
      break
    case 'hard':
      n = rng.int(100, 999)
      break
  }

  return {
    id: makeId('mul-by-9'),
    techniqueId: 'mul-by-9',
    topicId: 'multiplication',
    difficulty,
    prompt: `${n} × 9 = ?`,
    answer: n * 9,
  }
}

// ── mul-by-5 ──────────────────────────────────────────────────────────────────

export function generateMulBy5(difficulty: Difficulty, rng: Rng): Problem {
  let n: number

  switch (difficulty) {
    case 'easy':
      // Even 2-digit (÷2 is a clean whole number)
      n = rng.int(1, 19) * 2 // 2,4,...,38 — ensures even
      break
    case 'medium':
      // Odd 2-digit (result has .5 intermediate step)
      n = rng.int(1, 19) * 2 + 1 // 3,5,...,39
      break
    case 'hard':
      // 3-digit
      n = rng.int(100, 399)
      break
  }

  return {
    id: makeId('mul-by-5'),
    techniqueId: 'mul-by-5',
    topicId: 'multiplication',
    difficulty,
    prompt: `${n} × 5 = ?`,
    answer: n * 5,
  }
}

// ── mul-by-25 ─────────────────────────────────────────────────────────────────

export function generateMulBy25(difficulty: Difficulty, rng: Rng): Problem {
  let n: number

  switch (difficulty) {
    case 'easy':
      // Multiple of 4 (÷4 is exact whole number)
      n = rng.int(1, 24) * 4 // 4,8,...,96
      break
    case 'medium':
      // Not a multiple of 4 (remainder left)
      do {
        n = rng.int(10, 99)
      } while (n % 4 === 0)
      break
    case 'hard':
      // 3-digit; mix of ÷4 exact and non-exact
      n = rng.int(100, 399)
      break
  }

  return {
    id: makeId('mul-by-25'),
    techniqueId: 'mul-by-25',
    topicId: 'multiplication',
    difficulty,
    prompt: `${n} × 25 = ?`,
    answer: n * 25,
  }
}

// ── mul-by-12 ─────────────────────────────────────────────────────────────────

export function generateMulBy12(difficulty: Difficulty, rng: Rng): Problem {
  let n: number

  switch (difficulty) {
    case 'easy':
      n = rng.int(2, 9)
      break
    case 'medium':
      n = rng.int(11, 79)
      break
    case 'hard':
      n = rng.int(21, 79)
      break
  }

  return {
    id: makeId('mul-by-12'),
    techniqueId: 'mul-by-12',
    topicId: 'multiplication',
    difficulty,
    prompt: `${n} × 12 = ?`,
    answer: n * 12,
  }
}

// ── mul-sq-ending-5 ───────────────────────────────────────────────────────────

/**
 * Square of a number ending in 5.
 * Technique: leading digits × (leading + 1), then append 25.
 */
export function generateMulSqEnding5(difficulty: Difficulty, rng: Rng): Problem {
  let n: number

  switch (difficulty) {
    case 'easy':
      // 15², 25², 35², 45² (single leading digit)
      n = rng.pick([15, 25, 35, 45])
      break
    case 'medium':
      // 55², 65², 75², 85², 95²
      n = rng.pick([55, 65, 75, 85, 95])
      break
    case 'hard':
      // 105², 115², 125², 135², 145², 155² (two-digit leading)
      n = rng.pick([105, 115, 125, 135, 145, 155])
      break
  }

  return {
    id: makeId('mul-sq-ending-5'),
    techniqueId: 'mul-sq-ending-5',
    topicId: 'multiplication',
    difficulty,
    prompt: `${n}² = ?`,
    answer: n * n,
  }
}

// ── mul-near-100 ──────────────────────────────────────────────────────────────

/**
 * Multiply two numbers near 100 using d1 × d2 + cross-difference method.
 */
export function generateMulNear100(difficulty: Difficulty, rng: Rng): Problem {
  let a: number, b: number

  switch (difficulty) {
    case 'easy':
      // Both 91–99 (small differences from 100)
      a = rng.int(91, 99)
      b = rng.int(91, 99)
      break
    case 'medium':
      // 85–99 (slightly larger differences)
      a = rng.int(85, 99)
      b = rng.int(85, 99)
      break
    case 'hard':
      // One or both slightly above 100 (101–109) for cross-sign differences
      a = rng.pick([rng.int(91, 99), rng.int(101, 109)])
      b = rng.pick([rng.int(91, 99), rng.int(101, 109)])
      break
  }

  return {
    id: makeId('mul-near-100'),
    techniqueId: 'mul-near-100',
    topicId: 'multiplication',
    difficulty,
    prompt: `${a} × ${b} = ?`,
    answer: a * b,
  }
}

// ── mul-double-halve ──────────────────────────────────────────────────────────

/**
 * Double one factor and halve the other until one factor is a round number.
 * Pick problems where one factor is a power of 2 or easily halved.
 */
export function generateMulDoubleHalve(difficulty: Difficulty, rng: Rng): Problem {
  let a: number, b: number

  switch (difficulty) {
    case 'easy': {
      // One factor is a power of 2 (easy to halve repeatedly)
      const powers = [4, 8, 16, 32]
      b = rng.pick(powers)
      a = rng.int(10, 49) * 2 + 1 // odd number (odd × power of 2)
      break
    }
    case 'medium': {
      // One factor even but not a power of 2; still halves cleanly
      b = rng.pick([6, 12, 14, 18, 24, 28])
      a = rng.int(11, 69)
      break
    }
    case 'hard': {
      // Requires 3+ doublings; larger numbers
      b = rng.pick([16, 24, 32, 48])
      a = rng.int(25, 99)
      break
    }
  }

  return {
    id: makeId('mul-double-halve'),
    techniqueId: 'mul-double-halve',
    topicId: 'multiplication',
    difficulty,
    prompt: `${a} × ${b} = ?`,
    answer: a * b,
  }
}

// ── mul-by-99-101 ─────────────────────────────────────────────────────────────

export function generateMulBy99101(difficulty: Difficulty, rng: Rng): Problem {
  let n: number
  const multiplier = rng.pick([99, 101])

  switch (difficulty) {
    case 'easy':
      n = rng.int(11, 79)
      break
    case 'medium':
      n = rng.int(100, 499)
      break
    case 'hard': {
      // Extend pattern: ×98, ×102
      n = rng.int(11, 99)
      const hardMultiplier = rng.pick([98, 102])
      return {
        id: makeId('mul-by-99-101'),
        techniqueId: 'mul-by-99-101',
        topicId: 'multiplication',
        difficulty,
        prompt: `${n} × ${hardMultiplier} = ?`,
        answer: n * hardMultiplier,
      }
    }
  }

  return {
    id: makeId('mul-by-99-101'),
    techniqueId: 'mul-by-99-101',
    topicId: 'multiplication',
    difficulty,
    prompt: `${n} × ${multiplier} = ?`,
    answer: n * multiplier,
  }
}

// ── mul-foil-mental ───────────────────────────────────────────────────────────

/**
 * FOIL: (a+b)(c+d). Use two 2-digit numbers, break as (tens+units).
 */
export function generateMulFoilMental(difficulty: Difficulty, rng: Rng): Problem {
  let a: number, b: number

  switch (difficulty) {
    case 'easy':
      // Small tens, small units (e.g., 21 × 13)
      a = rng.int(11, 29)
      b = rng.int(11, 29)
      break
    case 'medium':
      // Mid-range 2-digit × 2-digit (e.g., 34 × 27)
      a = rng.int(21, 59)
      b = rng.int(21, 59)
      break
    case 'hard':
      // Larger products (e.g., 67 × 89)
      a = rng.int(51, 89)
      b = rng.int(51, 89)
      break
  }

  return {
    id: makeId('mul-foil-mental'),
    techniqueId: 'mul-foil-mental',
    topicId: 'multiplication',
    difficulty,
    prompt: `${a} × ${b} = ?`,
    answer: a * b,
  }
}

// ── mul-table-2to9 ────────────────────────────────────────────────────────────

export function generateMulTable2to9(difficulty: Difficulty, rng: Rng): Problem {
  let a: number, b: number

  switch (difficulty) {
    case 'easy':
      a = rng.int(2, 9)
      b = rng.int(2, 9)
      break
    case 'medium':
      a = rng.int(2, 9)
      b = rng.int(2, 9)
      break
    case 'hard':
      a = rng.int(2, 9)
      b = rng.int(2, 9)
      break
  }

  return {
    id: makeId('mul-table-2to9'),
    techniqueId: 'mul-table-2to9',
    topicId: 'multiplication',
    difficulty,
    prompt: `${a} × ${b} = ?`,
    answer: a * b,
  }
}

// ── mul-table-10to19 ──────────────────────────────────────────────────────────

export function generateMulTable10to19(difficulty: Difficulty, rng: Rng): Problem {
  let a: number, b: number

  switch (difficulty) {
    case 'easy':
      a = rng.int(10, 14)
      b = rng.int(10, 14)
      break
    case 'medium':
      a = rng.int(10, 19)
      b = rng.int(10, 19)
      break
    case 'hard':
      a = rng.int(10, 19)
      b = rng.int(10, 19)
      break
  }

  return {
    id: makeId('mul-table-10to19'),
    techniqueId: 'mul-table-10to19',
    topicId: 'multiplication',
    difficulty,
    prompt: `${a} × ${b} = ?`,
    answer: a * b,
  }
}

// ── mul-table-20to29 ──────────────────────────────────────────────────────────

export function generateMulTable20to29(difficulty: Difficulty, rng: Rng): Problem {
  let a: number, b: number

  switch (difficulty) {
    case 'easy':
      a = rng.int(20, 24)
      b = rng.int(2, 19)
      break
    case 'medium':
      a = rng.int(20, 29)
      b = rng.int(2, 29)
      break
    case 'hard':
      a = rng.int(20, 29)
      b = rng.int(10, 99)
      break
  }

  return {
    id: makeId('mul-table-20to29'),
    techniqueId: 'mul-table-20to29',
    topicId: 'multiplication',
    difficulty,
    prompt: `${a} × ${b} = ?`,
    answer: a * b,
  }
}

// ── mul-whole-numbers ─────────────────────────────────────────────────────────

export function generateMulWholeNumbers(difficulty: Difficulty, rng: Rng): Problem {
  let a: number, b: number

  switch (difficulty) {
    case 'easy':
      a = rng.int(2, 19)
      b = rng.int(2, 19)
      break
    case 'medium':
      a = rng.int(10, 49)
      b = rng.int(10, 49)
      break
    case 'hard':
      a = rng.int(2, 99)
      b = rng.int(2, 99)
      break
  }

  return {
    id: makeId('mul-whole-numbers'),
    techniqueId: 'mul-whole-numbers',
    topicId: 'multiplication',
    difficulty,
    prompt: `${a} × ${b} = ?`,
    answer: a * b,
  }
}

// ── mul-squares-foundation ────────────────────────────────────────────────────

export function generateMulSquaresFoundation(difficulty: Difficulty, rng: Rng): Problem {
  let n: number

  switch (difficulty) {
    case 'easy':
      n = rng.int(2, 12)
      break
    case 'medium':
      n = rng.int(2, 16)
      break
    case 'hard':
      n = rng.int(2, 20)
      break
  }

  return {
    id: makeId('mul-squares-foundation'),
    techniqueId: 'mul-squares-foundation',
    topicId: 'multiplication',
    difficulty,
    prompt: `${n}² = ?`,
    answer: n * n,
  }
}

// ── mul-squares-advanced ──────────────────────────────────────────────────────

export function generateMulSquaresAdvanced(difficulty: Difficulty, rng: Rng): Problem {
  let n: number

  switch (difficulty) {
    case 'easy':
      n = rng.int(21, 30)
      break
    case 'medium':
      n = rng.int(21, 40)
      break
    case 'hard':
      n = rng.int(21, 50)
      break
  }

  return {
    id: makeId('mul-squares-advanced'),
    techniqueId: 'mul-squares-advanced',
    topicId: 'multiplication',
    difficulty,
    prompt: `${n}² = ?`,
    answer: n * n,
  }
}

// ── mul-roots-foundation ──────────────────────────────────────────────────────

export function generateMulRootsFoundation(difficulty: Difficulty, rng: Rng): Problem {
  let n: number

  switch (difficulty) {
    case 'easy':
      // Perfect squares: 4, 9, 16, 25, 36, 49, 64, 81, 100
      n = rng.pick([4, 9, 16, 25, 36, 49, 64, 81, 100])
      break
    case 'medium':
      // Perfect squares up to 100
      n = rng.pick([4, 9, 16, 25, 36, 49, 64, 81, 100])
      break
    case 'hard':
      // Mix perfect and non-perfect (requires estimation)
      if (rng.int(1, 2) === 1) {
        // Perfect square
        n = rng.pick([4, 9, 16, 25, 36, 49, 64, 81, 100])
      } else {
        // Non-perfect: challenge user to estimate
        n = rng.pick([8, 10, 15, 18, 20, 24, 30, 40, 50, 75, 99, 120, 150])
      }
      break
  }

  const answer = Math.round(Math.sqrt(n))

  return {
    id: makeId('mul-roots-foundation'),
    techniqueId: 'mul-roots-foundation',
    topicId: 'multiplication',
    difficulty,
    prompt: `√${n} = ?`,
    answer,
  }
}

// ── mul-roots-practice ────────────────────────────────────────────────────────

export function generateMulRootsPractice(difficulty: Difficulty, rng: Rng): Problem {
  let n: number

  switch (difficulty) {
    case 'easy':
      // Perfect squares 2–10 squared (4–100)
      n = rng.pick([4, 9, 16, 25, 36, 49, 64, 81, 100])
      break
    case 'medium':
      // Mix perfect and near-perfect
      n = rng.pick([4, 5, 8, 9, 10, 15, 16, 24, 25, 35, 36, 48, 49, 63, 64, 80, 81, 99, 100])
      break
    case 'hard':
      // Large range with estimation
      n = rng.int(4, 200)
      break
  }

  const answer = Math.round(Math.sqrt(n))

  return {
    id: makeId('mul-roots-practice'),
    techniqueId: 'mul-roots-practice',
    topicId: 'multiplication',
    difficulty,
    prompt: `√${n} = ?`,
    answer,
  }
}
