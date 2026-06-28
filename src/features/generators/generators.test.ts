/**
 * Phase 2 — Generator Engine Tests
 *
 * Property-based tests run each generator N times and assert:
 *   1. techniqueId and topicId are correct
 *   2. answer is arithmetically correct (verified independently)
 *   3. prompt is a non-empty string
 *   4. difficulty field matches the requested difficulty
 *   5. No trivial/invalid problems (answer > 0, no 0×anything, etc.)
 *   6. Multi-technique generator balances difficulties
 */

import { describe, it, expect } from 'vitest'
import {
  generateProblem,
  generateProblems,
  generateMixedProblems,
  registeredTechniqueIds,
} from './index'
import type { Difficulty } from '@/shared/types'

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard']
const SAMPLES = 30 // samples per (technique × difficulty)

// ── Helpers ───────────────────────────────────────────────────────────────────

function parsePromptNumbers(prompt: string): number[] {
  return (prompt.match(/-?\d+(\.\d+)?/g) ?? []).map(Number)
}

// ── Registry coverage ─────────────────────────────────────────────────────────

describe('generatorRegistry', () => {
  it('has exactly 39 registered techniques', () => {
    expect(registeredTechniqueIds).toHaveLength(39)
  })

  it('covers all 4 topics', () => {
    const ids = registeredTechniqueIds as string[]
    expect(ids.some((id) => id.startsWith('add-'))).toBe(true)
    expect(ids.some((id) => id.startsWith('sub-'))).toBe(true)
    expect(ids.some((id) => id.startsWith('mul-'))).toBe(true)
    expect(ids.some((id) => id.startsWith('div-'))).toBe(true)
  })
})

// ── Per-technique property tests ──────────────────────────────────────────────

describe('generateProblem — universal invariants', () => {
  for (const techniqueId of registeredTechniqueIds) {
    for (const difficulty of DIFFICULTIES) {
      describe(`${techniqueId} [${difficulty}]`, () => {
        const problems = Array.from({ length: SAMPLES }, () =>
          generateProblem(techniqueId, difficulty),
        )

        it('returns correct techniqueId', () => {
          for (const p of problems) expect(p.techniqueId).toBe(techniqueId)
        })

        it('returns the requested difficulty', () => {
          for (const p of problems) expect(p.difficulty).toBe(difficulty)
        })

        it('has a non-empty prompt string', () => {
          for (const p of problems) {
            expect(typeof p.prompt).toBe('string')
            expect(p.prompt.length).toBeGreaterThan(0)
          }
        })

        it('has a numeric answer', () => {
          for (const p of problems) {
            expect(typeof p.answer).toBe('number')
            expect(Number.isFinite(p.answer)).toBe(true)
          }
        })

        it('has a non-empty id', () => {
          for (const p of problems) expect(p.id.length).toBeGreaterThan(0)
        })

        it('answer is not NaN or Infinity', () => {
          for (const p of problems) {
            expect(Number.isNaN(p.answer)).toBe(false)
            expect(Number.isFinite(p.answer)).toBe(true)
          }
        })
      })
    }
  }
})

// ── Arithmetic correctness per technique ──────────────────────────────────────

