import { describe, it, expect } from 'vitest'
import { getAllTechniques } from '@/content'
import {
  getAllTechniqueContent,
  getTechniqueContent,
} from './index'
import type { Slide } from '@/features/technique-card'

/** Tokens we are willing to evaluate inside a `worked`/`try-it` problem. */
function evaluateExpression(expr: string): number | null {
  // Normalise unicode operator glyphs we use in prompts.
  const normalised = expr
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/\s+/g, '')

  // Detect "n²" (square shorthand) — only when the whole expression matches.
  const sqMatch = /^(\d+)²$/.exec(normalised)
  if (sqMatch) {
    const n = Number(sqMatch[1])
    return n * n
  }

  // Single binary op only: a (+|-|*|/) b
  const binMatch = /^(\d+)([+\-*/])(\d+)$/.exec(normalised)
  if (!binMatch) return null
  const a = Number(binMatch[1])
  const b = Number(binMatch[3])
  switch (binMatch[2]) {
    case '+':
      return a + b
    case '-':
      return a - b
    case '*':
      return a * b
    case '/':
      return b === 0 ? null : a / b
  }
  return null
}

describe('technique content registry', () => {
  const techniques = getAllTechniques()
  const content = getAllTechniqueContent()

  it('has content for every technique in the curriculum', () => {
    for (const tech of techniques) {
      // Throws on miss → meaningful failure message.
      expect(() => getTechniqueContent(tech.id)).not.toThrow()
    }
  })

  it('content entry count matches curriculum (no orphans)', () => {
    expect(content).toHaveLength(techniques.length)
    const techIds = new Set(techniques.map((t) => t.id))
    for (const c of content) {
      expect(techIds.has(c.techniqueId)).toBe(true)
    }
  })

  it('each technique has 3–5 slides', () => {
    for (const c of content) {
      expect(c.slides.length).toBeGreaterThanOrEqual(3)
      expect(c.slides.length).toBeLessThanOrEqual(5)
    }
  })

  it('every slide has non-empty primary text', () => {
    for (const c of content) {
      c.slides.forEach((slide, i) => {
        const label = `${c.techniqueId}#${i}`
        switch (slide.kind) {
          case 'concept':
            expect(slide.heading.length, label).toBeGreaterThan(0)
            expect(slide.body.length, label).toBeGreaterThan(0)
            break
          case 'worked':
            expect(slide.problem.length, label).toBeGreaterThan(0)
            expect(slide.steps.length, label).toBeGreaterThan(0)
            slide.steps.forEach((s) => expect(s.length, label).toBeGreaterThan(0))
            break
          case 'edge-case':
            expect(slide.heading.length, label).toBeGreaterThan(0)
            expect(slide.body.length, label).toBeGreaterThan(0)
            break
          case 'try-it':
            expect(slide.problem.length, label).toBeGreaterThan(0)
            expect(slide.hint.length, label).toBeGreaterThan(0)
            break
        }
      })
    }
  })

  it('worked + try-it slides have a numerically correct answer when the prompt is a single binary op', () => {
    for (const c of content) {
      c.slides.forEach((slide: Slide, i) => {
        if (slide.kind !== 'worked' && slide.kind !== 'try-it') return

        // Worked-example answers may be strings (e.g. cosmetic). Only check
        // numeric answers; string-answer slides are author-responsibility.
        const ans = slide.answer
        const expected = evaluateExpression(slide.problem)
        if (expected === null) return // Compound expressions (e.g. "7 + 3 + 6 + 4 + 8") aren't auto-validated.

        if (typeof ans === 'number') {
          expect(ans, `${c.techniqueId}#${i} (${slide.problem})`).toBe(expected)
        }
      })
    }
  })
})
