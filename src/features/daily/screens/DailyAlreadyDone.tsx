import { useState } from 'react'
import { Box, Button, Heading, Stack, Text } from '@chakra-ui/react'
import type { DailyChallengeResult } from '@/features/progress'
import { buildShareText } from '../dailyChallenge'

export interface DailyAlreadyDoneProps {
  result: DailyChallengeResult
  challengeNumber: number
  onBack: () => void
}

/**
 * Shown when the user has already completed today's Daily Challenge.
 * Displays their previous result and a share button; no retry path.
 */
export function DailyAlreadyDone({ result, challengeNumber, onBack }: DailyAlreadyDoneProps) {
  const shareText = buildShareText(
    challengeNumber,
    result.score,
    result.attempted,
    result.timeSeconds,
    result.problemResults,
  )

  return (
    <Box p={{ base: 4, md: 8 }} maxW="480px" mx="auto">
      <Stack gap={6}>
        <Box>
          <Text fontSize="sm" color="text.muted" textTransform="uppercase" letterSpacing="wider">
            Daily Challenge #{challengeNumber}
          </Text>
          <Heading size="xl" mt={1}>
            Already completed
          </Heading>
          <Text color="text.muted" mt={1}>
            {result.date}
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
          <Text fontWeight="semibold">Your result</Text>
          <Text>
            {result.score}/{result.attempted} correct · {result.timeSeconds}s
          </Text>
          <Text fontSize="2xl" letterSpacing="0.15em" aria-label="Result grid">
            {result.problemResults.map((r, i) => (
              <span key={i} role="img" aria-label={r.correct ? 'correct' : 'incorrect'}>
                {r.correct ? '🟩' : '🟥'}
              </span>
            ))}
          </Text>
        </Stack>

        <CopyShareButton shareText={shareText} />

        <Button variant="outline" onClick={onBack} aria-label="Back to home">
          Back to Home
        </Button>
      </Stack>
    </Box>
  )
}

function CopyShareButton({ shareText }: { shareText: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Silent failure — clipboard API may be unavailable on non-HTTPS.
    }
  }

  return (
    <Button
      onClick={handleCopy}
      bg="brand.500"
      color="white"
      _hover={{ bg: 'brand.600' }}
      aria-label="Copy result to clipboard"
    >
      {copied ? 'Copied!' : 'Share result'}
    </Button>
  )
}
