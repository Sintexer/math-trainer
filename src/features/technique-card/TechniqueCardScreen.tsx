import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  Stack,
  Text,
} from '@chakra-ui/react'
import { findTechnique, getTechniqueContent, getLearningTopicForTechnique } from '@/content'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { markTechniqueRead, selectTechniqueRead } from '@/features/progress'
import { TechniqueSlideViewer } from './TechniqueSlideViewer'

/**
 * TechniqueCardScreen — Phase 8.
 *
 * Renders the slide-based technique reference for `/topic/:techniqueId/technique`.
 * Tapping "Got it" on the final slide marks the technique as read (the
 * unlock signal consumed by Drill/Challenge soft gates and, later, the
 * Topic Detail screen in Phase 9) and routes back to the topic.
 *
 * Already-read techniques still show the same viewer, but the final CTA
 * reads "Done" so the user knows there is no state change to commit.
 */
export default function TechniqueCardScreen() {
  const { techniqueId = '' } = useParams<{ techniqueId: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const technique = useMemo(() => findTechnique(techniqueId), [techniqueId])
  const content = useMemo(
    () => (technique ? getTechniqueContent(technique.id) : null),
    [technique],
  )
  const alreadyRead = useAppSelector((s) => selectTechniqueRead(s, techniqueId))

  if (!technique || !content) {
    return (
      <Flex direction="column" minH="100dvh" p={8}>
        <Heading size="lg">Unknown technique</Heading>
        <Text mt={2} color="text.muted">
          No technique with id <code>{techniqueId}</code>.
        </Text>
        <Button mt={4} onClick={() => navigate('/')}>
          Back to map
        </Button>
      </Flex>
    )
  }

  const onComplete = () => {
    if (!alreadyRead) dispatch(markTechniqueRead(technique.id))
    const topicId = getLearningTopicForTechnique(technique.id)?.id
    navigate(topicId ? `/topic/${topicId}` : '/')
  }

  return (
    <Flex direction="column" minH="100dvh" p={{ base: 4, md: 8 }}>
      <Box maxW="720px" mx="auto" w="full">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            const topicId = getLearningTopicForTechnique(technique.id)?.id
            navigate(topicId ? `/topic/${topicId}` : '/')
          }}
          mb={4}
          aria-label="Back to topic"
        >
          ← Back
        </Button>

        <Stack gap={2} mb={6}>
          <Heading size="xl">{technique.name}</Heading>
          <HStack gap={2}>
            <Badge>{technique.topicId}</Badge>
            <Badge colorPalette="purple">{technique.difficulty}</Badge>
            {alreadyRead && <Badge colorPalette="green">Read</Badge>}
          </HStack>
        </Stack>

        <TechniqueSlideViewer
          slides={content.slides}
          completeLabel={alreadyRead ? 'Done' : 'Got it'}
          onComplete={onComplete}
        />
      </Box>
    </Flex>
  )
}
