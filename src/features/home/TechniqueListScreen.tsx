import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Flex, HStack, Heading, Stack, Text } from '@chakra-ui/react'
import { getAllLearningTopics } from '@/content'
import { useAppSelector } from '@/app/hooks'
import { selectAllTechniqueProgress } from '@/features/progress'
import type { LearningTopic } from '@/shared/types'

/**
 * HomeScreen — the app entry point.
 *
 * Shows all learning topics as tappable cards. Each card displays a progress
 * indicator (challenges passed / total) so learners can track progress at a
 * glance before drilling down into a topic hub.
 */
export default function HomeScreen() {
  const navigate = useNavigate()
  const topics = useMemo(() => getAllLearningTopics(), [])
  const allProgress = useAppSelector(selectAllTechniqueProgress)

  const totalChallenges = useMemo(
    () => topics.reduce((sum, t) => sum + t.techniqueIds.length, 0),
    [topics],
  )

  return (
    // pb="24" leaves room above the fixed constellation FAB
    <Flex direction="column" minH="100dvh" p={{ base: 4, md: 8 }} pb={24}>
      <Box maxW="640px" mx="auto" w="full">
        <Heading size="xl" mb={1}>
          Math Trainer
        </Heading>
        <Text color="text.muted" mb={8}>
          {totalChallenges} challenges across {topics.length} topics
        </Text>

        <Stack gap={3}>
          {topics.map((topic) => {
            const passed = topic.techniqueIds.filter(
              (id) => allProgress[id]?.challengePassed ?? false,
            ).length
            return (
              <TopicCard
                key={topic.id}
                topic={topic}
                passed={passed}
                total={topic.techniqueIds.length}
                onClick={() => navigate(`/topic/${topic.id}`)}
              />
            )
          })}
        </Stack>
      </Box>
    </Flex>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

interface TopicCardProps {
  topic: LearningTopic
  passed: number
  total: number
  onClick: () => void
}

function TopicCard({ topic, passed, total, onClick }: TopicCardProps) {
  const allDone = passed === total && total > 0

  return (
    <HStack
      gap={4}
      px={5}
      py={4}
      borderRadius="lg"
      borderWidth="2px"
      borderColor={allDone ? 'green.300' : 'border.subtle'}
      bg={allDone ? 'green.50' : 'bg.card'}
      cursor="pointer"
      _hover={{ bg: allDone ? 'green.100' : 'bg.app' }}
      onClick={onClick}
      role="button"
      aria-label={`Open ${topic.name}`}
    >
      {/* Left: name + description */}
      <Stack gap={0.5} flex={1} minW={0}>
        <Text fontWeight="semibold" lineClamp={1}>
          {topic.name}
        </Text>
        <Text fontSize="sm" color="text.muted" lineClamp={1}>
          {topic.description}
        </Text>
      </Stack>

      {/* Right: progress badge */}
      <Box flexShrink={0} textAlign="right">
        <Text
          fontSize="sm"
          fontWeight="semibold"
          color={allDone ? 'green.600' : passed > 0 ? 'brand.500' : 'text.muted'}
        >
          {passed}/{total}
        </Text>
        <Text fontSize="xs" color="text.muted">
          passed
        </Text>
      </Box>
    </HStack>
  )
}
