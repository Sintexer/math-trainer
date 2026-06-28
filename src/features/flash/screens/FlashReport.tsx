import { Box, Button, Flex, Heading, SimpleGrid, Stack, Text } from '@chakra-ui/react'

export interface FlashReportProps {
  totalCards: number
  cardsPerMin: number
  totalTimeMs: number
  onTryAgain: () => void
  onBack: () => void
}

export function FlashReport({
  totalCards,
  cardsPerMin,
  totalTimeMs,
  onTryAgain,
  onBack,
}: FlashReportProps) {
  const totalSec = Math.round(totalTimeMs / 1000)
  const minutes = Math.floor(totalSec / 60)
  const seconds = totalSec % 60
  const timeLabel = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`

  return (
    <Flex direction="column" minH="100dvh" p={{ base: 4, md: 8 }}>
      <Heading size="xl" mb={1}>
        Flash complete
      </Heading>
      <Text color="text.muted" mb={6}>
        Mental speed session
      </Text>

      <SimpleGrid columns={3} gap={3} mb={8}>
        <Stat label="Cards" value={String(totalCards)} />
        <Stat label="Cards / min" value={String(cardsPerMin)} highlight />
        <Stat label="Time" value={timeLabel} />
      </SimpleGrid>

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
