import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import { useKeyboardDigits, type UseKeyboardDigitsOptions } from './useKeyboardDigits'

function Harness(props: UseKeyboardDigitsOptions) {
  useKeyboardDigits(props)
  return (
    <div>
      <input data-testid="text" type="text" />
      <div contentEditable data-testid="ce" />
    </div>
  )
}

function makeHandlers() {
  return { onDigit: vi.fn(), onBackspace: vi.fn(), onSubmit: vi.fn() }
}

function press(key: string, target: EventTarget = window) {
  const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })
  target.dispatchEvent(event)
  return event
}

describe('useKeyboardDigits', () => {
  beforeEach(() => {
    document.body.focus()
  })

  it('fires onDigit for each 0–9 key', () => {
    const handlers = makeHandlers()
    render(<Harness {...handlers} />)
    for (let d = 0; d <= 9; d++) press(String(d))
    expect(handlers.onDigit).toHaveBeenCalledTimes(10)
    for (let d = 0; d <= 9; d++) {
      expect(handlers.onDigit).toHaveBeenNthCalledWith(d + 1, d)
    }
  })

  it('fires onBackspace and onSubmit for Backspace / Enter', () => {
    const handlers = makeHandlers()
    render(<Harness {...handlers} />)
    press('Backspace')
    press('Enter')
    expect(handlers.onBackspace).toHaveBeenCalledOnce()
    expect(handlers.onSubmit).toHaveBeenCalledOnce()
  })

  it('preventDefaults its keys so the browser does not also act', () => {
    const handlers = makeHandlers()
    render(<Harness {...handlers} />)
    const event = press('5')
    expect(event.defaultPrevented).toBe(true)
  })

  it('ignores keys when an input has focus', () => {
    const handlers = makeHandlers()
    const { getByTestId } = render(<Harness {...handlers} />)
    const input = getByTestId('text') as HTMLInputElement
    input.focus()
    press('5', input)
    press('Enter', input)
    expect(handlers.onDigit).not.toHaveBeenCalled()
    expect(handlers.onSubmit).not.toHaveBeenCalled()
  })

  it('ignores keys inside contentEditable', () => {
    const handlers = makeHandlers()
    const { getByTestId } = render(<Harness {...handlers} />)
    const ce = getByTestId('ce')
    ce.focus()
    press('3', ce)
    expect(handlers.onDigit).not.toHaveBeenCalled()
  })

  it('does not attach when enabled=false', () => {
    const handlers = makeHandlers()
    render(<Harness {...handlers} enabled={false} />)
    press('1')
    press('Enter')
    expect(handlers.onDigit).not.toHaveBeenCalled()
    expect(handlers.onSubmit).not.toHaveBeenCalled()
  })

  it('detaches on unmount', () => {
    const handlers = makeHandlers()
    const { unmount } = render(<Harness {...handlers} />)
    unmount()
    press('1')
    expect(handlers.onDigit).not.toHaveBeenCalled()
  })

  it('ignores keys with modifiers (Cmd/Ctrl/Alt)', () => {
    const handlers = makeHandlers()
    render(<Harness {...handlers} />)
    window.dispatchEvent(new KeyboardEvent('keydown', { key: '1', metaKey: true }))
    window.dispatchEvent(new KeyboardEvent('keydown', { key: '2', ctrlKey: true }))
    window.dispatchEvent(new KeyboardEvent('keydown', { key: '3', altKey: true }))
    expect(handlers.onDigit).not.toHaveBeenCalled()
  })
})
