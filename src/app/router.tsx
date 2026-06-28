import { Routes, Route } from 'react-router-dom'
import { Box, Heading, Text } from '@chakra-ui/react'
import PrimitivesDemoScreen from '@/features/input/demo/PrimitivesDemoScreen'
import { DrillScreen } from '@/features/drill'
import { ChallengeScreen } from '@/features/challenge'
import { TechniqueCardScreen } from '@/features/technique-card'
import { TopicHubScreen } from '@/features/topic'
import { HomeScreen } from '@/features/home'
import { DailyScreen } from '@/features/daily'

// HashRouter lives in App.tsx — it is intentionally NOT here. The app deploys
// to GitHub Pages which serves static files and cannot rewrite arbitrary paths
// to /index.html. The router must stay hash-based and must be the outermost
// routing context so overlays rendered outside <AppRouter> can still call
// useNavigate().
function Placeholder({ name }: { name: string }) {
  return (
    <Box p={8}>
      <Heading size="lg">{name}</Heading>
      <Text mt={2} color="gray.500">
        Coming soon — see ROADMAP.md.
      </Text>
    </Box>
  )
}

export default function AppRouter() {
  return (
    <Routes>
      {/* Home — learning topic cards */}
      <Route path="/" element={<HomeScreen />} />

      {/* Topic hub — groups one or more challenges by sub-domain */}
      <Route path="/topic/:topicId" element={<TopicHubScreen />} />

      {/* Individual challenge routes — flat, no topic context needed */}
      <Route path="/challenge/:techniqueId" element={<ChallengeScreen />} />
      <Route path="/challenge/:techniqueId/theory" element={<TechniqueCardScreen />} />
      <Route path="/challenge/:techniqueId/drill" element={<DrillScreen />} />
      {/* /challenge/:techniqueId/flash — Flash mode (coming soon, not yet implemented) */}

      <Route path="/daily" element={<DailyScreen />} />
      <Route path="/profile" element={<Placeholder name="Profile" />} />
      <Route path="/settings" element={<Placeholder name="Settings" />} />
      {/* Dev-only preview of Phase 5 input primitives. Mounted in all builds
          so the route works on the deployed preview, but not linked from
          production navigation. */}
      {import.meta.env.DEV && (
        <Route path="/dev/primitives" element={<PrimitivesDemoScreen />} />
      )}
    </Routes>
  )
}
