import { Box, Button, Flex, Heading, SimpleGrid, Stack, Text } from '@chakra-ui/react'
import type { SessionSummary } from '@/features/session'
import { findTechnique } from '@/content'

export interface TopicChallengeReportProps {
  topicName: string
  summary: SessionSummary
  onTryAgain: () => void
  onBack: () => void
}

export function TopicChallengeReport({
  topicName,
  summary,
  onTryAgain,
  onBack,
}: TopicChallengeReportProps) {
  const techniqueIds = Object.keys(summary.techniqueBreakdown)

  return (
    <Flex direction="column" minH="100dvh" p={{ base: 4, md: 8 }}>
      <Heading size="xl" mb={1}>
        Topic Test complete
      </Heading>
      <Text color="text.muted" mb={6}>
        {topicName}
      </Text>

      <SimpleGrid columns={{ base: 2, md: 3 }} gap={3} mb={6}>
        <Stat label="Correct" value={`${summary.correct}/${summary.attempted}`} />
        <Stat label="Accuracy" value={`${summary.accuracyPct}%`} />
        <Stat label="Speed" value={`${summary.speedPerMin}/min`} />
      </SimpleGrid>

      {techniqueIds.length > 1 && (
        <Stack
          gap={2}
          p={5}
          borderRadius="lg"
          borderWidth="2px"
          borderColor="border.subtle"
          bg="bg.card"
          mb={6}
        >
          <Heading size="sm" color="text.muted" textTransform="uppercase" letterSpacing="wider">
            By technique
          </Heading>
          {techniqueIds.map((id) => {
            const tech = findTechnique(id)
            const breakdown = summary.techniqueBreakdown[id]
            if (!breakdown) return null
            const acc =
              breakdown.attempted > 0
                ? Math.round((breakdown.correct / breakdown.attempted) * 100)
                : 0
            return (
              <Box key={id} display="flex" justifyContent="space-between" alignItems="center">
                <Text fontSize="sm">{tech?.name ?? id}</Text>
                <Text fontSize="sm" color="text.muted">
                  {breakdown.correct}/{breakdown.attempted} ({acc}%)
                </Text>
              </Box>
            )
          })}
        </Stack>
      )}

      <Stack direction={{ base: 'column', md: 'row' }} gap={3}>
        <Button flex={1} onClick={onBack} variant="outline">
          Back to Topic
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
    </Flex>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Box p={4} borderRadius="lg" borderWidth="1px" borderColor="border.subtle" bg="bg.card" textAlign="center">
      <Text fontSize="xs" color="text.muted" textTransform="uppercase" letterSpacing="wider">
        {label}
      </Text>
      <Text fontSize="2xl" fontWeight="bold">
        {value}
      </Text>
    </Box>
  )
}
