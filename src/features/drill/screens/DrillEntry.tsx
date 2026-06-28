import { Badge, Box, Button, HStack, Heading, Stack, Text } from '@chakra-ui/react'
import type { MasteryStars, Technique } from '@/shared/types'
import type { SessionSummary } from '@/features/session'

export interface DrillEntryProps {
  technique: Technique
  stars: MasteryStars
  /** Most recent drill session for this technique, if any. */
  lastSession: SessionSummary | null
  onStart: () => void
  onBack: () => void
}

export function DrillEntry({
  technique,
  stars,
  lastSession,
  onStart,
  onBack,
}: DrillEntryProps) {
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
        mb={6}
      >
        <Heading size="sm" color="text.muted" textTransform="uppercase" letterSpacing="wider">
          Mastery
        </Heading>
        <HStack gap={4}>
          <Star label="Speed" filled={stars.speed} />
          <Star label="Range" filled={stars.range} />
        </HStack>
        {lastSession && (
          <Text fontSize="sm" color="text.muted">
            Last drill: {lastSession.correct}/{lastSession.attempted} ·{' '}
            {lastSession.accuracyPct}% · {lastSession.speedPerMin}/min
          </Text>
        )}
        {!lastSession && (
          <Text fontSize="sm" color="text.muted">
            No drill attempts yet.
          </Text>
        )}
      </Stack>

      <Button
        size="lg"
        colorPalette="brand"
        w="full"
        onClick={onStart}
        bg="brand.500"
        color="white"
        _hover={{ bg: 'brand.600' }}
      >
        Start Drill
      </Button>
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
