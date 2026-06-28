import { useEffect, useMemo } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Box, Button, Heading, Text } from '@chakra-ui/react'
import type { Difficulty } from '@/shared/types'
import { findTechnique } from '@/content'
import { computeCardsPerMin } from '../flashSessionReducer'
import { useFlashSession } from '../useFlashSession'
import { FlashInSession } from './FlashInSession'
import { FlashReport } from './FlashReport'

export default function FlashScreen() {
  const { techniqueId = '' } = useParams<{ techniqueId: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const technique = useMemo(() => findTechnique(techniqueId), [techniqueId])

  const configCount = searchParams.get('count')
  const configDifficulty = searchParams.get('difficulty') as Difficulty | null
  const problemCount = configCount ? parseInt(configCount, 10) : undefined
  const difficulty = configDifficulty ?? undefined

  const { state, currentProblem, finalElapsedMs, start, advance, reset } =
    useFlashSession({ techniqueId, problemCount, difficulty })

  // Auto-start on mount.
  useEffect(() => {
    if (technique && state.status === 'idle') start()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [technique])

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

  if (state.status === 'idle') return null

  if (state.status === 'complete') {
    const totalCards = state.problems.length
    const cardsPerMin = computeCardsPerMin(state, state.sessionStartedAt + finalElapsedMs)
    return (
      <FlashReport
        totalCards={totalCards}
        cardsPerMin={cardsPerMin}
        totalTimeMs={finalElapsedMs}
        onTryAgain={() => {
          reset()
          start()
        }}
        onBack={() => navigate(-1)}
      />
    )
  }

  if (!currentProblem) return null

  return (
    <FlashInSession
      problems={state.problems}
      currentIndex={state.currentIndex}
      status={state.status}
      onAdvance={advance}
      onExit={() => navigate(-1)}
    />
  )
}
