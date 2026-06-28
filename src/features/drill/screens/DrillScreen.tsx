import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Box, Button, Heading, Text } from '@chakra-ui/react'
import { findTechnique } from '@/content'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import {
  completeSession,
  selectMasteryStars,
  selectTechniqueProgress,
} from '@/features/progress'
import type { SessionSummary } from '@/features/session'
import { useDrillSession } from '../useDrillSession'
import { DrillInSession } from './DrillInSession'
import { DrillReport } from './DrillReport'

/**
 * DrillScreen — Phase 6 vertical slice.
 *
 * Single React route component that orchestrates the three Drill sub-screens
 * (entry → in-session → report) by reading the local session reducer's
 * status. On session completion, the summary is persisted to the Redux
 * progress slice exactly once.
 */
export default function DrillScreen() {
  const { techniqueId = '' } = useParams<{ techniqueId: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const technique = useMemo(() => findTechnique(techniqueId), [techniqueId])

  const liveStars = useAppSelector((s) => selectMasteryStars(s, techniqueId))
  const techniqueProgress = useAppSelector((s) =>
    selectTechniqueProgress(s, techniqueId),
  )

  // Snapshot the user's stars at the moment they tap "Start Drill" so the
  // report screen can highlight stars EARNED during this session vs. the
  // ones they already had. Captured as state (not a ref) because the
  // report renders it during render and refs are read-during-render
  // forbidden by the project's lint rules.
  const [starsBefore, setStarsBefore] = useState(liveStars)

  // Tracks which summary id has already been persisted so the completion
  // effect dispatches completeSession exactly once per session.
  const persistedSummaryIdRef = useRef<string | null>(null)

  const { state, currentProblem, start, submitAnswer, advance, reset } =
    useDrillSession({ techniqueId })

  // Auto-start the drill the moment the technique is known and we're idle.
  // This skips the DrillEntry screen so the user goes straight into practice.
  useEffect(() => {
    if (technique && state.status === 'idle') start()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [technique])

  useEffect(() => {
    if (state.status !== 'complete' || !state.summary || !technique) return
    if (persistedSummaryIdRef.current === state.summary.id) return
    persistedSummaryIdRef.current = state.summary.id
    dispatch(
      completeSession({
        summary: state.summary,
        thresholds: technique.masteryThresholds,
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

  // ── Idle (auto-starting) ────────────────────────────────────────────
  if (state.status === 'idle') return null

  // ── Report ─────────────────────────────────────────────────────────
  if (state.status === 'complete' && state.summary) {
    const summaryWithXp = readPersistedSummary(
      techniqueProgress?.sessions ?? [],
      state.summary,
    )
    return (
      <DrillReport
        technique={technique}
        summary={summaryWithXp ?? state.summary}
        starsAfter={liveStars}
        starsBefore={starsBefore}
        xpEarned={summaryWithXp?.xpEarned ?? 0}
        onBackToMap={() => navigate('/')}
        onReview={(id) => navigate(`/challenge/${id}/drill`)}
        onTryAgain={() => {
          setStarsBefore(liveStars)
          persistedSummaryIdRef.current = null
          reset()
          start()
        }}
      />
    )
  }

  // ── In-session ─────────────────────────────────────────────────────
  if (!currentProblem) return null
  const lastAnswer =
    state.status === 'evaluating' ? state.answers[state.answers.length - 1] : null

  return (
    <DrillInSession
      problem={currentProblem}
      attempted={state.answers.length}
      totalProblems={state.problems.length}
      evaluating={state.status === 'evaluating'}
      lastAnswerCorrect={lastAnswer?.correct ?? null}
      lastCorrectAnswer={lastAnswer?.problem.answer ?? null}
      onSubmit={submitAnswer}
      onAdvance={advance}
      onExit={() => navigate(-1)}
    />
  )
}

/**
 * Look up the just-persisted summary in the progress slice to retrieve the
 * XP that the slice computed. We match on the session id which is stable.
 */
function readPersistedSummary(
  sessions: readonly SessionSummary[],
  draft: SessionSummary,
): SessionSummary | null {
  for (let i = sessions.length - 1; i >= 0; i--) {
    if (sessions[i].id === draft.id) return sessions[i]
  }
  return null
}
