import { useEffect, useMemo, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Box, Button, Heading, Text } from '@chakra-ui/react'
import { findLearningTopic, findTechnique } from '@/content'
import { useAppDispatch } from '@/app/hooks'
import { completeSession } from '@/features/progress'
import { useDrillSession } from '@/features/drill'
import { DrillInSession } from '@/features/drill/screens/DrillInSession'
import type { SessionSummary } from '@/features/session'
import { TopicChallengeReport } from './TopicChallengeReport'

const TOPIC_CHALLENGE_PROBLEM_COUNT = 30

export default function TopicChallengeScreen() {
  const { topicId = '' } = useParams<{ topicId: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const topic = useMemo(() => findLearningTopic(topicId), [topicId])
  const techniqueIds = useMemo(() => topic?.techniqueIds as string[] | undefined, [topic])

  const persistedSummaryIdRef = useRef<string | null>(null)

  const { state, currentProblem, start, submitAnswer, advance, reset } = useDrillSession({
    // Use first technique as sentinel for session config ID; actual problems are mixed.
    techniqueId: techniqueIds?.[0] ?? topicId,
    techniqueIds,
    problemCount: TOPIC_CHALLENGE_PROBLEM_COUNT,
  })

  useEffect(() => {
    if (topic && state.status === 'idle') start()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic])

  // Persist with first technique's thresholds for XP calculation.
  useEffect(() => {
    if (state.status !== 'complete' || !state.summary || !techniqueIds?.[0]) return
    if (persistedSummaryIdRef.current === state.summary.id) return
    persistedSummaryIdRef.current = state.summary.id
    const firstTechnique = findTechnique(techniqueIds[0])
    if (!firstTechnique) return
    dispatch(
      completeSession({
        summary: state.summary,
        thresholds: firstTechnique.masteryThresholds,
      }),
    )
  }, [state.status, state.summary, techniqueIds, dispatch])

  if (!topic) {
    return (
      <Box p={8}>
        <Heading size="lg">Unknown topic</Heading>
        <Text mt={2} color="text.muted">
          No topic with id <code>{topicId}</code>.
        </Text>
        <Button mt={4} onClick={() => navigate('/')}>
          Back to map
        </Button>
      </Box>
    )
  }

  if (state.status === 'idle') return null

  if (state.status === 'complete' && state.summary) {
    return (
      <TopicChallengeReport
        topicName={topic.name}
        summary={state.summary}
        onTryAgain={() => {
          persistedSummaryIdRef.current = null
          reset()
          start()
        }}
        onBack={() => navigate(`/topic/${topicId}`)}
      />
    )
  }

  if (!currentProblem) return null

  const lastAnswer =
    state.status === 'evaluating' ? state.answers[state.answers.length - 1] : null

  // Reuse DrillInSession — identical UI, different problem mix.
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
      onExit={() => navigate(`/topic/${topicId}`)}
    />
  )
}

// Re-export for router — avoids extra barrel indirection.
export type { SessionSummary }
