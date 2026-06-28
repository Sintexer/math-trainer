// Public surface of the input feature. Import only from this barrel.
//
// Phase 5 — Input UI Primitives. Composed by the Drill / Challenge session
// screens (Phase 6+). All components are presentational; they never read
// from Redux or Date.now().

export { Keypad } from './Keypad'
export type { KeypadProps } from './Keypad'

export { AnswerInput } from './AnswerInput'
export type { AnswerInputProps } from './AnswerInput'

// KeyboardType lives in shared/types but is also re-exported here so that
// session screens can import everything input-related from a single place.
export type { KeyboardType } from '@/shared/types'

export { useKeyboardDigits } from './useKeyboardDigits'
export type { UseKeyboardDigitsOptions } from './useKeyboardDigits'

export { AnswerFeedback } from './AnswerFeedback'
export type { AnswerFeedbackProps, FeedbackState } from './AnswerFeedback'

export { Timer } from './Timer'
export type { TimerProps } from './Timer'
export { formatMmSs } from './formatMmSs'

export { SessionProgress } from './SessionProgress'
export type { SessionProgressProps } from './SessionProgress'
