// Public surface for the Drill feature. Phase 6 vertical slice.
//
// External imports should only reach into this barrel — never the screens
// folder or the hook file directly.

export { default as DrillScreen } from './screens/DrillScreen'
export { useDrillSession, DEFAULT_DRILL_PROBLEM_COUNT } from './useDrillSession'
export type { UseDrillSessionApi, UseDrillSessionOptions } from './useDrillSession'
