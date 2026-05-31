/**
 * Phase 3 — Session Engine Tests
 *
 * All timestamps are injected (no Date.now()), making every test deterministic.
 * Problems are hand-crafted (not generated) so answers are predictable.
 */

import { describe, it, expect } from 'vitest'
import {
  sessionReducer,
  createIdleState,
  applyActions,
  detectWeakTechniques,
  computeXp,
} from './index'
import type { SessionState, SessionAction, AnsweredProblem, SessionConfig } from './index'
import type { Problem } from '@/shared/types'

// ── Test fixtures ─────────────────────────────────────────────────────────────

function makeProblem(overrides: Partial<Problem> = {}): Problem {
  return {
    id: `p-${Math.random()}`,
    techniqueId: 'mul-by-11',
    topicId: 'multiplication',
    difficulty: 'easy',
    prompt: '23 × 11 = ?',
    answer: 253,
    ...overrides,
  }
}

function makeProblems(count: number, overrides: Partial<Problem> = {}): Problem[] {
  return Array.from({ length: count }, (_, i) =>
    makeProblem({ id: `p-${i}`, ...overrides }),
  )
}

const DRILL_CONFIG: SessionConfig = {
  type: 'drill',
  techniqueId: 'mul-by-11',
  problemCount: 5,
}

