import { Box, Text } from '@chakra-ui/react'
import { formatMmSs } from './formatMmSs'

export interface TimerProps {
  /** Remaining milliseconds. Caller drives time; component is presentational. */
  remainingMs: number
  /** Total session length in ms, for the optional progress bar. */
  totalMs?: number
  /** ms threshold below which the timer turns warning-colored (default 10_000). */
  warningMs?: number
  /** ms threshold below which the timer pulses (default 5_000). */
  pulseMs?: number
}

// Pure presentational countdown. The session engine (Phase 3) is the source
// of truth for elapsed time; this component never calls Date.now() so it
// stays trivially testable and deterministic.
export function Timer({
  remainingMs,
  totalMs,
  warningMs = 10_000,
  pulseMs = 5_000,
}: TimerProps) {
  const clamped = Math.max(0, remainingMs)
  const warning = clamped < warningMs
  const pulse = clamped < pulseMs
  const label = formatMmSs(clamped)

  const color = warning ? 'red.500' : 'text.primary'

  const ratio = totalMs && totalMs > 0 ? Math.max(0, Math.min(1, clamped / totalMs)) : null

  return (
    <Box w="full" textAlign="center">
      <Text
        as="div"
        role="timer"
        aria-label={`Time remaining ${label}`}
        data-warning={warning ? 'true' : 'false'}
        data-pulse={pulse ? 'true' : 'false'}
        fontSize="5xl"
        fontWeight="bold"
        fontFamily="mono"
        color={color}
        animation={pulse ? 'pulse 1s ease-in-out infinite' : undefined}
      >
        {label}
      </Text>
      {ratio !== null && (
        <Box
          mt={2}
          h="6px"
          bg="border.subtle"
          borderRadius="full"
          overflow="hidden"
          aria-hidden="true"
        >
          <Box
            h="full"
            bg={warning ? 'red.500' : 'brand.500'}
            width={`${ratio * 100}%`}
            transition="width 0.2s linear"
          />
        </Box>
       )}
     </Box>
   )
 }

