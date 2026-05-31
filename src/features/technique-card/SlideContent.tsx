import { Box, Button, Heading, Stack, Text } from '@chakra-ui/react'
import type {
  ConceptSlide,
  EdgeCaseSlide,
  Slide,
  TryItSlide,
  WorkedSlide,
} from './types'
import { useState } from 'react'

export function SlideContent({ slide }: { slide: Slide }) {
  switch (slide.kind) {
    case 'concept':
      return <ConceptSlideView slide={slide} />
    case 'worked':
      return <WorkedSlideView slide={slide} />
    case 'edge-case':
      return <EdgeCaseSlideView slide={slide} />
    case 'try-it':
      return <TryItSlideView slide={slide} />
  }
}

function ConceptSlideView({ slide }: { slide: ConceptSlide }) {
  return (
    <Stack gap={4}>
      <Heading size="lg">{slide.heading}</Heading>
      <Text fontSize="md" lineHeight="tall">
        {slide.body}
      </Text>
      {slide.mentalModel && (
        <Box
          p={4}
          borderRadius="md"
          bg="bg.card"
          borderLeftWidth="4px"
          borderLeftColor="brand.500"
        >
          <Text fontSize="sm" color="text.muted" fontStyle="italic">
            {slide.mentalModel}
          </Text>
        </Box>
      )}
    </Stack>
  )
}

function WorkedSlideView({ slide }: { slide: WorkedSlide }) {
  return (
    <Stack gap={4}>
      <Text
        fontSize="xs"
        color="text.muted"
        textTransform="uppercase"
        letterSpacing="wider"
      >
        Worked example
      </Text>
      <Heading
        as="div"
        size="xl"
        fontFamily="mono"
        data-testid="worked-problem"
      >
        {slide.problem}
      </Heading>
      <Stack gap={2} as="ol" pl={5} listStyleType="decimal">
        {slide.steps.map((step, i) => (
          <Text as="li" key={i} fontSize="md" lineHeight="tall">
            {step}
          </Text>
        ))}
      </Stack>
      <Box
        mt={2}
        p={3}
        borderRadius="md"
        bg="bg.card"
        borderWidth="1px"
        borderColor="border.subtle"
      >
        <Text fontFamily="mono" fontSize="lg">
          Answer: <strong>{slide.answer}</strong>
        </Text>
      </Box>
    </Stack>
  )
}

function EdgeCaseSlideView({ slide }: { slide: EdgeCaseSlide }) {
  return (
    <Stack gap={4}>
      <Text
        fontSize="xs"
        color="orange.500"
        textTransform="uppercase"
        letterSpacing="wider"
      >
        Watch out
      </Text>
      <Heading size="lg">{slide.heading}</Heading>
      <Text fontSize="md" lineHeight="tall">
        {slide.body}
      </Text>
      {slide.examples && slide.examples.length > 0 && (
        <Stack gap={1} as="ul" pl={5} listStyleType="disc">
          {slide.examples.map((ex, i) => (
            <Text as="li" key={i} fontFamily="mono" fontSize="sm">
              {ex}
            </Text>
          ))}
        </Stack>
      )}
    </Stack>
  )
}

function TryItSlideView({ slide }: { slide: TryItSlide }) {
  const [revealed, setRevealed] = useState(false)
  return (
    <Stack gap={4}>
      <Text
        fontSize="xs"
        color="text.muted"
        textTransform="uppercase"
        letterSpacing="wider"
      >
        Try it
      </Text>
      <Heading
        as="div"
        size="xl"
        fontFamily="mono"
        data-testid="try-it-problem"
      >
        {slide.problem}
      </Heading>
      <Text fontSize="sm" color="text.muted">
        Work it out in your head, then reveal the approach.
      </Text>
      {!revealed && (
        <Button
          variant="outline"
          size="sm"
          alignSelf="flex-start"
          onClick={() => setRevealed(true)}
        >
          Reveal hint &amp; answer
        </Button>
      )}
      {revealed && (
        <Stack
          gap={2}
          p={4}
          borderRadius="md"
          bg="bg.card"
          borderWidth="1px"
          borderColor="border.subtle"
        >
          <Text fontSize="sm" color="text.muted">
            {slide.hint}
          </Text>
          <Text fontFamily="mono" fontSize="lg">
            Answer: <strong>{slide.answer}</strong>
          </Text>
        </Stack>
      )}
    </Stack>
  )
}
