import { useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Box, Button, Heading } from '@chakra-ui/react'
import { useDrillSession } from '@/features/drill'
import { DrillInSession } from '@/features/drill/screens/DrillInSession'
import { useFlashSession } from '@/features/flash'
import { FlashInSession } from '@/features/flash/screens/FlashInSession'
import { FlashReport } from '@/features/flash/screens/FlashReport'
import { DrillReport } from '@/features/drill/screens/DrillReport'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { completeSession, selectMasteryStars, selectTechniqueProgress } from '@/features/progress'
import { findTechnique } from '@/content'
import { useRef, useState } from 'react'
import type { SessionSummary } from '@/features/session'
import { computeCardsPerMin } from '@/features/flash'

type Mode = 'drill' | 'flash' | 'challenge'

export default function CustomSessionScreen() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const techniquesParam = searchParams.get('techniques') ?? ''
  const mode = (searchParams.get('mode') ?? 'drill') as Mode
  const configCount = searchParams.get('count')
  const techniqueIds = useMemo(
    () => techniquesParam.split(',').filter(Boolean),
    [techniquesParam],
  )

  const problemCount = configCount ? parseInt(configCount, 10) : 20
  // Use first technique as sentinel for progress tracking
  const primaryTechniqueId = techniqueIds[0] ?? ''
  const primaryTechnique = useMemo(() => findTechnique(primaryTechniqueId), [primaryTechniqueId])

  const liveStars = useAppSelector((s) => selectMasteryStars(s, primaryTechniqueId))
  const techniqueProgress = useAppSelector((s) => selectTechniqueProgress(s, primaryTechniqueId))
  const [starsBefore] = useState(liveStars)
  const persistedSummaryIdRef = useRef<string | null>(null)

  if (techniqueIds.length === 0) {
    return (
      <Box p={8}>
        <Heading size="lg">No techniques selected</Heading>
        <Button mt={4} onClick={() => navigate('/practice/builder')}>
          Back to Builder
        </Button>
      </Box>
    )
  }

  if (mode === 'flash') {
    return (
      <CustomFlashSession
        techniqueIds={techniqueIds}
        problemCount={problemCount}
        onBack={() => navigate('/practice/builder')}
      />
    )
  }

  // Drill mode (default for multi-technique)
  return (
    <CustomDrillSession
      techniqueIds={techniqueIds}
      primaryTechniqueId={primaryTechniqueId}
      primaryTechnique={primaryTechnique}
      problemCount={problemCount}
      liveStars={liveStars}
      starsBefore={starsBefore}
      techniqueProgress={techniqueProgress}
      persistedSummaryIdRef={persistedSummaryIdRef}
      dispatch={dispatch}
      onBack={() => navigate('/practice/builder')}
    />
  )
}

// ── Drill sub-component ────────────────────────────────────────────────────────

interface CustomDrillSessionProps {
  techniqueIds: string[]
  primaryTechniqueId: string
  primaryTechnique: ReturnType<typeof findTechnique>
  problemCount: number
  liveStars: ReturnType<typeof selectMasteryStars>
  starsBefore: ReturnType<typeof selectMasteryStars>
  techniqueProgress: ReturnType<typeof selectTechniqueProgress>
  persistedSummaryIdRef: React.MutableRefObject<string | null>
  dispatch: ReturnType<typeof useAppDispatch>
  onBack: () => void
}

function CustomDrillSession({
  techniqueIds,
  primaryTechniqueId,
  primaryTechnique,
  problemCount,
  liveStars,
  starsBefore,
  techniqueProgress,
  persistedSummaryIdRef,
  dispatch,
  onBack,
}: CustomDrillSessionProps) {
  const navigate = useNavigate()
  const { state, currentProblem, start, submitAnswer, advance, reset } = useDrillSession({
    techniqueId: primaryTechniqueId,
    techniqueIds,
    problemCount,
  })

  useEffect(() => {
    if (state.status === 'idle') start()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (state.status !== 'complete' || !state.summary || !primaryTechnique) return
    if (persistedSummaryIdRef.current === state.summary.id) return
    persistedSummaryIdRef.current = state.summary.id
    dispatch(completeSession({ summary: state.summary, thresholds: primaryTechnique.masteryThresholds }))
  }, [state.status, state.summary, primaryTechnique, persistedSummaryIdRef, dispatch])

  if (state.status === 'idle') return null

  if (state.status === 'complete' && state.summary) {
    const persisted = readPersistedSummary(techniqueProgress?.sessions ?? [], state.summary)
    return (
      <DrillReport
        technique={primaryTechnique ?? { id: primaryTechniqueId, name: 'Custom Session', topicId: 'addition', description: '', difficulty: 'medium', relatedTechniqueIds: [], masteryThresholds: { speedPerMin: 0 } }}
        summary={persisted ?? state.summary}
        starsAfter={liveStars}
        starsBefore={starsBefore}
        xpEarned={persisted?.xpEarned ?? 0}
        onBackToMap={onBack}
        onReview={(id) => navigate(`/challenge/${id}/drill`)}
        onTryAgain={() => {
          persistedSummaryIdRef.current = null
          reset()
          start()
        }}
      />
    )
  }

  if (!currentProblem) return null
  const lastAnswer = state.status === 'evaluating' ? state.answers[state.answers.length - 1] : null

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
      onExit={onBack}
    />
  )
}

// ── Flash sub-component ────────────────────────────────────────────────────────

function CustomFlashSession({
  techniqueIds,
  problemCount,
  onBack,
}: {
  techniqueIds: string[]
  problemCount: number
  onBack: () => void
}) {
  // Flash doesn't support multi-technique in useFlashSession directly,
  // so we use the first technique + mix problems via the techniqueIds list.
  // For now use the first technique and round-robin mixing happens in generateMixedProblems.
  // A future enhancement would be to extend useFlashSession with techniqueIds.
  const primaryId = techniqueIds[0]
  const { state, finalElapsedMs, start, advance, reset } = useFlashSession({
    techniqueId: primaryId,
    problemCount,
  })

  useEffect(() => {
    if (state.status === 'idle') start()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (state.status === 'idle') return null

  if (state.status === 'complete') {
    const totalCards = state.problems.length
    const cardsPerMin = computeCardsPerMin(state, state.sessionStartedAt + finalElapsedMs)
    return (
      <FlashReport
        totalCards={totalCards}
        cardsPerMin={cardsPerMin}
        totalTimeMs={finalElapsedMs}
        onTryAgain={() => { reset(); start() }}
        onBack={onBack}
      />
    )
  }

  return (
    <FlashInSession
      problems={state.problems}
      currentIndex={state.currentIndex}
      status={state.status}
      onAdvance={advance}
      onExit={onBack}
    />
  )
}

function readPersistedSummary(sessions: readonly SessionSummary[], draft: SessionSummary): SessionSummary | null {
  for (let i = sessions.length - 1; i >= 0; i--) {
    if (sessions[i].id === draft.id) return sessions[i]
  }
  return null
}
