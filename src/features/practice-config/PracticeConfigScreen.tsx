import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  RadioGroup,
  Stack,
  Text,
} from '@chakra-ui/react'
import { findTechnique } from '@/content'
import type { Difficulty } from '@/shared/types'

type PracticeMode = 'drill' | 'flash' | 'challenge'
type PracticeDifficulty = Difficulty | 'mixed'

const PROBLEM_COUNT_OPTIONS = [10, 20, 50, 100]
const DURATION_OPTIONS = [30, 60, 120]

export default function PracticeConfigScreen() {
  const { techniqueId = '' } = useParams<{ techniqueId: string }>()
  const navigate = useNavigate()

  const technique = useMemo(() => findTechnique(techniqueId), [techniqueId])

  const [mode, setMode] = useState<PracticeMode>('drill')
  const [problemCount, setProblemCount] = useState(20)
  const [durationSeconds, setDurationSeconds] = useState(60)
  const [difficulty, setDifficulty] = useState<PracticeDifficulty>('mixed')

  if (!technique) {
    return (
      <Box p={8}>
        <Heading size="lg">Unknown technique</Heading>
        <Button mt={4} onClick={() => navigate('/')}>
          Back to map
        </Button>
      </Box>
    )
  }

  function handleStart() {
    const params = new URLSearchParams()
    if (difficulty !== 'mixed') params.set('difficulty', difficulty)

    if (mode === 'drill') {
      params.set('count', String(problemCount))
      navigate(`/challenge/${techniqueId}/drill?${params}`)
    } else if (mode === 'flash') {
      params.set('count', String(problemCount))
      navigate(`/challenge/${techniqueId}/flash?${params}`)
    } else {
      params.set('duration', String(durationSeconds))
      navigate(`/challenge/${techniqueId}?${params}`)
    }
  }

  return (
    <Flex direction="column" minH="100dvh" p={{ base: 4, md: 8 }}>
      <Button
        size="sm"
        variant="ghost"
        alignSelf="flex-start"
        mb={4}
        onClick={() => navigate(-1)}
        aria-label="Back"
      >
        ← Back
      </Button>

      <Box maxW="480px" mx="auto" w="full">
        <Heading size="xl" mb={1}>
          Custom Practice
        </Heading>
        <Text color="text.muted" mb={6}>
          {technique.name}
        </Text>

        <Stack gap={6}>
          {/* Mode */}
          <Stack gap={2}>
            <Text fontWeight="semibold" fontSize="sm">
              Mode
            </Text>
            <RadioGroup.Root
              value={mode}
              onValueChange={(e) => setMode(e.value as PracticeMode)}
            >
              <HStack gap={4} flexWrap="wrap">
                <RadioGroup.Item value="drill">
                  <RadioGroup.ItemHiddenInput />
                  <RadioGroup.ItemIndicator />
                  <RadioGroup.ItemText>Drill</RadioGroup.ItemText>
                </RadioGroup.Item>
                <RadioGroup.Item value="flash">
                  <RadioGroup.ItemHiddenInput />
                  <RadioGroup.ItemIndicator />
                  <RadioGroup.ItemText>⚡ Flash</RadioGroup.ItemText>
                </RadioGroup.Item>
                <RadioGroup.Item value="challenge">
                  <RadioGroup.ItemHiddenInput />
                  <RadioGroup.ItemIndicator />
                  <RadioGroup.ItemText>Timed Challenge</RadioGroup.ItemText>
                </RadioGroup.Item>
              </HStack>
            </RadioGroup.Root>
          </Stack>

          {/* Problem count (drill and flash) */}
          {mode !== 'challenge' && (
            <Stack gap={2}>
              <Text fontWeight="semibold" fontSize="sm">
                Problems
              </Text>
              <HStack gap={2} flexWrap="wrap">
                {PROBLEM_COUNT_OPTIONS.map((n) => (
                  <Button
                    key={n}
                    size="sm"
                    variant={problemCount === n ? 'solid' : 'outline'}
                    onClick={() => setProblemCount(n)}
                    bg={problemCount === n ? 'brand.500' : undefined}
                    color={problemCount === n ? 'white' : undefined}
                    _hover={problemCount === n ? { bg: 'brand.600' } : undefined}
                  >
                    {n}
                  </Button>
                ))}
              </HStack>
            </Stack>
          )}

          {/* Duration (challenge) */}
          {mode === 'challenge' && (
            <Stack gap={2}>
              <Text fontWeight="semibold" fontSize="sm">
                Duration
              </Text>
              <HStack gap={2} flexWrap="wrap">
                {DURATION_OPTIONS.map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    variant={durationSeconds === s ? 'solid' : 'outline'}
                    onClick={() => setDurationSeconds(s)}
                    bg={durationSeconds === s ? 'brand.500' : undefined}
                    color={durationSeconds === s ? 'white' : undefined}
                    _hover={durationSeconds === s ? { bg: 'brand.600' } : undefined}
                  >
                    {s}s
                  </Button>
                ))}
              </HStack>
            </Stack>
          )}

          {/* Difficulty */}
          <Stack gap={2}>
            <Text fontWeight="semibold" fontSize="sm">
              Difficulty
            </Text>
            <RadioGroup.Root
              value={difficulty}
              onValueChange={(e) => setDifficulty(e.value as PracticeDifficulty)}
            >
              <HStack gap={4} flexWrap="wrap">
                {(['mixed', 'easy', 'medium', 'hard'] as PracticeDifficulty[]).map((d) => (
                  <RadioGroup.Item key={d} value={d}>
                    <RadioGroup.ItemHiddenInput />
                    <RadioGroup.ItemIndicator />
                    <RadioGroup.ItemText style={{ textTransform: 'capitalize' }}>
                      {d}
                    </RadioGroup.ItemText>
                  </RadioGroup.Item>
                ))}
              </HStack>
            </RadioGroup.Root>
          </Stack>

          <Button
            size="lg"
            onClick={handleStart}
            bg="brand.500"
            color="white"
            _hover={{ bg: 'brand.600' }}
          >
            Start →
          </Button>
        </Stack>
      </Box>
    </Flex>
  )
}
