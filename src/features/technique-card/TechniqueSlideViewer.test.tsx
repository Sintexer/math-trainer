import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { TechniqueSlideViewer } from './TechniqueSlideViewer'
import type { Slide } from './types'

const slides: Slide[] = [
  { kind: 'concept', heading: 'Why', body: 'Because.' },
  { kind: 'worked', problem: '2 + 2', steps: ['Add.'], answer: 4 },
  { kind: 'try-it', problem: '3 + 3', answer: 6, hint: 'Double 3.' },
]

function renderViewer(onComplete: () => void = () => {}) {
  return render(
    <ChakraProvider value={defaultSystem}>
      <TechniqueSlideViewer slides={slides} onComplete={onComplete} />
    </ChakraProvider>,
  )
}

describe('TechniqueSlideViewer', () => {
  it('renders the first slide and the correct counter', () => {
    renderViewer()
    expect(screen.getByTestId('slide-counter').textContent).toBe('1 / 3')
    expect(screen.getByRole('heading', { name: /Why/i })).toBeInTheDocument()
  })

  it('advances to the next slide via the Next button', async () => {
    const user = userEvent.setup()
    renderViewer()
    await user.click(screen.getByRole('button', { name: /Next slide/i }))
    expect(screen.getByTestId('slide-counter').textContent).toBe('2 / 3')
    expect(screen.getByTestId('worked-problem')).toBeInTheDocument()
  })

  it('Prev button is disabled on the first slide', () => {
    renderViewer()
    expect(screen.getByRole('button', { name: /Previous slide/i })).toBeDisabled()
  })

  it('shows "Got it" CTA on the last slide instead of Next', async () => {
    const user = userEvent.setup()
    renderViewer()
    await user.click(screen.getByRole('button', { name: /Next slide/i }))
    await user.click(screen.getByRole('button', { name: /Next slide/i }))
    expect(screen.queryByRole('button', { name: /Next slide/i })).toBeNull()
    expect(screen.getByRole('button', { name: /Got it/i })).toBeInTheDocument()
  })

  it('fires onComplete from the final CTA', async () => {
    const user = userEvent.setup()
    const onComplete = vi.fn()
    renderViewer(onComplete)
    await user.click(screen.getByRole('button', { name: /Next slide/i }))
    await user.click(screen.getByRole('button', { name: /Next slide/i }))
    await user.click(screen.getByRole('button', { name: /Got it/i }))
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('keyboard arrows navigate slides', async () => {
    const user = userEvent.setup()
    renderViewer()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByTestId('slide-counter').textContent).toBe('2 / 3')
    await user.keyboard('{ArrowLeft}')
    expect(screen.getByTestId('slide-counter').textContent).toBe('1 / 3')
  })
})
