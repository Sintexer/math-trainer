import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { completeDailyChallenge, selectDailyChallengeResult } from '@/features/progress'
import { getTodayDate, getDailyNumber } from '../dailyChallenge'
import { useDailySession } from '../useDailySession'
import { DailyEntry } from './DailyEntry'
import { DailyInSession } from './DailyInSession'
import { DailyResult } from './DailyResult'
import { DailyAlreadyDone } from './DailyAlreadyDone'

export interface DailyScreenProps {
  /**
   * Override the "current date" used for seeding and persistence look-up.
   * Pass a fixed YYYY-MM-DD string in tests to make behaviour deterministic.
   * Defaults to the device's local calendar date at mount time.
   */
  date?: string
}

/**
 * DailyScreen — Phase 12 route component.
 *
 * Orchestrates four states for the daily challenge:
 *   1. already-done  — user completed today's challenge; show prior result
 *   2. idle          — pre-session entry screen
 *   3. running/evaluating — in-session problem view
 *   4. complete      — post-session result card
 *
 * The session is driven by useDailySession (local useReducer, seeded RNG).
 * Persistence is dispatched exactly once via completeDailyChallenge on
 * transition to 'complete'. completeSession is NOT called — daily results
 * live in dailyChallenges, not in techniqueProgress.
 */
export default function DailyScreen({ date: dateProp }: DailyScreenProps = {}) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const today = dateProp ?? getTodayDate()
  const challengeNumber = Math.max(1, getDailyNumber(today))

  // Check for an already-completed result before the session starts.
  const existingResult = useAppSelector((s) => selectDailyChallengeResult(s, today))

  const { state, elapsedMs, finalElapsedMs, currentProblem, start, submitAnswer, advance } =
    useDailySession({ date: today })

  // Persist the result exactly once when the session completes.
  // Uses a ref (not state) so the effect doesn't re-trigger on re-renders.
  const persistedRef = useRef(false)

  useEffect(() => {
    if (state.status !== 'complete' || persistedRef.current) return
    persistedRef.current = true

    const score = state.answers.filter((a) => a.correct).length
    dispatch(
      completeDailyChallenge({
        date: today,
        score,
        attempted: state.answers.length,
        timeSeconds: Math.round(finalElapsedMs / 1000),
        problemResults: state.answers.map((a) => ({
          techniqueId: a.problem.techniqueId,
          correct: a.correct,
        })),
      }),
    )
  }, [state.status, state.answers, today, finalElapsedMs, dispatch])

  // ── 1. Already completed today ────────────────────────────────────────────
  if (existingResult !== null && state.status === 'idle') {
    return (
      <DailyAlreadyDone
        result={existingResult}
        challengeNumber={challengeNumber}
        onBack={() => navigate('/')}
      />
    )
  }

  // ── 2. Entry ──────────────────────────────────────────────────────────────
  if (state.status === 'idle') {
    return (
      <DailyEntry
        challengeNumber={challengeNumber}
        date={today}
        onStart={start}
        onBack={() => navigate('/')}
      />
    )
  }

  // ── 3. In-session ─────────────────────────────────────────────────────────
  if (state.status !== 'complete') {
    if (!currentProblem) return null
    const lastAnswer =
      state.status === 'evaluating' ? state.answers[state.answers.length - 1] : null
    const correctCount = state.answers.filter((a) => a.correct).length

    return (
      <DailyInSession
        problem={currentProblem}
        problemNumber={state.currentIndex + 1}
        attempted={state.answers.length}
        correct={correctCount}
        totalProblems={state.problems.length}
        elapsedMs={elapsedMs}
        evaluating={state.status === 'evaluating'}
        lastAnswerCorrect={lastAnswer?.correct ?? null}
        lastCorrectAnswer={lastAnswer?.problem.answer ?? null}
        onSubmit={submitAnswer}
        onAdvance={advance}
      />
    )
  }

  // ── 4. Result ─────────────────────────────────────────────────────────────
  // Prefer the Redux-persisted result so XP / time are from the authoritative
  // store; fall back to a local derivation if the dispatch hasn't flushed yet.
  const resultToShow = existingResult ?? {
    date: today,
    score: state.answers.filter((a) => a.correct).length,
    attempted: state.answers.length,
    timeSeconds: Math.round(finalElapsedMs / 1000),
    problemResults: state.answers.map((a) => ({
      techniqueId: a.problem.techniqueId,
      correct: a.correct,
    })),
  }

  return (
    <DailyResult
      result={resultToShow}
      challengeNumber={challengeNumber}
      weakTechniqueIds={state.summary?.weakTechniqueIds ?? []}
      onNavigate={(id) => navigate(`/challenge/${id}`)}
      onBack={() => navigate('/')}
    />
  )
}
