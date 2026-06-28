import { Box, Button, Flex, HStack, Heading, SimpleGrid, Stack, Text } from '@chakra-ui/react'
import type { MasteryThresholds, Technique } from '@/shared/types'
import type { SessionSummary } from '@/features/session'
import { findTechnique } from '@/content'

export interface ChallengeResultProps {
  technique: Technique
  summary: SessionSummary
  thresholds: MasteryThresholds
  xpEarned: number
  /** Did the user pass this challenge? Mirrors summary.passed. */
  passed: boolean
  /** Whether this run earned the user's first challenge pass for this technique. */
  justPassedFirstTime: boolean
  onBackToMap: () => void
  onTryDrills: () => void
  onTryAgain: () => void
  onReview: (techniqueId: string) => void
}

/**
 * Challenge result screen — Phase 7.
 *
 * Single component handles both pass and fail. Visual tone shifts (green
 * celebratory vs. neutral encouraging) but the layout stays consistent so
 * the user always knows where to look for stats and CTAs.
 *
 * Failure framing is intentionally progress-positive: "Not there yet" never
 * "Failed". The Two-weakest-techniques block matches the Drill report so
 * the user has a familiar way back to focused practice.
 */
export function ChallengeResult({
  technique,
  summary,
  thresholds,
  xpEarned,
  passed,
  justPassedFirstTime,
  onBackToMap,
  onTryDrills,
  onTryAgain,
  onReview,
}: ChallengeResultProps) {
  const speedMet = summary.speedPerMin >= thresholds.speedPerMin

  return (
    <Flex direction="column" minH="100dvh" p={{ base: 4, md: 8 }}>
        <Stack
          gap={2}
          mb={6}
          p={5}
          borderRadius="lg"
          bg={passed ? 'green.50' : 'bg.card'}
          borderWidth="2px"
          borderColor={passed ? 'green.400' : 'border.subtle'}
          textAlign="center"
          data-result={passed ? 'pass' : 'fail'}
        >
          <Heading size="xl" color={passed ? 'green.700' : 'text.primary'}>
            {passed ? 'Challenge Passed' : 'Not there yet'}
          </Heading>
          <Text color="text.muted">{technique.name}</Text>
          {passed && justPassedFirstTime && (
            <Text
              mt={1}
              fontWeight="bold"
              color="green.700"
              data-testid="challenge-cleared-banner"
            >
              ★ Challenge cleared for this technique
            </Text>
          )}
        </Stack>

        <SimpleGrid columns={{ base: 2, md: 4 }} gap={3} mb={6}>
          <Stat label="Correct" value={`${summary.correct}/${summary.attempted}`} />
          <Stat
            label="Speed"
            value={`${summary.speedPerMin}/min`}
            target={`≥ ${thresholds.speedPerMin}`}
            met={speedMet}
          />
          <Stat label="Accuracy" value={`${summary.accuracyPct}%`} />
          <Stat label="XP" value={`+${xpEarned}`} highlight />
        </SimpleGrid>

        {!passed && (
          <Box
            mb={6}
            p={5}
            borderRadius="lg"
            borderWidth="2px"
            borderColor="border.subtle"
            bg="bg.card"
          >
            <Text color="text.primary">A few more Drills will get you there.</Text>
            <Text fontSize="sm" color="text.muted" mt={1}>
              Focus on building speed.
            </Text>
          </Box>
        )}

        {summary.weakTechniqueIds.length > 0 && (
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
          <Button flex={1} onClick={onBackToMap} variant="outline">
            Back to Map
          </Button>
          {!passed && (
            <Button flex={1} onClick={onTryDrills} variant="outline">
              Try Drills
            </Button>
          )}
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
    </Flex>
  )
}

function Stat({
  label,
  value,
  target,
  met,
  highlight,
}: {
  label: string
  value: string
  target?: string
  met?: boolean
  highlight?: boolean
}) {
  const showMet = typeof met === 'boolean'
  return (
    <Box
      p={4}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={showMet ? (met ? 'green.300' : 'red.300') : 'border.subtle'}
      bg={highlight ? 'brand.50' : showMet ? (met ? 'green.50' : 'red.50') : 'bg.card'}
      textAlign="center"
    >
      <Text
        fontSize="xs"
        color="text.muted"
        textTransform="uppercase"
        letterSpacing="wider"
      >
        {label}
      </Text>
      <Text fontSize="2xl" fontWeight="bold">
        {value}
      </Text>
      {target && (
        <Text fontSize="xs" color="text.muted" mt={1}>
          {target}
        </Text>
      )}
    </Box>
  )
}
