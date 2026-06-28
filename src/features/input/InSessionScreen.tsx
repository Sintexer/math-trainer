// Unified in-session screen shared by Drill, Challenge, Topic Test, and Custom
// sessions. Handles: full-screen gradient feedback, animated border, prompt
// completion animation (no layout shift), feedback label above the prompt,
// auto-advance timer, and an optional technique reference modal.
//
// The only variation between modes is the `headerCenter` slot — callers pass
// a counter (<Text>3 of 15</Text>) or a countdown timer.

import { type ReactNode, useEffect, useRef, useState } from 'react'
import { Box, Button, Flex, Heading, HStack, Text } from '@chakra-ui/react'
import type { KeyboardType, Problem } from '@/shared/types'
import { AnswerInput } from './AnswerInput'
import { TechniqueReferenceModal } from '@/features/technique-card'

// Auto-advance delays (ms).
const ADVANCE_CORRECT_MS = 800
const ADVANCE_INCORRECT_MS = 1500

export interface InSessionScreenProps {
  problem: Problem
  /** Rendered in the center of the top header bar (counter text or timer). */
  headerCenter: ReactNode
  evaluating: boolean
  lastAnswerCorrect: boolean | null
  /** The correct answer to display on correct, and show when incorrect. */
  lastCorrectAnswer: number | null
  onSubmit: (answer: number) => void
  onAdvance: () => void
  onExit: () => void
  /** When false, the ? reference button is omitted. Defaults to true. */
  showReferenceButton?: boolean
  /** Aria label for the × exit button. */
  exitAriaLabel?: string
  /** data-testid for the prompt heading. Defaults to "session-prompt". */
  promptTestId?: string
}

