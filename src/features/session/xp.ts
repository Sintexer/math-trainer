/**
 * XP formula — isolated so it can be unit-tested independently.
 *
 * Canonical formula (Vision doc):
 *   base            = correct × 10
 *   accuracy_bonus  = +50 if accuracyPct ≥ 95%, +25 if accuracyPct ≥ 80%
 *   speed_bonus     = +20 if speedPerMin ≥ 8,   +10 if speedPerMin ≥ 5
 *   first_bonus     = +100 on first session per technique per tier (drill or challenge)
 *
 * NOTE: `isFirstSession` cannot be determined inside buildSummary (no access to
 * persisted state at session-engine time). buildSummary passes false; the progress
 * slice re-evaluates with the correct value and overwrites xpEarned on persist.
 */

export interface XpInputs {
  correct: number
  accuracyPct: number
  speedPerMin: number
  /** True when this is the first drill — or first challenge — ever for this technique. */
  isFirstSession: boolean
}

export function computeXp({ correct, accuracyPct, speedPerMin, isFirstSession }: XpInputs): number {
  const base = correct * 10
  const accuracyBonus = accuracyPct >= 95 ? 50 : accuracyPct >= 80 ? 25 : 0
  const speedBonus = speedPerMin >= 8 ? 20 : speedPerMin >= 5 ? 10 : 0
  const firstBonus = isFirstSession ? 100 : 0
  return base + accuracyBonus + speedBonus + firstBonus
}
