import { useEffect } from 'react'

export interface UseKeyboardDigitsOptions {
  onDigit: (digit: number) => void
  onBackspace: () => void
  onSubmit: () => void
  /** When false (or omitted), the listener is detached. */
  enabled?: boolean
}

// Global keydown handler for desktop. We attach to window — not a focused
// element — because the session screen has no focused input by default.
// Typing into a real text input must NOT steal keys, so we bail when the
// active element is a form field. The listener is fully attached/detached
// via the `enabled` flag.
export function useKeyboardDigits({
  onDigit,
  onBackspace,
  onSubmit,
  enabled = true,
}: UseKeyboardDigitsOptions): void {
  useEffect(() => {
    if (!enabled) return
    function handler(event: KeyboardEvent) {
      if (event.defaultPrevented) return
      if (isEditableTarget(event.target)) return
      if (event.metaKey || event.ctrlKey || event.altKey) return

      if (event.key >= '0' && event.key <= '9') {
        event.preventDefault()
        onDigit(Number(event.key))
        return
      }
      if (event.key === 'Backspace') {
        event.preventDefault()
        onBackspace()
        return
      }
      if (event.key === 'Enter') {
        event.preventDefault()
        onSubmit()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onDigit, onBackspace, onSubmit, enabled])
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true
  if (target.isContentEditable) return true
  // jsdom does not always reflect contenteditable=true into isContentEditable;
  // fall back to the attribute for test parity with real browsers.
  const attr = target.getAttribute('contenteditable')
  if (attr !== null && attr !== 'false') return true
  return false
}
