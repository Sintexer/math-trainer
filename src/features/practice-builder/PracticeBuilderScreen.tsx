import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Badge,
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  HStack,
  RadioGroup,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react'
import { getAllLearningTopics, findTechnique } from '@/content'
import type { LearningTopic } from '@/shared/types'

type Step = 'topic-select' | 'technique-select' | 'config'
type PracticeMode = 'drill' | 'flash' | 'challenge'

const PROBLEM_COUNT_OPTIONS = [10, 20, 50, 100]
const DURATION_OPTIONS = [30, 60, 120]

export default function PracticeBuilderScreen() {
  const navigate = useNavigate()
  const topics = useMemo(() => getAllLearningTopics(), [])

  const [step, setStep] = useState<Step>('topic-select')
  const [selectedTopicIds, setSelectedTopicIds] = useState<Set<string>>(new Set())
  const [selectedTechniqueIds, setSelectedTechniqueIds] = useState<Set<string>>(new Set())
  const [mode, setMode] = useState<PracticeMode>('drill')
  const [problemCount, setProblemCount] = useState(20)
  const [durationSeconds, setDurationSeconds] = useState(60)

  // Collect all technique IDs for selected topics
  const topicTechniques = useMemo(() => {
    const selectedTopics = topics.filter((t) => selectedTopicIds.has(t.id))
    return selectedTopics.flatMap((t) => t.techniqueIds as string[])
  }, [topics, selectedTopicIds])

  function handleTopicToggle(topicId: string) {
    setSelectedTopicIds((prev) => {
      const next = new Set(prev)
      if (next.has(topicId)) {
        next.delete(topicId)
      } else {
        next.add(topicId)
      }
      return next
    })
  }

  function handleSelectAllTopics() {
    if (selectedTopicIds.size === topics.length) {
      setSelectedTopicIds(new Set())
    } else {
      setSelectedTopicIds(new Set(topics.map((t) => t.id)))
    }
  }

  function goToTechniqueSelect() {
    // Default: all techniques in selected topics are selected
    setSelectedTechniqueIds(new Set(topicTechniques))
    setStep('technique-select')
  }

  function handleTechniqueToggle(techniqueId: string) {
    setSelectedTechniqueIds((prev) => {
      const next = new Set(prev)
      if (next.has(techniqueId)) {
        next.delete(techniqueId)
      } else {
        next.add(techniqueId)
      }
      return next
    })
  }

  function handleLaunch() {
    const ids = [...selectedTechniqueIds]
    if (ids.length === 0) return
    const params = new URLSearchParams()
    params.set('techniques', ids.join(','))
    params.set('mode', mode)
    if (mode === 'challenge') {
      params.set('duration', String(durationSeconds))
    } else {
      params.set('count', String(problemCount))
    }
    navigate(`/practice/session?${params}`)
  }

  return (
    <Flex direction="column" minH="100dvh" p={{ base: 4, md: 8 }}>
      <Button
        size="sm"
        variant="ghost"
        alignSelf="flex-start"
        mb={4}
        onClick={() => {
          if (step === 'topic-select') navigate('/')
          else if (step === 'technique-select') setStep('topic-select')
          else setStep('technique-select')
        }}
        aria-label="Back"
      >
        ← Back
      </Button>

      {step === 'topic-select' && (
        <TopicSelectStep
          topics={topics}
          selectedTopicIds={selectedTopicIds}
          onToggle={handleTopicToggle}
          onSelectAll={handleSelectAllTopics}
          onNext={() => goToTechniqueSelect()}
        />
      )}

      {step === 'technique-select' && (
        <TechniqueSelectStep
          topics={topics.filter((t) => selectedTopicIds.has(t.id))}
          selectedTechniqueIds={selectedTechniqueIds}
          onToggle={handleTechniqueToggle}
          onNext={() => setStep('config')}
        />
      )}

      {step === 'config' && (
        <ConfigStep
          techniqueCount={selectedTechniqueIds.size}
          mode={mode}
          onModeChange={setMode}
          problemCount={problemCount}
          onProblemCountChange={setProblemCount}
          durationSeconds={durationSeconds}
          onDurationChange={setDurationSeconds}
          onLaunch={handleLaunch}
        />
      )}
    </Flex>
  )
}

// ── Steps ─────────────────────────────────────────────────────────────────────

interface TopicSelectStepProps {
  topics: LearningTopic[]
  selectedTopicIds: Set<string>
  onToggle: (id: string) => void
  onSelectAll: () => void
  onNext: () => void
}

