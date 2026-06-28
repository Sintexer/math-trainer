import { Text } from '@chakra-ui/react'
import type { Problem } from '@/shared/types'
import { InSessionScreen } from '@/features/input'

export interface DrillInSessionProps {
  problem: Problem
  attempted: number
  totalProblems: number
  evaluating: boolean
  lastAnswerCorrect: boolean | null
  lastCorrectAnswer: number | null
  onSubmit: (answer: number) => void
  onAdvance: () => void
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
  // During evaluating the answer was already recorded — step back by 1 so the
  // counter still shows the current problem number, not the next one.
  const currentNumber = evaluating ? attempted : attempted + 1

  return (
    <InSessionScreen
      problem={problem}
      headerCenter={
        <Text fontSize="sm" color="text.muted" fontWeight="medium">
          {currentNumber} of {totalProblems}
        </Text>
      }
      evaluating={evaluating}
      lastAnswerCorrect={lastAnswerCorrect}
      lastCorrectAnswer={lastCorrectAnswer}
      onSubmit={onSubmit}
      onAdvance={onAdvance}
      onExit={onExit}
      exitAriaLabel="Exit drill"
      promptTestId="drill-prompt"
    />
  )
}
