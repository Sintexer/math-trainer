import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Box, Button, Heading, Text } from '@chakra-ui/react'
import { findTechnique } from '@/content'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import {
  completeSession,
  selectChallengePassed,
  selectTechniqueProgress,
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
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const technique = useMemo(() => findTechnique(techniqueId), [techniqueId])

  const configDuration = searchParams.get('duration')
  const durationSeconds = configDuration ? parseInt(configDuration, 10) : undefined

  const techniqueProgress = useAppSelector((s) =>
    selectTechniqueProgress(s, techniqueId),
  )
  const challengePassed = useAppSelector((s) => selectChallengePassed(s, techniqueId))

  // Snapshot challengePassed at session start so the result screen can tell
  // whether THIS run is what flipped the flag (used for the "first time"
  // celebratory banner).
  const [passedBefore, setPassedBefore] = useState(challengePassed)

  const persistedSummaryIdRef = useRef<string | null>(null)

  const {
    state,
    currentProblem,
    timeRemainingMs,
    start,
    submitAnswer,
    advance,
    reset,
  } = useChallengeSession({ techniqueId, durationSeconds })

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
    return (
      <ChallengeEntry
        technique={technique}
        challengePassed={challengePassed}
        onStart={() => {
          setPassedBefore(challengePassed)
          start()
        }}
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
        onTryDrills={() => navigate(`/challenge/${techniqueId}/drill`)}
        onTryAgain={() => {
          setPassedBefore(challengePassed)
          persistedSummaryIdRef.current = null
          reset()
        }}
        onReview={(id) => navigate(`/challenge/${id}/drill`)}
      />
    )
  }

  // ── In-session ─────────────────────────────────────────────────────
  if (!currentProblem) return null
  const lastAnswer =
    state.status === 'evaluating' ? state.answers[state.answers.length - 1] : null

  return (
    <ChallengeInSession
      problem={currentProblem}
      timeRemainingMs={timeRemainingMs}
      evaluating={state.status === 'evaluating'}
      lastAnswerCorrect={lastAnswer?.correct ?? null}
      lastCorrectAnswer={lastAnswer?.problem.answer ?? null}
      onSubmit={submitAnswer}
      onAdvance={advance}
      onExit={() => {
        persistedSummaryIdRef.current = null
        reset()
      }}
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