function TopicSelectStep({
  topics,
  selectedTopicIds,
  onToggle,
  onSelectAll,
  onNext,
}: TopicSelectStepProps) {
  const allSelected = selectedTopicIds.size === topics.length
  return (
    <Box maxW="600px" mx="auto" w="full">
      <Heading size="xl" mb={1}>
        Custom Practice
      </Heading>
      <Text color="text.muted" mb={6}>
        Step 1 of 3 — choose topics
      </Text>

      <HStack justify="space-between" mb={3}>
        <Text fontWeight="semibold" fontSize="sm">
          Topics
        </Text>
        <Button size="xs" variant="ghost" onClick={onSelectAll}>
          {allSelected ? 'Deselect all' : 'Select all'}
        </Button>
      </HStack>

      <SimpleGrid minChildWidth="160px" gap={3} mb={6}>
        {topics.map((topic) => {
          const selected = selectedTopicIds.has(topic.id)
          return (
            <Stack
              key={topic.id}
              gap={1}
              p={4}
              borderRadius="lg"
              borderWidth="2px"
              borderColor={selected ? 'brand.500' : 'border.subtle'}
              bg={selected ? 'brand.50' : 'bg.card'}
              cursor="pointer"
              onClick={() => onToggle(topic.id)}
              role="checkbox"
              aria-checked={selected}
            >
              <Text fontWeight="semibold" fontSize="sm">
                {topic.name}
              </Text>
              <Text fontSize="xs" color="text.muted">
                {topic.techniqueIds.length} techniques
              </Text>
            </Stack>
          )
        })}
      </SimpleGrid>

      <Button
        w="full"
        onClick={onNext}
        bg="brand.500"
        color="white"
        _hover={{ bg: 'brand.600' }}
        disabled={selectedTopicIds.size === 0}
      >
        Next →
      </Button>
    </Box>
  )
}

interface TechniqueSelectStepProps {
  topics: LearningTopic[]
  selectedTechniqueIds: Set<string>
  onToggle: (id: string) => void
  onNext: () => void
}

function TechniqueSelectStep({
  topics,
  selectedTechniqueIds,
  onToggle,
  onNext,
}: TechniqueSelectStepProps) {
  return (
    <Box maxW="600px" mx="auto" w="full">
      <Heading size="xl" mb={1}>
        Custom Practice
      </Heading>
      <Text color="text.muted" mb={6}>
        Step 2 of 3 — choose techniques
      </Text>

      <Stack gap={6} mb={6}>
        {topics.map((topic) => (
          <Stack key={topic.id} gap={2}>
            <Text fontWeight="semibold" fontSize="sm" color="text.muted" textTransform="uppercase">
              {topic.name}
            </Text>
            {(topic.techniqueIds as string[]).map((id) => {
              const technique = findTechnique(id)
              if (!technique) return null
              const selected = selectedTechniqueIds.has(id)
              return (
                <HStack
                  key={id}
                  p={3}
                  borderRadius="md"
                  borderWidth="1px"
                  borderColor={selected ? 'brand.400' : 'border.subtle'}
                  bg={selected ? 'brand.50' : 'bg.card'}
                  cursor="pointer"
                  onClick={() => onToggle(id)}
                  gap={3}
                >
                  <Checkbox.Root checked={selected} readOnly>
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                  </Checkbox.Root>
                  <Box flex={1}>
                    <Text fontSize="sm" fontWeight={selected ? 'semibold' : 'normal'}>
                      {technique.name}
                    </Text>
                  </Box>
                  <Badge size="sm" colorPalette={technique.difficulty === 'easy' ? 'green' : technique.difficulty === 'medium' ? 'orange' : 'red'}>
                    {technique.difficulty}
                  </Badge>
                </HStack>
              )
            })}
          </Stack>
        ))}
      </Stack>

      <Button
        w="full"
        onClick={onNext}
        disabled={selectedTechniqueIds.size === 0}
        bg="brand.500"
        color="white"
        _hover={{ bg: 'brand.600' }}
      >
        Next → ({selectedTechniqueIds.size} selected)
      </Button>
    </Box>
  )
}

interface ConfigStepProps {
  techniqueCount: number
  mode: PracticeMode
  onModeChange: (m: PracticeMode) => void
  problemCount: number
  onProblemCountChange: (n: number) => void
  durationSeconds: number
  onDurationChange: (s: number) => void
  onLaunch: () => void
}

function ConfigStep({
  techniqueCount,
  mode,
  onModeChange,
  problemCount,
  onProblemCountChange,
  durationSeconds,
  onDurationChange,
  onLaunch,
}: ConfigStepProps) {
  return (
    <Box maxW="480px" mx="auto" w="full">
      <Heading size="xl" mb={1}>
        Custom Practice
      </Heading>
      <Text color="text.muted" mb={6}>
        Step 3 of 3 — configure ({techniqueCount} technique{techniqueCount !== 1 ? 's' : ''})
      </Text>

      <Stack gap={6}>
        <Stack gap={2}>
          <Text fontWeight="semibold" fontSize="sm">
            Mode
          </Text>
          <RadioGroup.Root value={mode} onValueChange={(e) => onModeChange(e.value as PracticeMode)}>
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
                  onClick={() => onProblemCountChange(n)}
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
                  onClick={() => onDurationChange(s)}
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

        <Button
          size="lg"
          onClick={onLaunch}
          bg="brand.500"
          color="white"
          _hover={{ bg: 'brand.600' }}
        >
          Start →
        </Button>
      </Stack>
    </Box>
  )
}
