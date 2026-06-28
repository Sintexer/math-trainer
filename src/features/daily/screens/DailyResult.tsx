import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  HStack,
  Heading,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react'
import type { DailyChallengeResult } from '@/features/progress'
import { findTechnique } from '@/content'
import { buildShareText, formatCountdown, msUntilMidnight } from '../dailyChallenge'

export interface DailyResultProps {
  result: DailyChallengeResult
  challengeNumber: number
  /** Technique IDs from the session summary that the user struggled with most. */
  weakTechniqueIds: readonly string[]
  onNavigate: (techniqueId: string) => void
  onBack: () => void
}

/**
 * Post-session result screen for the Daily Challenge.
 * Shows a Wordle-style emoji grid, stats, a copy-to-clipboard share button,
 * weak technique focus areas, and a countdown to the next challenge.
 */
export function DailyResult({
  result,
  challengeNumber,
  weakTechniqueIds,
  onNavigate,
  onBack,
}: DailyResultProps) {
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
        {/* Header */}
        <Box>
          <Text fontSize="sm" color="text.muted" textTransform="uppercase" letterSpacing="wider">
            Daily Challenge #{challengeNumber}
          </Text>
          <Heading size="xl" mt={1}>
            {result.score === result.attempted ? 'Perfect!' : 'Complete'}
          </Heading>
        </Box>

        {/* Stats */}
        <SimpleGrid columns={3} gap={3}>
          <Stat label="Correct" value={`${result.score}/${result.attempted}`} />
          <Stat
            label="Accuracy"
            value={`${Math.round((result.score / Math.max(1, result.attempted)) * 100)}%`}
          />
          <Stat label="Time" value={`${result.timeSeconds}s`} />
        </SimpleGrid>

        {/* Emoji grid */}
        <EmojiGrid problemResults={result.problemResults} />

        {/* Share button */}
        <CopyShareButton shareText={shareText} />

        {/* Weak technique focus areas */}
        {weakTechniqueIds.length > 0 && (
          <Stack
            gap={2}
            p={5}
            borderRadius="lg"
            borderWidth="2px"
            borderColor="border.subtle"
            bg="bg.card"
          >
            <Heading
              size="sm"
              color="text.muted"
              textTransform="uppercase"
              letterSpacing="wider"
            >
              Focus areas
            </Heading>
            {weakTechniqueIds.map((id) => {
              const tech = findTechnique(id)
              return (
                <HStack key={id} justify="space-between">
                  <Text>{tech?.name ?? id}</Text>
                  <Button size="sm" variant="outline" onClick={() => onNavigate(id)}>
                    Review
                  </Button>
                </HStack>
              )
            })}
          </Stack>
        )}

        {/* Countdown to next challenge */}
        <NextChallengeCountdown />

        {/* Navigation */}
        <Button variant="outline" onClick={onBack} aria-label="Back to home">
          Back to Home
        </Button>
      </Stack>
    </Box>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Box
      p={4}
      borderRadius="lg"
      borderWidth="1px"
      borderColor="border.subtle"
      bg="bg.card"
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

function EmojiGrid({
  problemResults,
}: {
  problemResults: ReadonlyArray<{ correct: boolean }>
}) {
  return (
    <Box
      p={4}
      borderRadius="lg"
      borderWidth="1px"
      borderColor="border.subtle"
      bg="bg.card"
      textAlign="center"
    >
      <Text fontSize="2xl" letterSpacing="0.15em" aria-label="Result grid">
        {problemResults.map((r, i) => (
          <span key={i} role="img" aria-label={r.correct ? 'correct' : 'incorrect'}>
            {r.correct ? '🟩' : '🟥'}
          </span>
        ))}
      </Text>
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
      // Clipboard API unavailable (e.g. non-HTTPS, some older browsers).
      // Silent failure is acceptable — the user can still read the result.
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

/** Shows a live HH:MM:SS countdown to midnight (next challenge). */
function NextChallengeCountdown() {
  const [countdown, setCountdown] = useState(() => formatCountdown(msUntilMidnight()))

  useEffect(() => {
    const id = window.setInterval(() => {
      setCountdown(formatCountdown(msUntilMidnight()))
    }, 1000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <Text textAlign="center" color="text.muted" fontSize="sm">
      Next challenge in{' '}
      <Text as="span" fontVariantNumeric="tabular-nums" fontWeight="semibold">
        {countdown}
      </Text>
    </Text>
  )
}
