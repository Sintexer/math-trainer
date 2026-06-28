import { Box, Button, SimpleGrid } from '@chakra-ui/react'
import type { KeyboardType } from '@/shared/types'

// Numeric keypad designed mobile-first. The component is presentational: it
// emits onDigit / onBackspace and never owns the answer buffer.
// The submit action lives in the input row (✓ button next to the text field),
// so the keypad no longer carries a submit key.
//
// Layout:
//   1  2  3
//   4  5  6
//   7  8  9
//      0  ⌫   ← empty first cell keeps 0 centred under 8
//
// The `variant` prop is reserved for future keyboard types (decimal, algebraic).
// Only 'numeric' has a full layout today; other variants fall back to numeric.

export interface KeypadProps {
  /** Keyboard variant — controls which keys are rendered. Default 'numeric'. */
  variant?: KeyboardType
  onDigit: (digit: number) => void
  onBackspace: () => void
  /** Disables the entire keypad (e.g. while showing feedback). */
  disabled?: boolean
}

const DIGITS: ReadonlyArray<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9]

export function Keypad({
  variant: _variant = 'numeric',
  onDigit,
  onBackspace,
  disabled = false,
}: KeypadProps) {
  return (
    <Box w="full" maxW="320px" mx="auto">
      <SimpleGrid columns={3} gap={2}>
        {DIGITS.map((d) => (
          <KeypadButton key={d} onClick={() => onDigit(d)} disabled={disabled} label={String(d)} />
        ))}
        {/* Bottom row: empty spacer | 0 | ⌫ */}
        <Box />
        <KeypadButton onClick={() => onDigit(0)} disabled={disabled} label="0" />
        <KeypadButton
          onClick={onBackspace}
          disabled={disabled}
          label="⌫"
          aria-label="Backspace"
          variant="muted"
        />
      </SimpleGrid>
    </Box>
  )
}

interface KeypadButtonProps {
  label: string
  onClick: () => void
  disabled?: boolean
  variant?: 'default' | 'muted'
  'aria-label'?: string
}

function KeypadButton({
  label,
  onClick,
  disabled,
  variant = 'default',
  'aria-label': ariaLabel,
}: KeypadButtonProps) {
  const styles =
    variant === 'muted'
      ? { bg: 'bg.card', color: 'text.muted' }
      : { bg: 'bg.card', color: 'text.primary' }

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel ?? label}
      minH="56px"
      minW="56px"
      h="56px"
      fontSize="2xl"
      fontWeight="semibold"
      borderRadius="lg"
      borderWidth="1px"
      borderColor="border.subtle"
      transition="transform 0.05s ease, background-color 0.1s ease"
      _active={{ transform: 'scale(0.95)' }}
      {...styles}
    >
      {label}
    </Button>
  )
}
