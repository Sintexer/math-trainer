/**
 * Tests for src/features/progress/exportImport.ts
 *
 * `parseProgressFile` (async, requires a File object) is tested via
 * `parseProgressJson` (synchronous) except for the file-read path,
 * which gets one integration test using a real Blob → File construction.
 */

import { describe, it, expect } from 'vitest'
import {
  serializeProgress,
  parseProgressJson,
  parseProgressFile,
  ProgressImportError,
} from '@/features/progress/exportImport'
import { initialProgressState, SCHEMA_VERSION } from '@/features/progress/progressSlice'
import type { UserProgress } from '@/shared/types'

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Build a valid UserProgress with optional overrides. */
function makeProgress(overrides: Partial<UserProgress> = {}): UserProgress {
  return { ...initialProgressState, ...overrides }
}

/** Wrap a JSON string in a File object for testing parseProgressFile. */
function jsonToFile(json: string, filename = 'progress.json'): File {
  const blob = new Blob([json], { type: 'application/json' })
  return new File([blob], filename, { type: 'application/json' })
}

// ── serializeProgress ─────────────────────────────────────────────────────────

describe('serializeProgress', () => {
  it('produces valid JSON that round-trips back to the original object', () => {
    const progress = makeProgress({ xp: 500, level: 0 })
    const json = serializeProgress(progress)
    expect(JSON.parse(json)).toEqual(progress)
  })

  it('preserves nested techniqueProgress and dailyChallenges', () => {
    const progress = makeProgress({
      xp: 1200,
      level: 1,
      techniqueProgress: {
        'mul-by-11': {
          techniqueRead: true,
          challengePassed: false,
          sessions: [],
          stars: { speed: false, accuracy: true, range: false },
          totalCorrect: 30,
          totalAttempted: 35,
          bestSpeedPerMin: 7.5,
          difficultiesCovered: ['easy', 'medium'],
        },
      },
    })
    const roundTripped = JSON.parse(serializeProgress(progress))
    expect(roundTripped.techniqueProgress['mul-by-11'].stars.accuracy).toBe(true)
    expect(roundTripped.techniqueProgress['mul-by-11'].bestSpeedPerMin).toBe(7.5)
  })

  it('output is pretty-printed (contains newlines)', () => {
    const json = serializeProgress(makeProgress())
    expect(json).toContain('\n')
  })
})

// ── parseProgressJson — valid input ──────────────────────────────────────────

describe('parseProgressJson — valid input', () => {
  it('round-trips the initial state', () => {
    const json = serializeProgress(initialProgressState)
    const parsed = parseProgressJson(json)
    expect(parsed).toEqual(initialProgressState)
  })

  it('round-trips a progress object with sessions and stars', () => {
    const progress = makeProgress({
      xp: 450,
      level: 0,
      settings: { pactModeEnabled: true },
    })
    expect(parseProgressJson(serializeProgress(progress))).toEqual(progress)
  })

  it('accepts a correct schemaVersion', () => {
    const json = serializeProgress(makeProgress({ schemaVersion: SCHEMA_VERSION }))
    expect(() => parseProgressJson(json)).not.toThrow()
  })
})

// ── parseProgressJson — invalid input ────────────────────────────────────────

describe('parseProgressJson — invalid input', () => {
  it('throws ProgressImportError on non-JSON string', () => {
    expect(() => parseProgressJson('not json {{')).toThrow(ProgressImportError)
    expect(() => parseProgressJson('not json {{')).toThrow('valid JSON')
  })

  it('throws ProgressImportError on empty string', () => {
    expect(() => parseProgressJson('')).toThrow(ProgressImportError)
  })

  it('throws ProgressImportError when required fields are missing', () => {
    const incomplete = JSON.stringify({ xp: 0, level: 0 })
    expect(() => parseProgressJson(incomplete)).toThrow(ProgressImportError)
    expect(() => parseProgressJson(incomplete)).toThrow('expected progress format')
  })

  it('throws ProgressImportError on schema version mismatch', () => {
    const futureSchema = serializeProgress(makeProgress({ schemaVersion: SCHEMA_VERSION + 1 }))
    expect(() => parseProgressJson(futureSchema)).toThrow(ProgressImportError)
    expect(() => parseProgressJson(futureSchema)).toThrow('Schema version mismatch')
    expect(() => parseProgressJson(futureSchema)).toThrow(`v${SCHEMA_VERSION + 1}`)
  })

  it('throws ProgressImportError on schema version 0 (legacy)', () => {
    const legacySchema = serializeProgress(makeProgress({ schemaVersion: 0 }))
    expect(() => parseProgressJson(legacySchema)).toThrow(ProgressImportError)
  })

  it('throws ProgressImportError when xp is not a number', () => {
    const bad = JSON.stringify({
      xp: 'lots',
      level: 0,
      schemaVersion: SCHEMA_VERSION,
      settings: { pactModeEnabled: false },
      techniqueProgress: {},
      dailyChallenges: {},
    })
    expect(() => parseProgressJson(bad)).toThrow(ProgressImportError)
  })
})

// ── parseProgressFile — async / File integration ─────────────────────────────

describe('parseProgressFile', () => {
  it('resolves with parsed progress for a valid file', async () => {
    const file = jsonToFile(serializeProgress(initialProgressState))
    const result = await parseProgressFile(file)
    expect(result).toEqual(initialProgressState)
  })

  it('rejects with ProgressImportError for a file with invalid JSON', async () => {
    const file = jsonToFile('{ bad json ]]]')
    await expect(parseProgressFile(file)).rejects.toThrow(ProgressImportError)
  })

  it('rejects with ProgressImportError for a schema version mismatch', async () => {
    const file = jsonToFile(
      serializeProgress(makeProgress({ schemaVersion: SCHEMA_VERSION + 99 }))
    )
    await expect(parseProgressFile(file)).rejects.toThrow(ProgressImportError)
  })
})
