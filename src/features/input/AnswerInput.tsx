import { useCallback, useState } from 'react'
import { Box, Button, HStack, Input } from '@chakra-ui/react'
import type { KeyboardType } from '@/shared/types'
import { Keypad } from './Keypad'

export interface AnswerInputProps {
  /** Current digit buffer as string of digits (or empty). Controlled. */
  value: string
  onChange: (next: string) => void
  /** Fired when the user submits (✓, Enter, or keypad ✓). Emits the parsed numeric value. */
  onSubmit: (value: number) => void
  /**
   * When set, the input auto-submits the moment the typed value equals this
   * number — no explicit ✓ press required. Drives the speed improvement in
   * drill and challenge sessions.
   */
  expectedAnswer?: number
  /** Virtual keyboard variant forwarded to the Keypad. Default 'numeric'. */
  keyboardType?: KeyboardType
  /** Maximum number of digits the buffer can hold (default 4). */
  maxDigits?: number
  /** Disables the input, the ✓ button, and the keypad. */
  disabled?: boolean
  /** Native input placeholder text. */
  placeholder?: string
}

// AnswerInput renders a native <input> (autoFocus) with two action buttons:
//   • A keyboard-icon toggle that shows/hides the virtual Keypad below it
//   • A ✓ submit button for explicit submission
//
// Auto-submit: when `expectedAnswer` is set and the typed value matches it
// exactly the input calls `onSubmit` on the same event — zero extra keypresses.
//
// The buffer is controlled by the caller so the session can clear it on
// problem advance without needing a setState-in-effect.
export function AnswerInput({
  value,
  onChange,
  onSubmit,
  expectedAnswer,
  keyboardType = 'numeric',
  maxDigits = 4,
  disabled = false,
  placeholder = '',
}: AnswerInputProps) {
  const [showKeypad, setShowKeypad] = useState(false)

  // ── shared logic ─────────────────────────────────────────────────────────

  /** Emit a value and auto-submit if it matches the expected answer. */
  const commitValue = useCallback(
    (next: string) => {
      onChange(next)
      if (expectedAnswer !== undefined && next.length > 0 && Number(next) === expectedAnswer) {
        onSubmit(Number(next))
      }
    },
    [onChange, expectedAnswer, onSubmit],
  )

  const handleSubmit = useCallback(() => {
    if (disabled || value.length === 0) return
    onSubmit(Number(value))
  }, [disabled, value, onSubmit])

  // ── native <input> handlers ───────────────────────────────────────────────

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return
      // Strip non-digits, cap length, collapse leading zeros (e.g. "05" → "5").
      const raw = e.target.value.replace(/\D/g, '').slice(0, maxDigits)
      const next = raw === '' ? '' : String(parseInt(raw, 10))
      commitValue(next)
    },
    [disabled, maxDigits, commitValue],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        handleSubmit()
      }
    },
    [handleSubmit],
  )

  // ── virtual keypad handlers ───────────────────────────────────────────────

  const handleKeypadDigit = useCallback(
    (digit: number) => {
      if (disabled) return
      // Preserve the same leading-zero semantics as the native input handler.
      let next: string
      if (value === '' || (value === '0' && digit !== 0)) {
        next = String(digit)
      } else if (value === '0' && digit === 0) {
        next = '0'
      } else if (value.length < maxDigits) {
        next = value + String(digit)
      } else {
        return // already at max — ignore
      }
      commitValue(next)
    },
    [disabled, value, maxDigits, commitValue],
  )

  const handleKeypadBackspace = useCallback(() => {
    if (disabled) return
    onChange(value.slice(0, -1))
  }, [disabled, value, onChange])

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <Box w="full">
      <HStack gap={2} mb={showKeypad ? 3 : 0}>
        {/* Virtual keyboard toggle — left of input */}
        <Button
          aria-label={showKeypad ? 'Hide keyboard' : 'Show keyboard'}
          onClick={() => setShowKeypad((v) => !v)}
          variant={showKeypad ? 'solid' : 'outline'}
          colorPalette={showKeypad ? 'brand' : undefined}
          h="64px"
          w="52px"
          px={0}
          borderRadius="xl"
          flexShrink={0}
        >
          <KeyboardIcon />
        </Button>

        <Input
          autoFocus
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          aria-label="Your answer"
          flex={1}
          h="64px"
          fontSize="3xl"
          fontFamily="mono"
          textAlign="center"
          borderRadius="xl"
          borderWidth="1px"
          borderColor="border.subtle"
          bg="bg.card"
          css={{ '--focus-ring-color': 'var(--chakra-colors-brand-500)' }}
        />

        {/* Explicit submit — right of input */}
        <Button
          aria-label="Submit answer"
          onClick={handleSubmit}
          disabled={disabled || value.length === 0}
          colorPalette="brand"
          variant="solid"
          h="64px"
          w="52px"
          px={0}
          borderRadius="xl"
          flexShrink={0}
          fontSize="2xl"
        >
          ✓
        </Button>
      </HStack>

      {showKeypad && (
        <Keypad
          variant={keyboardType}
          onDigit={handleKeypadDigit}
          onBackspace={handleKeypadBackspace}
          disabled={disabled}
        />
      )}
    </Box>
  )
}

// Inline keyboard SVG icon — no external icon library dependency.
function KeyboardIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
      {/* top row dots */}
      <circle cx="6" cy="9.5" r="1" fill="currentColor" />
      <circle cx="10" cy="9.5" r="1" fill="currentColor" />
      <circle cx="14" cy="9.5" r="1" fill="currentColor" />
      <circle cx="18" cy="9.5" r="1" fill="currentColor" />
      {/* spacebar row */}
      <circle cx="6" cy="13.5" r="1" fill="currentColor" />
      <rect x="9" y="13" width="6" height="1.5" rx="0.75" fill="currentColor" />
      <circle cx="18" cy="13.5" r="1" fill="currentColor" />
    </svg>
  )
}
