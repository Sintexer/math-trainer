/**
 * Selector tests for src/features/progress/selectors.ts
 *
 * These tests drive selectors against a hand-crafted partial RootState.
 * We bypass the persisted store entirely — selectors only read from
 * state.progress, so we construct the minimum shape needed.
 */

import { describe, it, expect } from 'vitest'
import { selectGlobalStats, selectWeakTechniques } from '@/features/progress/selectors'
import type { RootState } from '@/app/store'
import type { TechniqueProgress, UserProgress } from '@/features/progress/types'
import { initialProgressState } from '@/features/progress/progressSlice'

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Build a minimal RootState containing the provided UserProgress. */
function makeState(progress: Partial<UserProgress> = {}): RootState {
  // redux-persist wraps the root reducer, so the actual state shape includes
  // _persist at the root level. Selectors only access state.progress, so we
  // only need to satisfy that path.
  return {
    progress: { ...initialProgressState, ...progress },
  } as unknown as RootState
}

function makeTechniqueProgress(
  sessions: Array<{ type?: 'drill' | 'challenge'; accuracyPct: number; speedPerMin?: number; bestSpeedPerMin?: number }>
): TechniqueProgress {
  const s = sessions.map((s, i) => ({
    id: `sess-${i}`,
    type: (s.type ?? 'drill') as 'drill' | 'challenge',
    techniqueId: 'test',
    date: new Date().toISOString(),
    correct: Math.round(s.accuracyPct / 10),
    attempted: 10,
    accuracyPct: s.accuracyPct,
    speedPerMin: s.speedPerMin ?? 5,
    xpEarned: 0,
    weakTechniqueIds: [],
    techniqueBreakdown: {},
    difficultiesAttempted: [] as ('easy' | 'medium' | 'hard')[],
  }))

  const bestSpeed = Math.max(0, ...s.map((sess) => sess.speedPerMin ?? 5))

  return {
    techniqueRead: false,
    challengePassed: false,
    sessions: s,
    stars: { speed: false, accuracy: false, range: false },
    totalCorrect: s.reduce((n, sess) => n + sess.correct, 0),
    totalAttempted: s.reduce((n, sess) => n + sess.attempted, 0),
    bestSpeedPerMin: bestSpeed,
    difficultiesCovered: [],
  }
}

// ── selectGlobalStats ─────────────────────────────────────────────────────────

describe('selectGlobalStats', () => {
  it('returns zeros when no technique progress exists', () => {
    const state = makeState()
    expect(selectGlobalStats(state)).toEqual({ maxSpeed: 0, avgAccuracy: 0, breadthPct: 0 })
  })

  it('returns zeros when techniqueProgress has entries but no sessions', () => {
    const state = makeState({
      techniqueProgress: {
        'mul-by-11': makeTechniqueProgress([]),
      },
    })
    // entries with no sessions are excluded from avgAccuracy calculation
    expect(selectGlobalStats(state)).toEqual({ maxSpeed: 0, avgAccuracy: 0, breadthPct: 0 })
  })

  it('maxSpeed is the highest bestSpeedPerMin across all techniques', () => {
    const state = makeState({
      techniqueProgress: {
        'mul-by-11': { ...makeTechniqueProgress([{ accuracyPct: 80, speedPerMin: 3 }]), bestSpeedPerMin: 3 },
        'mul-by-9':  { ...makeTechniqueProgress([{ accuracyPct: 80, speedPerMin: 10 }]), bestSpeedPerMin: 10 },
        'add-left-to-right': { ...makeTechniqueProgress([{ accuracyPct: 80, speedPerMin: 7 }]), bestSpeedPerMin: 7 },
      },
    })
    expect(selectGlobalStats(state).maxSpeed).toBe(10)
  })

  it('avgAccuracy averages the windowed accuracy across techniques with sessions', () => {
    // Two techniques: one at 80%, one at 60% → avg = 70%
    const state = makeState({
      techniqueProgress: {
        'mul-by-11': makeTechniqueProgress([{ accuracyPct: 80 }]),
        'mul-by-9':  makeTechniqueProgress([{ accuracyPct: 60 }]),
      },
    })
    expect(selectGlobalStats(state).avgAccuracy).toBe(70)
  })

  it('breadthPct reflects the fraction of all curriculum techniques with ≥1 mastery star', () => {
    // Only one technique has a star; breadth = 1 / totalTechniques * 100
    const state = makeState({
      techniqueProgress: {
        'mul-by-11': {
          ...makeTechniqueProgress([{ accuracyPct: 95 }]),
          stars: { speed: true, accuracy: false, range: false },
        },
        'mul-by-9': {
          ...makeTechniqueProgress([{ accuracyPct: 50 }]),
          stars: { speed: false, accuracy: false, range: false },
        },
      },
    })
    const stats = selectGlobalStats(state)
    // Curriculum has 25 techniques; 1 has a star → 1/25 = 4%
    expect(stats.breadthPct).toBeCloseTo(4, 0)
  })
})

