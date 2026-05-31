// Progress feature types.

import type { Difficulty, MasteryStars } from '@/shared/types'
import type { SessionSummary } from '@/features/session/types'

/** Per-technique progress. There is no per-topic aggregate by design — the
 *  curriculum unit of progress is the technique, and topic-level rollups are
 *  computed on the fly by selectors. */
export interface TechniqueProgress {
  techniqueRead: boolean
  challengePassed: boolean
  /** Trimmed to the last MAX_SESSIONS_RETAINED sessions. */
  sessions: SessionSummary[]
  stars: MasteryStars
  totalCorrect: number
  totalAttempted: number
  bestSpeedPerMin: number
  /** Difficulties the user has correctly solved at least once, across all sessions. */
  difficultiesCovered: Difficulty[]
}

export interface DailyChallengeResult {
  date: string
  score: number
  attempted: number
  timeSeconds: number
  problemResults: Array<{ techniqueId: string; correct: boolean }>
}

export interface UserSettings {
  pactModeEnabled: boolean
}

export interface UserProgress {
  xp: number
  level: number
  techniqueProgress: Record<string, TechniqueProgress>
  dailyChallenges: Record<string, DailyChallengeResult>
  settings: UserSettings
  /** Incremented on schema changes for migration support. */
  schemaVersion: number
}
