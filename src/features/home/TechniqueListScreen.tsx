import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge, Box, HStack, Heading, Stack, Text } from '@chakra-ui/react'
import { getAllTechniques, getAllTopics, getTechniquesByTopic } from '@/content'
import { useAppSelector } from '@/app/hooks'
import { selectAllTechniqueProgress } from '@/features/progress'
import { DEFAULT_MASTERY_STARS } from '@/shared/types'
import type { MasteryStars, Technique } from '@/shared/types'

const DIFFICULTY_PALETTE: Record<string, string> = {
  easy: 'green',
  medium: 'orange',
  hard: 'red',
}

/**
 * TechniqueListScreen — Phase 11.
 *
 * Default home screen showing all 25 techniques grouped by topic.
 * The constellation map is accessible via the fixed GraphMapButton overlay.
 */
export default function TechniqueListScreen() {
  const navigate = useNavigate()
  const topics = useMemo(() => getAllTopics(), [])
  const totalCount = useMemo(() => getAllTechniques().length, [])
  const allProgress = useAppSelector(selectAllTechniqueProgress)

  return (
    // pb="24" leaves room above the fixed constellation FAB
    <Box p={{ base: 4, md: 8 }} maxW="640px" mx="auto" pb={24}>
      <Heading size="xl" mb={1}>
        Math Trainer
      </Heading>
      <Text color="text.muted" mb={8}>
        {totalCount} mental math techniques across {topics.length} topics
      </Text>

      <Stack gap={8}>
        {topics.map((topic) => {
          const techniques = getTechniquesByTopic(topic.id)
          return (
            <Box key={topic.id}>
              <Text
                fontSize="xs"
                fontWeight="semibold"
                textTransform="uppercase"
                letterSpacing="wider"
                color="text.muted"
                mb={2}
              >
                {topic.name}
              </Text>

              {/* Techniques list — single card with dividers between rows */}
              <Box
                borderWidth="1px"
                borderColor="border.subtle"
                borderRadius="lg"
                overflow="hidden"
              >
                {techniques.map((technique, idx) => (
                  <TechniqueRow
                    key={technique.id}
                    technique={technique}
                    stars={allProgress[technique.id]?.stars ?? DEFAULT_MASTERY_STARS}
                    isLast={idx === techniques.length - 1}
                    onClick={() => navigate(`/topic/${technique.id}`)}
                  />
                ))}
              </Box>
            </Box>
          )
        })}
      </Stack>
    </Box>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────────────

interface TechniqueRowProps {
  technique: Technique
  stars: MasteryStars
  isLast: boolean
  onClick: () => void
}

function TechniqueRow({ technique, stars, isLast, onClick }: TechniqueRowProps) {
  return (
    <HStack
      gap={3}
      px={4}
      minH="56px"
      cursor="pointer"
      bg="bg.card"
      borderBottomWidth={isLast ? '0' : '1px'}
      borderColor="border.subtle"
      _hover={{ bg: 'bg.app' }}
      onClick={onClick}
      role="button"
      aria-label={`Open ${technique.name}`}
    >
      {/* Left: name + difficulty */}
      <Box flex={1} py={3}>
        <Text fontWeight="medium" lineClamp={1}>
          {technique.name}
        </Text>
        <Badge colorPalette={DIFFICULTY_PALETTE[technique.difficulty]} size="sm" mt={0.5}>
          {technique.difficulty}
        </Badge>
      </Box>

      {/* Right: 3 mastery star dots */}
      <HStack gap={1} flexShrink={0} aria-label="Mastery stars">
        <StarDot filled={stars.speed} color="star.speed" label="Speed" />
        <StarDot filled={stars.accuracy} color="star.accuracy" label="Accuracy" />
        <StarDot filled={stars.range} color="star.range" label="Range" />
      </HStack>
    </HStack>
  )
}

function StarDot({ filled, color, label }: { filled: boolean; color: string; label: string }) {
  return (
    <Text
      fontSize="sm"
      color={filled ? color : 'text.muted'}
      aria-label={`${label}: ${filled ? 'earned' : 'not earned'}`}
      aria-hidden="false"
    >
      {filled ? '★' : '☆'}
    </Text>
  )
}
