import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { configureStore } from '@reduxjs/toolkit'
import progressReducer from '@/features/progress/progressSlice'
import ChallengeScreen from './ChallengeScreen'

const TECH = 'mul-by-11'

function renderAt(path: string) {
  const store = configureStore({ reducer: { progress: progressReducer } })
  const view = render(
    <Provider store={store}>
      <ChakraProvider value={defaultSystem}>
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route path="/" element={<div data-testid="map">map</div>} />
            <Route path="/challenge/:techniqueId/drill" element={<div data-testid="drill">drill</div>} />
            <Route
              path="/challenge/:techniqueId"
              element={<ChallengeScreen />}
            />
          </Routes>
        </MemoryRouter>
      </ChakraProvider>
    </Provider>,
  )
  return { ...view, store }
}

describe('ChallengeScreen', () => {
  beforeEach(() => {
    // shouldAdvanceTime keeps the fake clock auto-stepping with the real
    // event loop so user-event's internal setTimeouts resolve naturally.
    // Explicit vi.advanceTimersByTime() still works for jumping forward to
    // expire the 60s session timer in a single step.
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  const makeUser = () => userEvent.setup()

  it('renders the entry screen with technique name and pass thresholds', () => {
    renderAt(`/challenge/${TECH}`)
    expect(screen.getByRole('heading', { name: /Multiply by 11/i })).toBeInTheDocument()
    expect(screen.getByText(/To pass/i)).toBeInTheDocument()
    // mul-by-11 threshold: 7/min (no accuracy threshold any more)
    expect(screen.getByText(/≥ 7\/min/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Start Challenge/i })).toBeInTheDocument()
  })

  it('shows an error screen for an unknown technique', () => {
    renderAt('/challenge/bogus-id')
    expect(screen.getByText(/Unknown technique/i)).toBeInTheDocument()
  })

  it('Start CTA transitions to the in-session screen with timer and first problem', async () => {
    const user = makeUser()
    renderAt(`/challenge/${TECH}`)
    await user.click(screen.getByRole('button', { name: /Start Challenge/i }))
    expect(screen.getByTestId('challenge-prompt')).toBeInTheDocument()
    expect(screen.getByRole('timer')).toBeInTheDocument()
  })

  it('shows the fail result when the timer expires with no answers', async () => {
    const user = makeUser()
    const { store } = renderAt(`/challenge/${TECH}`)
    await user.click(screen.getByRole('button', { name: /Start Challenge/i }))

    // Advance well past the 60s configured duration.
    await act(async () => {
      vi.advanceTimersByTime(61_000)
    })

    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: /Not there yet/i }),
      ).toBeInTheDocument(),
    )

    const persisted = store.getState().progress.techniqueProgress[TECH]
    expect(persisted).toBeDefined()
    expect(persisted!.sessions).toHaveLength(1)
    expect(persisted!.sessions[0].type).toBe('challenge')
    expect(persisted!.challengePassed).toBe(false)
  })

  it('Back to Map navigates to "/"', async () => {
    const user = makeUser()
    renderAt(`/challenge/${TECH}`)
    await user.click(screen.getByRole('button', { name: /Start Challenge/i }))
    await act(async () => {
      vi.advanceTimersByTime(61_000)
    })
    await screen.findByRole('heading', { name: /Not there yet/i })
    await user.click(screen.getByRole('button', { name: /Back to Map/i }))
    expect(screen.getByTestId('map')).toBeInTheDocument()
  })

  it('Try Drills navigates to the drill route on fail', async () => {
    const user = makeUser()
    renderAt(`/challenge/${TECH}`)
    await user.click(screen.getByRole('button', { name: /Start Challenge/i }))
    await act(async () => {
      vi.advanceTimersByTime(61_000)
    })
    await screen.findByRole('heading', { name: /Not there yet/i })
    await user.click(screen.getByRole('button', { name: /Try Drills/i }))
    expect(screen.getByTestId('drill')).toBeInTheDocument()
  })

  it('Try Again resets back to the entry screen', async () => {
    const user = makeUser()
    renderAt(`/challenge/${TECH}`)
    await user.click(screen.getByRole('button', { name: /Start Challenge/i }))
    await act(async () => {
      vi.advanceTimersByTime(61_000)
    })
    await screen.findByRole('heading', { name: /Not there yet/i })
    await user.click(screen.getByRole('button', { name: /Try Again/i }))
    expect(screen.getByRole('button', { name: /Start Challenge/i })).toBeInTheDocument()
  })
})
