import { useState } from 'react'
import { Box, Button, Heading, HStack, Stack, Text } from '@chakra-ui/react'
import type { Problem } from '@/shared/types'
import { AnswerFeedback, AnswerInput, SessionProgress } from '@/features/input'
import { TechniqueReferenceModal } from '@/features/technique-card'

export interface DrillInSessionProps {
  problem: Problem
  /** 1-based index of the displayed problem. */
  problemNumber: number
  attempted: number
  correct: number
  totalProblems: number
  elapsedMs: number
  /** Whether the engine is in 'evaluating' state (feedback visible). */
  evaluating: boolean
  /** The most recent answer record (if any) for feedback rendering. */
  lastAnswerCorrect: boolean | null
  /** The correct answer to reveal on a wrong submission. */
  lastCorrectAnswer: number | null
  onSubmit: (answer: number) => void
  onAdvance: () => void
}

export function DrillInSession({
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
}: DrillInSessionProps) {
  const [referenceOpen, setReferenceOpen] = useState(false)
  return (
    <Box p={{ base: 4, md: 8 }} maxW="640px" mx="auto">
      <Stack gap={6}>
        <HStack justify="space-between" align="center">
          <SessionProgress
            attempted={attempted}
            correct={correct}
            totalProblems={totalProblems}
            elapsedMs={elapsedMs}
          />
          <Button
            size="sm"
            variant="ghost"
            aria-label="Open technique reference"
            onClick={() => setReferenceOpen(true)}
          >
            ?
          </Button>
        </HStack>

        <Box
          textAlign="center"
          py={8}
          px={4}
          borderRadius="xl"
          borderWidth="1px"
          borderColor="border.subtle"
          bg="bg.card"
        >
          <Text fontSize="xs" color="text.muted" textTransform="uppercase" letterSpacing="wider" mb={2}>
            Problem {problemNumber} of {totalProblems}
          </Text>
          <Heading
            as="div"
            size="2xl"
            fontFamily="mono"
            data-testid="drill-prompt"
          >
            {problem.prompt}
          </Heading>
        </Box>

        {/* Keyed on problem.id so the digit buffer naturally resets when
            the engine advances. This avoids a setState-in-effect pattern
            (forbidden by react-hooks/set-state-in-effect in v7). */}
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

      <TechniqueReferenceModal
        techniqueId={problem.techniqueId}
        open={referenceOpen}
        onClose={() => setReferenceOpen(false)}
      />
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
        // Clear the buffer immediately on submit so the feedback overlay
        // does not show a stale typed value, even though the AnswerForm
        // also remounts on the next problem id change.
        setBuffer('')
        onSubmit(value)
      }}
      disabled={disabled}
    />
  )
}
