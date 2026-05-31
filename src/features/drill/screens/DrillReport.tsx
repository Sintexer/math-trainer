import { Box, Button, HStack, Heading, SimpleGrid, Stack, Text } from '@chakra-ui/react'
import type { MasteryStars, Technique } from '@/shared/types'
import type { SessionSummary } from '@/features/session'
import { findTechnique } from '@/content'

export interface DrillReportProps {
  technique: Technique
  summary: SessionSummary
  /** Stars after this session has been persisted. */
  starsAfter: MasteryStars
  /** Stars before this session was persisted (to highlight deltas). */
  starsBefore: MasteryStars
  /** Total XP earned in this session (filled in by the progress slice). */
  xpEarned: number
  onBackToMap: () => void
  onReview: (techniqueId: string) => void
  onTryAgain: () => void
}

export function DrillReport({
  technique,
  summary,
  starsAfter,
  starsBefore,
  xpEarned,
  onBackToMap,
  onReview,
  onTryAgain,
}: DrillReportProps) {
  return (
    <Box p={{ base: 4, md: 8 }} maxW="640px" mx="auto">
      <Heading size="xl" mb={1}>
        Drill complete
      </Heading>
      <Text color="text.muted" mb={6}>
        {technique.name}
      </Text>

      <SimpleGrid columns={{ base: 2, md: 4 }} gap={3} mb={6}>
        <Stat label="Correct" value={`${summary.correct}/${summary.attempted}`} />
        <Stat label="Accuracy" value={`${summary.accuracyPct}%`} />
        <Stat label="Speed" value={`${summary.speedPerMin}/min`} />
        <Stat label="XP" value={`+${xpEarned}`} highlight />
      </SimpleGrid>

      <Stack
        gap={3}
        p={5}
        borderRadius="lg"
        borderWidth="1px"
        borderColor="border.subtle"
        bg="bg.card"
        mb={6}
      >
        <Heading size="sm" color="text.muted" textTransform="uppercase" letterSpacing="wider">
          Mastery
        </Heading>
        <HStack gap={4}>
          <StarRow label="Speed" before={starsBefore.speed} after={starsAfter.speed} />
          <StarRow label="Accuracy" before={starsBefore.accuracy} after={starsAfter.accuracy} />
          <StarRow label="Range" before={starsBefore.range} after={starsAfter.range} />
        </HStack>
      </Stack>

      {summary.weakTechniqueIds.length > 0 && (
        <Stack
          gap={2}
          p={5}
          borderRadius="lg"
          borderWidth="1px"
          borderColor="border.subtle"
          bg="bg.card"
          mb={6}
        >
          <Heading size="sm" color="text.muted" textTransform="uppercase" letterSpacing="wider">
            Focus areas
          </Heading>
          {summary.weakTechniqueIds.map((id) => {
            const tech = findTechnique(id)
            return (
              <HStack key={id} justify="space-between">
                <Text>{tech?.name ?? id}</Text>
                <Button size="sm" variant="outline" onClick={() => onReview(id)}>
                  Review
                </Button>
              </HStack>
            )
          })}
        </Stack>
      )}

      <Stack direction={{ base: 'column', md: 'row' }} gap={3}>
        <Button
          flex={1}
          onClick={onBackToMap}
          variant="outline"
          aria-label="Back to map"
        >
          Back to Map
        </Button>
        <Button
          flex={1}
          onClick={onTryAgain}
          bg="brand.500"
          color="white"
          _hover={{ bg: 'brand.600' }}
        >
          Try Again
        </Button>
      </Stack>
    </Box>
  )
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <Box
      p={4}
      borderRadius="lg"
      borderWidth="1px"
      borderColor="border.subtle"
      bg={highlight ? 'brand.50' : 'bg.card'}
      textAlign="center"
    >
      <Text fontSize="xs" color="text.muted" textTransform="uppercase" letterSpacing="wider">
        {label}
      </Text>
      <Text fontSize="2xl" fontWeight="bold">
        {value}
      </Text>
    </Box>
  )
}

function StarRow({
  label,
  before,
  after,
}: {
  label: string
  before: boolean
  after: boolean
}) {
  const justEarned = !before && after
  return (
    <HStack gap={1} data-just-earned={justEarned ? 'true' : 'false'}>
      <Text fontSize="lg" aria-hidden="true">
        {after ? '★' : '☆'}
      </Text>
      <Text fontSize="sm" color={after ? 'text.primary' : 'text.muted'}>
        {label}
        {justEarned && (
          <Text as="span" ml={1} color="brand.500" fontWeight="bold">
            +1
          </Text>
        )}
      </Text>
    </HStack>
  )
}
