import { Badge, Box, Button, Flex, HStack, Heading, Stack, Text } from '@chakra-ui/react'
import { DifficultyBadge } from '@/features/input'
import type { Technique } from '@/shared/types'

export interface ChallengeEntryProps {
  technique: Technique
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

      <Flex direction={{ base: 'column', md: 'row' }} gap={6} maxW="800px" mx="auto" w="full">
        {/* Info card (invisible border) */}
        <Stack
          gap={3}
          p={5}
          borderRadius="lg"
          borderWidth="2px"
          borderColor="gray.100"
          bg="bg.card"
          flex={1}
        >
          <Heading size="xl" mb={1}>
            {technique.name}
          </Heading>
          <HStack mb={4} gap={2}>
            <DifficultyBadge difficulty={technique.difficulty} />
            <Badge>{technique.topicId}</Badge>
            <Badge colorPalette="orange">Challenge</Badge>
          </HStack>
          <Text color="text.muted">
            {technique.description}
          </Text>
        </Stack>

        {/* To Pass card with button inside */}
        <Stack
          gap={3}
          p={5}
          borderRadius="lg"
          borderWidth="2px"
          borderColor="gray.100"
          bg="bg.card"
          flex={1}
          display="flex"
          flexDirection="column"
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
          <Text fontSize="sm" color="text.muted" flex={1}>
            {challengePassed
              ? 'You have already passed this challenge. Try again to beat your time.'
              : 'Pass to mark this technique as challenge-cleared.'}
          </Text>
          <Button
            size="lg"
            onClick={onStart}
            bg="brand.500"
            color="white"
            _hover={{ bg: 'brand.600' }}
            aria-label="Start Challenge"
            mt="auto"
          >
            Start Challenge
          </Button>
        </Stack>
      </Flex>
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
