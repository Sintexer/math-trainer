import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  SimpleGrid,
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
      <Flex direction="column" minH="100dvh" p={8}>
        <Text color="text.muted">Topic not found: {topicId}</Text>
        <Button mt={4} onClick={() => navigate('/')}>
          ← Back
        </Button>
      </Flex>
    )
  }

  return (
    <Flex direction="column" minH="100dvh" p={{ base: 4, md: 8 }}>
      <Button
        size="sm"
        variant="ghost"
        alignSelf="flex-start"
        mb={4}
        onClick={() => navigate('/')}
        aria-label="Back to home"
      >
        ← Back
      </Button>
      <Box maxW="800px" mx="auto" w="full">
        <Heading size="xl" mb={1}>
          {topic.name}
        </Heading>
        <Text color="text.muted" mb={6}>
          {topic.description}
        </Text>

        <SimpleGrid minChildWidth="220px" gap={4}>
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
        </SimpleGrid>
      </Box>
    </Flex>
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
      p={4}
      borderRadius="lg"
      borderWidth="2px"
      borderColor={challengePassed ? 'green.300' : 'border.subtle'}
      bg={challengePassed ? 'green.50' : 'bg.card'}
    >
      {/* Name + badges */}
      <Stack gap={1}>
        <Text fontWeight="semibold" lineClamp={2} fontSize="sm">
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
        <Text fontSize="xs" color="text.muted">
          Last: {lastDrill.speedPerMin}/min · {lastDrill.accuracyPct}%
        </Text>
      )}

      {/* Action buttons stacked vertically to fit narrow cells */}
      <Stack gap={2} mt="auto">
        {showTheory && (
          <Button size="sm" variant="outline" w="full" onClick={onReadTheory}>
            Read Theory
          </Button>
        )}
        <Button size="sm" variant="outline" w="full" onClick={onPractice}>
          Practice
        </Button>
        <Button
          size="sm"
          w="full"
          onClick={onChallenge}
          bg="brand.500"
          color="white"
          _hover={{ bg: 'brand.600' }}
        >
          {challengePassed ? 'Retry' : 'Challenge →'}
        </Button>
      </Stack>
    </Stack>
  )
}
