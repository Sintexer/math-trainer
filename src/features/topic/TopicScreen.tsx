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
import { DifficultyBadge } from '@/features/input'
import type { SessionSummary } from '@/features/session'
import type { Technique } from '@/shared/types'

const FLASH_TECHNIQUE_IDS = new Set([
  'add-speed-1d2d',
  'add-speed-2d2d',
  'add-speed-3d',
  'sub-speed-2d1d',
  'sub-speed-2d2d',
  'sub-speed-3d',
  'mul-times-table',
  'mul-perfect-squares',
])

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
        <Flex justify="space-between" align="flex-start" mb={1} gap={3} flexWrap="wrap">
          <Box>
            <Heading size="xl" mb={1}>
              {topic.name}
            </Heading>
            <Text color="text.muted" mb={6}>
              {topic.description}
            </Text>
          </Box>
          <Button
            size="sm"
            variant="outline"
            flexShrink={0}
            onClick={() => navigate(`/topic/${topicId}/challenge`)}
          >
            Topic Test →
          </Button>
        </Flex>

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
                showFlash={FLASH_TECHNIQUE_IDS.has(technique.id)}
                onReadTheory={() => navigate(`/challenge/${technique.id}/theory`)}
                onPractice={() => navigate(`/challenge/${technique.id}/drill`)}
                onFlash={() => navigate(`/challenge/${technique.id}/flash`)}
                onCustom={() => navigate(`/challenge/${technique.id}/config`)}
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
  showTheory: boolean
  showFlash: boolean
  onReadTheory: () => void
  onPractice: () => void
  onFlash: () => void
  onCustom: () => void
  onChallenge: () => void
}

function ChallengeCard({
  technique,
  challengePassed,
  lastDrill,
  showTheory,
  showFlash,
  onReadTheory,
  onPractice,
  onFlash,
  onCustom,
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
      {/* Name + badges — difficulty first */}
      <Stack gap={1}>
        <Text fontWeight="semibold" lineClamp={2} fontSize="sm">
          {technique.name}
        </Text>
        <HStack gap={2} flexWrap="wrap">
          <DifficultyBadge difficulty={technique.difficulty} />
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
        {showFlash && (
          <Button size="sm" variant="outline" w="full" onClick={onFlash}>
            ⚡ Flash
          </Button>
        )}
        <Button size="sm" variant="ghost" w="full" onClick={onCustom} fontSize="xs">
          Custom…
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
