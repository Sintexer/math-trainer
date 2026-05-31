import { Box, Button, SimpleGrid } from '@chakra-ui/react'

// Numeric keypad designed mobile-first. The component is presentational: it
// emits onDigit / onBackspace / onSubmit and never owns the answer buffer.
// The min 44px target follows iOS Human Interface Guidelines for touch.

export interface KeypadProps {
  onDigit: (digit: number) => void
  onBackspace: () => void
  onSubmit: () => void
  /** Disables the submit (✓) key. Backspace stays available even when disabled. */
  submitDisabled?: boolean
  /** Disables the entire keypad (e.g. while showing feedback). */
  disabled?: boolean
}

const DIGITS: ReadonlyArray<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9]

export function Keypad({
  onDigit,
  onBackspace,
  onSubmit,
  submitDisabled = false,
  disabled = false,
}: KeypadProps) {
  return (
    <Box w="full" maxW="320px" mx="auto">
      <SimpleGrid columns={3} gap={2}>
        {DIGITS.map((d) => (
          <KeypadButton key={d} onClick={() => onDigit(d)} disabled={disabled} label={String(d)} />
        ))}
        <KeypadButton
          onClick={onBackspace}
          disabled={disabled}
          label="⌫"
          aria-label="Backspace"
          variant="muted"
        />
        <KeypadButton onClick={() => onDigit(0)} disabled={disabled} label="0" />
        <KeypadButton
          onClick={onSubmit}
          disabled={disabled || submitDisabled}
          label="✓"
          aria-label="Submit"
          variant="primary"
        />
      </SimpleGrid>
    </Box>
  )
}

interface KeypadButtonProps {
  label: string
  onClick: () => void
  disabled?: boolean
  variant?: 'default' | 'primary' | 'muted'
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
    variant === 'primary'
      ? { bg: 'brand.500', color: 'white', _hover: { bg: 'brand.600' } }
      : variant === 'muted'
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
