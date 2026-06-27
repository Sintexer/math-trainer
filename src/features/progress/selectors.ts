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

// ── Per-technique selectors ──────────────────────────────────
//
// Signature is `(state, id)` rather than the curried `(id) => (state) => …`.
// React-Redux compares the returned value with strict equality, so primitive
// returns (booleans, numbers) are safe to recompute on each render.
// Reference-returning selectors fall back to a frozen module-level constant
// (DEFAULT_MASTERY_STARS) so React-Redux doesn't see a fresh object reference
// every time a technique has no progress yet.

export const selectTechniqueProgress = (state: RootState, techniqueId: string) =>
  state.progress.techniqueProgress[techniqueId] ?? null

export const selectTechniqueRead = (state: RootState, techniqueId: string) =>
  state.progress.techniqueProgress[techniqueId]?.techniqueRead ?? false

export const selectMasteryStars = (state: RootState, techniqueId: string) =>
  state.progress.techniqueProgress[techniqueId]?.stars ?? DEFAULT_MASTERY_STARS

export const selectChallengePassed = (state: RootState, techniqueId: string) =>
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
      (p) => p.stars.speed || p.stars.range
    ).length

    const breadthPct =
      CURRICULUM_SIZE > 0 ? (withAnyStar / CURRICULUM_SIZE) * 100 : 0

    return { maxSpeed, avgAccuracy, breadthPct }
  }
)

export const selectDailyChallengeResult = (state: RootState, date: string) =>
  state.progress.dailyChallenges[date] ?? null

// ── Cross-topic weak techniques ──────────────────────────────

/**
 * Returns up to 3 techniqueIds with the lowest windowed average accuracy
 * across all techniques that have at least one session.
 *
 * Useful for the profile page and post-run reports that need a global view
 * of where the user struggles most.
 */
export const selectWeakTechniques = createSelector(
  [selectAllTechniqueProgress],
  (allProgress) => {
    return Object.entries(allProgress)
      .filter(([, p]) => p.sessions.length > 0)
      .map(([id, p]) => {
        const recent = p.sessions.slice(-MASTERY_WINDOW)
        const avgAccuracy =
          recent.reduce((sum, s) => sum + s.accuracyPct, 0) / recent.length
        return { id, avgAccuracy }
      })
      .sort((a, b) => a.avgAccuracy - b.avgAccuracy)
      .slice(0, 3)
      .map(({ id }) => id)
  }
)
