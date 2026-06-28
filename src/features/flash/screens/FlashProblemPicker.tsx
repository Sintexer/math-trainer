import { Box, Heading, Text } from '@chakra-ui/react'
import type { Problem } from '@/shared/types'

const HISTORY_DEPTH = 2

export interface FlashProblemPickerProps {
  problems: Problem[]
  currentIndex: number
}

export function FlashProblemPicker({
  problems,
  currentIndex,
}: FlashProblemPickerProps) {
  const problem = problems[currentIndex]!

  // Get up to 2 previous problems
  const history = problems.slice(
    Math.max(0, currentIndex - HISTORY_DEPTH),
    currentIndex,
  )

  // Pad history with empty slots to always show 2 items on top
  const paddedHistory = Array(Math.max(0, HISTORY_DEPTH - history.length))
    .fill(null)
    .concat(history)

  return (
    <Box width="100%" display="flex" flexDirection="column" gap={4}>
      {/* 2 previous problems (or empty) — oldest first, fading */}
      {paddedHistory.map((prev, i) => {
        const opacity = i === 0 ? 0.25 : 0.5
        if (!prev) {
          return <Box key={`empty-top-${i}`} h="1.5em" />
        }
        const answered = prev.prompt.replace(/\?$/, String(prev.answer))
        return (
          <Text
            key={prev.id}
            fontFamily="mono"
            fontSize="lg"
            fontWeight="semibold"
            color="green.700"
            textAlign="center"
            style={{ opacity }}
          >
            {answered}
          </Text>
        )
      })}

      {/* Current problem — always centered */}
      <Heading as="div" size="2xl" fontFamily="mono" textAlign="center">
        {problem.prompt}
      </Heading>

      {/* 2 empty slots below for balance */}
      <Box h="1.5em" />
      <Box h="1.5em" />
    </Box>
  )
}
