// Pure summary builder. Called by the reducer on session completion.
// Reads timestamps from state — no Date.now() / new Date() calls here.

import type { Difficulty } from '@/shared/types'
import type { AnsweredProblem, SessionState, SessionSummary } from './types'
import { getTechnique } from '@/content'

/** Minimum problems required before weak-technique detection fires. */
const MIN_PROBLEMS_FOR_WEAK_DETECTION = 5

/** Return up to 2 techniqueIds with the lowest accuracy in this session. */
export function detectWeakTechniques(answers: AnsweredProblem[]): string[] {
  if (answers.length < MIN_PROBLEMS_FOR_WEAK_DETECTION) return []

  const byTechnique = new Map<string, { correct: number; attempted: number }>()
  for (const a of answers) {
    const id = a.problem.techniqueId
    const entry = byTechnique.get(id) ?? { correct: 0, attempted: 0 }
    entry.attempted++
    if (a.correct) entry.correct++
    byTechnique.set(id, entry)
  }

  // Sort ascending by accuracy; break ties by more attempts (more data = more reliable).
  const sorted = Array.from(byTechnique.entries()).sort(([, a], [, b]) => {
    const accA = a.correct / a.attempted
    const accB = b.correct / b.attempted
    if (accA !== accB) return accA - accB
    return b.attempted - a.attempted
  })

  return sorted.slice(0, 2).map(([id]) => id)
}

/**
 * Build the final SessionSummary from a completed session's state.
 *
 * `xpEarned` is intentionally left at 0 — XP requires knowledge of prior
 * sessions (first-session bonus) and is computed exclusively by the
 * progress slice when the session is persisted.
 */
export function buildSummary(state: SessionState): SessionSummary {
  const { config, answers, currentTimeMs } = state

  const attempted = answers.length
  const correct = answers.filter((a) => a.correct).length
  const accuracyPct = attempted > 0 ? Math.round((correct / attempted) * 100) : 0

  // Drill: sum of per-answer times. Challenge: full configured duration.
  const totalTimeMs =
    config.type === 'challenge'
      ? (config.durationSeconds ?? 60) * 1000
      : answers.reduce((sum, a) => sum + a.timeMs, 0)
  const totalTimeMin = totalTimeMs / 60_000
  const speedPerMin =
    totalTimeMin > 0 ? Math.round((correct / totalTimeMin) * 10) / 10 : 0

  let passed = false
  if (config.type === 'challenge') {
    try {
      const thresholds = getTechnique(config.techniqueId).masteryThresholds
      passed = speedPerMin >= thresholds.speedPerMin
    } catch {
      // Unknown technique — treat as not passed.
    }
  }

  const techniqueBreakdown: Record<string, { correct: number; attempted: number }> = {}
  for (const a of answers) {
    const id = a.problem.techniqueId
    if (!techniqueBreakdown[id]) techniqueBreakdown[id] = { correct: 0, attempted: 0 }
    techniqueBreakdown[id].attempted++
    if (a.correct) techniqueBreakdown[id].correct++
  }

  const difficultiesAttempted: Difficulty[] = []
  const seen = new Set<Difficulty>()
  for (const a of answers) {
    if (a.correct && !seen.has(a.problem.difficulty)) {
      seen.add(a.problem.difficulty)
      difficultiesAttempted.push(a.problem.difficulty)
    }
  }

  return {
    id: `session-${currentTimeMs}-${config.techniqueId}`,
    type: config.type,
    techniqueId: config.techniqueId,
    date: new Date(currentTimeMs).toISOString(),
    correct,
    attempted,
    accuracyPct,
    speedPerMin,
    xpEarned: 0,
    weakTechniqueIds: detectWeakTechniques(answers),
    techniqueBreakdown,
    difficultiesAttempted,
    passed,
  }
}
