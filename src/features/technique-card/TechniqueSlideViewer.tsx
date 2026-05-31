import { useCallback, useEffect, useState } from 'react'
import { Box, Button, HStack, Stack, Text } from '@chakra-ui/react'
import { motion, useReducedMotion } from 'framer-motion'
import type { Slide } from './types'
import { SlideContent } from './SlideContent'
import { useSwipeNavigation } from './useSwipeNavigation'

export interface TechniqueSlideViewerProps {
  slides: readonly Slide[]
  /** Label on the final-slide CTA. Defaults to "Got it". */
  completeLabel?: string
  /** Fired when the user clicks the final-slide CTA. */
  onComplete: () => void
}

/**
 * Tier-1 slide engine. Renders one slide at a time with prev/next controls,
 * keyboard arrows, swipe (mobile), and a Framer Motion slide-x transition
 * that respects `prefers-reduced-motion`.
 */
export function TechniqueSlideViewer({
  slides,
  completeLabel = 'Got it',
  onComplete,
}: TechniqueSlideViewerProps) {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const reducedMotion = useReducedMotion()

  const goNext = useCallback(() => {
    setDirection(1)
    setIndex((i) => Math.min(slides.length - 1, i + 1))
  }, [slides.length])

  const goPrev = useCallback(() => {
    setDirection(-1)
    setIndex((i) => Math.max(0, i - 1))
  }, [])

  const swipeRef = useSwipeNavigation({ onPrev: goPrev, onNext: goNext })

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext()
      else if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNext, goPrev])

  const isLast = index === slides.length - 1
  const isFirst = index === 0
  const slide = slides[index]

  const slideKey = `slide-${index}`

  return (
    <Stack gap={6}>
      <HStack justify="space-between" align="center">
        <Text
          fontSize="xs"
          color="text.muted"
          textTransform="uppercase"
          letterSpacing="wider"
          data-testid="slide-counter"
        >
          {index + 1} / {slides.length}
        </Text>
      </HStack>

      <Box
        ref={swipeRef}
        position="relative"
        minH="320px"
        overflow="hidden"
        role="region"
        aria-label="Technique slide"
        data-testid="slide-viewport"
        style={{ touchAction: 'pan-y' }}
      >
        <motion.div
          key={slideKey}
          initial={
            reducedMotion ? { opacity: 0 } : { opacity: 0, x: direction * 40 }
          }
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: reducedMotion ? 0.1 : 0.22, ease: 'easeOut' }}
        >
          <SlideContent slide={slide} />
        </motion.div>
      </Box>

      <HStack justify="space-between">
        <Button
          variant="ghost"
          onClick={goPrev}
          disabled={isFirst}
          aria-label="Previous slide"
        >
          ← Prev
        </Button>
        {isLast ? (
          <Button
            bg="brand.500"
            color="white"
            _hover={{ bg: 'brand.600' }}
            onClick={onComplete}
            aria-label={completeLabel}
          >
            {completeLabel}
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={goNext}
            aria-label="Next slide"
          >
            Next →
          </Button>
        )}
      </HStack>
    </Stack>
  )
}
