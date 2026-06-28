import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { configureStore } from '@reduxjs/toolkit'
import progressReducer from '@/features/progress/progressSlice'
import TechniqueCardScreen from './TechniqueCardScreen'

const TECH = 'mul-by-11'

function renderAt(path: string) {
  const store = configureStore({ reducer: { progress: progressReducer } })
  const view = render(
    <Provider store={store}>
      <ChakraProvider value={defaultSystem}>
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route path="/" element={<div data-testid="map">map</div>} />
            <Route
              path="/topic/:topicId"
              element={<div data-testid="topic">topic</div>}
            />
            <Route
              path="/challenge/:techniqueId/theory"
              element={<TechniqueCardScreen />}
            />
          </Routes>
        </MemoryRouter>
      </ChakraProvider>
    </Provider>,
  )
  return { ...view, store }
}

async function clickThroughTo(label: string | RegExp) {
  const user = userEvent.setup()
  // Walk forward until the named CTA exists on the page.
  while (!screen.queryByRole('button', { name: label })) {
    const next = screen.queryByRole('button', { name: /Next slide/i })
    if (!next) break
    await user.click(next)
  }
  return user
}

describe('TechniqueCardScreen', () => {
  it('renders the technique name and slide viewer', () => {
    renderAt(`/challenge/${TECH}/theory`)
    expect(
      screen.getByRole('heading', { name: /Multiply by 11/i }),
    ).toBeInTheDocument()
    expect(screen.getByTestId('slide-counter')).toBeInTheDocument()
  })

  it('shows an error screen for an unknown technique', () => {
    renderAt('/challenge/bogus-id/theory')
    expect(screen.getByText(/Unknown technique/i)).toBeInTheDocument()
  })

  it('"Got it" dispatches markTechniqueRead and navigates back to topic', async () => {
    const { store } = renderAt(`/challenge/${TECH}/theory`)
    const user = await clickThroughTo(/Got it/i)
    await user.click(screen.getByRole('button', { name: /Got it/i }))
    expect(store.getState().progress.techniqueProgress[TECH]?.techniqueRead).toBe(
      true,
    )
    expect(screen.getByTestId('topic')).toBeInTheDocument()
  })

  it('shows "Done" CTA (not "Got it") when already read', async () => {
    const store = configureStore({ reducer: { progress: progressReducer } })
    store.dispatch({ type: 'progress/markTechniqueRead', payload: TECH })
    render(
      <Provider store={store}>
        <ChakraProvider value={defaultSystem}>
          <MemoryRouter initialEntries={[`/challenge/${TECH}/theory`]}>
            <Routes>
              <Route
                path="/challenge/:techniqueId/theory"
                element={<TechniqueCardScreen />}
              />
              <Route
                path="/topic/:topicId"
                element={<div data-testid="topic">topic</div>}
              />
            </Routes>
          </MemoryRouter>
        </ChakraProvider>
      </Provider>,
    )
    await clickThroughTo(/Done/i)
    expect(screen.getByRole('button', { name: /^Done$/i })).toBeInTheDocument()
  })
})
