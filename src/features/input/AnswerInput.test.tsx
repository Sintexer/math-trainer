import { useState } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { AnswerInput } from './AnswerInput'

function Wrapper({
  onSubmit,
  maxDigits,
  disabled,
}: {
  onSubmit: (v: number) => void
  maxDigits?: number
  disabled?: boolean
}) {
  const [value, setValue] = useState('')
  return (
    <ChakraProvider value={defaultSystem}>
      <AnswerInput
        value={value}
        onChange={setValue}
        onSubmit={onSubmit}
        maxDigits={maxDigits}
        disabled={disabled}
      />
    </ChakraProvider>
  )
}

describe('AnswerInput', () => {
  it('appends digits typed on the physical keyboard', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<Wrapper onSubmit={onSubmit} />)
    await user.keyboard('123')
    expect(screen.getByRole('status', { name: 'Current answer' })).toHaveTextContent('123')
  })

  it('submits the numeric value on Enter', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<Wrapper onSubmit={onSubmit} />)
    await user.keyboard('42{Enter}')
    expect(onSubmit).toHaveBeenCalledWith(42)
  })

  it('submits via the ✓ keypad button', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<Wrapper onSubmit={onSubmit} />)
    await user.click(screen.getByRole('button', { name: '7' }))
    await user.click(screen.getByRole('button', { name: 'Submit' }))
    expect(onSubmit).toHaveBeenCalledWith(7)
  })

  it('Backspace removes the last digit', async () => {
    const user = userEvent.setup()
    render(<Wrapper onSubmit={vi.fn()} />)
    await user.keyboard('123{Backspace}')
    expect(screen.getByRole('status', { name: 'Current answer' })).toHaveTextContent('12')
  })

  it('does nothing when submitting with an empty buffer', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<Wrapper onSubmit={onSubmit} />)
    await user.keyboard('{Enter}')
    expect(onSubmit).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled()
  })

  it('respects maxDigits', async () => {
    const user = userEvent.setup()
    render(<Wrapper onSubmit={vi.fn()} maxDigits={3} />)
    await user.keyboard('12345')
    expect(screen.getByRole('status', { name: 'Current answer' })).toHaveTextContent('123')
  })

  it('collapses leading zeros', async () => {
    const user = userEvent.setup()
    render(<Wrapper onSubmit={vi.fn()} />)
    await user.keyboard('00')
    expect(screen.getByRole('status', { name: 'Current answer' })).toHaveTextContent('0')
    await user.keyboard('5')
    expect(screen.getByRole('status', { name: 'Current answer' })).toHaveTextContent('5')
  })

  it('ignores input when disabled', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<Wrapper onSubmit={onSubmit} disabled />)
    await user.keyboard('5{Enter}')
    expect(onSubmit).not.toHaveBeenCalled()
    expect(screen.getByRole('status', { name: 'Current answer' })).toHaveTextContent('|')
  })
})
