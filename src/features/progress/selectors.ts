import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store'
import { DEFAULT_MASTERY_STARS } from '@/shared/types'
import { MASTERY_WINDOW } from './progressSlice'
import { getAllTechniques } from '@/content'

// ── Primitive selectors ──────────────────────────────────────

export const selectXp = (state: RootState) => state.progress.xp
export const selectLevel = (state: RootState) => state.progress.level
export const selectSettings = (state: RootState) => state.progress.settings
export const selectPactMode = (state: RootState) =>
  state.progress.settings.pactModeEnabled
export const selectDailyChallenges = (state: RootState) =>
  state.progress.dailyChallenges
export const selectAllTechniqueProgress = (state: RootState) =>
  state.progress.techniqueProgress

// ── Per-technique selector factories ─────────────────────────
//
// NOTE: these create a fresh function on every call. That's fine for
// primitive returns (React-Redux uses strict equality on the result),
// but reference-returning factories use module-level constants as the
// "missing" sentinel so React-Redux doesn't see a new object reference
// each render.

export const selectTechniqueProgress = (techniqueId: string) => (state: RootState) =>
  state.progress.techniqueProgress[techniqueId] ?? null

export const selectTechniqueRead = (techniqueId: string) => (state: RootState) =>
  state.progress.techniqueProgress[techniqueId]?.techniqueRead ?? false

export const selectMasteryStars = (techniqueId: string) => (state: RootState) =>
  state.progress.techniqueProgress[techniqueId]?.stars ?? DEFAULT_MASTERY_STARS

export const selectChallengePassed = (techniqueId: string) => (state: RootState) =>
  state.progress.techniqueProgress[techniqueId]?.challengePassed ?? false

// ── Derived global stats ─────────────────────────────────────

/** Cached curriculum size — the breadth denominator is the total number of
 *  techniques in the curriculum, NOT the number the user has touched. */
const CURRICULUM_SIZE = getAllTechniques().length

export const selectGlobalStats = createSelector(
  [selectAllTechniqueProgress],
  (allProgress) => {
    const entries = Object.values(allProgress)

    if (entries.length === 0) {
      return { maxSpeed: 0, avgAccuracy: 0, breadthPct: 0 }
    }

    const maxSpeed = entries.reduce(
      (max, p) => (p.bestSpeedPerMin > max ? p.bestSpeedPerMin : max),
      0
    )

    const withSessions = entries.filter((p) => p.sessions.length > 0)
    const avgAccuracy =
      withSessions.length > 0
        ? withSessions.reduce((sum, p) => {
            const recent = p.sessions.slice(-MASTERY_WINDOW)
            const avg =
              recent.reduce((s, sess) => s + sess.accuracyPct, 0) / recent.length
            return sum + avg
          }, 0) / withSessions.length
        : 0

    const withAnyStar = entries.filter(
      (p) => p.stars.speed || p.stars.accuracy || p.stars.range
    ).length

    const breadthPct =
      CURRICULUM_SIZE > 0 ? (withAnyStar / CURRICULUM_SIZE) * 100 : 0

    return { maxSpeed, avgAccuracy, breadthPct }
  }
)

export const selectDailyChallengeResult = (date: string) => (state: RootState) =>
  state.progress.dailyChallenges[date] ?? null