describe('arithmetic correctness', () => {
  // Addition techniques: prompt "a + b + ... = ?"
  const additionIds = [
    'add-left-to-right',
    'add-complement-100',
    'add-round-adjust',
    'add-near-doubles',
    'add-column-grouping',
    'add-speed-1d2d',
    'add-speed-2d2d',
    'add-speed-3d',
  ]
  for (const id of additionIds) {
    it(`${id}: answer equals sum of operands`, () => {
      for (const difficulty of DIFFICULTIES) {
        for (let i = 0; i < SAMPLES; i++) {
          const p = generateProblem(id, difficulty)
          const nums = parsePromptNumbers(p.prompt)
          const expected = nums.reduce((s, n) => s + n, 0)
          expect(p.answer).toBe(expected)
        }
      }
    })
  }

  // Subtraction: "a − b = ?" → a - b
  const subIds = [
    'sub-complement-10',
    'sub-borrow-free',
    'sub-round-adjust',
    'sub-counting-up',
    'sub-speed-2d1d',
    'sub-speed-2d2d',
    'sub-speed-3d',
  ]
  for (const id of subIds) {
    it(`${id}: answer equals a − b`, () => {
      for (const difficulty of DIFFICULTIES) {
        for (let i = 0; i < SAMPLES; i++) {
          const p = generateProblem(id, difficulty)
          const nums = parsePromptNumbers(p.prompt)
          expect(p.answer).toBe(nums[0] - nums[1])
          expect(p.answer).toBeGreaterThan(0)
        }
      }
    })
  }

  // Multiplication: "a × b = ?" or "a² = ?"
  it('mul-by-11: answer equals n × 11', () => {
    for (const difficulty of DIFFICULTIES) {
      for (let i = 0; i < SAMPLES; i++) {
        const p = generateProblem('mul-by-11', difficulty)
        const nums = parsePromptNumbers(p.prompt)
        expect(p.answer).toBe(nums[0] * 11)
      }
    }
  })

  it('mul-by-9: answer equals n × 9', () => {
    for (const difficulty of DIFFICULTIES) {
      for (let i = 0; i < SAMPLES; i++) {
        const p = generateProblem('mul-by-9', difficulty)
        const nums = parsePromptNumbers(p.prompt)
        expect(p.answer).toBe(nums[0] * 9)
      }
    }
  })

  it('mul-by-5: answer equals n × 5', () => {
    for (const difficulty of DIFFICULTIES) {
      for (let i = 0; i < SAMPLES; i++) {
        const p = generateProblem('mul-by-5', difficulty)
        const nums = parsePromptNumbers(p.prompt)
        expect(p.answer).toBe(nums[0] * 5)
      }
    }
  })

  it('mul-by-25: answer equals n × 25', () => {
    for (const difficulty of DIFFICULTIES) {
      for (let i = 0; i < SAMPLES; i++) {
        const p = generateProblem('mul-by-25', difficulty)
        const nums = parsePromptNumbers(p.prompt)
        expect(p.answer).toBe(nums[0] * 25)
      }
    }
  })

  it('mul-by-12: answer equals n × 12', () => {
    for (const difficulty of DIFFICULTIES) {
      for (let i = 0; i < SAMPLES; i++) {
        const p = generateProblem('mul-by-12', difficulty)
        const nums = parsePromptNumbers(p.prompt)
        expect(p.answer).toBe(nums[0] * 12)
      }
    }
  })

  it('mul-sq-ending-5: answer equals n²', () => {
    for (const difficulty of DIFFICULTIES) {
      for (let i = 0; i < SAMPLES; i++) {
        const p = generateProblem('mul-sq-ending-5', difficulty)
        const nums = parsePromptNumbers(p.prompt)
        expect(p.answer).toBe(nums[0] * nums[0])
        expect(nums[0] % 5).toBe(0) // always ends in 5 (or 0 at 5n)
        expect(nums[0] % 10).toBe(5) // specifically ends in 5
      }
    }
  })

  it('mul-near-100: answer equals a × b', () => {
    for (const difficulty of DIFFICULTIES) {
      for (let i = 0; i < SAMPLES; i++) {
        const p = generateProblem('mul-near-100', difficulty)
        const nums = parsePromptNumbers(p.prompt)
        expect(p.answer).toBe(nums[0] * nums[1])
      }
    }
  })

  it('mul-double-halve: answer equals a × b', () => {
    for (const difficulty of DIFFICULTIES) {
      for (let i = 0; i < SAMPLES; i++) {
        const p = generateProblem('mul-double-halve', difficulty)
        const nums = parsePromptNumbers(p.prompt)
        expect(p.answer).toBe(nums[0] * nums[1])
      }
    }
  })

  it('mul-by-99-101: answer equals a × b', () => {
    for (const difficulty of DIFFICULTIES) {
      for (let i = 0; i < SAMPLES; i++) {
        const p = generateProblem('mul-by-99-101', difficulty)
        const nums = parsePromptNumbers(p.prompt)
        expect(p.answer).toBe(nums[0] * nums[1])
      }
    }
  })

  it('mul-foil-mental: answer equals a × b', () => {
    for (const difficulty of DIFFICULTIES) {
      for (let i = 0; i < SAMPLES; i++) {
        const p = generateProblem('mul-foil-mental', difficulty)
        const nums = parsePromptNumbers(p.prompt)
        expect(p.answer).toBe(nums[0] * nums[1])
      }
    }
  })

  // Multiplication foundations (times tables)
  it('mul-table-2to9: answer equals a × b', () => {
    for (const difficulty of DIFFICULTIES) {
      for (let i = 0; i < SAMPLES; i++) {
        const p = generateProblem('mul-table-2to9', difficulty)
        const nums = parsePromptNumbers(p.prompt)
        expect(p.answer).toBe(nums[0] * nums[1])
        expect(nums[0]).toBeGreaterThanOrEqual(2)
        expect(nums[1]).toBeGreaterThanOrEqual(2)
      }
    }
  })

  it('mul-table-10to19: answer equals a × b', () => {
    for (const difficulty of DIFFICULTIES) {
      for (let i = 0; i < SAMPLES; i++) {
        const p = generateProblem('mul-table-10to19', difficulty)
        const nums = parsePromptNumbers(p.prompt)
        expect(p.answer).toBe(nums[0] * nums[1])
      }
    }
  })

  it('mul-table-20to29: answer equals a × b', () => {
    for (const difficulty of DIFFICULTIES) {
      for (let i = 0; i < SAMPLES; i++) {
        const p = generateProblem('mul-table-20to29', difficulty)
        const nums = parsePromptNumbers(p.prompt)
        expect(p.answer).toBe(nums[0] * nums[1])
      }
    }
  })

  it('mul-whole-numbers: answer equals a × b', () => {
    for (const difficulty of DIFFICULTIES) {
      for (let i = 0; i < SAMPLES; i++) {
        const p = generateProblem('mul-whole-numbers', difficulty)
        const nums = parsePromptNumbers(p.prompt)
        expect(p.answer).toBe(nums[0] * nums[1])
      }
    }
  })

  // Multiplication foundations (squares & roots)
  it('mul-squares-foundation: answer equals n²', () => {
    for (const difficulty of DIFFICULTIES) {
      for (let i = 0; i < SAMPLES; i++) {
        const p = generateProblem('mul-squares-foundation', difficulty)
        const nums = parsePromptNumbers(p.prompt)
        expect(p.answer).toBe(nums[0] * nums[0])
        expect(nums[0]).toBeGreaterThanOrEqual(2)
      }
    }
  })

  it('mul-squares-advanced: answer equals n²', () => {
    for (const difficulty of DIFFICULTIES) {
      for (let i = 0; i < SAMPLES; i++) {
        const p = generateProblem('mul-squares-advanced', difficulty)
        const nums = parsePromptNumbers(p.prompt)
        expect(p.answer).toBe(nums[0] * nums[0])
        expect(nums[0]).toBeGreaterThanOrEqual(21)
      }
    }
  })

  it('mul-roots-foundation: answer equals √n (rounded)', () => {
    for (const difficulty of DIFFICULTIES) {
      for (let i = 0; i < SAMPLES; i++) {
        const p = generateProblem('mul-roots-foundation', difficulty)
        const nums = parsePromptNumbers(p.prompt)
        expect(p.answer).toBe(Math.round(Math.sqrt(nums[0])))
      }
    }
  })

  it('mul-roots-practice: answer equals √n (rounded)', () => {
    for (const difficulty of DIFFICULTIES) {
      for (let i = 0; i < SAMPLES; i++) {
        const p = generateProblem('mul-roots-practice', difficulty)
        const nums = parsePromptNumbers(p.prompt)
        expect(p.answer).toBe(Math.round(Math.sqrt(nums[0])))
      }
    }
  })

  // Division
  it('div-by-5: answer equals n ÷ 5 (whole number)', () => {
    for (const difficulty of DIFFICULTIES) {
      for (let i = 0; i < SAMPLES; i++) {
        const p = generateProblem('div-by-5', difficulty)
        const nums = parsePromptNumbers(p.prompt)
        expect(p.answer).toBe(nums[0] / 5)
        expect(Number.isInteger(p.answer)).toBe(true)
      }
    }
  })

  it('div-by-25: answer equals n ÷ 25 (whole number)', () => {
    for (const difficulty of DIFFICULTIES) {
      for (let i = 0; i < SAMPLES; i++) {
        const p = generateProblem('div-by-25', difficulty)
        const nums = parsePromptNumbers(p.prompt)
        expect(p.answer).toBe(nums[0] / 25)
        expect(Number.isInteger(p.answer)).toBe(true)
      }
    }
  })

  it('div-by-9-digit-sum: answer equals n ÷ 9 (whole number)', () => {
    for (const difficulty of DIFFICULTIES) {
      for (let i = 0; i < SAMPLES; i++) {
        const p = generateProblem('div-by-9-digit-sum', difficulty)
        const nums = parsePromptNumbers(p.prompt)
        expect(p.answer).toBe(nums[0] / 9)
        expect(Number.isInteger(p.answer)).toBe(true)
      }
    }
  })

  it('div-percent-10-5-20: answer is (pct% of base)', () => {
    for (const difficulty of DIFFICULTIES) {
      for (let i = 0; i < SAMPLES; i++) {
        const p = generateProblem('div-percent-10-5-20', difficulty)
        // Prompt format: "X% of Y = ?"
        const pctMatch = p.prompt.match(/(\d+)%\s+of\s+(\d+)/)
        expect(pctMatch).not.toBeNull()
        if (pctMatch) {
          const pct = Number(pctMatch[1])
          const base = Number(pctMatch[2])
          expect(p.answer).toBeCloseTo((pct * base) / 100, 5)
        }
      }
    }
  })

  it('div-estimate-adjust: answer is exact quotient', () => {
    for (const difficulty of DIFFICULTIES) {
      for (let i = 0; i < SAMPLES; i++) {
        const p = generateProblem('div-estimate-adjust', difficulty)
        const nums = parsePromptNumbers(p.prompt)
        // nums[0] ÷ nums[1] = p.answer
        expect(nums[0]).toBe(nums[1] * p.answer)
        expect(Number.isInteger(p.answer)).toBe(true)
      }
    }
  })

  it('div-factor-decompose: answer is exact quotient', () => {
    for (const difficulty of DIFFICULTIES) {
      for (let i = 0; i < SAMPLES; i++) {
        const p = generateProblem('div-factor-decompose', difficulty)
        const nums = parsePromptNumbers(p.prompt)
        expect(nums[0]).toBe(nums[1] * p.answer)
        expect(Number.isInteger(p.answer)).toBe(true)
      }
    }
  })
})

