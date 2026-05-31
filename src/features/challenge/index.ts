// Public surface for the Challenge feature. Phase 7 vertical slice.
//
// External imports should only reach into this barrel — never the screens
// folder or the hook file directly.

export { default as ChallengeScreen } from './screens/ChallengeScreen'
export {
  useChallengeSession,
  DEFAULT_CHALLENGE_DURATION_SECONDS,
} from './useChallengeSession'
export type {
  UseChallengeSessionApi,
  UseChallengeSessionOptions,
} from './useChallengeSession'
