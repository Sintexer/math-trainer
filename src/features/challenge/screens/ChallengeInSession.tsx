import { useState } from 'react'
import { Box, Button, Flex, Heading, HStack, Text } from '@chakra-ui/react'
import type { KeyboardType, Problem } from '@/shared/types'
import { AnswerFeedback, AnswerInput, formatMmSs } from '@/features/input'
import { TechniqueReferenceModal } from '@/features/technique-card'

export interface ChallengeInSessionProps {
  problem: Problem
  timeRemainingMs: number
  evaluating: boolean
  lastAnswerCorrect: boolean | null
  lastCorrectAnswer: number | null
  onSubmit: (answer: number) => void
  onAdvance: () => void
  /** Abandons the session and returns to the entry screen. */
  onExit: () => void
}

/**
 * Challenge in-session screen.
 *
 * Header mirrors DrillInSession exactly (× | center | ?) — the only
 * difference is that the center shows a compact countdown instead of a
 * problem counter. The card layout is identical to the drill screen.
 */
export function ChallengeInSession({
  problem,
  timeRemainingMs,
  evaluating,
  lastAnswerCorrect,
  lastCorrectAnswer,
  onSubmit,
  onAdvance,
  onExit,
}: ChallengeInSessionProps) {
  const [referenceOpen, setReferenceOpen] = useState(false)
  const clamped = Math.max(0, timeRemainingMs)
  const warning = clamped < 10_000

  return (
    <Flex direction="column" minH="100dvh" p={{ base: 4, md: 8 }} gap={3}>
      {/* ── Top: exit × | timer | reference ? ── */}
      <HStack justify="space-between" align="center" flexShrink={0}>
        <Button
          size="sm"
          variant="ghost"
          aria-label="Exit challenge"
          onClick={onExit}
          color="text.muted"
          fontSize="xl"
          px={2}
        >
          ×
        </Button>
        <Text
          role="timer"
          aria-label={`Time remaining ${formatMmSs(clamped)}`}
          fontSize="sm"
          fontWeight="medium"
          fontFamily="mono"
          fontVariantNumeric="tabular-nums"
          color={warning ? 'red.500' : 'text.muted'}
          data-warning={warning ? 'true' : 'false'}
        >
          {formatMmSs(clamped)}
        </Text>
        <Button
          size="sm"
          variant="ghost"
          aria-label="Open technique reference"
          onClick={() => setReferenceOpen(true)}
        >
          ?
        </Button>
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
            <Heading
              as="div"
              size="2xl"
              fontFamily="mono"
              data-testid="challenge-prompt"
            >
              {problem.prompt}
            </Heading>
          </Box>
        </Flex>

        {/* Feedback + input — pinned to the bottom of the card */}
        <Box flexShrink={0} w="full" maxW="480px" mx="auto">
          <Box minH="64px" mb={3}>
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
          {/* Keyed on problem.id — same remount strategy as DrillInSession. */}
          <AnswerForm
            key={problem.id}
            onSubmit={onSubmit}
            disabled={evaluating}
            expectedAnswer={problem.answer}
            keyboardType={problem.keyboardType}
          />
        </Box>
      </Flex>

      <TechniqueReferenceModal
        techniqueId={problem.techniqueId}
        open={referenceOpen}
        onClose={() => setReferenceOpen(false)}
      />
    </Flex>
  )
}

interface AnswerFormProps {
  onSubmit: (answer: number) => void
  disabled?: boolean
  expectedAnswer?: number
  keyboardType?: KeyboardType
}

function AnswerForm({ onSubmit, disabled, expectedAnswer, keyboardType }: AnswerFormProps) {
  const [buffer, setBuffer] = useState('')
  return (
    <AnswerInput
      value={buffer}
      onChange={setBuffer}
      onSubmit={(value) => {
        setBuffer('')
        onSubmit(value)
      }}
      expectedAnswer={expectedAnswer}
      keyboardType={keyboardType}
      disabled={disabled}
    />
  )
}