// ── selectWeakTechniques ──────────────────────────────────────────────────────

describe('selectWeakTechniques', () => {
  it('returns empty array when no techniques have sessions', () => {
    const state = makeState()
    expect(selectWeakTechniques(state)).toEqual([])
  })

  it('returns techniques sorted by lowest average accuracy', () => {
    const state = makeState({
      techniqueProgress: {
        'mul-by-11':        makeTechniqueProgress([{ accuracyPct: 90 }]),
        'add-left-to-right': makeTechniqueProgress([{ accuracyPct: 40 }]),
        'sub-complement-10': makeTechniqueProgress([{ accuracyPct: 60 }]),
      },
    })
    const weak = selectWeakTechniques(state)
    expect(weak[0]).toBe('add-left-to-right') // lowest
    expect(weak[1]).toBe('sub-complement-10')
    expect(weak[2]).toBe('mul-by-11')
  })

  it('caps the result at 3 techniques even with more in progress', () => {
    const state = makeState({
      techniqueProgress: {
        'a': makeTechniqueProgress([{ accuracyPct: 10 }]),
        'b': makeTechniqueProgress([{ accuracyPct: 20 }]),
        'c': makeTechniqueProgress([{ accuracyPct: 30 }]),
        'd': makeTechniqueProgress([{ accuracyPct: 40 }]),
        'e': makeTechniqueProgress([{ accuracyPct: 50 }]),
      },
    })
    expect(selectWeakTechniques(state)).toHaveLength(3)
  })

  it('uses only the last MASTERY_WINDOW sessions for the average', () => {
    // A technique with 4 old bad sessions and 5 recent perfect sessions.
    // After windowing (last 5 = MASTERY_WINDOW), avg should be 100%.
    // Add 3 other techniques with lower accuracy so mul-by-11 stays out of bottom-3.
    const oldBad = Array.from({ length: 4 }, () => ({ accuracyPct: 10 }))
    const recentGood = Array.from({ length: 5 }, () => ({ accuracyPct: 100 }))

    const state = makeState({
      techniqueProgress: {
        'mul-by-11':         makeTechniqueProgress([...oldBad, ...recentGood]),
        'add-left-to-right': makeTechniqueProgress([{ accuracyPct: 50 }]),
        'sub-complement-10': makeTechniqueProgress([{ accuracyPct: 40 }]),
        'div-by-5':          makeTechniqueProgress([{ accuracyPct: 60 }]),
      },
    })
    const weak = selectWeakTechniques(state)
    // mul-by-11 windowed avg = 100%; others are 40%, 50%, 60%
    // bottom-3 = sub-complement-10, add-left-to-right, div-by-5
    expect(weak).not.toContain('mul-by-11')
    expect(weak).toContain('add-left-to-right')
  })

  it('returns single technique when only one has sessions', () => {
    const state = makeState({
      techniqueProgress: {
        'mul-by-11': makeTechniqueProgress([{ accuracyPct: 70 }]),
      },
    })
    expect(selectWeakTechniques(state)).toEqual(['mul-by-11'])
  })
})