// ── No trivial / degenerate problems ─────────────────────────────────────────

describe('no degenerate problems', () => {
  it('no problem has answer === 0', () => {
    for (const id of registeredTechniqueIds) {
      for (const difficulty of DIFFICULTIES) {
        for (let i = 0; i < SAMPLES; i++) {
          const p = generateProblem(id, difficulty)
          expect(p.answer).not.toBe(0)
        }
      }
    }
  })

  it('subtraction problems always have positive answers', () => {
    const subIds = [
      'sub-complement-10',
      'sub-borrow-free',
      'sub-round-adjust',
      'sub-counting-up',
      'sub-speed-2d1d',
      'sub-speed-2d2d',
      'sub-speed-3d',
    ]
    for (const id of subIds) {
      for (const difficulty of DIFFICULTIES) {
        for (let i = 0; i < SAMPLES; i++) {
          const p = generateProblem(id, difficulty)
          expect(p.answer).toBeGreaterThan(0)
        }
      }
    }
  })
})

// ── generateProblems batch ────────────────────────────────────────────────────

describe('generateProblems', () => {
  it('returns exactly the requested count', () => {
    const problems = generateProblems('mul-by-11', 'easy', 15)
    expect(problems).toHaveLength(15)
  })

  it('all batch problems share the requested techniqueId and difficulty', () => {
    const problems = generateProblems('add-left-to-right', 'medium', 10)
    for (const p of problems) {
      expect(p.techniqueId).toBe('add-left-to-right')
      expect(p.difficulty).toBe('medium')
    }
  })
})

