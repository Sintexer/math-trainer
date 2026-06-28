import { Box, Button, Flex, Heading, Stack, Text } from '@chakra-ui/react'
import { DAILY_PROBLEM_COUNT } from '../dailyChallenge'

export interface DailyEntryProps {
  /** Sequential challenge number (e.g. 178). */
  challengeNumber: number
  /** YYYY-MM-DD date string for display. */
  date: string
  onStart: () => void
  onBack: () => void
}

/**
 * Pre-session entry screen for the Daily Challenge.
 * Shows the challenge number, date, problem count, and a Start button.
 * Deliberately shows no content hints so the challenge remains a surprise.
 */
export function DailyEntry({ challengeNumber, date, onStart, onBack }: DailyEntryProps) {
  return (
    <Flex direction="column" minH="100dvh" p={{ base: 4, md: 8 }}>
      <Box maxW="480px" mx="auto" w="full">
        <Stack gap={6}>
          <Box>
            <Text fontSize="sm" color="text.muted" textTransform="uppercase" letterSpacing="wider">
              Daily Challenge
            </Text>
            <Heading size="2xl" mt={1}>
              #{challengeNumber}
            </Heading>
            <Text color="text.muted" mt={1}>
              {date}
            </Text>
          </Box>

          <Stack
            gap={3}
            p={5}
            borderRadius="lg"
            borderWidth="2px"
            borderColor="border.subtle"
            bg="bg.card"
          >
            <Text fontWeight="semibold">Today's challenge</Text>
            <Text color="text.muted" fontSize="sm">
              {DAILY_PROBLEM_COUNT} mixed problems · one attempt · same for everyone today
            </Text>
            <Text color="text.muted" fontSize="sm">
              Work as fast as you can — your total time is recorded.
            </Text>
          </Stack>

          <Stack direction={{ base: 'column', md: 'row' }} gap={3}>
            <Button flex={1} variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button
              flex={1}
              bg="brand.500"
              color="white"
              _hover={{ bg: 'brand.600' }}
              onClick={onStart}
            >
              Start
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Flex>
  )
}
