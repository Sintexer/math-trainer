import { useState } from 'react'
import { Box, Flex, Heading, HStack, Text } from '@chakra-ui/react'
import type { Problem } from '@/shared/types'
import { AnswerFeedback, AnswerInput, SessionProgress } from '@/features/input'

export interface DailyInSessionProps {
  problem: Problem
  /** 1-based index of the displayed problem. */
  problemNumber: number
  attempted: number
  correct: number
  totalProblems: number
  elapsedMs: number
  evaluating: boolean
  lastAnswerCorrect: boolean | null
  lastCorrectAnswer: number | null
  onSubmit: (answer: number) => void
  onAdvance: () => void
}

/**
 * In-session screen for the Daily Challenge.
 * Mirrors DrillInSession but omits the technique reference button — daily
 * challenge problems span multiple techniques and there is no single card to
 * reference.
 */
export function DailyInSession({
  problem,
  problemNumber,
  attempted,
  correct,
  totalProblems,
  elapsedMs,
  evaluating,
  lastAnswerCorrect,
  lastCorrectAnswer,
  onSubmit,
  onAdvance,
}: DailyInSessionProps) {
  return (
    <Flex direction="column" minH="100dvh" p={{ base: 4, md: 8 }} gap={3}>
      {/* ── Top: progress stats | Daily Challenge label ── */}
      <HStack justify="space-between" align="center" flexShrink={0}>
        <SessionProgress
          attempted={attempted}
          correct={correct}
          totalProblems={totalProblems}
          elapsedMs={elapsedMs}
        />
        <Text fontSize="xs" color="text.muted" fontVariantNumeric="tabular-nums">
          Daily Challenge
        </Text>
      </HStack>

      {/* ── Card: question + feedback + input ── */}
      <Flex
        direction="column"
        flex={1}
        borderWidth="1px"
        borderColor="border.subtle"
        borderRadius="2xl"
        bg="bg.card"
        p={{ base: 5, md: 8 }}
        overflow="hidden"
      >
        {/* Question — grows to fill available card height, vertically centred */}
        <Flex flex={1} alignItems="center" justifyContent="center">
          <Box textAlign="center" w="full" maxW="600px" mx="auto">
            <Text
              fontSize="xs"
              color="text.muted"
              textTransform="uppercase"
              letterSpacing="wider"
              mb={2}
            >
              Problem {problemNumber} of {totalProblems}
            </Text>
            <Heading as="div" size="2xl" fontFamily="mono" data-testid="daily-prompt">
              {problem.prompt}
            </Heading>
          </Box>
        </Flex>

        {/* Feedback + input — pinned to the bottom of the card */}
        <Box flexShrink={0} w="full" maxW="480px" mx="auto">
          <Box minH="64px" mb={3}>
            <AnswerFeedback
              state={evaluating ? (lastAnswerCorrect ? 'correct' : 'incorrect') : 'idle'}
              correctAnswer={lastCorrectAnswer ?? undefined}
              onDismiss={onAdvance}
              showNextButton
            />
          </Box>
          {/* Key on problem.id so the digit buffer resets automatically on advance. */}
          <AnswerForm key={problem.id} onSubmit={onSubmit} disabled={evaluating} />
        </Box>
      </Flex>
    </Flex>
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
