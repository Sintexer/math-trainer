import { Box, Button, Flex, HStack, Text } from '@chakra-ui/react'
import type { Problem } from '@/shared/types'
import type { FlashStatus } from '../flashSessionReducer'
import { FlashProblemPicker } from './FlashProblemPicker'

const HISTORY_DEPTH = 2

export interface FlashInSessionProps {
  problems: Problem[]
  currentIndex: number
  /** Kept for API compatibility — flash has no visual state difference per status. */
  status: FlashStatus
  onAdvance: () => void
  onExit: () => void
}

export function FlashInSession({
  problems,
  currentIndex,
  onAdvance,
  onExit,
}: FlashInSessionProps) {
  const totalProblems = problems.length
  const cardNumber = currentIndex + 1

  return (
    <Flex direction="column" minH="100dvh" p={{ base: 4, md: 8 }} gap={3}>

      {/* ── Top: exit × | X of Y ── */}
      <HStack
        justify="space-between"
        align="center"
        flexShrink={0}
        position="relative"
        zIndex={1}
      >
        <Button
          size="sm"
          variant="ghost"
          aria-label="Exit flash"
          onClick={onExit}
          color="text.muted"
          fontSize="xl"
          px={2}
        >
          ×
        </Button>
        <Text fontSize="sm" color="text.muted" fontWeight="medium">
          {cardNumber} of {totalProblems}
        </Text>
        <Box w="36px" />
      </HStack>

      {/* ── Card with picker wheel layout ── */}
      <Flex
        direction="column"
        flex={1}
        borderWidth="1px"
        borderColor="border.subtle"
        borderRadius="2xl"
        bg="bg.card"
        p={{ base: 5, md: 8 }}
        overflow="hidden"
        position="relative"
        zIndex={1}
        gap={4}
        minH={0}
      >
        {/* Problem picker — shows 2 prev + current */}
        <Box flex={1} minH={0} display="flex" alignItems="center" justifyContent="center">
          <FlashProblemPicker
            problems={problems}
            currentIndex={currentIndex}
          />
        </Box>

        {/* Next button pinned to the bottom of the card */}
        <Box flexShrink={0} w="full" maxW="480px" mx="auto">
          <Button
            w="full"
            onClick={onAdvance}
            bg="brand.500"
            color="white"
            _hover={{ bg: 'brand.600' }}
          >
            Next →
          </Button>
        </Box>
      </Flex>
    </Flex>
  )
}
