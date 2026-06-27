import { HashRouter, Routes, Route } from 'react-router-dom'
import { Box, Heading, Text } from '@chakra-ui/react'
import PrimitivesDemoScreen from '@/features/input/demo/PrimitivesDemoScreen'
import { DrillScreen } from '@/features/drill'
import { ChallengeScreen } from '@/features/challenge'
import { TechniqueCardScreen } from '@/features/technique-card'
import { ConstellationMapScreen } from '@/features/constellation'
import { TopicScreen } from '@/features/topic'

// HashRouter is intentional: the app deploys to GitHub Pages, which serves
// static files and cannot rewrite arbitrary paths to /index.html. Switching
// to BrowserRouter would break direct links and refreshes on any non-root URL.
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
    <HashRouter>
      <Routes>
        <Route path="/" element={<ConstellationMapScreen />} />
        <Route path="/topic/:techniqueId" element={<TopicScreen />} />
        <Route
          path="/topic/:techniqueId/technique"
          element={<TechniqueCardScreen />}
        />
        <Route path="/topic/:techniqueId/drill" element={<DrillScreen />} />
        <Route
          path="/topic/:techniqueId/challenge"
          element={<ChallengeScreen />}
        />
        <Route path="/daily" element={<Placeholder name="Daily Challenge" />} />
        <Route path="/profile" element={<Placeholder name="Profile" />} />
        <Route path="/settings" element={<Placeholder name="Settings" />} />
        {/* Dev-only preview of Phase 5 input primitives. Mounted in all builds
            so the route works on the deployed preview, but not linked from
            production navigation. */}
        {import.meta.env.DEV && (
          <Route path="/dev/primitives" element={<PrimitivesDemoScreen />} />
        )}
      </Routes>
    </HashRouter>
  )
}
