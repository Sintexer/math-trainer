import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { configureStore } from '@reduxjs/toolkit'
import progressReducer from '@/features/progress/progressSlice'
import DrillScreen from './DrillScreen'

const TECH = 'mul-by-11'

function renderAt(path: string) {
  const store = configureStore({ reducer: { progress: progressReducer } })
  const view = render(
    <Provider store={store}>
      <ChakraProvider value={defaultSystem}>
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route path="/" element={<div data-testid="map">map</div>} />
            <Route path="/challenge/:techniqueId/drill" element={<DrillScreen />} />
          </Routes>
        </MemoryRouter>
      </ChakraProvider>
    </Provider>,
  )
  return { ...view, store }
}

/**
 * Drive a single drill problem: type a wrong answer, submit, click Next.
 * Returns once we are either back on a new problem prompt or on the report.
 */
async function answerWrongAndContinue(user: ReturnType<typeof userEvent.setup>) {
  await user.keyboard('999{Enter}')
  // The explicit Next button bypasses the AnswerFeedback auto-dismiss delay
  // so the integration test does not depend on real or fake timers.
  const next = await screen.findByRole('button', { name: /Next problem/i })
  await user.click(next)
}

describe('DrillScreen', () => {
  it('auto-starts and shows the first problem immediately', async () => {
    renderAt(`/challenge/${TECH}/drill`)
    await waitFor(() =>
      expect(screen.getByTestId('drill-prompt')).toBeInTheDocument(),
    )
  })

  it('shows an error screen for an unknown technique', () => {
    renderAt('/challenge/bogus-id/drill')
    expect(screen.getByText(/Unknown technique/i)).toBeInTheDocument()
  })

  it('end-to-end: completes a drill, persists summary, shows report with stats', async () => {
    const user = userEvent.setup()
    const { store } = renderAt(`/challenge/${TECH}/drill`)

    // Wait for auto-start
    await waitFor(() => expect(screen.getByTestId('drill-prompt')).toBeInTheDocument())

    // Walk through all 15 problems answering wrong each time.
    for (let i = 0; i < 15; i++) {
      await answerWrongAndContinue(user)
    }

    await waitFor(() =>
      expect(screen.getByRole('heading', { name: /Drill complete/i })).toBeInTheDocument(),
    )

    expect(screen.getByText('0/15')).toBeInTheDocument()
    expect(screen.getByText('0%')).toBeInTheDocument()

    const persisted = store.getState().progress.techniqueProgress[TECH]
    expect(persisted).toBeDefined()
    expect(persisted!.sessions).toHaveLength(1)
    expect(persisted!.sessions[0].type).toBe('drill')
    expect(persisted!.sessions[0].correct).toBe(0)
    expect(persisted!.sessions[0].attempted).toBe(15)
  })

  it('persists XP earned (first-session bonus = 100, +0 from 0% correctness)', async () => {
    const user = userEvent.setup()
    const { store } = renderAt(`/challenge/${TECH}/drill`)
    await waitFor(() => expect(screen.getByTestId('drill-prompt')).toBeInTheDocument())
    for (let i = 0; i < 15; i++) await answerWrongAndContinue(user)
    await screen.findByRole('heading', { name: /Drill complete/i })
    // computeXp: base 0 + first-session bonus 100 = 100.
    expect(store.getState().progress.xp).toBe(100)
  })

  it('Back-to-Map navigates to "/"', async () => {
    const user = userEvent.setup()
    renderAt(`/challenge/${TECH}/drill`)
    await waitFor(() => expect(screen.getByTestId('drill-prompt')).toBeInTheDocument())
    for (let i = 0; i < 15; i++) await answerWrongAndContinue(user)
    await user.click(await screen.findByRole('button', { name: /Back to Map/i }))
    expect(screen.getByTestId('map')).toBeInTheDocument()
  })

  it('Try Again restarts a new session immediately', async () => {
    const user = userEvent.setup()
    renderAt(`/challenge/${TECH}/drill`)
    await waitFor(() => expect(screen.getByTestId('drill-prompt')).toBeInTheDocument())
    for (let i = 0; i < 15; i++) await answerWrongAndContinue(user)
    await user.click(await screen.findByRole('button', { name: /Try Again/i }))
    await waitFor(() =>
      expect(screen.getByTestId('drill-prompt')).toBeInTheDocument(),
    )
  })
})
