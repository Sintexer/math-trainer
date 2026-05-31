import { useCallback, useEffect, useRef } from 'react'

const SWIPE_THRESHOLD_PX = 50

/**
 * Pointer-based horizontal swipe → navigation helper.
 *
 * Returns a single ref that the caller spreads onto an element. We track a
 * pointerdown→pointerup delta; if the horizontal distance exceeds
 * SWIPE_THRESHOLD_PX (and exceeds the vertical distance), we call onPrev or
 * onNext. Tiny moves (taps, jitter) are ignored so clicks on buttons inside
 * the element still work.
 */
export function useSwipeNavigation({
  onPrev,
  onNext,
  disabled = false,
}: {
  onPrev: () => void
  onNext: () => void
  disabled?: boolean
}) {
  const startRef = useRef<{ x: number; y: number; id: number } | null>(null)
  const elementRef = useRef<HTMLElement | null>(null)

  const setRef = useCallback((node: HTMLElement | null) => {
    elementRef.current = node
  }, [])

  useEffect(() => {
    const el = elementRef.current
    if (!el || disabled) return

    const onPointerDown = (e: PointerEvent) => {
      startRef.current = { x: e.clientX, y: e.clientY, id: e.pointerId }
    }
    const onPointerUp = (e: PointerEvent) => {
      const start = startRef.current
      if (!start || start.id !== e.pointerId) return
      startRef.current = null
      const dx = e.clientX - start.x
      const dy = e.clientY - start.y
      if (Math.abs(dx) < SWIPE_THRESHOLD_PX) return
      if (Math.abs(dy) > Math.abs(dx)) return
      if (dx < 0) onNext()
      else onPrev()
    }
    const onPointerCancel = () => {
      startRef.current = null
    }

    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('pointerup', onPointerUp)
    el.addEventListener('pointercancel', onPointerCancel)
    return () => {
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('pointerup', onPointerUp)
      el.removeEventListener('pointercancel', onPointerCancel)
    }
  }, [onPrev, onNext, disabled])

  return setRef
}

export const SWIPE_THRESHOLD = SWIPE_THRESHOLD_PX