export function InSessionScreen({
  problem,
  headerCenter,
  evaluating,
  lastAnswerCorrect,
  lastCorrectAnswer,
  onSubmit,
  onAdvance,
  onExit,
  showReferenceButton = true,
  exitAriaLabel = 'Exit session',
  promptTestId = 'session-prompt',
}: InSessionScreenProps) {
  const [referenceOpen, setReferenceOpen] = useState(false)

  // Auto-advance: fire onAdvance after the delay when evaluating starts.
  // Ref so onAdvance identity changes don't restart the timer.
  const onAdvanceRef = useRef(onAdvance)
  onAdvanceRef.current = onAdvance

  useEffect(() => {
    if (!evaluating) return
    const delay = lastAnswerCorrect === true ? ADVANCE_CORRECT_MS : ADVANCE_INCORRECT_MS
    const id = window.setTimeout(() => onAdvanceRef.current(), delay)
    return () => window.clearTimeout(id)
  }, [evaluating, lastAnswerCorrect])

  // Derived visual states.
  const correct = evaluating && lastAnswerCorrect === true
  const incorrect = evaluating && lastAnswerCorrect === false

  // Card border color.
  const borderColor = correct ? 'green.400' : incorrect ? 'red.300' : 'border.subtle'

  // Full-screen gradient: fixed layer from bottom edge → top edge of viewport.
  // Opacity transitions between 0 (idle) and 1 (evaluating).
  const gradientOpacity = evaluating ? 1 : 0
  const gradientColor = correct
    ? 'rgba(22,163,74,0.18)'   // green.500 @ 18% — darker green
    : incorrect
      ? 'rgba(239,68,68,0.14)' // red.500 @ 14%
      : 'rgba(22,163,74,0.18)'

  // Prompt: replace trailing ? with the answer on correct.
  // Use display:inline-grid with two stacked rows so the prompt never shifts
  // width — both the ? version and the answer version are rendered but only
  // one is visible. This keeps the heading at a stable size.
  const answerStr = lastCorrectAnswer !== null ? String(lastCorrectAnswer) : '?'
  const promptWithAnswer = problem.prompt.replace(/\?$/, answerStr)
  const promptWithQ = problem.prompt // always ends in ?
  // When correct, show the substituted prompt in green; otherwise show the original.
  // Feedback label rendered above the prompt (fixed-height slot).
  const feedbackLabel = correct
    ? 'Correct!'
    : incorrect
      ? `Answer: ${answerStr}`
      : ''
  const feedbackColor = correct ? 'green.600' : 'red.500'
  const feedbackOpacity = evaluating ? 1 : 0

  return (
    // Outer wrapper: position:relative so the fixed gradient can be scoped to
    // this subtree (we use position:fixed on the gradient instead so it covers
    // the full viewport regardless of scroll).
    <Flex direction="column" minH="100dvh" p={{ base: 4, md: 8 }} gap={3}>
      {/* ── Full-screen gradient overlay (pointer-events:none, behind everything) ── */}
      <Box
        position="fixed"
        inset={0}
        zIndex={0}
        pointerEvents="none"
        style={{
          background: `linear-gradient(to top, ${gradientColor} 0%, transparent 60%)`,
          opacity: gradientOpacity,
          transition: 'opacity 0.25s ease',
        }}
      />

      {/* ── All content sits above the gradient ── */}
      <Box position="relative" zIndex={1} display="contents">

        {/* ── Top: exit × | header center | reference ? ── */}
        <HStack justify="space-between" align="center" flexShrink={0}>
          <Button
            size="sm"
            variant="ghost"
            aria-label={exitAriaLabel}
            onClick={onExit}
            color="text.muted"
            fontSize="xl"
            px={2}
          >
            ×
          </Button>
          {headerCenter}
          {showReferenceButton ? (
            <Button
              size="sm"
              variant="ghost"
              aria-label="Open technique reference"
              onClick={() => setReferenceOpen(true)}
            >
              ?
            </Button>
          ) : (
            <Box w="36px" />
          )}
        </HStack>

        {/* ── Card ── */}
        <Flex
          direction="column"
          flex={1}
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="2xl"
          bg="bg.card"
          p={{ base: 5, md: 8 }}
          overflow="hidden"
          position="relative"
          zIndex={2}
          style={{ transition: 'border-color 0.2s ease' }}
        >
          {/* Problem zone — fills space, vertically centered */}
          <Flex flex={1} alignItems="center" justifyContent="center">
            <Box textAlign="center" w="full" maxW="600px" mx="auto">

              {/* Fixed-height feedback label above the prompt.
                  Uses the same reserved-space trick: always h="6", text fades
                  in/out so the prompt heading never moves. */}
              <Box
                h="6"
                mb={2}
                role="status"
                aria-live="polite"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  color={feedbackColor}
                  style={{
                    opacity: feedbackOpacity,
                    transition: 'opacity 0.15s ease',
                  }}
                >
                  {feedbackLabel}
                </Text>
              </Box>

              {/* Prompt heading — stable width/height achieved by rendering both
                  variants in an inline-grid stack and toggling visibility, so
                  the container is always sized to the wider of the two strings.
                  The ? is replaced by the answer on correct; the heading is
                  otherwise unchanged for incorrect. */}
              <Box display="inline-grid" style={{ gridTemplateAreas: "'stack'" }}>
                {/* Row 1: prompt with answer substituted */}
                <Heading
                  as="div"
                  size="2xl"
                  fontFamily="mono"
                  data-testid={promptTestId}
                  style={{
                    gridArea: 'stack',
                    color: correct ? '#15803d' : 'transparent', // green.600 or invisible
                    transition: 'color 0.15s ease',
                    // When not correct, this row is colour:transparent so it
                    // still occupies space but is not visible.
                    userSelect: correct ? 'auto' : 'none',
                    pointerEvents: correct ? 'auto' : 'none',
                  }}
                >
                  {promptWithAnswer}
                </Heading>
                {/* Row 2: original prompt with ? — visible when not correct */}
                <Heading
                  as="div"
                  size="2xl"
                  fontFamily="mono"
                  aria-hidden="true"
                  style={{
                    gridArea: 'stack',
                    opacity: correct ? 0 : 1,
                    transition: 'opacity 0.15s ease',
                    pointerEvents: 'none',
                  }}
                >
                  {promptWithQ}
                </Heading>
              </Box>

            </Box>
          </Flex>

          {/* Bottom: input + optional feedback echo below prompt */}
          <Box flexShrink={0} w="full" maxW="480px" mx="auto">
            {/* Keyed on problem.id so the buffer resets on advance. */}
            <AnswerForm
              key={problem.id}
              onSubmit={onSubmit}
              disabled={evaluating}
              expectedAnswer={problem.answer}
              keyboardType={problem.keyboardType}
            />
          </Box>
        </Flex>

      </Box>

      {showReferenceButton && (
        <TechniqueReferenceModal
          techniqueId={problem.techniqueId}
          open={referenceOpen}
          onClose={() => setReferenceOpen(false)}
        />
      )}
    </Flex>
  )
}

// ── Internal AnswerForm ────────────────────────────────────────────────────

interface AnswerFormProps {
  onSubmit: (answer: number) => void
  disabled?: boolean
  expectedAnswer?: number
  keyboardType?: KeyboardType
}

function AnswerForm({ onSubmit, disabled, expectedAnswer, keyboardType }: AnswerFormProps) {
  const [buffer, setBuffer] = useState('')
  return (
    <AnswerInput
      value={buffer}
      onChange={setBuffer}
      onSubmit={(value) => {
        setBuffer('')
        onSubmit(value)
      }}
      expectedAnswer={expectedAnswer}
      keyboardType={keyboardType}
      disabled={disabled}
    />
  )
}
