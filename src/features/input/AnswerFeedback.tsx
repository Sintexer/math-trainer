import { useEffect } from 'react'
import { Box, Button, Text } from '@chakra-ui/react'

export type FeedbackState = 'idle' | 'correct' | 'incorrect'

export interface AnswerFeedbackProps {
  state: FeedbackState
  /** Displayed inline when state==='incorrect'. */
  correctAnswer?: number | string
  /** Fired after autoDismissMs elapses. Caller advances to the next problem. */
  onDismiss?: () => void
  /** Auto-dismiss delays per state. Set to 0 to disable auto-dismiss. */
  autoDismissMs?: { correct?: number; incorrect?: number }
  /** When true, renders an explicit "Next" button that also calls onDismiss. */
  showNextButton?: boolean
}

const DEFAULT_DELAYS = { correct: 800, incorrect: 1500 } as const

// Headless visual feedback. The component renders nothing in 'idle' state
// so the underlying problem display remains uncovered. Animations are CSS-
// only and respect prefers-reduced-motion via Chakra's animation tokens.
export function AnswerFeedback({
  state,
  correctAnswer,
  onDismiss,
  autoDismissMs,
  showNextButton = false,
}: AnswerFeedbackProps) {
  const delays = { ...DEFAULT_DELAYS, ...autoDismissMs }

  useEffect(() => {
    if (state === 'idle' || !onDismiss) return
    const delay = state === 'correct' ? delays.correct : delays.incorrect
    if (delay <= 0) return
    const id = window.setTimeout(onDismiss, delay)
    return () => window.clearTimeout(id)
  }, [state, onDismiss, delays.correct, delays.incorrect])

  if (state === 'idle') return null

  const isCorrect = state === 'correct'
  return (
    <Box
      role="status"
      aria-live="polite"
      data-feedback-state={state}
      textAlign="center"
      py={4}
      px={6}
      borderRadius="lg"
      bg={isCorrect ? 'green.100' : 'red.100'}
      color={isCorrect ? 'green.800' : 'red.800'}
      borderWidth="2px"
      borderColor={isCorrect ? 'green.400' : 'red.400'}
      transition="opacity 0.15s ease"
    >
      <Text fontSize="xl" fontWeight="bold">
        {isCorrect ? 'Correct' : 'Not quite'}
      </Text>
      {!isCorrect && correctAnswer !== undefined && (
        <Text mt={1} fontSize="md">
          Answer: <b>{correctAnswer}</b>
        </Text>
      )}
      {showNextButton && onDismiss && (
        <Button
          mt={3}
          size="sm"
          onClick={onDismiss}
          aria-label="Next problem"
          variant="outline"
        >
          Next
        </Button>
      )}
    </Box>
  )
}