const CHALLENGE_CONFIG: SessionConfig = {
  type: 'challenge',
  techniqueId: 'mul-by-11',
  durationSeconds: 60,
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Run a full drill session: start → answer all problems (correct by default) → advance each.
 */
function runDrill(
  problems: Problem[],
  config: SessionConfig = DRILL_CONFIG,
  answerFn: (p: Problem, i: number) => number = (p) => p.answer,
  baseTime = 1000,
): SessionState {
  const actions: SessionAction[] = [
    { type: 'start', config, problems, now: baseTime },
  ]

  for (let i = 0; i < problems.length; i++) {
    actions.push({ type: 'submitAnswer', answer: answerFn(problems[i], i), now: baseTime + (i + 1) * 2000 })
    actions.push({ type: 'advance', now: baseTime + (i + 1) * 2000 + 500 })
  }

  return applyActions(actions)
}

// ── XP formula ────────────────────────────────────────────────────────────────

describe('computeXp', () => {
  it('base: correct × 10', () => {
    expect(computeXp({ correct: 5, accuracyPct: 50, speedPerMin: 0, isFirstSession: false })).toBe(50)
  })

  it('accuracy bonus: +25 at ≥80%, +50 at ≥95%', () => {
    expect(computeXp({ correct: 5, accuracyPct: 80,  speedPerMin: 0, isFirstSession: false })).toBe(75)
    expect(computeXp({ correct: 5, accuracyPct: 94,  speedPerMin: 0, isFirstSession: false })).toBe(75)
    expect(computeXp({ correct: 5, accuracyPct: 95,  speedPerMin: 0, isFirstSession: false })).toBe(100)
    expect(computeXp({ correct: 5, accuracyPct: 100, speedPerMin: 0, isFirstSession: false })).toBe(100)
  })

  it('no accuracy bonus below 80%', () => {
    expect(computeXp({ correct: 5, accuracyPct: 79, speedPerMin: 0, isFirstSession: false })).toBe(50)
  })

  it('speed bonus: +10 at ≥5/min, +20 at ≥8/min', () => {
    expect(computeXp({ correct: 5, accuracyPct: 50, speedPerMin: 5, isFirstSession: false })).toBe(60)
    expect(computeXp({ correct: 5, accuracyPct: 50, speedPerMin: 7, isFirstSession: false })).toBe(60)
    expect(computeXp({ correct: 5, accuracyPct: 50, speedPerMin: 8, isFirstSession: false })).toBe(70)
    expect(computeXp({ correct: 5, accuracyPct: 50, speedPerMin: 20, isFirstSession: false })).toBe(70)
  })

  it('no speed bonus below 5/min', () => {
    expect(computeXp({ correct: 5, accuracyPct: 50, speedPerMin: 4, isFirstSession: false })).toBe(50)
  })

  it('first-session bonus: +100', () => {
    expect(computeXp({ correct: 5, accuracyPct: 50, speedPerMin: 0, isFirstSession: true })).toBe(150)
  })

  it('all bonuses stack', () => {
    // 50 base + 50 accuracy + 20 speed + 100 first = 220
    expect(computeXp({ correct: 5, accuracyPct: 95, speedPerMin: 8, isFirstSession: true })).toBe(220)
  })

  it('zero correct → zero base (bonuses still apply)', () => {
    expect(computeXp({ correct: 0, accuracyPct: 0, speedPerMin: 0, isFirstSession: false })).toBe(0)
  })
})

// ── State machine — start ─────────────────────────────────────────────────────

describe('start action', () => {
  it('transitions idle → running', () => {
    const state = sessionReducer(createIdleState(), {
      type: 'start',
      config: DRILL_CONFIG,
      problems: makeProblems(5),
      now: 1000,
    })
    expect(state.status).toBe('running')
  })

  it('stores the problem list', () => {
    const problems = makeProblems(5)
    const state = sessionReducer(createIdleState(), {
      type: 'start',
      config: DRILL_CONFIG,
      problems,
      now: 1000,
    })
    expect(state.problems).toHaveLength(5)
    expect(state.currentIndex).toBe(0)
  })

  it('sets timeRemainingMs = -1 for drill', () => {
    const state = sessionReducer(createIdleState(), {
      type: 'start',
      config: DRILL_CONFIG,
      problems: makeProblems(5),
      now: 1000,
    })
    expect(state.timeRemainingMs).toBe(-1)
  })

  it('sets timeRemainingMs from durationSeconds for challenge', () => {
    const state = sessionReducer(createIdleState(), {
      type: 'start',
      config: CHALLENGE_CONFIG,
      problems: makeProblems(50),
      now: 1000,
    })
    expect(state.timeRemainingMs).toBe(60_000)
  })

  it('defaults challenge duration to 60s when not provided', () => {
    const state = sessionReducer(createIdleState(), {
      type: 'start',
      config: { type: 'challenge', techniqueId: 'mul-by-11' },
      problems: makeProblems(50),
      now: 1000,
    })
    expect(state.timeRemainingMs).toBe(60_000)
  })

  it('ignores start when already running', () => {
    const first = sessionReducer(createIdleState(), {
      type: 'start',
      config: DRILL_CONFIG,
      problems: makeProblems(5),
      now: 1000,
    })
    const second = sessionReducer(first, {
      type: 'start',
      config: DRILL_CONFIG,
      problems: makeProblems(10),
      now: 2000,
    })
    // Still has original problem count
    expect(second.problems).toHaveLength(5)
  })

  it('throws when started with an empty problem list', () => {
    expect(() =>
      sessionReducer(createIdleState(), {
        type: 'start',
        config: DRILL_CONFIG,
        problems: [],
        now: 1000,
      }),
    ).toThrow()
  })
})

// ── State machine — submitAnswer ──────────────────────────────────────────────

describe('submitAnswer action', () => {
  it('transitions running → evaluating', () => {
    const started = sessionReducer(createIdleState(), {
      type: 'start',
      config: DRILL_CONFIG,
      problems: makeProblems(5),
      now: 1000,
    })
    const answered = sessionReducer(started, {
      type: 'submitAnswer',
      answer: 253,
      now: 3000,
    })
    expect(answered.status).toBe('evaluating')
  })

  it('records the answered problem with timeMs', () => {
    const problems = makeProblems(5)
    const started = sessionReducer(createIdleState(), {
      type: 'start',
      config: DRILL_CONFIG,
      problems,
      now: 1000,
    })
    const answered = sessionReducer(started, {
      type: 'submitAnswer',
      answer: 253,
      now: 3000, // 2000ms after start
    })
    expect(answered.answers).toHaveLength(1)
    expect(answered.answers[0].timeMs).toBe(2000)
    expect(answered.answers[0].correct).toBe(true)
    expect(answered.answers[0].userAnswer).toBe(253)
  })

  it('marks answer as incorrect when wrong', () => {
    const started = sessionReducer(createIdleState(), {
      type: 'start',
      config: DRILL_CONFIG,
      problems: makeProblems(5),
      now: 1000,
    })
    const answered = sessionReducer(started, {
      type: 'submitAnswer',
      answer: 999,
      now: 2000,
    })
    expect(answered.answers[0].correct).toBe(false)
  })

  it('is a no-op if status is not running', () => {
    const state = createIdleState()
    const after = sessionReducer(state, { type: 'submitAnswer', answer: 1, now: 1000 })
    expect(after).toBe(state) // exact same reference
  })
})

// ── State machine — streak ────────────────────────────────────────────────────

describe('streak tracking', () => {
  it('increments streak on correct answers', () => {
    const problems = makeProblems(3) // all answer = 253
    const state = applyActions([
      { type: 'start', config: DRILL_CONFIG, problems, now: 0 },
      { type: 'submitAnswer', answer: 253, now: 1000 },
      { type: 'advance', now: 1500 },
      { type: 'submitAnswer', answer: 253, now: 2500 },
      { type: 'advance', now: 3000 },
      { type: 'submitAnswer', answer: 253, now: 4000 },
    ])
    expect(state.streak).toBe(3)
  })

  it('resets streak to 0 on a wrong answer', () => {
    const problems = makeProblems(3)
    const state = applyActions([
      { type: 'start', config: DRILL_CONFIG, problems, now: 0 },
      { type: 'submitAnswer', answer: 253, now: 1000 }, // correct, streak = 1
      { type: 'advance', now: 1500 },
      { type: 'submitAnswer', answer: 999, now: 2500 }, // wrong, streak = 0
    ])
    expect(state.streak).toBe(0)
  })

  it('resumes streak after wrong answer then correct', () => {
    const problems = makeProblems(3)
    const state = applyActions([
      { type: 'start', config: DRILL_CONFIG, problems, now: 0 },
      { type: 'submitAnswer', answer: 999, now: 1000 }, // wrong, streak = 0
      { type: 'advance', now: 1500 },
      { type: 'submitAnswer', answer: 253, now: 2500 }, // correct, streak = 1
      { type: 'advance', now: 3000 },
      { type: 'submitAnswer', answer: 253, now: 4000 }, // correct, streak = 2
    ])
    expect(state.streak).toBe(2)
  })
})

// ── Drill mode — full flow ────────────────────────────────────────────────────

describe('drill mode — full session', () => {
  it('completes after all problems answered and advanced', () => {
    const final = runDrill(makeProblems(5))
    expect(final.status).toBe('complete')
  })

  it('summary has correct counts when all correct', () => {
    const final = runDrill(makeProblems(5))
    expect(final.summary).not.toBeNull()
    expect(final.summary!.correct).toBe(5)
    expect(final.summary!.attempted).toBe(5)
    expect(final.summary!.accuracyPct).toBe(100)
  })

  it('summary has correct counts with mixed answers', () => {
    const problems = makeProblems(5)
    // Answer wrong on problems 1 and 3 (0-indexed)
    const final = runDrill(problems, DRILL_CONFIG, (p, i) => (i === 1 || i === 3 ? 0 : p.answer))
    expect(final.summary!.correct).toBe(3)
    expect(final.summary!.attempted).toBe(5)
    expect(final.summary!.accuracyPct).toBe(60)
  })

  it('summary.type is drill', () => {
    const final = runDrill(makeProblems(5))
    expect(final.summary!.type).toBe('drill')
  })

  it('summary.xpEarned is left at 0 — XP is computed by the progress slice on persistence', () => {
    const final = runDrill(makeProblems(5))
    expect(final.summary!.xpEarned).toBe(0)
  })

  it('no problems remain unanswered after complete', () => {
    const final = runDrill(makeProblems(15, {}))
    expect(final.summary!.attempted).toBe(15)
  })

  it('does not complete mid-session (status = running before last advance)', () => {
    const problems = makeProblems(3)
    const state = applyActions([
      { type: 'start', config: { ...DRILL_CONFIG, problemCount: 3 }, problems, now: 0 },
      { type: 'submitAnswer', answer: 253, now: 1000 },
      { type: 'advance', now: 1500 }, // problem 2
      { type: 'submitAnswer', answer: 253, now: 2500 },
      // NOT advanced yet — should be evaluating, not complete
    ])
    expect(state.status).toBe('evaluating')
  })
})

// ── Challenge mode — timer ─────────────────────────────────────────────────────

describe('challenge mode — timer', () => {
  it('timeRemainingMs decrements on tick', () => {
    const state = applyActions([
      { type: 'start', config: CHALLENGE_CONFIG, problems: makeProblems(50), now: 0 },
      { type: 'tick', elapsedMs: 1000 },
    ])
    expect(state.timeRemainingMs).toBe(59_000)
  })

  it('completes when timer reaches 0', () => {
    const actions: SessionAction[] = [
      { type: 'start', config: CHALLENGE_CONFIG, problems: makeProblems(50), now: 0 },
    ]
    // 60 ticks of 1000ms = 60 seconds
    for (let i = 0; i < 60; i++) {
      actions.push({ type: 'tick', elapsedMs: 1000 })
    }
    const final = applyActions(actions)
    expect(final.status).toBe('complete')
    expect(final.timeRemainingMs).toBe(0)
  })

  it('summary is built on timer expiry', () => {
    const actions: SessionAction[] = [
      { type: 'start', config: CHALLENGE_CONFIG, problems: makeProblems(50), now: 0 },
      { type: 'submitAnswer', answer: 253, now: 2000 },
      { type: 'advance', now: 2500 },
      { type: 'submitAnswer', answer: 253, now: 4000 },
      // Timer fires before user advances second answer
    ]
    for (let i = 0; i < 60; i++) {
      actions.push({ type: 'tick', elapsedMs: 1000 })
    }
    const final = applyActions(actions)
    expect(final.status).toBe('complete')
    expect(final.summary).not.toBeNull()
    // 2 answers submitted (both correct)
    expect(final.summary!.correct).toBe(2)
  })

  it('tick is a no-op for drill sessions', () => {
    const started = sessionReducer(createIdleState(), {
      type: 'start',
      config: DRILL_CONFIG,
      problems: makeProblems(5),
      now: 0,
    })
    const after = sessionReducer(started, { type: 'tick', elapsedMs: 5000 })
    expect(after.timeRemainingMs).toBe(-1) // unchanged
    expect(after.status).toBe('running')
  })

  it('single large tick past zero also completes the session', () => {
    const final = applyActions([
      { type: 'start', config: CHALLENGE_CONFIG, problems: makeProblems(50), now: 0 },
      { type: 'tick', elapsedMs: 999_999 }, // way past 60s
    ])
    expect(final.status).toBe('complete')
    expect(final.timeRemainingMs).toBe(0)
  })
})

// ── Weak technique detection ──────────────────────────────────────────────────

describe('detectWeakTechniques', () => {
  function makeAnswer(techniqueId: string, correct: boolean): AnsweredProblem {
    return {
      problem: makeProblem({ techniqueId }),
      userAnswer: correct ? 253 : 0,
      correct,
      timeMs: 1000,
    }
  }

  it('returns empty array when fewer than 5 answers', () => {
    const answers = [
      makeAnswer('mul-by-11', false),
      makeAnswer('mul-by-11', false),
      makeAnswer('mul-by-9', true),
      makeAnswer('mul-by-9', true),
    ]
    expect(detectWeakTechniques(answers)).toEqual([])
  })

  it('returns the 2 lowest-accuracy techniques', () => {
    const answers = [
      // mul-by-11: 1/4 = 25%
      makeAnswer('mul-by-11', true),
      makeAnswer('mul-by-11', false),
      makeAnswer('mul-by-11', false),
      makeAnswer('mul-by-11', false),
      // mul-by-9: 3/4 = 75%
      makeAnswer('mul-by-9', true),
      makeAnswer('mul-by-9', true),
      makeAnswer('mul-by-9', true),
      makeAnswer('mul-by-9', false),
      // mul-by-5: 4/4 = 100%
      makeAnswer('mul-by-5', true),
      makeAnswer('mul-by-5', true),
      makeAnswer('mul-by-5', true),
      makeAnswer('mul-by-5', true),
    ]
    const weak = detectWeakTechniques(answers)
    expect(weak).toHaveLength(2)
    expect(weak[0]).toBe('mul-by-11') // worst
    expect(weak[1]).toBe('mul-by-9')  // second worst
  })

  it('returns at most 2 techniques', () => {
    // 5 techniques, all with some failures
    const answers: AnsweredProblem[] = []
    for (const id of ['a', 'b', 'c', 'd', 'e']) {
      answers.push(makeAnswer(id, false))
      answers.push(makeAnswer(id, true))
    }
    expect(detectWeakTechniques(answers)).toHaveLength(2)
  })

  it('handles a single technique session (returns at most 1)', () => {
    const answers = Array.from({ length: 10 }, (_, i) =>
      makeAnswer('mul-by-11', i % 2 === 0),
    )
    const weak = detectWeakTechniques(answers)
    expect(weak.length).toBeLessThanOrEqual(2)
    expect(weak[0]).toBe('mul-by-11')
  })
})

// ── Summary — techniqueBreakdown and difficultiesAttempted ────────────────────

describe('buildSummary — breakdown fields', () => {
  it('techniqueBreakdown tracks per-technique correct/attempted', () => {
    const problems = [
      makeProblem({ id: 'p1', techniqueId: 'mul-by-11', answer: 253 }),
      makeProblem({ id: 'p2', techniqueId: 'mul-by-9', answer: 333 }),
      makeProblem({ id: 'p3', techniqueId: 'mul-by-11', answer: 253 }),
    ]
    // Answer p1 correct, p2 wrong, p3 correct
    const final = runDrill(
      problems,
      { ...DRILL_CONFIG, problemCount: 3 },
      (p) => (p.techniqueId === 'mul-by-9' ? 0 : p.answer),
    )
    const bd = final.summary!.techniqueBreakdown
    expect(bd['mul-by-11'].correct).toBe(2)
    expect(bd['mul-by-11'].attempted).toBe(2)
    expect(bd['mul-by-9'].correct).toBe(0)
    expect(bd['mul-by-9'].attempted).toBe(1)
  })

  it('difficultiesAttempted includes only difficulties with correct answers', () => {
    const problems = [
      makeProblem({ id: 'p1', difficulty: 'easy', answer: 253 }),
      makeProblem({ id: 'p2', difficulty: 'medium', answer: 253 }),
      makeProblem({ id: 'p3', difficulty: 'hard', answer: 253 }),
    ]
    const final = runDrill(
      problems,
      { ...DRILL_CONFIG, problemCount: 3 },
      // Answer easy correctly, but medium and hard incorrectly
      (p) => (p.difficulty === 'easy' ? p.answer : 0),
    )
    expect(final.summary!.difficultiesAttempted).toContain('easy')
    expect(final.summary!.difficultiesAttempted).not.toContain('medium')
    expect(final.summary!.difficultiesAttempted).not.toContain('hard')
  })
})

// ── speedPerMin calculation ───────────────────────────────────────────────────

describe('summary.speedPerMin', () => {
  it('drill: computed from total answer time', () => {
    // 5 correct answers, each taking 2000ms → total 10000ms = 1/6 min
    // speedPerMin = 5 / (10000 / 60000) = 5 × 6 = 30
    const problems = makeProblems(5)
    const actions: SessionAction[] = [
      { type: 'start', config: DRILL_CONFIG, problems, now: 0 },
    ]
    for (let i = 0; i < 5; i++) {
      // Use the same now for submit and advance so problemStartedAt for the
      // next problem equals the submit time, giving exactly 2000ms per problem.
      const t = (i + 1) * 2000
      actions.push({ type: 'submitAnswer', answer: 253, now: t })
      actions.push({ type: 'advance', now: t })
    }
    const final = applyActions(actions)
    expect(final.summary!.speedPerMin).toBe(30)
  })

  it('challenge: computed against full session duration', () => {
    // answer 3 correct in a 60s challenge → speedPerMin = 3
    const actions: SessionAction[] = [
      { type: 'start', config: CHALLENGE_CONFIG, problems: makeProblems(50), now: 0 },
      { type: 'submitAnswer', answer: 253, now: 5000 },
      { type: 'advance', now: 5500 },
      { type: 'submitAnswer', answer: 253, now: 10000 },
      { type: 'advance', now: 10500 },
      { type: 'submitAnswer', answer: 253, now: 15000 },
      { type: 'advance', now: 15500 },
    ]
    for (let i = 0; i < 60; i++) {
      actions.push({ type: 'tick', elapsedMs: 1000 })
    }
    const final = applyActions(actions)
    expect(final.summary!.correct).toBe(3)
    expect(final.summary!.speedPerMin).toBe(3)
  })
})
