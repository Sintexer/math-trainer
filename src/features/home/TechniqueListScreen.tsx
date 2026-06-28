import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Flex, Heading, SimpleGrid, Stack, Text, Box } from '@chakra-ui/react'
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
      <Heading size="xl" mb={1}>
        Math Trainer
      </Heading>
      <Text color="text.muted" mb={8}>
        {totalChallenges} challenges across {topics.length} topics
      </Text>

      <SimpleGrid minChildWidth="180px" gap={4}>
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
        <CustomPracticeCard onClick={() => navigate('/practice/builder')} />
      </SimpleGrid>
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

function CustomPracticeCard({ onClick }: { onClick: () => void }) {
  return (
    <Stack
      gap={2}
      p={5}
      minH="130px"
      borderRadius="xl"
      borderWidth="2px"
      borderStyle="dashed"
      borderColor="border.subtle"
      bg="bg.card"
      cursor="pointer"
      _hover={{ bg: 'bg.app' }}
      onClick={onClick}
      role="button"
      aria-label="Open custom practice builder"
    >
      <Text fontWeight="bold" fontSize="lg">
        Custom Practice
      </Text>
      <Text fontSize="sm" color="text.muted" flex={1}>
        Build your own session across any topics and techniques
      </Text>
      <Box />
    </Stack>
  )
}

function TopicCard({ topic, passed, total, onClick }: TopicCardProps) {
  const allDone = passed === total && total > 0

  return (
    <Stack
      gap={2}
      p={5}
      minH="130px"
      borderRadius="xl"
      borderWidth="2px"
      borderColor={allDone ? 'green.300' : 'border.subtle'}
      bg={allDone ? 'green.50' : 'bg.card'}
      cursor="pointer"
      _hover={{ bg: allDone ? 'green.100' : 'bg.app' }}
      onClick={onClick}
      role="button"
      aria-label={`Open ${topic.name}`}
    >
      <Text fontWeight="bold" fontSize="lg">
        {topic.name}
      </Text>
      <Text fontSize="sm" color="text.muted" flex={1}>
        {topic.description}
      </Text>
      <Text
        fontSize="sm"
        fontWeight="semibold"
        color={allDone ? 'green.600' : passed > 0 ? 'brand.500' : 'text.muted'}
      >
        {passed}/{total} passed
      </Text>
    </Stack>
  )
}
