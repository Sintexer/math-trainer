import { useMemo } from 'react'
import {
  Box,
  CloseButton,
  Dialog,
  Heading,
  Portal,
  Stack,
} from '@chakra-ui/react'
import { findTechnique, getTechniqueContent } from '@/content'
import { TechniqueSlideViewer } from './TechniqueSlideViewer'

export interface TechniqueReferenceModalProps {
  techniqueId: string
  open: boolean
  onClose: () => void
}

/**
 * Read-only reference overlay for use inside an active Drill or Challenge
 * session. The slide viewer is the same component as the standalone screen,
 * but the final-slide CTA simply closes the dialog — opening this modal
 * never mutates progress, and it must not unmount the underlying session.
 */
export function TechniqueReferenceModal({
  techniqueId,
  open,
  onClose,
}: TechniqueReferenceModalProps) {
  const technique = useMemo(
    () => findTechnique(techniqueId),
    [techniqueId],
  )
  const content = useMemo(
    () => (technique ? getTechniqueContent(technique.id) : null),
    [technique],
  )

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(d) => {
        if (!d.open) onClose()
      }}
      size="lg"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content data-testid="technique-reference-modal">
            <Dialog.Header>
              <Heading size="md">
                {technique ? technique.name : 'Technique'}
              </Heading>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" aria-label="Close reference" />
              </Dialog.CloseTrigger>
            </Dialog.Header>
            <Dialog.Body>
              {!technique || !content ? (
                <Box>Unknown technique.</Box>
              ) : (
                <Stack gap={4}>
                  <TechniqueSlideViewer
                    slides={content.slides}
                    completeLabel="Close"
                    onComplete={onClose}
                  />
                </Stack>
              )}
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
