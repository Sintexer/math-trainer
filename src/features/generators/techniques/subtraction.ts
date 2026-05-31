/**
 * Subtraction technique generators (4 techniques)
 *
 * sub-complement-10  — complement-of-10 mental subtraction
 * sub-borrow-free    — adjust both numbers to avoid borrowing
 * sub-round-adjust   — round the subtractor, subtract, then adjust
 * sub-counting-up    — count up from subtractor to minuend
 */

import type { Difficulty, Problem } from '@/shared/types'
import { makeId } from '../utils'
import type { Rng } from '../rng'

// ── sub-complement-10 ─────────────────────────────────────────────────────────

export function generateSubComplement10(difficulty: Difficulty, rng: Rng): Problem {
  let a: number, b: number

  switch (difficulty) {
    case 'easy':
      // 2-digit minus single digit (crosses tens boundary)
      a = rng.int(11, 99)
      b = rng.int(2, 9)
      // Ensure it actually crosses a tens boundary for the technique to be useful
      if (a % 10 >= b) {
        // Make b larger than the units digit
        b = (a % 10) + rng.int(1, Math.min(5, 9 - (a % 10) + 9))
        b = Math.min(b, 9)
        if (b > a) b = a - 1
      }
      break
    case 'medium':
      // 2-digit minus 2-digit (e.g., 73 − 48)
      a = rng.int(30, 99)
      b = rng.int(11, a - 5)
      break
    case 'hard':
      // 3-digit minus 2-digit (e.g., 354 − 87)
      a = rng.int(100, 599)
      b = rng.int(11, 99)
      break
  }

  return {
    id: makeId('sub-complement-10'),
    techniqueId: 'sub-complement-10',
    topicId: 'subtraction',
    difficulty,
    prompt: `${a} − ${b} = ?`,
    answer: a - b,
  }
}

// ── sub-borrow-free ───────────────────────────────────────────────────────────

/**
 * Problems where the subtractor ends in 7–9 (so adding to it reaches a round
 * number, eliminating borrowing).  e.g. 82 − 47 → 85 − 50 = 35
 */
export function generateSubBorrowFree(difficulty: Difficulty, rng: Rng): Problem {
  let a: number, b: number

  switch (difficulty) {
    case 'easy': {
      // 2-digit minus 2-digit; subtractor ends in 7,8,9
      const bTens = rng.int(1, 6) * 10
      const bUnits = rng.pick([7, 8, 9])
      b = bTens + bUnits
      a = b + rng.int(5, 40)
      break
    }
    case 'medium': {
      // 3-digit minus 2-digit
      const bTens = rng.int(1, 8) * 10
      const bUnits = rng.pick([7, 8, 9])
      b = bTens + bUnits
      a = b + rng.int(50, 200)
      break
    }
    case 'hard': {
      // 3-digit minus 3-digit
      const bHundreds = rng.int(1, 4) * 100
      const bTens = rng.int(1, 8) * 10
      const bUnits = rng.pick([7, 8, 9])
      b = bHundreds + bTens + bUnits
      a = b + rng.int(50, 300)
      break
    }
  }

  return {
    id: makeId('sub-borrow-free'),
    techniqueId: 'sub-borrow-free',
    topicId: 'subtraction',
    difficulty,
    prompt: `${a} − ${b} = ?`,
    answer: a - b,
  }
}

// ── sub-round-adjust ──────────────────────────────────────────────────────────

/**
 * Subtractor is near a multiple of 10 (ends in 7–9 or 1–3 from below).
 * Round to nearest 10, subtract, then adjust.
 */
export function generateSubRoundAdjust(difficulty: Difficulty, rng: Rng): Problem {
  let a: number, b: number

  switch (difficulty) {
    case 'easy': {
      // 2-digit minus 2-digit (e.g., 94 − 38 → 94 − 40 + 2 = 56)
      const bTens = rng.int(1, 7) * 10
      const bUnits = rng.pick([7, 8, 9]) // rounds up
      b = bTens + bUnits
      a = b + rng.int(10, 50)
      break
    }
    case 'medium': {
      // 3-digit minus 2-digit
      const bTens = rng.int(1, 8) * 10
      const bUnits = rng.pick([7, 8, 9])
      b = bTens + bUnits
      a = b + rng.int(50, 250)
      break
    }
    case 'hard': {
      // 3-digit minus 3-digit
      const bHundreds = rng.int(1, 5) * 100
      const bTens = rng.int(1, 8) * 10
      const bUnits = rng.pick([7, 8, 9])
      b = bHundreds + bTens + bUnits
      a = b + rng.int(100, 400)
      break
    }
  }

  return {
    id: makeId('sub-round-adjust'),
    techniqueId: 'sub-round-adjust',
    topicId: 'subtraction',
    difficulty,
    prompt: `${a} − ${b} = ?`,
    answer: a - b,
  }
}

// ── sub-counting-up ───────────────────────────────────────────────────────────

/**
 * Count up from the subtractor to the minuend.
 * Gap is small enough that it's tractable mentally.
 */
export function generateSubCountingUp(difficulty: Difficulty, rng: Rng): Problem {
  let a: number, b: number

  switch (difficulty) {
    case 'easy': {
      // Gap 10–30; numbers in 40–99 range
      b = rng.int(30, 70)
      a = b + rng.int(10, 30)
      break
    }
    case 'medium': {
      // Crosses a hundreds boundary; gap 20–60
      b = rng.int(50, 150)
      a = b + rng.int(20, 60)
      break
    }
    case 'hard': {
      // 3-digit minus 3-digit; gap 30–99
      b = rng.int(100, 450)
      a = b + rng.int(30, 99)
      break
    }
  }

  return {
    id: makeId('sub-counting-up'),
    techniqueId: 'sub-counting-up',
    topicId: 'subtraction',
    difficulty,
    prompt: `${a} − ${b} = ?`,
    answer: a - b,
  }
}
