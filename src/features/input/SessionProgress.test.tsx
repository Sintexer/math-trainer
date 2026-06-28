import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { SessionProgress } from './SessionProgress'

function renderProgress(props: React.ComponentProps<typeof SessionProgress>) {
  return render(
    <ChakraProvider value={defaultSystem}>
      <SessionProgress {...props} />
    </ChakraProvider>,
  )
}

describe('SessionProgress', () => {
  it('renders "n / total" when totalProblems provided (Drill)', () => {
    renderProgress({ attempted: 12, correct: 9, totalProblems: 15, elapsedMs: 60_000 })
    expect(screen.getByText('12 / 15')).toBeInTheDocument()
  })

  it('renders only the count when totalProblems missing (Challenge)', () => {
    renderProgress({ attempted: 7, correct: 5, elapsedMs: 30_000 })
    expect(screen.getByText('7')).toBeInTheDocument()
    expect(screen.queryByRole('progressbar')).toBeNull()
  })

  it('reports accuracy rounded to whole percent', () => {
    renderProgress({ attempted: 10, correct: 7, elapsedMs: 60_000 })
    expect(screen.getByText('70%')).toBeInTheDocument()
  })

  it('reports speed as problems-per-minute with one decimal', () => {
    // 6 correct in 60s → 6.0/min
    renderProgress({ attempted: 8, correct: 6, elapsedMs: 60_000 })
    expect(screen.getByText('6.0/min')).toBeInTheDocument()
  })

  it('avoids NaN at zero attempts / zero elapsed', () => {
    renderProgress({ attempted: 0, correct: 0, elapsedMs: 0 })
    expect(screen.getByText('0%')).toBeInTheDocument()
    expect(screen.getByText('0.0/min')).toBeInTheDocument()
  })

  it('does not render a progressbar (progress bar was removed from this component)', () => {
    renderProgress({ attempted: 5, correct: 5, totalProblems: 10, elapsedMs: 30_000 })
    expect(screen.queryByRole('progressbar')).toBeNull()
  })

  it('does not render a progressbar when attempted exceeds total', () => {
    renderProgress({ attempted: 20, correct: 18, totalProblems: 10, elapsedMs: 60_000 })
    expect(screen.queryByRole('progressbar')).toBeNull()
  })
})
