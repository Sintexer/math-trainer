import { Badge, Box, Button, Flex, HStack, Heading, Stack, Text } from '@chakra-ui/react'
import type { MasteryStars, Technique } from '@/shared/types'

export interface ChallengeEntryProps {
  technique: Technique
  stars: MasteryStars
  challengePassed: boolean
  onStart: () => void
  onBack: () => void
}

/**
 * Challenge entry screen — Phase 7.
 *
 * Communicates the exam nature of the upcoming session: pass thresholds are
 * front-and-center and current mastery is visible at a glance.
 */
export function ChallengeEntry({
  technique,
  stars,
  challengePassed,
  onStart,
  onBack,
}: ChallengeEntryProps) {
  const { speedPerMin } = technique.masteryThresholds

  return (
    <Flex direction="column" minH="100dvh" p={{ base: 4, md: 8 }}>
      <Button
        size="sm"
        variant="ghost"
        alignSelf="flex-start"
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
        borderWidth="2px"
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
        borderWidth="2px"
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
          <Star label="Range" filled={stars.range} />
        </HStack>
      </Stack>

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
    </Flex>
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
