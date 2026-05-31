import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { Keypad } from './Keypad'

function renderKeypad(props: Partial<React.ComponentProps<typeof Keypad>> = {}) {
  const onDigit = vi.fn()
  const onBackspace = vi.fn()
  const onSubmit = vi.fn()
  render(
    <ChakraProvider value={defaultSystem}>
      <Keypad
        onDigit={onDigit}
        onBackspace={onBackspace}
        onSubmit={onSubmit}
        {...props}
      />
    </ChakraProvider>,
  )
  return { onDigit, onBackspace, onSubmit }
}

describe('Keypad', () => {
  it('emits onDigit for every digit 0–9', async () => {
    const user = userEvent.setup()
    const { onDigit } = renderKeypad()
    for (let d = 0; d <= 9; d++) {
      await user.click(screen.getByRole('button', { name: String(d) }))
    }
    expect(onDigit).toHaveBeenCalledTimes(10)
    for (let d = 0; d <= 9; d++) {
      expect(onDigit).toHaveBeenNthCalledWith(d + 1, d)
    }
  })

  it('emits onBackspace when ⌫ pressed', async () => {
    const user = userEvent.setup()
    const { onBackspace } = renderKeypad()
    await user.click(screen.getByRole('button', { name: 'Backspace' }))
    expect(onBackspace).toHaveBeenCalledOnce()
  })

  it('emits onSubmit when ✓ pressed', async () => {
    const user = userEvent.setup()
    const { onSubmit } = renderKeypad()
    await user.click(screen.getByRole('button', { name: 'Submit' }))
    expect(onSubmit).toHaveBeenCalledOnce()
  })

  it('blocks submit when submitDisabled is true', async () => {
    const user = userEvent.setup()
    const { onSubmit } = renderKeypad({ submitDisabled: true })
    const submit = screen.getByRole('button', { name: 'Submit' })
    expect(submit).toBeDisabled()
    await user.click(submit)
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('disables every key when disabled is true', () => {
    renderKeypad({ disabled: true })
    for (let d = 0; d <= 9; d++) {
      expect(screen.getByRole('button', { name: String(d) })).toBeDisabled()
    }
    expect(screen.getByRole('button', { name: 'Backspace' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled()
  })

  it('renders tap targets at least 44px tall (mobile HIG)', () => {
    renderKeypad()
    const btn = screen.getByRole('button', { name: '5' })
    // Chakra renders inline-style/CSS vars; checking the prop is reflected as
    // a min-height style or explicit height is sufficient — we set both.
    expect(btn).toHaveStyle({ minHeight: '56px' })
  })
})
