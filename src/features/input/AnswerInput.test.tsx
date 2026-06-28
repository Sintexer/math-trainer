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
  expectedAnswer,
}: {
  onSubmit: (v: number) => void
  maxDigits?: number
  disabled?: boolean
  expectedAnswer?: number
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
        expectedAnswer={expectedAnswer}
      />
    </ChakraProvider>
  )
}

// Convenience: get the text input element
const getInput = () => screen.getByRole('textbox', { name: 'Your answer' })

describe('AnswerInput', () => {
  it('autofocuses on mount', () => {
    render(<Wrapper onSubmit={vi.fn()} />)
    expect(getInput()).toHaveFocus()
  })

  it('appends digits typed on the physical keyboard', async () => {
    const user = userEvent.setup()
    render(<Wrapper onSubmit={vi.fn()} />)
    await user.type(getInput(), '123')
    expect(getInput()).toHaveValue('123')
  })

  it('submits the numeric value on Enter', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<Wrapper onSubmit={onSubmit} />)
    await user.type(getInput(), '42')
    await user.keyboard('{Enter}')
    expect(onSubmit).toHaveBeenCalledWith(42)
  })

  it('submits via the ✓ button in the input row', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<Wrapper onSubmit={onSubmit} />)
    await user.type(getInput(), '7')
    await user.click(screen.getByRole('button', { name: 'Submit answer' }))
    expect(onSubmit).toHaveBeenCalledWith(7)
  })

  it('Backspace removes the last digit', async () => {
    const user = userEvent.setup()
    render(<Wrapper onSubmit={vi.fn()} />)
    await user.type(getInput(), '123')
    await user.keyboard('{Backspace}')
    expect(getInput()).toHaveValue('12')
  })

  it('does nothing when submitting with an empty buffer', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<Wrapper onSubmit={onSubmit} />)
    await user.keyboard('{Enter}')
    expect(onSubmit).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Submit answer' })).toBeDisabled()
  })

  it('respects maxDigits', async () => {
    const user = userEvent.setup()
    render(<Wrapper onSubmit={vi.fn()} maxDigits={3} />)
    await user.type(getInput(), '12345')
    expect(getInput()).toHaveValue('123')
  })

  it('collapses leading zeros (05 → 5)', async () => {
    const user = userEvent.setup()
    render(<Wrapper onSubmit={vi.fn()} />)
    await user.type(getInput(), '0')
    expect(getInput()).toHaveValue('0')
    await user.type(getInput(), '5')
    expect(getInput()).toHaveValue('5')
  })

  it('collapses multiple leading zeros (00 → 0)', async () => {
    const user = userEvent.setup()
    render(<Wrapper onSubmit={vi.fn()} />)
    // Type '0' twice. After first '0' the value is "0". Typing '0' again gives
    // target.value "00" → parseInt → 0 → "0". Buffer stays "0".
    await user.type(getInput(), '00')
    expect(getInput()).toHaveValue('0')
  })

  it('ignores non-digit characters', async () => {
    const user = userEvent.setup()
    render(<Wrapper onSubmit={vi.fn()} />)
    await user.type(getInput(), '1a2b3')
    expect(getInput()).toHaveValue('123')
  })

  it('disables input and buttons when disabled prop is set', () => {
    render(<Wrapper onSubmit={vi.fn()} disabled />)
    expect(getInput()).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Submit answer' })).toBeDisabled()
  })

  it('auto-submits when typed value exactly matches expectedAnswer', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<Wrapper onSubmit={onSubmit} expectedAnswer={42} />)
    await user.type(getInput(), '4')
    expect(onSubmit).not.toHaveBeenCalled()
    await user.type(getInput(), '2')
    expect(onSubmit).toHaveBeenCalledWith(42)
  })

  it('does not auto-submit on a partial match', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<Wrapper onSubmit={onSubmit} expectedAnswer={123} />)
    await user.type(getInput(), '12')
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('auto-submits via keypad when digit completes the expected answer', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<Wrapper onSubmit={onSubmit} expectedAnswer={7} />)
    await user.click(screen.getByRole('button', { name: 'Show keyboard' }))
    await user.click(screen.getByRole('button', { name: '7' }))
    expect(onSubmit).toHaveBeenCalledWith(7)
  })

  it('toggles the keypad on and off', async () => {
    const user = userEvent.setup()
    render(<Wrapper onSubmit={vi.fn()} />)
    // Keypad is hidden initially
    expect(screen.queryByRole('button', { name: '5' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Show keyboard' }))
    expect(screen.getByRole('button', { name: '5' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Hide keyboard' }))
    expect(screen.queryByRole('button', { name: '5' })).not.toBeInTheDocument()
  })
})
