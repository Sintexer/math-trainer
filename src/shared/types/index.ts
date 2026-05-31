// ─────────────────────────────────────────────────────────────
// Core domain types for MathSprint
// All generated problems, sessions, and user progress are typed here.
// ─────────────────────────────────────────────────────────────

// ── Difficulty ───────────────────────────────────────────────

export type Difficulty = 'easy' | 'medium' | 'hard'

/** The full set of difficulties, in canonical order. Use this constant
 *  instead of hardcoding the literal array in reducers / selectors. */
export const ALL_DIFFICULTIES: readonly Difficulty[] = ['easy', 'medium', 'hard'] as const

// ── Problem ──────────────────────────────────────────────────

export interface Problem {
  id: string
  /** ID of the specific technique this problem tests (e.g. "mul-by-11") */
  techniqueId: string
  /** Parent operation topic (e.g. "multiplication") */
  topicId: string
  difficulty: Difficulty
  /** Human-readable prompt shown to user (e.g. "34 × 11 = ?") */
  prompt: string
  answer: number
  // Populated after user answers:
  userAnswer?: number
  correct?: boolean
  /** Time from problem display to answer submission in ms */
  timeMs?: number
}

// ── Technique ────────────────────────────────────────────────

export type TopicId = 'addition' | 'subtraction' | 'multiplication' | 'division'

export interface MasteryThresholds {
  /** Minimum correct answers per minute to earn Speed star */
  speedPerMin: number
  /** Minimum accuracy % to earn Accuracy star */
  accuracyPct: number
}

export interface Technique {
  id: string
  name: string
  topicId: TopicId
  description: string
  difficulty: Difficulty
  /** IDs of techniques logically related to this one (used for pact mode path) */
  relatedTechniqueIds: string[]
  masteryThresholds: MasteryThresholds
}

// ── Topic ────────────────────────────────────────────────────

export interface Topic {
  id: TopicId
  name: string
  techniqueIds: string[]
}

// ── Constellation Graph ──────────────────────────────────────

export interface ConstellationNode {
  techniqueId: string
  /** Position on the canvas (hand-tuned coordinates) */
  x: number
  y: number
}

export interface ConstellationEdge {
  from: string
  to: string
}

export interface ConstellationGraph {
  nodes: ConstellationNode[]
  edges: ConstellationEdge[]
}

// ── Session ──────────────────────────────────────────────────

export type SessionType = 'drill' | 'challenge'

export type SessionStatus = 'idle' | 'running' | 'evaluating' | 'complete'

export interface SessionConfig {
  type: SessionType
  techniqueId: string
  /** For drill: total number of problems. For challenge: ignored (time-based). */
  problemCount?: number
  /** For challenge: total duration in seconds. */
  durationSeconds?: number
}

export interface SessionSummary {
  id: string
  type: SessionType
  techniqueId: string
  date: string // ISO string
  correct: number
  attempted: number
  /** Percentage 0–100 */
  accuracyPct: number
  /** Correct answers per minute */
  speedPerMin: number
  /** Computed inside the reducer from the canonical XP formula —
   *  callers may leave this at 0 when constructing a summary. */
  xpEarned: number
  /** IDs of up to 2 worst-performing techniques in this session */
  weakTechniqueIds: string[]
  /** Granular per-technique stats for reporting */
  techniqueBreakdown: Record<string, { correct: number; attempted: number }>
  /** Difficulties the user CORRECTLY solved at least one problem at during
   *  this session. Powers the Range star and per-technique breadth metrics. */
  difficultiesAttempted: Difficulty[]
  passed?: boolean // only meaningful for challenge sessions
}

// ── Mastery ──────────────────────────────────────────────────

export interface MasteryStars {
  speed: boolean
  accuracy: boolean
  range: boolean
}

/** Module-level frozen default. Selectors return this exact reference for
 *  techniques with no progress yet, so React-Redux's default equality check
 *  does not trigger spurious re-renders. */
export const DEFAULT_MASTERY_STARS: MasteryStars = Object.freeze({
  speed: false,
  accuracy: false,
  range: false,
})

// ── User Progress ────────────────────────────────────────────

/** Per-technique progress. Note: there is no per-topic aggregate by design —
 *  the curriculum unit of progress is the technique, and topic-level rollups
 *  are computed on the fly by selectors. */
export interface TechniqueProgress {
  techniqueRead: boolean
  challengePassed: boolean
  /** Kept trimmed to last MAX_SESSIONS_RETAINED sessions */
  sessions: SessionSummary[]
  stars: MasteryStars
  // Aggregated stats (updated on each session completion):
  totalCorrect: number
  totalAttempted: number
  bestSpeedPerMin: number
  /** Difficulties the user has correctly solved ≥1 problem at, across all sessions. */
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
  /** Keyed by techniqueId. */
  techniqueProgress: Record<string, TechniqueProgress>
  dailyChallenges: Record<string, DailyChallengeResult>
  settings: UserSettings
  /** Incremented on schema changes for migration support */
  schemaVersion: number
}
