import { HashRouter, Routes, Route } from 'react-router-dom'
import MapPage from '@/pages/MapPage'
import TopicPage from '@/pages/TopicPage'
import TechniqueCardPage from '@/pages/TechniqueCardPage'
import DrillPage from '@/pages/DrillPage'
import ChallengePage from '@/pages/ChallengePage'
import DailyChallengePage from '@/pages/DailyChallengePage'
import ProfilePage from '@/pages/ProfilePage'
import SettingsPage from '@/pages/SettingsPage'

// HashRouter is intentional: the app deploys to GitHub Pages, which serves
// static files and cannot rewrite arbitrary paths to /index.html. Switching
// to BrowserRouter would break direct links and refreshes on any non-root URL.
export default function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        {/* Main constellation map */}
        <Route path="/" element={<MapPage />} />

        {/* Topic detail — all three tiers */}
        <Route path="/topic/:techniqueId" element={<TopicPage />} />
        <Route path="/topic/:techniqueId/technique" element={<TechniqueCardPage />} />
        <Route path="/topic/:techniqueId/drill" element={<DrillPage />} />
        <Route path="/topic/:techniqueId/challenge" element={<ChallengePage />} />

        {/* Daily challenge */}
        <Route path="/daily" element={<DailyChallengePage />} />

        {/* User profile & settings */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </HashRouter>
  )
}
