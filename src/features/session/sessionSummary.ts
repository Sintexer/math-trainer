/**
 * Session Summary Builder
 *
 * `buildSummary` is called by the reducer once a session reaches 'complete'.
 * It is a pure function — no side effects, no randomness.
 */

import type { Difficulty, SessionSummary } from '@/shared/types'
import type { AnsweredProblem, SessionState } from './types'
import { computeXp } from './xp'
import { getTechnique } from '@/content'

// ── Weak technique detection ──────────────────────────────────────────────────

/** Minimum problems attempted in a session before weak-technique detection fires. */
const MIN_PROBLEMS_FOR_WEAK_DETECTION = 5

/**
 * Return up to 2 techniqueIds with the lowest accuracy in this session.
 * Only fires when the session has >= MIN_PROBLEMS_FOR_WEAK_DETECTION answers.
 */
export function detectWeakTechniques(answers: AnsweredProblem[]): string[] {
  if (answers.length < MIN_PROBLEMS_FOR_WEAK_DETECTION) return []

  // Aggregate per technique
  const byTechnique = new Map<string, { correct: number; attempted: number }>()
  for (const a of answers) {
    const id = a.problem.techniqueId
    const entry = byTechnique.get(id) ?? { correct: 0, attempted: 0 }
    entry.attempted++
    if (a.correct) entry.correct++
    byTechnique.set(id, entry)
  }

  // Sort by accuracy ascending (worst first), break ties by more attempts (more data = more reliable)
  const sorted = Array.from(byTechnique.entries()).sort(([, a], [, b]) => {
    const accA = a.correct / a.attempted
    const accB = b.correct / b.attempted
    if (accA !== accB) return accA - accB
    return b.attempted - a.attempted
  })

  return sorted.slice(0, 2).map(([id]) => id)
}

// ── Summary builder ───────────────────────────────────────────────────────────

let _summaryCounter = 0

/**
 * Build the final SessionSummary from a completed session's state.
 * Call this only when state.status is transitioning to 'complete'.
 */
export function buildSummary(state: SessionState): SessionSummary {
  const { config, answers } = state

  const attempted = answers.length
  const correct = answers.filter((a) => a.correct).length
  const accuracyPct = attempted > 0 ? Math.round((correct / attempted) * 100) : 0

  // speedPerMin: correct answers per minute, based on actual elapsed session time
  // For challenge: use full duration. For drill: sum of all answer times.
  let totalTimeMs: number
  if (config.type === 'challenge') {
    totalTimeMs = (config.durationSeconds ?? 60) * 1000
  } else {
    totalTimeMs = answers.reduce((sum, a) => sum + a.timeMs, 0)
  }
  const totalTimeMin = totalTimeMs / 60_000
  const speedPerMin = totalTimeMin > 0 ? Math.round((correct / totalTimeMin) * 10) / 10 : 0

  // Pass/fail for challenge mode
  let passed = false
  if (config.type === 'challenge') {
    try {
      const thresholds = getTechnique(config.techniqueId).masteryThresholds
      passed = speedPerMin >= thresholds.speedPerMin && accuracyPct >= thresholds.accuracyPct
    } catch {
      // Unknown technique — treat as not passed
    }
  }

  const xpEarned = computeXp({ correct, accuracyPct, type: config.type, passed })

  // Per-technique breakdown
  const techniqueBreakdown: Record<string, { correct: number; attempted: number }> = {}
  for (const a of answers) {
    const id = a.problem.techniqueId
    if (!techniqueBreakdown[id]) techniqueBreakdown[id] = { correct: 0, attempted: 0 }
    techniqueBreakdown[id].attempted++
    if (a.correct) techniqueBreakdown[id].correct++
  }

  // Difficulties the user got at least one correct answer at
  const difficultiesAttempted: Difficulty[] = []
  const seen = new Set<string>()
  for (const a of answers) {
    if (a.correct && !seen.has(a.problem.difficulty)) {
      seen.add(a.problem.difficulty)
      difficultiesAttempted.push(a.problem.difficulty)
    }
  }

  const weakTechniqueIds = detectWeakTechniques(answers)

  return {
    id: `session-${Date.now()}-${++_summaryCounter}`,
    type: config.type,
    techniqueId: config.techniqueId,
    date: new Date().toISOString(),
    correct,
    attempted,
    accuracyPct,
    speedPerMin,
    xpEarned,
    weakTechniqueIds,
    techniqueBreakdown,
    difficultiesAttempted,
    passed,
  }
}
