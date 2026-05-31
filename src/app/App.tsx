import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { ChakraProvider } from '@chakra-ui/react'
import { store, persistor } from './store'
import { system } from './theme'
import AppRouter from './router'

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ChakraProvider value={system}>
          <AppRouter />
        </ChakraProvider>
      </PersistGate>
    </Provider>
  )
}
