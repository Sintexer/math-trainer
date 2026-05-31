import { Badge, Box, Button, HStack, Heading, Stack, Text } from '@chakra-ui/react'
import type { MasteryStars, Technique } from '@/shared/types'

export interface ChallengeEntryProps {
  technique: Technique
  stars: MasteryStars
  challengePassed: boolean
  /** Whether the user has any prior drill sessions for this technique. */
  hasDrillHistory: boolean
  onStart: () => void
  onBack: () => void
}

/**
 * Challenge entry screen — Phase 7.
 *
 * Mirrors the DrillEntry structure but communicates the *exam* nature of
 * the upcoming session: pass thresholds are front-and-center, the Start CTA
 * uses the same primary visual but with a sharper label, and we soft-nudge
 * users with no drill history to warm up first (no hard block — see
 * ROADMAP §7.1).
 */
export function ChallengeEntry({
  technique,
  stars,
  challengePassed,
  hasDrillHistory,
  onStart,
  onBack,
}: ChallengeEntryProps) {
  const { speedPerMin, accuracyPct } = technique.masteryThresholds

  return (
    <Box p={{ base: 4, md: 8 }} maxW="640px" mx="auto">
      <Button
        size="sm"
        variant="ghost"
        onClick={onBack}
        mb={4}
        aria-label="Back to topic"
      >
        ← Back
      </Button>

      <Heading size="xl" mb={1}>
        {technique.name}
      </Heading>
      <HStack mb={4} gap={2}>
        <Badge>{technique.topicId}</Badge>
        <Badge colorPalette="purple">{technique.difficulty}</Badge>
        <Badge colorPalette="orange">Challenge</Badge>
      </HStack>
      <Text color="text.muted" mb={6}>
        {technique.description}
      </Text>

      <Stack
        gap={3}
        p={5}
        borderRadius="lg"
        borderWidth="1px"
        borderColor="border.subtle"
        bg="bg.card"
        mb={4}
      >
        <Heading
          size="sm"
          color="text.muted"
          textTransform="uppercase"
          letterSpacing="wider"
        >
          To pass
        </Heading>
        <HStack gap={6} flexWrap="wrap">
          <Threshold label="Speed" value={`≥ ${speedPerMin}/min`} />
          <Threshold label="Accuracy" value={`≥ ${accuracyPct}%`} />
          <Threshold label="Time" value="60 s" />
        </HStack>
        <Text fontSize="sm" color="text.muted">
          {challengePassed
            ? 'You have already passed this challenge. Try again to beat your time.'
            : 'Pass to mark this technique as challenge-cleared.'}
        </Text>
      </Stack>

      <Stack
        gap={2}
        p={5}
        borderRadius="lg"
        borderWidth="1px"
        borderColor="border.subtle"
        bg="bg.card"
        mb={6}
      >
        <Heading
          size="sm"
          color="text.muted"
          textTransform="uppercase"
          letterSpacing="wider"
        >
          Mastery
        </Heading>
        <HStack gap={4}>
          <Star label="Speed" filled={stars.speed} />
          <Star label="Accuracy" filled={stars.accuracy} />
          <Star label="Range" filled={stars.range} />
        </HStack>
      </Stack>

      {!hasDrillHistory && (
        <Box
          mb={4}
          p={3}
          borderRadius="md"
          bg="orange.50"
          borderWidth="1px"
          borderColor="orange.200"
          color="orange.900"
        >
          <Text fontSize="sm">
            Recommended: complete a few Drills first to warm up.
          </Text>
        </Box>
      )}

      <Button
        size="lg"
        w="full"
        onClick={onStart}
        bg="brand.500"
        color="white"
        _hover={{ bg: 'brand.600' }}
        aria-label="Start Challenge"
      >
        Start Challenge
      </Button>
    </Box>
  )
}

function Threshold({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Text
        fontSize="xs"
        color="text.muted"
        textTransform="uppercase"
        letterSpacing="wider"
      >
        {label}
      </Text>
      <Text fontSize="lg" fontWeight="bold">
        {value}
      </Text>
    </Box>
  )
}

function Star({ label, filled }: { label: string; filled: boolean }) {
  return (
    <HStack gap={1}>
      <Text fontSize="lg" aria-hidden="true">
        {filled ? '★' : '☆'}
      </Text>
      <Text fontSize="sm" color={filled ? 'text.primary' : 'text.muted'}>
        {label}
      </Text>
    </HStack>
  )
}
