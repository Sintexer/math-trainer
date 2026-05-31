import { Box, HStack, Text, VStack } from '@chakra-ui/react'

export interface SessionProgressProps {
  attempted: number
  correct: number
  /** When defined, renders a "n / total" counter and progress bar (Drill mode). */
  totalProblems?: number
  /** Elapsed ms used for the speed (problems/min) calculation. */
  elapsedMs: number
}

// Live session stats: count, accuracy, speed. Pure derived display — no
// internal state, no timers. The session screen passes the latest numbers
// each render.
export function SessionProgress({
  attempted,
  correct,
  totalProblems,
  elapsedMs,
}: SessionProgressProps) {
  const accuracy = attempted === 0 ? 0 : (correct / attempted) * 100
  const minutes = elapsedMs / 60_000
  const speed = minutes > 0 ? correct / minutes : 0

  const counterLabel =
    typeof totalProblems === 'number' ? `${attempted} / ${totalProblems}` : `${attempted}`

  const ratio =
    typeof totalProblems === 'number' && totalProblems > 0
      ? Math.min(1, attempted / totalProblems)
      : null

  return (
    <VStack w="full" gap={2} align="stretch">
      <HStack justify="space-between" px={1}>
        <Stat label="Problems" value={counterLabel} />
        <Stat label="Accuracy" value={`${accuracy.toFixed(0)}%`} />
        <Stat label="Speed" value={`${speed.toFixed(1)}/min`} />
      </HStack>
      {ratio !== null && (
        <Box
          h="6px"
          bg="border.subtle"
          borderRadius="full"
          overflow="hidden"
          aria-label="Session progress"
          role="progressbar"
          aria-valuenow={Math.round(ratio * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <Box
            h="full"
            bg="brand.500"
            width={`${ratio * 100}%`}
            transition="width 0.2s ease"
          />
        </Box>
      )}
    </VStack>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Box textAlign="center">
      <Text fontSize="xs" color="text.muted" textTransform="uppercase" letterSpacing="wider">
        {label}
      </Text>
      <Text fontSize="lg" fontWeight="semibold" color="text.primary">
        {value}
      </Text>
    </Box>
  )
}
