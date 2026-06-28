import { useState } from 'react'
import { Box, Flex, Heading, HStack, Stack, Text, VStack } from '@chakra-ui/react'
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
    <Box p={{ base: 4, md: 8 }} mx="auto">
      <Stack gap={6}>
        <HStack justify="space-between" align="center">
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

        <Flex justifyContent="center" alignContent="center">
          <VStack maxW="640px">
            <Box textAlign="center" py={8} px={4} borderRadius="xl">
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

            <Box maxW="320px">
              {/* Key on problem.id so the digit buffer resets automatically on advance. */}
              <AnswerForm key={problem.id} onSubmit={onSubmit} disabled={evaluating} />
            </Box>

            <Box minH="80px">
              <AnswerFeedback
                state={evaluating ? (lastAnswerCorrect ? 'correct' : 'incorrect') : 'idle'}
                correctAnswer={lastCorrectAnswer ?? undefined}
                onDismiss={onAdvance}
                showNextButton
              />
            </Box>
          </VStack>
        </Flex>
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
