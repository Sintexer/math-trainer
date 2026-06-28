import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Badge,
  Box,
  Button,
  HStack,
  Heading,
  Stack,
  Text,
} from '@chakra-ui/react'
import { findLearningTopic, findTechnique } from '@/content'
import { useAppSelector } from '@/app/hooks'
import { selectAllTechniqueProgress } from '@/features/progress'
import type { SessionSummary } from '@/features/session'
import type { Technique } from '@/shared/types'

const DIFFICULTY_PALETTE: Record<string, string> = {
  easy: 'green',
  medium: 'orange',
  hard: 'red',
}

/**
 * TopicHubScreen — the hub for a single learning topic.
 *
 * Renders one ChallengeCard per technique listed in the topic's `techniqueIds`
 * array. Adding a new technique to a topic's data is the only change needed to
 * make it appear here — no UI code changes required.
 *
 * Architecture note: a "Flash" training mode card will be added to each
 * ChallengeCard once that feature is implemented. The card component is
 * designed to accommodate an additional button row without layout changes.
 */
export default function TopicHubScreen() {
  const { topicId = '' } = useParams<{ topicId: string }>()
  const navigate = useNavigate()

  const topic = useMemo(() => findLearningTopic(topicId), [topicId])

  const allProgress = useAppSelector(selectAllTechniqueProgress)

  const techniques = useMemo(
    () =>
      (topic?.techniqueIds ?? [])
        .map((id) => findTechnique(id))
        .filter((t): t is Technique => t !== undefined),
    [topic],
  )

  if (!topic) {
    return (
      <Box p={8}>
        <Text color="text.muted">Topic not found: {topicId}</Text>
        <Button mt={4} onClick={() => navigate('/')}>
          ← Back
        </Button>
      </Box>
    )
  }

  return (
    <Box p={{ base: 4, md: 8 }} maxW="800px" mx="auto">
      <Button
        size="sm"
        variant="ghost"
        onClick={() => navigate('/')}
        mb={4}
        aria-label="Back to home"
      >
        ← Back
      </Button>

      <Heading size="xl" mb={1}>
        {topic.name}
      </Heading>
      <Text color="text.muted" mb={6}>
        {topic.description}
      </Text>

      <Stack gap={3}>
        {techniques.map((technique) => {
          const progress = allProgress[technique.id]
          const challengePassed = progress?.challengePassed ?? false
          const lastDrill =
            progress?.sessions.filter((s: SessionSummary) => s.type === 'drill').at(-1) ?? null

          return (
            <ChallengeCard
              key={technique.id}
              technique={technique}
              challengePassed={challengePassed}
              lastDrill={lastDrill}
              showTheory={topic.hasTheory ?? true}
              onReadTheory={() => navigate(`/challenge/${technique.id}/theory`)}
              onPractice={() => navigate(`/challenge/${technique.id}/drill`)}
              onChallenge={() => navigate(`/challenge/${technique.id}`)}
            />
          )
        })}
      </Stack>
    </Box>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

interface ChallengeCardProps {
  technique: Technique
  challengePassed: boolean
  lastDrill: SessionSummary | null
  /** When false, the "Read Theory" button is omitted (speed/repetition topics). */
  showTheory: boolean
  onReadTheory: () => void
  onPractice: () => void
  onChallenge: () => void
}

function ChallengeCard({
  technique,
  challengePassed,
  lastDrill,
  showTheory,
  onReadTheory,
  onPractice,
  onChallenge,
}: ChallengeCardProps) {
  return (
    <Stack
      gap={3}
      p={5}
      borderRadius="lg"
      borderWidth="2px"
      borderColor={challengePassed ? 'green.300' : 'border.subtle'}
      bg={challengePassed ? 'green.50' : 'bg.card'}
    >
      {/* Header row */}
      <HStack justify="space-between" align="flex-start" flexWrap="wrap" gap={2}>
        <Stack gap={1} flex={1} minW={0}>
          <Text fontWeight="semibold" lineClamp={1}>
            {technique.name}
          </Text>
          <HStack gap={2} flexWrap="wrap">
            <Badge colorPalette={DIFFICULTY_PALETTE[technique.difficulty]} size="sm">
              {technique.difficulty}
            </Badge>
            {challengePassed && (
              <Badge colorPalette="green" size="sm">
                Passed ✓
              </Badge>
            )}
          </HStack>
        </Stack>
        {lastDrill && (
          <Text fontSize="xs" color="text.muted" flexShrink={0} pt={0.5}>
            Last: {lastDrill.speedPerMin}/min · {lastDrill.accuracyPct}%
          </Text>
        )}
      </HStack>

      {/* Action buttons
          Layout: [Read Theory] [Practice] occupy the left, [Challenge →] on the right.
          On narrow screens all three wrap naturally in the HStack. */}
      <HStack gap={2} flexWrap="wrap">
        {showTheory && (
          <Button
            size="sm"
            variant="outline"
            minH="40px"
            onClick={onReadTheory}
            flexShrink={0}
          >
            Read Theory
          </Button>
        )}
        <Button
          size="sm"
          variant="outline"
          minH="40px"
          onClick={onPractice}
          flexShrink={0}
        >
          Practice
        </Button>
        <Button
          size="sm"
          minH="40px"
          ml="auto"
          onClick={onChallenge}
          bg="brand.500"
          color="white"
          _hover={{ bg: 'brand.600' }}
          flexShrink={0}
        >
          {challengePassed ? 'Retry Challenge' : 'Start Challenge →'}
        </Button>
      </HStack>
    </Stack>
  )
}
