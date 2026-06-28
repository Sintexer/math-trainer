import { Text } from '@chakra-ui/react'
import type { Problem } from '@/shared/types'
import { InSessionScreen, formatMmSs } from '@/features/input'

export interface ChallengeInSessionProps {
  problem: Problem
  timeRemainingMs: number
  evaluating: boolean
  lastAnswerCorrect: boolean | null
  lastCorrectAnswer: number | null
  onSubmit: (answer: number) => void
  onAdvance: () => void
  onExit: () => void
}

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
  const clamped = Math.max(0, timeRemainingMs)
  const warning = clamped < 10_000

  return (
    <InSessionScreen
      problem={problem}
      headerCenter={
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
      }
      evaluating={evaluating}
      lastAnswerCorrect={lastAnswerCorrect}
      lastCorrectAnswer={lastCorrectAnswer}
      onSubmit={onSubmit}
      onAdvance={onAdvance}
      onExit={onExit}
      exitAriaLabel="Exit challenge"
      promptTestId="challenge-prompt"
    />
  )
}
