import type { RootState } from '@/app/store'

export const selectXp = (state: RootState) => state.progress.xp
export const selectLevel = (state: RootState) => state.progress.level
export const selectSettings = (state: RootState) => state.progress.settings
export const selectPactMode = (state: RootState) => state.progress.settings.pactModeEnabled
export const selectDailyChallenges = (state: RootState) => state.progress.dailyChallenges
export const selectAllTopicProgress = (state: RootState) => state.progress.topicProgress

export const selectTopicProgress = (techniqueId: string) => (state: RootState) =>
  state.progress.topicProgress[techniqueId] ?? null

export const selectTechniqueRead = (techniqueId: string) => (state: RootState) =>
  state.progress.topicProgress[techniqueId]?.techniqueRead ?? false

export const selectMasteryStars = (techniqueId: string) => (state: RootState) =>
  state.progress.topicProgress[techniqueId]?.stars ?? {
    speed: false,
    accuracy: false,
    range: false,
  }

export const selectChallengePassed = (techniqueId: string) => (state: RootState) =>
  state.progress.topicProgress[techniqueId]?.challengePassed ?? false

export const selectGlobalStats = (state: RootState) => {
  const allProgress = Object.values(state.progress.topicProgress)

  if (allProgress.length === 0) {
    return { maxSpeed: 0, avgAccuracy: 0, breadthPct: 0 }
  }

  const maxSpeed = Math.max(...allProgress.map((p) => p.bestSpeedPerMin))

  const topicsWithSessions = allProgress.filter((p) => p.sessions.length > 0)
  const avgAccuracy =
    topicsWithSessions.length > 0
      ? topicsWithSessions.reduce((sum, p) => {
          const sessions = p.sessions.slice(-5)
          const avg = sessions.reduce((s, sess) => s + sess.accuracyPct, 0) / sessions.length
          return sum + avg
        }, 0) / topicsWithSessions.length
      : 0

  const topicsWithAnyStar = allProgress.filter(
    (p) => p.stars.speed || p.stars.accuracy || p.stars.range
  ).length

  const breadthPct = (topicsWithAnyStar / allProgress.length) * 100

  return { maxSpeed, avgAccuracy, breadthPct }
}

export const selectDailyChallengeResult = (date: string) => (state: RootState) =>
  state.progress.dailyChallenges[date] ?? null
