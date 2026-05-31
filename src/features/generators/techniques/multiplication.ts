/**
 * Multiplication technique generators (10 techniques)
 *
 * mul-by-11        — digit-sum trick (2- and 3-digit × 11)
 * mul-by-9         — ×9 = ×10 − n
 * mul-by-5         — ÷2 × 10
 * mul-by-25        — ÷4 × 100
 * mul-by-12        — ×10 + ×2
 * mul-sq-ending-5  — squares ending in 5
 * mul-near-100     — numbers near 100 using difference from 100
 * mul-double-halve — double one factor, halve the other
 * mul-by-99-101    — ×99 = ×100 − n, ×101 = ×100 + n
 * mul-foil-mental  — FOIL on two 2-digit numbers
 */

import type { Difficulty, Problem } from '@/shared/types'
import { makeId, randInt, pick } from '../utils'

// ── mul-by-11 ─────────────────────────────────────────────────────────────────

export function generateMulBy11(difficulty: Difficulty): Problem {
  let n: number

  switch (difficulty) {
    case 'easy':
      // 2-digit, digit sum < 10 (no carry needed)
      do {
        n = randInt(11, 99)
      } while (Math.floor(n / 10) + (n % 10) >= 10)
      break
    case 'medium':
      // 2-digit, digit sum ≥ 10 (carry required)
      do {
        n = randInt(11, 99)
      } while (Math.floor(n / 10) + (n % 10) < 10)
      break
    case 'hard':
      // 3-digit × 11
      n = randInt(100, 899)
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

export function generateMulBy9(difficulty: Difficulty): Problem {
  let n: number

  switch (difficulty) {
    case 'easy':
      n = randInt(2, 9)
      break
    case 'medium':
      n = randInt(11, 99)
      break
    case 'hard':
      n = randInt(100, 999)
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

export function generateMulBy5(difficulty: Difficulty): Problem {
  let n: number

  switch (difficulty) {
    case 'easy':
      // Even 2-digit (÷2 is a clean whole number)
      n = randInt(1, 19) * 2 // 2,4,...,38 — ensures even
      break
    case 'medium':
      // Odd 2-digit (result has .5 intermediate step)
      n = randInt(1, 19) * 2 + 1 // 3,5,...,39
      break
    case 'hard':
      // 3-digit
      n = randInt(100, 399)
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

export function generateMulBy25(difficulty: Difficulty): Problem {
  let n: number

  switch (difficulty) {
    case 'easy':
      // Multiple of 4 (÷4 is exact whole number)
      n = randInt(1, 24) * 4 // 4,8,...,96
      break
    case 'medium':
      // Not a multiple of 4 (remainder left)
      do {
        n = randInt(10, 99)
      } while (n % 4 === 0)
      break
    case 'hard':
      // 3-digit; mix of ÷4 exact and non-exact
      n = randInt(100, 399)
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

export function generateMulBy12(difficulty: Difficulty): Problem {
  let n: number

  switch (difficulty) {
    case 'easy':
      n = randInt(2, 9)
      break
    case 'medium':
      n = randInt(11, 79)
      break
    case 'hard':
      n = randInt(21, 79)
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
export function generateMulSqEnding5(difficulty: Difficulty): Problem {
  let n: number

  switch (difficulty) {
    case 'easy':
      // 15², 25², 35², 45² (single leading digit)
      n = pick([15, 25, 35, 45])
      break
    case 'medium':
      // 55², 65², 75², 85², 95²
      n = pick([55, 65, 75, 85, 95])
      break
    case 'hard':
      // 105², 115², 125², 135², 145², 155² (two-digit leading)
      n = pick([105, 115, 125, 135, 145, 155])
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
export function generateMulNear100(difficulty: Difficulty): Problem {
  let a: number, b: number

  switch (difficulty) {
    case 'easy':
      // Both 91–99 (small differences from 100)
      a = randInt(91, 99)
      b = randInt(91, 99)
      break
    case 'medium':
      // 85–99 (slightly larger differences)
      a = randInt(85, 99)
      b = randInt(85, 99)
      break
    case 'hard':
      // One or both slightly above 100 (101–109) for cross-sign differences
      a = pick([randInt(91, 99), randInt(101, 109)])
      b = pick([randInt(91, 99), randInt(101, 109)])
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
export function generateMulDoubleHalve(difficulty: Difficulty): Problem {
  let a: number, b: number

  switch (difficulty) {
    case 'easy': {
      // One factor is a power of 2 (easy to halve repeatedly)
      const powers = [4, 8, 16, 32]
      b = pick(powers)
      a = randInt(10, 49) * 2 + 1 // odd number (odd × power of 2)
      break
    }
    case 'medium': {
      // One factor even but not a power of 2; still halves cleanly
      b = pick([6, 12, 14, 18, 24, 28])
      a = randInt(11, 69)
      break
    }
    case 'hard': {
      // Requires 3+ doublings; larger numbers
      b = pick([16, 24, 32, 48])
      a = randInt(25, 99)
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

export function generateMulBy99101(difficulty: Difficulty): Problem {
  let n: number
  const multiplier = pick([99, 101])

  switch (difficulty) {
    case 'easy':
      n = randInt(11, 79)
      break
    case 'medium':
      n = randInt(100, 499)
      break
    case 'hard': {
      // Extend pattern: ×98, ×102
      n = randInt(11, 99)
      const hardMultiplier = pick([98, 102])
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
export function generateMulFoilMental(difficulty: Difficulty): Problem {
  let a: number, b: number

  switch (difficulty) {
    case 'easy':
      // Small tens, small units (e.g., 21 × 13)
      a = randInt(11, 29)
      b = randInt(11, 29)
      break
    case 'medium':
      // Mid-range 2-digit × 2-digit (e.g., 34 × 27)
      a = randInt(21, 59)
      b = randInt(21, 59)
      break
    case 'hard':
      // Larger products (e.g., 67 × 89)
      a = randInt(51, 89)
      b = randInt(51, 89)
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
