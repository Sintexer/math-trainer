import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Badge,
  Box,
  Button,
  HStack,
  Heading,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react'
import { findTechnique, getMasteryThresholds } from '@/content'
import { useAppSelector } from '@/app/hooks'
import {
  MASTERY_WINDOW,
  selectChallengePassed,
  selectMasteryStars,
  selectTechniqueProgress,
  selectTechniqueRead,
} from '@/features/progress'
import type { MasteryStars } from '@/shared/types'

/**
 * TopicScreen — Phase 9.
 *
 * The central hub for a single technique. Shows mastery state at a glance
 * and provides entry points to all three tiers (Technique card, Drill,
 * Challenge). Drill and Challenge cards show a soft-lock indicator when the
 * technique hasn't been read yet, but the CTAs remain navigable — the
 * entry screens handle the nudge.
 */
export default function TopicScreen() {
  const { techniqueId = '' } = useParams<{ techniqueId: string }>()
  const navigate = useNavigate()

  const technique = useMemo(() => findTechnique(techniqueId), [techniqueId])
  const thresholds = useMemo(
    () => (technique ? getMasteryThresholds(techniqueId) : null),
    [technique, techniqueId],
  )

  const stars = useAppSelector((s) => selectMasteryStars(s, techniqueId))
  const techniqueRead = useAppSelector((s) => selectTechniqueRead(s, techniqueId))
  const challengePassed = useAppSelector((s) => selectChallengePassed(s, techniqueId))
  const progress = useAppSelector((s) => selectTechniqueProgress(s, techniqueId))

  // Rolling averages over last MASTERY_WINDOW drill sessions — mirrors the
  // star computation in progressSlice so the numbers stay consistent.
  const recentDrills = useMemo(
    () => progress?.sessions.filter((s) => s.type === 'drill').slice(-MASTERY_WINDOW) ?? [],
    [progress],
  )
  const avgSpeed =
    recentDrills.length > 0
      ? recentDrills.reduce((sum, s) => sum + s.speedPerMin, 0) / recentDrills.length
      : 0
  const difficultiesCovered = progress?.difficultiesCovered ?? []
  const hasDrillHistory = recentDrills.length > 0
  const lastDrillSession =
    progress?.sessions.filter((s) => s.type === 'drill').at(-1) ?? null

  if (!technique || !thresholds) {
    return (
      <Box p={8}>
        <Text color="text.muted">Technique not found: {techniqueId}</Text>
        <Button mt={4} onClick={() => navigate('/')}>
          ← Back
        </Button>
      </Box>
    )
  }

  return (
    <Box p={{ base: 4, md: 8 }} maxW="800px" mx="auto">
      <Button
        size="sm"
        variant="ghost"
        onClick={() => navigate('/')}
        mb={4}
        aria-label="Back"
      >
        ← Back
      </Button>

      {/* Header */}
      <Heading size="xl" mb={1}>
        {technique.name}
      </Heading>
      <HStack mb={3} gap={2} flexWrap="wrap">
        <Badge>{technique.topicId}</Badge>
        <Badge colorPalette="purple">{technique.difficulty}</Badge>
      </HStack>
      <Text color="text.muted" mb={6}>
        {technique.description}
      </Text>

      {/* Mastery panel — rolling avg vs threshold, one item per star */}
      <Box
        p={5}
        borderRadius="lg"
        borderWidth="1px"
        borderColor="border.subtle"
        bg="bg.card"
        mb={6}
      >
        <Heading
          size="sm"
          color="text.muted"
          textTransform="uppercase"
          letterSpacing="wider"
          mb={3}
        >
          Mastery
        </Heading>
        <HStack gap={{ base: 4, md: 8 }} flexWrap="wrap">
          <MasteryItem
            label="Speed"
            filled={stars.speed}
            tokenColor="star.speed"
            current={avgSpeed > 0 ? `${avgSpeed.toFixed(1)}/min` : '—'}
            target={`need ${thresholds.speedPerMin}/min`}
          />
          <MasteryItem
            label="Range"
            filled={stars.range}
            tokenColor="star.range"
            current={`${difficultiesCovered.length}/3`}
            target="need all 3 difficulties"
          />
        </HStack>
      </Box>

      {/* Three tier cards — stack on mobile, row on desktop */}
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
        <TierCard
          icon="📖"
          title="Technique"
          status={techniqueRead ? 'Read ✓' : 'Not read yet'}
          statusHighlight={techniqueRead}
          description="Learn the mental trick behind this technique."
          ctaLabel={techniqueRead ? 'Read again' : 'Read now'}
          locked={false}
          accent={false}
          onClick={() => navigate(`/topic/${techniqueId}/technique`)}
        />
        <TierCard
          icon="🏋️"
          title="Drill"
          status={
            !techniqueRead
              ? 'Read technique first'
              : lastDrillSession
                ? `Last: ${lastDrillSession.speedPerMin}/min · ${lastDrillSession.accuracyPct}%`
                : 'No sessions yet'
          }
          statusHighlight={false}
          description="Build speed and accuracy through repeated practice."
          ctaLabel="Start Drill"
          locked={!techniqueRead}
          accent={false}
          stars={stars}
          onClick={() => navigate(`/topic/${techniqueId}/drill`)}
        />
        <TierCard
          icon="⚡"
          title="Challenge"
          status={
            !techniqueRead
              ? 'Read technique first'
              : challengePassed
                ? 'Passed ✓'
                : hasDrillHistory
                  ? 'Ready to test'
                  : 'Warm up with drills first'
          }
          statusHighlight={challengePassed}
          description={`Pass ≥${thresholds.speedPerMin}/min to clear this technique.`}
          ctaLabel={challengePassed ? 'Try Again' : 'Start Challenge'}
          locked={!techniqueRead}
          accent={challengePassed}
          onClick={() => navigate(`/topic/${techniqueId}/challenge`)}
        />
      </SimpleGrid>
    </Box>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

interface MasteryItemProps {
  label: string
  filled: boolean
  tokenColor: string
  current: string
  target: string
}

function MasteryItem({ label, filled, tokenColor, current, target }: MasteryItemProps) {
  return (
    <Stack gap={0.5} minW="110px">
      <HStack gap={1.5}>
        <Text fontSize="lg" color={filled ? tokenColor : 'text.muted'} aria-hidden="true">
          {filled ? '★' : '☆'}
        </Text>
        <Text fontSize="sm" fontWeight="semibold">
          {label}
        </Text>
      </HStack>
      <Text
        fontSize="sm"
        fontWeight={filled ? 'bold' : 'normal'}
        color={filled ? tokenColor : 'text.primary'}
      >
        {current}
      </Text>
      {!filled && (
        <Text fontSize="xs" color="text.muted">
          {target}
        </Text>
      )}
    </Stack>
  )
}

interface TierCardProps {
  icon: string
  title: string
  status: string
  statusHighlight: boolean
  description: string
  ctaLabel: string
  locked: boolean
  accent: boolean
  stars?: MasteryStars
  onClick: () => void
}

function TierCard({
  icon,
  title,
  status,
  statusHighlight,
  description,
  ctaLabel,
  locked,
  accent,
  stars,
  onClick,
}: TierCardProps) {
  const borderColor = accent ? 'green.300' : locked ? 'orange.200' : 'border.subtle'
  const bg = accent ? 'green.50' : locked ? 'bg.app' : 'bg.card'
  const statusColor = statusHighlight ? 'green.600' : locked ? 'orange.500' : 'text.muted'

  return (
    <Stack gap={3} p={5} borderRadius="lg" borderWidth="1px" borderColor={borderColor} bg={bg} h="full">
      <Text fontSize="2xl" aria-hidden="true">
        {icon}
      </Text>
      <Box>
        <Heading size="md" mb={1}>
          {title}
        </Heading>
        <Text fontSize="sm" color={statusColor}>
          {status}
        </Text>
      </Box>
      {/* flex="1" expands the description so the CTA button sits at the card bottom */}
      <Text fontSize="sm" color="text.muted" flex={1}>
        {description}
      </Text>
      {stars && (
        <HStack gap={3}>
          <StarIndicator label="Speed" filled={stars.speed} tokenColor="star.speed" />
          <StarIndicator label="Range" filled={stars.range} tokenColor="star.range" />
        </HStack>
      )}
      <Button
        size="sm"
        w="full"
        minH="44px"
        onClick={onClick}
        bg="brand.500"
        color="white"
        _hover={{ bg: 'brand.600' }}
      >
        {ctaLabel}
      </Button>
    </Stack>
  )
}

function StarIndicator({
  label,
  filled,
  tokenColor,
}: {
  label: string
  filled: boolean
  tokenColor: string
}) {
  return (
    <HStack gap={1} aria-label={`${label}: ${filled ? 'earned' : 'not earned'}`}>
      <Text fontSize="sm" color={filled ? tokenColor : 'text.muted'} aria-hidden="true">
        {filled ? '★' : '☆'}
      </Text>
      <Text fontSize="xs" color={filled ? 'text.primary' : 'text.muted'}>
        {label}
      </Text>
    </HStack>
  )
}
