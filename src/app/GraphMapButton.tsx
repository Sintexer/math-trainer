import { Box } from '@chakra-ui/react'

interface GraphMapButtonProps {
  onOpen: () => void
  hidden?: boolean
}

/**
 * GraphMapButton — fixed ghost FAB (bottom-right) that opens the constellation
 * map overlay. Rendered in App.tsx so it persists across all routes.
 *
 * Hidden while the overlay is open to avoid stacking on top of the close button.
 */
export default function GraphMapButton({ onOpen, hidden = false }: GraphMapButtonProps) {
  if (hidden) return null

  return (
    <Box
      as="button"
      position="fixed"
      bottom={6}
      right={6}
      zIndex={50}
      w="52px"
      h="52px"
      borderRadius="full"
      borderWidth="1px"
      borderColor="border.subtle"
      bg="bg.card"
      display="flex"
      alignItems="center"
      justifyContent="center"
      cursor="pointer"
      onClick={onOpen}
      aria-label="Open constellation map"
      _hover={{ borderColor: 'brand.500', color: 'brand.500' }}
      style={{ opacity: 0.9 }}
    >
      {/* Constellation icon — 5 dots connected by lines */}
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        aria-hidden="true"
      >
        <line x1="6" y1="5" x2="18" y2="8" stroke="currentColor" strokeWidth="0.8" />
        <line x1="18" y1="8" x2="13" y2="16" stroke="currentColor" strokeWidth="0.8" />
        <line x1="13" y1="16" x2="4" y2="18" stroke="currentColor" strokeWidth="0.8" />
        <line x1="13" y1="16" x2="20" y2="19" stroke="currentColor" strokeWidth="0.8" />
        <line x1="6" y1="5" x2="4" y2="18" stroke="currentColor" strokeWidth="0.8" />
        <circle cx="6" cy="5" r="1.8" fill="currentColor" />
        <circle cx="18" cy="8" r="1.8" fill="currentColor" />
        <circle cx="13" cy="16" r="1.8" fill="currentColor" />
        <circle cx="4" cy="18" r="1.8" fill="currentColor" />
        <circle cx="20" cy="19" r="1.8" fill="currentColor" />
      </svg>
    </Box>
  )
}
