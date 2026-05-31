import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { AnswerFeedback } from './AnswerFeedback'

function renderFeedback(props: React.ComponentProps<typeof AnswerFeedback>) {
  return render(
    <ChakraProvider value={defaultSystem}>
      <AnswerFeedback {...props} />
    </ChakraProvider>,
  )
}

describe('AnswerFeedback', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders nothing in idle state', () => {
    const { container } = renderFeedback({ state: 'idle' })
    expect(container).toBeEmptyDOMElement()
  })

  it('shows "Correct" message for correct state', () => {
    renderFeedback({ state: 'correct' })
    expect(screen.getByText('Correct')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveAttribute('data-feedback-state', 'correct')
  })

  it('shows "Not quite" and reveals the correct answer when incorrect', () => {
    renderFeedback({ state: 'incorrect', correctAnswer: 42 })
    expect(screen.getByText('Not quite')).toBeInTheDocument()
    expect(screen.getByText(/42/)).toBeInTheDocument()
  })

  it('does not reveal correctAnswer when omitted', () => {
    renderFeedback({ state: 'incorrect' })
    expect(screen.getByText('Not quite')).toBeInTheDocument()
    expect(screen.queryByText(/Answer:/)).not.toBeInTheDocument()
  })

  it('auto-dismisses correct state after default delay (800ms)', () => {
    const onDismiss = vi.fn()
    renderFeedback({ state: 'correct', onDismiss })
    expect(onDismiss).not.toHaveBeenCalled()
    act(() => {
      vi.advanceTimersByTime(799)
    })
    expect(onDismiss).not.toHaveBeenCalled()
    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(onDismiss).toHaveBeenCalledOnce()
  })

  it('auto-dismisses incorrect state after default delay (1500ms)', () => {
    const onDismiss = vi.fn()
    renderFeedback({ state: 'incorrect', correctAnswer: 9, onDismiss })
    act(() => {
      vi.advanceTimersByTime(1500)
    })
    expect(onDismiss).toHaveBeenCalledOnce()
  })

  it('honors custom autoDismissMs', () => {
    const onDismiss = vi.fn()
    renderFeedback({ state: 'correct', onDismiss, autoDismissMs: { correct: 200 } })
    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(onDismiss).toHaveBeenCalledOnce()
  })

  it('does not schedule a dismiss when autoDismissMs is 0', () => {
    const onDismiss = vi.fn()
    renderFeedback({ state: 'correct', onDismiss, autoDismissMs: { correct: 0 } })
    act(() => {
      vi.advanceTimersByTime(10_000)
    })
    expect(onDismiss).not.toHaveBeenCalled()
  })

  it('cancels pending dismiss on unmount', () => {
    const onDismiss = vi.fn()
    const { unmount } = renderFeedback({ state: 'correct', onDismiss })
    unmount()
    act(() => {
      vi.advanceTimersByTime(2_000)
    })
    expect(onDismiss).not.toHaveBeenCalled()
  })
})
