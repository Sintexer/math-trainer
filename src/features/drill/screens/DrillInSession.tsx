import { useState } from 'react'
import { Box, Button, Flex, Heading, HStack, Text } from '@chakra-ui/react'
import type { KeyboardType, Problem } from '@/shared/types'
import { AnswerFeedback, AnswerInput } from '@/features/input'
import { TechniqueReferenceModal } from '@/features/technique-card'

export interface DrillInSessionProps {
  problem: Problem
  attempted: number
  totalProblems: number
  /** Whether the engine is in 'evaluating' state (feedback visible). */
  evaluating: boolean
  /** The most recent answer record (if any) for feedback rendering. */
  lastAnswerCorrect: boolean | null
  /** The correct answer to reveal on a wrong submission. */
  lastCorrectAnswer: number | null
  onSubmit: (answer: number) => void
  onAdvance: () => void
  /** Abandons the session and returns to the entry screen. */
  onExit: () => void
}

export function DrillInSession({
  problem,
  attempted,
  totalProblems,
  evaluating,
  lastAnswerCorrect,
  lastCorrectAnswer,
  onSubmit,
  onAdvance,
  onExit,
}: DrillInSessionProps) {
  const [referenceOpen, setReferenceOpen] = useState(false)
  // During evaluating the answer was just recorded so attempted has already
  // incremented — step back by 1 to keep the counter on the current problem.
  const currentNumber = evaluating ? attempted : attempted + 1

  return (
    <Flex direction="column" minH="100dvh" p={{ base: 4, md: 8 }} gap={3}>
      {/* ── Top: exit × | X of Y | reference ? ── */}
      <HStack justify="space-between" align="center" flexShrink={0}>
        <Button
          size="sm"
          variant="ghost"
          aria-label="Exit drill"
          onClick={onExit}
          color="text.muted"
          fontSize="xl"
          px={2}
        >
          ×
        </Button>
        <Text fontSize="sm" color="text.muted" fontWeight="medium">
          {currentNumber} of {totalProblems}
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
            <Heading as="div" size="2xl" fontFamily="mono" data-testid="drill-prompt">
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
          {/* Keyed on problem.id so the buffer naturally resets when the engine
              advances to a new problem — avoids setState-in-effect. */}
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
        // Clear immediately so the display is blank while feedback shows.
        setBuffer('')
        onSubmit(value)
      }}
      expectedAnswer={expectedAnswer}
      keyboardType={keyboardType}
      disabled={disabled}
    />
  )
}
