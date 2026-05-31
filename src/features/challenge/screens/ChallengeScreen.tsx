import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Box, Button, Heading, Text } from '@chakra-ui/react'
import { findTechnique } from '@/content'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import {
  completeSession,
  selectChallengePassed,
  selectMasteryStars,
  selectTechniqueProgress,
  selectTechniqueRead,
} from '@/features/progress'
import type { SessionSummary } from '@/features/session'
import { useChallengeSession } from '../useChallengeSession'
import { ChallengeEntry } from './ChallengeEntry'
import { ChallengeInSession } from './ChallengeInSession'
import { ChallengeResult } from './ChallengeResult'

/**
 * ChallengeScreen — Phase 7 vertical slice.
 *
 * Mirrors DrillScreen's orchestration but for Challenge mode: entry →
 * timed in-session → pass/fail result. On completion the summary is
 * persisted to the progress slice exactly once with `passed` forwarded so
 * the slice can flip the `challengePassed` flag.
 */
export default function ChallengeScreen() {
  const { techniqueId = '' } = useParams<{ techniqueId: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const technique = useMemo(() => findTechnique(techniqueId), [techniqueId])

  const liveStars = useAppSelector((s) => selectMasteryStars(s, techniqueId))
  const techniqueProgress = useAppSelector((s) =>
    selectTechniqueProgress(s, techniqueId),
  )
  const challengePassed = useAppSelector((s) => selectChallengePassed(s, techniqueId))
  const techniqueRead = useAppSelector((s) => selectTechniqueRead(s, techniqueId))

  // Snapshot challengePassed at session start so the result screen can tell
  // whether THIS run is what flipped the flag (used for the "first time"
  // celebratory banner).
  const [passedBefore, setPassedBefore] = useState(challengePassed)

  const persistedSummaryIdRef = useRef<string | null>(null)

  const {
    state,
    currentProblem,
    timeRemainingMs,
    totalDurationMs,
    start,
    submitAnswer,
    advance,
    reset,
  } = useChallengeSession({ techniqueId })

  useEffect(() => {
    if (state.status !== 'complete' || !state.summary || !technique) return
    if (persistedSummaryIdRef.current === state.summary.id) return
    persistedSummaryIdRef.current = state.summary.id
    dispatch(
      completeSession({
        summary: state.summary,
        thresholds: technique.masteryThresholds,
        passed: state.summary.passed === true,
      }),
    )
  }, [state.status, state.summary, technique, dispatch])

  if (!technique) {
    return (
      <Box p={8}>
        <Heading size="lg">Unknown technique</Heading>
        <Text mt={2} color="text.muted">
          No technique with id <code>{techniqueId}</code>.
        </Text>
        <Button mt={4} onClick={() => navigate('/')}>
          Back to map
        </Button>
      </Box>
    )
  }

  // ── Entry ──────────────────────────────────────────────────────────
  if (state.status === 'idle') {
    const hasDrillHistory = (techniqueProgress?.sessions ?? []).some(
      (s) => s.type === 'drill',
    )
    return (
      <ChallengeEntry
        technique={technique}
        stars={liveStars}
        challengePassed={challengePassed}
        hasDrillHistory={hasDrillHistory}
        techniqueRead={techniqueRead}
        onStart={() => {
          setPassedBefore(challengePassed)
          start()
        }}
        onReadTechnique={() => navigate(`/topic/${technique.id}/technique`)}
        onBack={() => navigate(-1)}
      />
    )
  }

  // ── Result ─────────────────────────────────────────────────────────
  if (state.status === 'complete' && state.summary) {
    const persisted = readPersistedSummary(
      techniqueProgress?.sessions ?? [],
      state.summary,
    )
    const summary = persisted ?? state.summary
    const passed = summary.passed === true
    return (
      <ChallengeResult
        technique={technique}
        summary={summary}
        thresholds={technique.masteryThresholds}
        xpEarned={persisted?.xpEarned ?? 0}
        passed={passed}
        justPassedFirstTime={passed && !passedBefore}
        onBackToMap={() => navigate('/')}
        onTryDrills={() => navigate(`/topic/${techniqueId}/drill`)}
        onTryAgain={() => {
          setPassedBefore(challengePassed)
          persistedSummaryIdRef.current = null
          reset()
        }}
        onReview={(id) => navigate(`/topic/${id}/drill`)}
      />
    )
  }

  // ── In-session ─────────────────────────────────────────────────────
  if (!currentProblem) return null
  const lastAnswer =
    state.status === 'evaluating' ? state.answers[state.answers.length - 1] : null
  const correctCount = state.answers.filter((a) => a.correct).length

  return (
    <ChallengeInSession
      problem={currentProblem}
      attempted={state.answers.length}
      correct={correctCount}
      timeRemainingMs={timeRemainingMs}
      totalDurationMs={totalDurationMs}
      evaluating={state.status === 'evaluating'}
      lastAnswerCorrect={lastAnswer?.correct ?? null}
      lastCorrectAnswer={lastAnswer?.problem.answer ?? null}
      onSubmit={submitAnswer}
      onAdvance={advance}
    />
  )
}

/** Same trick as DrillScreen: look up the persisted summary so we get the
 *  XP that the progress slice computed. */
function readPersistedSummary(
  sessions: readonly SessionSummary[],
  draft: SessionSummary,
): SessionSummary | null {
  for (let i = sessions.length - 1; i >= 0; i--) {
    if (sessions[i].id === draft.id) return sessions[i]
  }
  return null
}
