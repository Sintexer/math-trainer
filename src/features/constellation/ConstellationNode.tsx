import { Box, HStack, Text } from '@chakra-ui/react'
import type { MasteryStars } from '@/shared/types'

/** Half the node size — used to center the node on its canvas coordinates. */
export const NODE_SIZE = 80
const HALF = NODE_SIZE / 2

type NodeState = 'mastered' | 'active' | 'unvisited'

function resolveState(
  techniqueRead: boolean,
  hasAnySessions: boolean,
  stars: MasteryStars,
): NodeState {
  if (stars.speed && stars.accuracy && stars.range) return 'mastered'
  if (techniqueRead || hasAnySessions) return 'active'
  return 'unvisited'
}

export interface ConstellationNodeProps {
  techniqueId: string
  name: string
  /** Canvas-space center X coordinate. */
  x: number
  /** Canvas-space center Y coordinate. */
  y: number
  stars: MasteryStars
  techniqueRead: boolean
  hasAnySessions: boolean
  /** Called with the technique ID when the user taps/clicks without panning. */
  onClick: (id: string) => void
}

/**
 * A single node on the constellation map.
 *
 * Absolutely positioned within the 1200×900 canvas div. Visual state:
 *   unvisited → dim grey ring, muted label
 *   active    → brand-colour ring, full opacity
 *   mastered  → filled brand background, white label
 */
export function ConstellationNode({
  techniqueId,
  name,
  x,
  y,
  stars,
  techniqueRead,
  hasAnySessions,
  onClick,
}: ConstellationNodeProps) {
  const state = resolveState(techniqueRead, hasAnySessions, stars)

  const borderColor =
    state === 'mastered' ? 'brand.500' : state === 'active' ? 'brand.300' : 'gray.300'
  const bg =
    state === 'mastered' ? 'brand.500' : state === 'active' ? 'bg.card' : 'bg.app'
  const nameColor =
    state === 'mastered' ? 'white' : state === 'active' ? 'text.primary' : 'text.muted'
  const opacity = state === 'unvisited' ? 0.55 : 1

  return (
    <Box
      position="absolute"
      left={`${x - HALF}px`}
      top={`${y - HALF}px`}
      w={`${NODE_SIZE}px`}
      h={`${NODE_SIZE}px`}
      borderRadius="xl"
      borderWidth="2px"
      borderColor={borderColor}
      bg={bg}
      opacity={opacity}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap="4px"
      p="6px"
      cursor="pointer"
      onClick={() => onClick(techniqueId)}
      transition="transform 0.12s ease, box-shadow 0.12s ease"
      _hover={{ transform: 'scale(1.1)', boxShadow: 'md' }}
      role="button"
      aria-label={`${name}${state === 'mastered' ? ', mastered' : state === 'active' ? ', in progress' : ', not started'}`}
      data-node-id={techniqueId}
    >
      {/* Technique name — CSS line-clamp to 2 lines */}
      <Text
        fontSize="9px"
        fontWeight="semibold"
        color={nameColor}
        textAlign="center"
        lineHeight="1.25"
        style={{
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          wordBreak: 'break-word',
          maxWidth: '68px',
        }}
      >
        {name}
      </Text>

      {/* Three mastery dot indicators */}
      <HStack gap="3px">
        <MasteryDot filled={stars.speed} tokenColor="star.speed" label="Speed" />
        <MasteryDot filled={stars.accuracy} tokenColor="star.accuracy" label="Accuracy" />
        <MasteryDot filled={stars.range} tokenColor="star.range" label="Range" />
      </HStack>
    </Box>
  )
}

function MasteryDot({
  filled,
  tokenColor,
  label,
}: {
  filled: boolean
  tokenColor: string
  label: string
}) {
  return (
    <Box
      w="8px"
      h="8px"
      borderRadius="full"
      bg={filled ? tokenColor : 'transparent'}
      borderWidth="1.5px"
      borderColor={filled ? tokenColor : 'gray.400'}
      opacity={filled ? 1 : 0.45}
      aria-label={`${label} star ${filled ? 'earned' : 'not earned'}`}
    />
  )
}
