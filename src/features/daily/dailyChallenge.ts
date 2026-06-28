// Daily Challenge pure utilities — no React, no Redux.
// All functions are deterministic and injectable for tests.

import { createSeededRng, generateMixedProblems, seedFromDate } from '@/features/generators'
import type { Problem } from '@/shared/types'

/** Number of problems in each Daily Challenge. */
export const DAILY_PROBLEM_COUNT = 10

/**
 * Fixed epoch for computing the challenge number.
 * Challenge #1 corresponds to 2026-01-01.
 */
const EPOCH_ISO = '2026-01-01'

// ── Date helpers ─────────────────────────────────────────────────────────────

/**
 * Returns today's date as a YYYY-MM-DD string in the device's local timezone.
 * Inject `now` in tests to control the "current day".
 */
export function getTodayDate(now: Date = new Date()): string {
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * Returns the sequential challenge number for a given ISO date (1-indexed from
 * EPOCH_ISO). Dates before the epoch return non-positive numbers; callers should
 * treat any value ≤ 0 as invalid and fall back to a safe default.
 */
export function getDailyNumber(isoDate: string): number {
  // Use UTC midnight to avoid DST shifts changing the day boundary.
  const epochMs = Date.UTC(2026, 0, 1) // 2026-01-01 UTC
  const [y, m, d] = isoDate.split('-').map(Number)
  const targetMs = Date.UTC(y, m - 1, d)
  return Math.floor((targetMs - epochMs) / 86_400_000) + 1
}

// ── Problem generation ────────────────────────────────────────────────────────

/**
 * Generates the fixed problem set for a given calendar date.
 * Two calls with the same date always return identical problems, regardless of
 * device or timezone — this is the Daily Challenge's core guarantee.
 */
export function getDailyProblems(isoDate: string): Problem[] {
  const rng = createSeededRng(seedFromDate(isoDate))
  return generateMixedProblems(null, DAILY_PROBLEM_COUNT, rng)
}

// ── Share card ────────────────────────────────────────────────────────────────

/**
 * Builds the Wordle-style share text for a completed challenge.
 *
 * Example output:
 *   MathSprint Daily #178
 *   ⚡ 8/10 correct · 47s
 *   🟩🟩🟩🟥🟩🟩🟩🟥🟩🟩
 */
export function buildShareText(
  challengeNumber: number,
  score: number,
  attempted: number,
  timeSeconds: number,
  problemResults: ReadonlyArray<{ correct: boolean }>,
): string {
  const emojis = problemResults.map((r) => (r.correct ? '🟩' : '🟥')).join('')
  return [
    `MathSprint Daily #${challengeNumber}`,
    `⚡ ${score}/${attempted} correct · ${timeSeconds}s`,
    emojis,
  ].join('\n')
}

// ── Countdown helpers ─────────────────────────────────────────────────────────

/**
 * Returns the number of milliseconds until midnight local time (start of the
 * next calendar day). Inject `now` in tests.
 */
export function msUntilMidnight(now: Date = new Date()): number {
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)
  return Math.max(0, tomorrow.getTime() - now.getTime())
}

/**
 * Formats a millisecond duration as HH:MM:SS.
 * Used for the "next challenge in …" countdown display.
 */
export function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

// Keep the EPOCH_ISO export for tests that want to verify the day-0 edge case.
export { EPOCH_ISO }
