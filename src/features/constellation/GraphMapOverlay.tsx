import { CloseButton, Box } from '@chakra-ui/react'
import ConstellationMapScreen from './ConstellationMapScreen'

interface GraphMapOverlayProps {
  open: boolean
  onClose: () => void
}

/**
 * GraphMapOverlay — full-screen fixed overlay that renders the constellation
 * map. Opens/closes via the GraphMapButton FAB in App.tsx.
 *
 * Clicking a node calls `onClose` (to dismiss the overlay) then navigates
 * to the topic screen — handled via the `onNavigate` prop on ConstellationMapScreen.
 */
export default function GraphMapOverlay({ open, onClose }: GraphMapOverlayProps) {
  if (!open) return null

  return (
    <Box
      position="fixed"
      inset={0}
      zIndex={100}
      bg="bg.app"
    >
      <ConstellationMapScreen onNavigate={onClose} />
      <CloseButton
        position="fixed"
        top={4}
        right={4}
        zIndex={101}
        size="lg"
        onClick={onClose}
        aria-label="Close constellation map"
        bg="bg.card"
        borderWidth="1px"
        borderColor="border.subtle"
        borderRadius="full"
      />
    </Box>
  )
}
