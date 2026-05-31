/**
 * Export / Import utilities for user progress.
 *
 * These are pure utilities — they do not dispatch Redux actions.
 * Callers are responsible for dispatching `importProgress(parsed)` after
 * a successful `parseProgressFile` call.
 *
 * Export flow (browser):
 *   exportProgress(store.getState().progress)
 *   → creates a Blob → triggers a browser download
 *
 * Import flow (browser + Node tests):
 *   const progress = await parseProgressFile(file)
 *   dispatch(importProgress(progress))
 */

import type { UserProgress } from '@/shared/types'
import { isValidUserProgress, SCHEMA_VERSION } from './progressSlice'

// ── Export ────────────────────────────────────────────────────────────────────

/**
 * Serialise `progress` to JSON and trigger a browser file download.
 * Filename: `mathsprint-progress-YYYY-MM-DD.json`
 *
 * NOTE: This function is intentionally side-effectful (DOM manipulation).
 * Do not call it in test environments — use `serializeProgress` instead.
 */
export function exportProgress(progress: UserProgress): void {
  const json = serializeProgress(progress)
  const date = new Date().toISOString().slice(0, 10)
  const filename = `mathsprint-progress-${date}.json`

  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

/**
 * Serialise progress to a pretty-printed JSON string.
 * Extracted for testability — `exportProgress` calls this internally.
 */
export function serializeProgress(progress: UserProgress): string {
  return JSON.stringify(progress, null, 2)
}

// ── Import ────────────────────────────────────────────────────────────────────

/** Errors thrown by `parseProgressFile` / `parseProgressJson`. */
export class ProgressImportError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ProgressImportError'
  }
}

/**
 * Read a `File` object, parse the JSON, validate the schema, and return
 * the parsed `UserProgress`.
 *
 * Throws `ProgressImportError` on any failure (invalid JSON, schema
 * mismatch, unknown version).
 */
export async function parseProgressFile(file: File): Promise<UserProgress> {
  let text: string
  try {
    text = await file.text()
  } catch {
    throw new ProgressImportError('Could not read the selected file')
  }
  return parseProgressJson(text)
}

/**
 * Parse a raw JSON string into `UserProgress`.
 * Throws `ProgressImportError` on any failure.
 * Extracted from `parseProgressFile` for synchronous testing.
 */
export function parseProgressJson(json: string): UserProgress {
  let parsed: unknown
  try {
    parsed = JSON.parse(json)
  } catch {
    throw new ProgressImportError('The file does not contain valid JSON')
  }

  if (!isValidUserProgress(parsed)) {
    throw new ProgressImportError('The file does not match the expected progress format')
  }

  if (parsed.schemaVersion !== SCHEMA_VERSION) {
    throw new ProgressImportError(
      `Schema version mismatch: file has v${parsed.schemaVersion}, app expects v${SCHEMA_VERSION}. ` +
        'Progress was not imported.'
    )
  }

  return parsed
}
