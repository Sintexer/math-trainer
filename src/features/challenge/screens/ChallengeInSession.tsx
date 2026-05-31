import { useState } from 'react'
import { Box, Heading, Stack, Text } from '@chakra-ui/react'
import type { Problem } from '@/shared/types'
import {
  AnswerFeedback,
  AnswerInput,
  SessionProgress,
  Timer,
} from '@/features/input'

export interface ChallengeInSessionProps {
  problem: Problem
  attempted: number
  correct: number
  timeRemainingMs: number
  totalDurationMs: number
  evaluating: boolean
  lastAnswerCorrect: boolean | null
  lastCorrectAnswer: number | null
  onSubmit: (answer: number) => void
  onAdvance: () => void
}

/**
 * Challenge in-session screen — Phase 7.
 *
 * Same input/feedback primitives as DrillInSession, but with a prominent
 * countdown Timer in place of the elapsed display, no total problem count
 * (the user solves as many as they can), and a slightly more intense
 * visual frame (deeper card background).
 */
export function ChallengeInSession({
  problem,
  attempted,
  correct,
  timeRemainingMs,
  totalDurationMs,
  evaluating,
  lastAnswerCorrect,
  lastCorrectAnswer,
  onSubmit,
  onAdvance,
}: ChallengeInSessionProps) {
  const elapsedMs = Math.max(0, totalDurationMs - Math.max(0, timeRemainingMs))

  return (
    <Box p={{ base: 4, md: 8 }} maxW="640px" mx="auto">
      <Stack gap={6}>
        <Timer remainingMs={timeRemainingMs} totalMs={totalDurationMs} />

        <SessionProgress attempted={attempted} correct={correct} elapsedMs={elapsedMs} />

        <Box
          textAlign="center"
          py={8}
          px={4}
          borderRadius="xl"
          borderWidth="2px"
          borderColor="border.subtle"
          bg="bg.card"
          boxShadow="md"
        >
          <Text
            fontSize="xs"
            color="text.muted"
            textTransform="uppercase"
            letterSpacing="wider"
            mb={2}
          >
            Problem #{attempted + (evaluating ? 0 : 1)}
          </Text>
          <Heading
            as="div"
            size="2xl"
            fontFamily="mono"
            data-testid="challenge-prompt"
          >
            {problem.prompt}
          </Heading>
        </Box>

        {/* Keyed on problem.id — same pattern as DrillInSession. */}
        <AnswerForm key={problem.id} onSubmit={onSubmit} disabled={evaluating} />

        <Box minH="80px">
          <AnswerFeedback
            state={
              evaluating
                ? lastAnswerCorrect
                  ? 'correct'
                  : 'incorrect'
                : 'idle'
            }
            correctAnswer={lastCorrectAnswer ?? undefined}
            onDismiss={onAdvance}
            showNextButton
          />
        </Box>
      </Stack>
    </Box>
  )
}

interface AnswerFormProps {
  onSubmit: (answer: number) => void
  disabled?: boolean
}

function AnswerForm({ onSubmit, disabled }: AnswerFormProps) {
  const [buffer, setBuffer] = useState('')
  return (
    <AnswerInput
      value={buffer}
      onChange={setBuffer}
      onSubmit={(value) => {
        setBuffer('')
        onSubmit(value)
      }}
      disabled={disabled}
    />
  )
}
