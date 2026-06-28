import { Badge, HStack, Text } from '@chakra-ui/react'
import type { Difficulty } from '@/shared/types'

export interface DifficultyBadgeProps {
  difficulty: Difficulty
}

const DOTS_BY_DIFFICULTY: Record<Difficulty, number> = {
  easy: 1,
  medium: 2,
  hard: 3,
}

const LABEL_BY_DIFFICULTY: Record<Difficulty, string> = {
  easy: 'easy',
  medium: 'medium',
  hard: 'hard',
}

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const dotCount = DOTS_BY_DIFFICULTY[difficulty]
  const label = LABEL_BY_DIFFICULTY[difficulty]

  return (
    <Badge variant="subtle" colorPalette="gray" px={3} py={1}>
      <HStack gap={1.5}>
        <Text fontSize="xs" fontWeight="medium">
          {label}
        </Text>
        {Array.from({ length: dotCount }).map((_, i) => (
          <Text key={i} fontSize="xs">
            ◦
          </Text>
        ))}
      </HStack>
    </Badge>
  )
}
