import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { Timer } from './Timer'
import { formatMmSs } from './formatMmSs'

function renderTimer(props: React.ComponentProps<typeof Timer>) {
  return render(
    <ChakraProvider value={defaultSystem}>
      <Timer {...props} />
    </ChakraProvider>,
  )
}

describe('formatMmSs', () => {
  it.each([
    [0, '0:00'],
    [1, '0:01'],
    [999, '0:01'],
    [1000, '0:01'],
    [1001, '0:02'],
    [59_000, '0:59'],
    [60_000, '1:00'],
    [83_000, '1:23'],
    [600_000, '10:00'],
    [-500, '0:00'],
  ])('formats %ims as %s', (ms, expected) => {
    expect(formatMmSs(ms)).toBe(expected)
  })
})

describe('Timer', () => {
  it('renders the formatted remaining time', () => {
    renderTimer({ remainingMs: 83_000, totalMs: 120_000 })
    expect(screen.getByRole('timer')).toHaveTextContent('1:23')
  })

  it('marks warning state below the warningMs threshold', () => {
    renderTimer({ remainingMs: 9_999, totalMs: 60_000 })
    const t = screen.getByRole('timer')
    expect(t).toHaveAttribute('data-warning', 'true')
  })

  it('does not mark warning at exactly the threshold', () => {
    renderTimer({ remainingMs: 10_000, totalMs: 60_000 })
    expect(screen.getByRole('timer')).toHaveAttribute('data-warning', 'false')
  })

  it('marks pulse state below pulseMs threshold', () => {
    renderTimer({ remainingMs: 3_000, totalMs: 60_000 })
    const t = screen.getByRole('timer')
    expect(t).toHaveAttribute('data-pulse', 'true')
    expect(t).toHaveAttribute('data-warning', 'true')
  })

  it('clamps negative remainingMs to zero', () => {
    renderTimer({ remainingMs: -1_000 })
    expect(screen.getByRole('timer')).toHaveTextContent('0:00')
  })

  it('hides the progress bar when totalMs is missing', () => {
    const { container } = renderTimer({ remainingMs: 5_000 })
    // Only the timer text + its wrapper should render; no bar element.
    expect(container.querySelector('[aria-hidden="true"]')).toBeNull()
  })

  it('includes an aria-label with the formatted time', () => {
    renderTimer({ remainingMs: 60_000 })
    expect(screen.getByRole('timer')).toHaveAttribute('aria-label', 'Time remaining 1:00')
  })
})
