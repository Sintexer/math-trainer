import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { ChakraProvider } from '@chakra-ui/react'
import { store, persistor } from './store'
import { system } from './theme'
import AppRouter from './router'

// ChakraProvider wraps PersistGate so any custom rehydration UI we add later
// has access to the theme / tokens.
export default function App() {
  return (
    <Provider store={store}>
      <ChakraProvider value={system}>
        <PersistGate loading={null} persistor={persistor}>
          <AppRouter />
        </PersistGate>
      </ChakraProvider>
    </Provider>
  )
}
