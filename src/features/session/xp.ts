/**
 * XP formula — isolated so it can be unit-tested independently.
 *
 * Formula:
 *   base     = correct × 10
 *   accuracy = accuracyPct >= 80 ? 20 : 0
 *   challenge= type === 'challenge' && passed ? 50 : 0
 *   total    = base + accuracy + challenge
 */

import type { SessionType } from '@/shared/types'

export interface XpInputs {
  correct: number
  accuracyPct: number
  type: SessionType
  passed: boolean
}

export function computeXp({ correct, accuracyPct, type, passed }: XpInputs): number {
  const base = correct * 10
  const accuracyBonus = accuracyPct >= 80 ? 20 : 0
  const challengeBonus = type === 'challenge' && passed ? 50 : 0
  return base + accuracyBonus + challengeBonus
}