// ── Multi-technique generator ─────────────────────────────────────────────────

describe('generateMixedProblems', () => {
  it('returns exactly the requested count', () => {
    const problems = generateMixedProblems(null, 10)
    expect(problems).toHaveLength(10)
  })

  it('difficulty distribution is approximately 40/40/20', () => {
    const COUNT = 100
    const problems = generateMixedProblems(null, COUNT)
    const easy = problems.filter((p) => p.difficulty === 'easy').length
    const medium = problems.filter((p) => p.difficulty === 'medium').length
    const hard = problems.filter((p) => p.difficulty === 'hard').length
    // Allow ±5 from expected (40, 40, 20)
    expect(easy).toBeGreaterThanOrEqual(35)
    expect(easy).toBeLessThanOrEqual(45)
    expect(medium).toBeGreaterThanOrEqual(35)
    expect(medium).toBeLessThanOrEqual(45)
    expect(hard).toBeGreaterThanOrEqual(15)
    expect(hard).toBeLessThanOrEqual(25)
  })

  it('uses only the provided techniqueIds when given a subset', () => {
    const subset = ['mul-by-11', 'mul-by-9', 'add-left-to-right']
    const problems = generateMixedProblems(subset, 30)
    for (const p of problems) {
      expect(subset).toContain(p.techniqueId)
    }
  })

  it('all problems have valid ids, prompts, and answers', () => {
    const problems = generateMixedProblems(null, 25)
    for (const p of problems) {
      expect(p.id.length).toBeGreaterThan(0)
      expect(p.prompt.length).toBeGreaterThan(0)
      expect(Number.isFinite(p.answer)).toBe(true)
    }
  })

  it('throws if an invalid techniqueId is provided', () => {
    expect(() => generateMixedProblems(['not-a-real-technique'], 5)).toThrow()
  })
})

// ── Error handling ────────────────────────────────────────────────────────────

describe('generateProblem error handling', () => {
  it('throws for unknown techniqueId', () => {
    expect(() => generateProblem('unknown-technique', 'easy')).toThrow(
      /No generator registered/,
    )
  })
})
