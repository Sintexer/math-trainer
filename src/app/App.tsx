import { useState } from 'react'
import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { ChakraProvider } from '@chakra-ui/react'
import { store, persistor } from './store'
import { system } from './theme'
import AppRouter from './router'
import GraphMapButton from './GraphMapButton'
import GraphMapOverlay from '@/features/constellation/GraphMapOverlay'

// HashRouter is lifted here (instead of inside AppRouter) so that
// ConstellationMapScreen — rendered inside the fixed GraphMapOverlay —
// has access to the router context for useNavigate().
export default function App() {
  const [mapOpen, setMapOpen] = useState(false)

  return (
    <Provider store={store}>
      <ChakraProvider value={system}>
        <PersistGate loading={null} persistor={persistor}>
          <HashRouter>
            <AppRouter />
            <GraphMapButton
              onOpen={() => setMapOpen(true)}
              hidden={mapOpen}
            />
            <GraphMapOverlay
              open={mapOpen}
              onClose={() => setMapOpen(false)}
            />
          </HashRouter>
        </PersistGate>
      </ChakraProvider>
    </Provider>
  )
}
