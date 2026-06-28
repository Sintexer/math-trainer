import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { configureStore } from '@reduxjs/toolkit'
import progressReducer, { completeDailyChallenge } from '@/features/progress/progressSlice'
import DailyScreen from './DailyScreen'

/** Fixed test date: 2026-01-01 → challenge #1. */
const TEST_DATE = '2026-01-01'

function renderDaily(opts: { preloadedDailyResult?: boolean } = {}) {
  const store = configureStore({ reducer: { progress: progressReducer } })

  if (opts.preloadedDailyResult) {
    store.dispatch(
      completeDailyChallenge({
        date: TEST_DATE,
        score: 7,
        attempted: 10,
        timeSeconds: 42,
        problemResults: Array.from({ length: 10 }, (_, i) => ({
          techniqueId: 'add-speed-1d2d',
          correct: i < 7,
        })),
      }),
    )
  }

  const view = render(
    <Provider store={store}>
      <ChakraProvider value={defaultSystem}>
        <MemoryRouter initialEntries={['/daily']}>
          <Routes>
            <Route path="/" element={<div data-testid="home">home</div>} />
            <Route path="/daily" element={<DailyScreen date={TEST_DATE} />} />
            <Route path="/challenge/:techniqueId" element={<div data-testid="challenge">challenge</div>} />
          </Routes>
        </MemoryRouter>
      </ChakraProvider>
    </Provider>,
  )
  return { ...view, store }
}

/** Answer one problem with a wrong answer and click Next. */
async function answerWrongAndContinue(user: ReturnType<typeof userEvent.setup>) {
  await user.keyboard('999{Enter}')
  const next = await screen.findByRole('button', { name: /Next problem/i })
  await user.click(next)
}

describe('DailyScreen — entry', () => {
  it('renders the entry screen with challenge number and date', () => {
    renderDaily()
    expect(screen.getByRole('heading', { name: /#1/ })).toBeInTheDocument()
    expect(screen.getByText(TEST_DATE)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Start/i })).toBeInTheDocument()
  })

  it('Start button transitions to the in-session screen', async () => {
    const user = userEvent.setup()
    renderDaily()
    await user.click(screen.getByRole('button', { name: /Start/i }))
    expect(screen.getByTestId('daily-prompt')).toBeInTheDocument()
    expect(screen.getByText(/Problem 1 of 10/i)).toBeInTheDocument()
  })

  it('Back button navigates to home', async () => {
    const user = userEvent.setup()
    renderDaily()
    await user.click(screen.getByRole('button', { name: /Back/i }))
    expect(screen.getByTestId('home')).toBeInTheDocument()
  })
})

describe('DailyScreen — already completed', () => {
  it('shows already-completed screen when today has a stored result', () => {
    renderDaily({ preloadedDailyResult: true })
    expect(screen.getByRole('heading', { name: /Already completed/i })).toBeInTheDocument()
    expect(screen.getByText(/7\/10 correct/)).toBeInTheDocument()
  })

  it('back button on already-done screen navigates home', async () => {
    const user = userEvent.setup()
    renderDaily({ preloadedDailyResult: true })
    await user.click(screen.getByRole('button', { name: /Back to Home/i }))
    expect(screen.getByTestId('home')).toBeInTheDocument()
  })
})

describe('DailyScreen — end-to-end session', () => {
  it('completes 10 problems, shows result screen, persists to Redux', async () => {
    const user = userEvent.setup()
    const { store } = renderDaily()

    await user.click(screen.getByRole('button', { name: /Start/i }))

    // Walk through all 10 problems answering wrong each time.
    for (let i = 0; i < 10; i++) {
      await answerWrongAndContinue(user)
    }

    await waitFor(() =>
      expect(screen.getByText('0/10')).toBeInTheDocument(),
    )

    // Verify result persisted to Redux
    const daily = store.getState().progress.dailyChallenges[TEST_DATE]
    expect(daily).toBeDefined()
    expect(daily!.score).toBe(0)
    expect(daily!.attempted).toBe(10)
    expect(daily!.problemResults).toHaveLength(10)
    expect(daily!.problemResults.every((r) => !r.correct)).toBe(true)
  })

  it('result screen Back-to-Home navigates to "/"', async () => {
    const user = userEvent.setup()
    renderDaily()
    await user.click(screen.getByRole('button', { name: /Start/i }))
    for (let i = 0; i < 10; i++) await answerWrongAndContinue(user)
    await screen.findByText('0/10')
    await user.click(screen.getByRole('button', { name: /Back to Home/i }))
    expect(screen.getByTestId('home')).toBeInTheDocument()
  })
})

describe('dailyChallenge utilities', () => {
  it('same date always produces the same problem set', async () => {
    const { getDailyProblems } = await import('../dailyChallenge')
    const set1 = getDailyProblems(TEST_DATE)
    const set2 = getDailyProblems(TEST_DATE)
    expect(set1.map((p) => p.answer)).toEqual(set2.map((p) => p.answer))
  })

  it('different dates produce different problem sets', async () => {
    const { getDailyProblems } = await import('../dailyChallenge')
    const set1 = getDailyProblems('2026-01-01')
    const set2 = getDailyProblems('2026-01-02')
    // Very unlikely to be identical with 10 problems across 33 techniques.
    const same = set1.every((p, i) => p.answer === set2[i].answer)
    expect(same).toBe(false)
  })

  it('getDailyNumber returns 1 for the epoch date', async () => {
    const { getDailyNumber, EPOCH_ISO } = await import('../dailyChallenge')
    expect(getDailyNumber(EPOCH_ISO)).toBe(1)
  })

  it('getDailyNumber is monotonically increasing', async () => {
    const { getDailyNumber } = await import('../dailyChallenge')
    expect(getDailyNumber('2026-01-02')).toBe(2)
    expect(getDailyNumber('2026-06-28')).toBe(179)
  })

  it('buildShareText produces expected format', async () => {
    const { buildShareText } = await import('../dailyChallenge')
    const results = [
      { correct: true },
      { correct: false },
      { correct: true },
    ]
    const text = buildShareText(42, 2, 3, 37, results)
    expect(text).toBe('MathSprint Daily #42\n⚡ 2/3 correct · 37s\n🟩🟥🟩')
  })

  it('formatCountdown formats ms as HH:MM:SS', async () => {
    const { formatCountdown } = await import('../dailyChallenge')
    expect(formatCountdown(3_661_000)).toBe('01:01:01')
    expect(formatCountdown(0)).toBe('00:00:00')
    expect(formatCountdown(3_600_000)).toBe('01:00:00')
  })
})
