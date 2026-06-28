import { useCallback } from 'react'
import { Box, Text } from '@chakra-ui/react'
import { Keypad } from './Keypad'
import { useKeyboardDigits } from './useKeyboardDigits'

export interface AnswerInputProps {
  /** Current digit buffer as string of digits (or empty). Controlled. */
  value: string
  onChange: (next: string) => void
  /** Fired when the user submits (✓ or Enter). Emits the parsed numeric value. */
  onSubmit: (value: number) => void
  /** Maximum number of digits the buffer can hold (default 4). */
  maxDigits?: number
  /** Disables both keypad and keyboard listener (e.g. while showing feedback). */
  disabled?: boolean
  /** Placeholder when buffer is empty. */
  placeholder?: string
}

// AnswerInput composes the visual digit display with the Keypad and the
// keyboard handler. The buffer is controlled by the caller so the session
// reducer (Phase 6) can clear it after each submission without prop drilling.
export function AnswerInput({
  value,
  onChange,
  onSubmit,
  maxDigits = 4,
  disabled = false,
  placeholder = '|',
}: AnswerInputProps) {
  const handleDigit = useCallback(
    (digit: number) => {
      if (disabled) return
      if (value.length >= maxDigits) return
      // Avoid leading zeros (e.g. "007"): collapse them into a single 0.
      if (value === '0') {
        onChange(digit === 0 ? '0' : String(digit))
        return
      }
      onChange(value + String(digit))
    },
    [value, onChange, maxDigits, disabled],
  )

  const handleBackspace = useCallback(() => {
    if (disabled) return
    if (value.length === 0) return
    onChange(value.slice(0, -1))
  }, [value, onChange, disabled])

  const handleSubmit = useCallback(() => {
    if (disabled) return
    if (value.length === 0) return
    onSubmit(Number(value))
  }, [value, onSubmit, disabled])

  useKeyboardDigits({
    onDigit: handleDigit,
    onBackspace: handleBackspace,
    onSubmit: handleSubmit,
    enabled: !disabled,
  })

  return (
    <Box w="full">
      <Box
        role="status"
        aria-label="Current answer"
        textAlign="center"
        py={6}
        px={4}
        mb={4}
        borderRadius="xl"
        borderWidth="1px"
        borderColor="border.subtle"
        bg="bg.card"
        minH="80px"
      >
        <Text
          fontSize="5xl"
          fontWeight="bold"
          fontFamily="mono"
          color={value.length === 0 ? 'text.muted' : 'text.primary'}
          lineHeight="1"
        >
          {value.length === 0 ? placeholder : value}
        </Text>
      </Box>
      <Keypad
        onDigit={handleDigit}
        onBackspace={handleBackspace}
        onSubmit={handleSubmit}
        submitDisabled={value.length === 0}
        disabled={disabled}
      />
    </Box>
  )
}
