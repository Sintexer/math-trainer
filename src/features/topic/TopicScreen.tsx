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
  'mul-table-2to9',
  'mul-table-10to19',
  'mul-squares-foundation',
  'mul-roots-foundation',
  'mul-roots-practice',
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
        <Box mb={6}>
          <Heading size="xl" mb={1}>
            {topic.name}
          </Heading>
          <Text color="text.muted">
            {topic.description}
          </Text>
        </Box>

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
                onFlash={() => navigate(`/challenge/${technique.id}/flash`)}
                onCustom={() => navigate(`/challenge/${technique.id}/config`)}
                onChallenge={() => navigate(`/challenge/${technique.id}`)}
              />
            )
          })}
          {/* Topic Test card — always at the end */}
          <TopicTestCard onTopicTest={() => navigate(`/topic/${topicId}/challenge`)} />
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
      borderColor={challengePassed ? 'green.200' : 'gray.100'}
      bg={challengePassed ? 'green.50' : 'bg.card'}
      position="relative"
    >
      {/* Theory icon in top-right corner */}
      {showTheory && (
        <Button
          size="sm"
          variant="ghost"
          position="absolute"
          top={2}
          right={2}
          onClick={onReadTheory}
          aria-label="Read theory"
          p={2}
          minW="auto"
          borderRadius="full"
          borderWidth="1px"
          borderColor="gray.100"
        >
          ?
        </Button>
      )}

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

      {/* Action buttons layout */}
      <Stack gap={2} mt="auto">
        {/* First row: Flash and Custom side-by-side */}
        <HStack gap={2} w="full">
          {showFlash && (
            <Button size="sm" variant="outline" flex={1} onClick={onFlash}>
              ⚡ Flash
            </Button>
          )}
          <Button size="sm" variant="outline" flex={1} onClick={onCustom}>
            ⚙ Custom
          </Button>
        </HStack>

        {/* Second row: Challenge button full width */}
        <Button
          size="sm"
          w="full"
          onClick={onChallenge}
          bg="brand.500"
          color="white"
          _hover={{ bg: 'brand.600' }}
        >
          {challengePassed ? 'Retry' : 'Challenge'}
        </Button>
      </Stack>
    </Stack>
  )
}

function TopicTestCard({ onTopicTest }: { onTopicTest: () => void }) {
  return (
    <Stack
      gap={4}
      p={4}
      borderRadius="lg"
      borderWidth="2px"
      borderColor="gray.100"
      bg="bg.card"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
      minH="220px"
    >
      <Text fontSize="lg" fontWeight="bold">
        Topic Test
      </Text>
      <Text fontSize="sm" color="text.muted">
        Test all techniques in this topic at once. Pass to master the entire subject.
      </Text>
      <Button
        size="md"
        mt="auto"
        w="full"
        onClick={onTopicTest}
        bg="brand.500"
        color="white"
        _hover={{ bg: 'brand.600' }}
      >
        Start Test
      </Button>
    </Stack>
  )
}
