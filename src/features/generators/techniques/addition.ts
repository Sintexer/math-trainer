/**
 * Addition technique generators (5 techniques)
 *
 * add-left-to-right   — add two multi-digit numbers, left to right
 * add-complement-100  — numbers near 100 using complement trick
 * add-round-adjust    — round one addend, add, then adjust
 * add-near-doubles    — two close numbers; double + offset
 * add-column-grouping — group 3+ numbers so pairs sum to 10/20
 */

import type { Difficulty, Problem } from '@/shared/types'
import { makeId } from '../utils'
import type { Rng } from '../rng'

// ── add-left-to-right ─────────────────────────────────────────────────────────

export function generateAddLeftToRight(difficulty: Difficulty, rng: Rng): Problem {
  let a: number, b: number

  switch (difficulty) {
    case 'easy':
      // 2-digit + 2-digit, no messy carries (both numbers, tens OK to carry once)
      a = rng.int(11, 79)
      b = rng.int(11, 79)
      break
    case 'medium':
      // 3-digit + 2-digit
      a = rng.int(100, 699)
      b = rng.int(10, 99)
      break
    case 'hard':
      // 3-digit + 3-digit
      a = rng.int(100, 699)
      b = rng.int(100, 699)
      break
  }

  return {
    id: makeId('add-left-to-right'),
    techniqueId: 'add-left-to-right',
    topicId: 'addition',
    difficulty,
    prompt: `${a} + ${b} = ?`,
    answer: a + b,
  }
}

// ── add-complement-100 ────────────────────────────────────────────────────────

export function generateAddComplement100(difficulty: Difficulty, rng: Rng): Problem {
  let a: number, b: number

  switch (difficulty) {
    case 'easy':
      // Both numbers between 85–99 (very close to 100)
      a = rng.int(85, 99)
      b = rng.int(85, 99)
      break
    case 'medium':
      // One in 80–99, one in 70–99
      a = rng.int(80, 99)
      b = rng.int(70, 99)
      break
    case 'hard':
      // Larger numbers near 200 or three addends near 100
      a = rng.int(185, 199)
      b = rng.int(185, 199)
      break
  }

  return {
    id: makeId('add-complement-100'),
    techniqueId: 'add-complement-100',
    topicId: 'addition',
    difficulty,
    prompt: `${a} + ${b} = ?`,
    answer: a + b,
  }
}

// ── add-round-adjust ──────────────────────────────────────────────────────────

export function generateAddRoundAdjust(difficulty: Difficulty, rng: Rng): Problem {
  let base: number, offset: number

  switch (difficulty) {
    case 'easy': {
      // 2-digit: one addend ends in 7, 8, or 9 (easy to round to nearest 10)
      const tens = rng.int(2, 7) * 10
      offset = rng.pick([7, 8, 9])
      const a = tens + offset // e.g. 47
      const b = rng.int(11, 69)
      return {
        id: makeId('add-round-adjust'),
        techniqueId: 'add-round-adjust',
        topicId: 'addition',
        difficulty,
        prompt: `${a} + ${b} = ?`,
        answer: a + b,
      }
    }
    case 'medium': {
      // 3-digit + 2-digit, second ends in 7,8,9
      const a = rng.int(100, 599)
      const tens = rng.int(1, 7) * 10
      offset = rng.pick([7, 8, 9])
      const b = tens + offset
      return {
        id: makeId('add-round-adjust'),
        techniqueId: 'add-round-adjust',
        topicId: 'addition',
        difficulty,
        prompt: `${a} + ${b} = ?`,
        answer: a + b,
      }
    }
    case 'hard': {
      // 3-digit + 3-digit, both may end in 7,8,9
      const a = rng.int(100, 599)
      const hundreds = rng.int(1, 4) * 100
      base = rng.int(1, 7) * 10
      offset = rng.pick([7, 8, 9])
      const b = hundreds + base + offset
      return {
        id: makeId('add-round-adjust'),
        techniqueId: 'add-round-adjust',
        topicId: 'addition',
        difficulty,
        prompt: `${a} + ${b} = ?`,
        answer: a + b,
      }
    }
  }
}

// ── add-near-doubles ──────────────────────────────────────────────────────────

export function generateAddNearDoubles(difficulty: Difficulty, rng: Rng): Problem {
  let a: number, b: number

  switch (difficulty) {
    case 'easy':
      // 2-digit, difference = 1 or 2 (very near doubles)
      a = rng.int(11, 79)
      b = a + rng.pick([1, 2])
      break
    case 'medium':
      // 2-digit, difference 3–5
      a = rng.int(11, 74)
      b = a + rng.pick([3, 4, 5])
      break
    case 'hard':
      // 3-digit near-doubles (difference 1–10)
      a = rng.int(100, 499)
      b = a + rng.int(1, 10)
      break
  }

  return {
    id: makeId('add-near-doubles'),
    techniqueId: 'add-near-doubles',
    topicId: 'addition',
    difficulty,
    prompt: `${a} + ${b} = ?`,
    answer: a + b,
  }
}

// ── add-column-grouping ───────────────────────────────────────────────────────

/**
 * Generate three or more numbers where some pairs sum to 10 or 20,
 * making column grouping an obvious win.
 */
export function generateAddColumnGrouping(difficulty: Difficulty, rng: Rng): Problem {
  let nums: number[]

  switch (difficulty) {
    case 'easy': {
      // 3 single-digit numbers, at least one pair sums to 10
      const a = rng.int(1, 9)
      const b = 10 - a // pair sums to 10
      const c = rng.int(1, 9)
      nums = [a, b, c]
      break
    }
    case 'medium': {
      // 3 two-digit numbers, at least one pair has matching units that sum to 10
      const tens1 = rng.int(1, 5) * 10
      const units1 = rng.int(1, 9)
      const tens2 = rng.int(1, 5) * 10
      const units2 = 10 - units1 // complement pair
      const extra = rng.int(10, 49)
      nums = [tens1 + units1, tens2 + units2, extra]
      break
    }
    case 'hard': {
      // 4 two-digit numbers with two complement pairs
      const u1 = rng.int(1, 9)
      const u2 = 10 - u1
      const u3 = rng.int(1, 9)
      const u4 = 10 - u3
      nums = [
        rng.int(1, 5) * 10 + u1,
        rng.int(1, 5) * 10 + u2,
        rng.int(1, 5) * 10 + u3,
        rng.int(1, 5) * 10 + u4,
      ]
      break
    }
  }

  const answer = nums.reduce((s, n) => s + n, 0)
  const prompt = nums.join(' + ') + ' = ?'

  return {
    id: makeId('add-column-grouping'),
    techniqueId: 'add-column-grouping',
    topicId: 'addition',
    difficulty,
    prompt,
    answer,
  }
}
