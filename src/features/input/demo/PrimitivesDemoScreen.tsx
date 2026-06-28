import { useEffect, useState } from 'react'
import { Box, Button, Heading, HStack, Stack, Text } from '@chakra-ui/react'
import {
  AnswerFeedback,
  AnswerInput,
  SessionProgress,
  Timer,
  type FeedbackState,
} from '@/features/input'

// Dev-only demo route mounted at /dev/primitives. Lets us hand-verify each
// primitive on real devices without spinning up a full Drill screen. Not
// linked from production navigation.
//
// Replaces Storybook (which the project does not use) per ROADMAP §5.6.
export default function PrimitivesDemoScreen() {
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState<FeedbackState>('idle')
  const [lastSubmitted, setLastSubmitted] = useState<number | null>(null)

  const [attempted, setAttempted] = useState(0)
  const [correct, setCorrect] = useState(0)

  // Demo countdown driven by a local interval. Production sessions will
  // drive the Timer from the session reducer instead.
  const [remainingMs, setRemainingMs] = useState(60_000)
  const totalMs = 60_000
  useEffect(() => {
    const id = window.setInterval(() => {
      setRemainingMs((ms) => Math.max(0, ms - 200))
    }, 200)
    return () => window.clearInterval(id)
  }, [])

  // Demo elapsed-time for SessionProgress.
  const [elapsedMs, setElapsedMs] = useState(0)
  useEffect(() => {
    const id = window.setInterval(() => setElapsedMs((e) => e + 200), 200)
    return () => window.clearInterval(id)
  }, [])

  function submit(value: number) {
    setLastSubmitted(value)
    setAttempted((n) => n + 1)
    // Pretend "42" is always correct, just to demo both feedback states.
    const isCorrect = value === 42
    if (isCorrect) setCorrect((n) => n + 1)
    setFeedback(isCorrect ? 'correct' : 'incorrect')
    setAnswer('')
  }

  return (
    <Box p={{ base: 4, md: 8 }} maxW="640px" mx="auto">
      <Heading size="lg" mb={1}>
        Input Primitives — Dev Preview
      </Heading>
      <Text color="text.muted" mb={6}>
        Phase 5 components. Submit <b>42</b> to see a correct flash; any other number flashes
        incorrect. Not linked from production routes.
      </Text>

      <Stack gap={8}>
        <Section title="Timer (controlled)">
          <Timer remainingMs={remainingMs} totalMs={totalMs} />
          <HStack mt={3} justify="center">
            <Button size="sm" onClick={() => setRemainingMs(60_000)}>
              Reset 60s
            </Button>
            <Button size="sm" onClick={() => setRemainingMs(8_000)}>
              Jump to 8s (warning)
            </Button>
            <Button size="sm" onClick={() => setRemainingMs(3_000)}>
              Jump to 3s (pulse)
            </Button>
          </HStack>
        </Section>

        <Section title="Session progress">
          <SessionProgress
            attempted={attempted}
            correct={correct}
            totalProblems={15}
            elapsedMs={elapsedMs}
          />
        </Section>

        <Section title="Answer input + keypad + feedback">
          <AnswerInput
            value={answer}
            onChange={setAnswer}
            onSubmit={submit}
            disabled={feedback !== 'idle'}
          />
          <Box mt={4}>
            <AnswerFeedback
              state={feedback}
              correctAnswer={42}
              onDismiss={() => setFeedback('idle')}
            />
          </Box>
          {lastSubmitted !== null && (
            <Text mt={3} fontSize="sm" color="text.muted" textAlign="center">
              Last submitted: {lastSubmitted}
            </Text>
          )}
        </Section>
      </Stack>
    </Box>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box>
      <Heading size="sm" mb={3} color="text.muted" textTransform="uppercase" letterSpacing="wider">
        {title}
      </Heading>
      <Box p={4} borderRadius="lg" borderWidth="2px" borderColor="border.subtle" bg="bg.card">
        {children}
      </Box>
    </Box>
  )
}
