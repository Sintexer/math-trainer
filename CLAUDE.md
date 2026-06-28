# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run dev           # Vite dev server
bun run build         # tsc -b then Vite production build → dist/
bun run lint          # ESLint
bun run format        # Prettier on src/**/*.{ts,tsx}
bun run test          # Vitest single run
bun run test:watch    # Vitest watch
bun run test:coverage # Vitest + V8 coverage (text + HTML)
bun run deploy        # build + publish dist/ to gh-pages branch
```

Run a single test file: `bun run test src/features/drill/screens/DrillScreen.test.tsx`

The `@` path alias resolves to `src/`.

## Architecture

**Stack:** React 19, TypeScript (strict), Vite, Chakra UI v3, Redux Toolkit + redux-persist, React Router 7 (HashRouter — GitHub Pages compatible), Vitest.

### Module Map

```
src/
  main.tsx
  app/                Composition root
    App.tsx           Provider stack (Redux → Chakra → PersistGate → HashRouter)
                      Also renders GraphMapButton FAB + GraphMapOverlay at root level
    router.tsx        AppRouter: route definitions only (no HashRouter — it lives in App.tsx)
    store.ts          Redux store + persistor
    theme.ts          Chakra UI v3 system theme
    hooks.ts          Typed useAppDispatch / useAppSelector
    GraphMapButton.tsx Fixed 52px FAB (bottom-right, z=50) that opens constellation overlay
  shared/types.ts     Domain types only — all features import from here
  content/            Static curriculum data. Public API via content/index.ts.
    index.ts          getAllTechniques / getTechnique / findTechnique / getTechniquesByTopic
                      getAllTopics / getTopic / getRelatedTechniques
                      getConstellationGraph / getMasteryThresholds / getPactSequence
    techniques/       Technique metadata: addition.ts, subtraction.ts, multiplication.ts, division.ts
    topics/index.ts   Topic definitions (4 topics, techniqueIds arrays)
    graph/index.ts    ConstellationGraph — 33 nodes + edges on 1200×900 logical canvas
    technique-content/ Slide content (3–5 slides each), one file per technique, index.ts barrel
  features/
    generators/       Problem generator engine. registry.ts maps techniqueId → ProblemGenerator.
                      All generators take an injected Rng; use defaultRng for production.
    session/          Pure session state machine (not a Redux slice — local useReducer in UI).
                      sessionReducer.ts, sessionSummary.ts, xp.ts
    progress/         The only Redux slice. Persisted to localStorage via redux-persist.
                      progressSlice.ts, selectors.ts, exportImport.ts
    input/            Reusable UI primitives shared by drill and challenge:
                        AnswerInput, AnswerFeedback, Keypad, SessionProgress, Timer,
                        useKeyboardDigits, formatMmSs
                      Demo at /#/dev/primitives (dev only)
    home/             HomeScreen — SimpleGrid of topic cards
    topic/            TopicHubScreen — SimpleGrid of technique cards per topic
    technique-card/   Slide-based technique learning view.
                        TechniqueCardScreen, TechniqueSlideViewer, SlideContent,
                        TechniqueReferenceModal, useSwipeNavigation
    drill/            Drill mode (accuracy-focused, 15-problem sessions).
                        useDrillSession, screens/: DrillScreen, DrillInSession, DrillReport
                        NOTE: DrillScreen auto-starts on mount — there is no entry/lobby screen.
                        Exit (×) navigates back; Try Again resets + restarts immediately.
    challenge/        Challenge/speed mode (timed, pass/fail).
                        useChallengeSession, screens/: ChallengeScreen, ChallengeEntry,
                        ChallengeInSession, ChallengeResult
    daily/            Daily Challenge mode. DailyScreen + useDailySession.
    constellation/    Full-screen technique graph map overlay.
                        ConstellationMapScreen (pan/zoom SVG), ConstellationNode, GraphMapOverlay
```

### Routes

| Hash path | Component |
|---|---|
| `/#/` | `HomeScreen` |
| `/#/topic/:topicId` | `TopicHubScreen` |
| `/#/challenge/:techniqueId` | `ChallengeScreen` |
| `/#/challenge/:techniqueId/theory` | `TechniqueCardScreen` |
| `/#/challenge/:techniqueId/drill` | `DrillScreen` |
| `/#/daily` | `DailyScreen` |
| `/#/profile` | Placeholder |
| `/#/settings` | Placeholder |
| `/#/dev/primitives` | `PrimitivesDemoScreen` (dev only) |

### Two State Layers

**Session state** (`features/session/`) is a plain reducer — never a Redux slice. The UI holds it in `useReducer`. The engine is headless: `now` timestamps are injected through actions, never read from `Date.now()`. Use `applyActions([...])` in tests.

**Progress state** (`features/progress/progressSlice.ts`) is the only Redux slice. `redux-persist` whitelists only `progress`. `completeSession(summary)` is the integration point — it re-computes XP (with `isFirstSession` context) and updates stars. `buildSummary()` intentionally leaves `xpEarned: 0`.

### Constellation Map Overlay

`HashRouter` is intentionally placed in `App.tsx` (not inside `AppRouter`) so that `GraphMapOverlay` — rendered at the root level alongside `AppRouter` — can call `useNavigate()`. `GraphMapOverlay.tsx` imports `ConstellationMapScreen` directly (not via `constellation/index.ts`) to avoid a circular dependency. Tapping a node calls `onNavigate?.()` to close the overlay before navigating.

### Key Invariants

- **Star monotonicity** — `mergeStars(prev, next)` ensures stars never regress. Stars for Drill come from a 5-session rolling window; Speed star from `challengePassed`.
- **Deterministic RNG** — every generator takes an injected `Rng`. Daily Challenge uses `createSeededRng(seedFromDate('YYYY-MM-DD'))`. Use `defaultRng` for production.
- **Schema versioning** — `SCHEMA_VERSION = 1` in the progress slice; used by `persistConfig` and `parseProgressJson` for import validation.
- **Public APIs via barrel `index.ts`** — import only from a feature's `index.ts`, never from internal files like `registry.ts` or individual technique files.
- **Frozen module-level constants** — `DEFAULT_MASTERY_STARS` and `registeredTechniqueIds` are `Object.freeze`d for referential equality in selectors.
- **Technique-content parity** — `technique-content/` must have exactly one entry per technique. `technique-content.test.ts` enforces this and validates that worked/try-it answers in slides are numerically correct.
- **Subtraction answer invariant** — all subtraction generators construct `a = b + gap` so `a > b` always; answer is never ≤ 0.
- **Speed drill vs trick techniques** — the 8 speed/memory techniques (`add-speed-*`, `sub-speed-*`, `mul-times-table`, `mul-perfect-squares`) are pure repetition drills with higher mastery thresholds. They are curriculum prerequisites to the trick-based techniques.

### Curriculum Summary (33 techniques, 4 topics)

| Topic | Count | IDs |
|---|---|---|
| Addition | 8 | `add-speed-1d2d`, `add-speed-2d2d`, `add-speed-3d`, `add-left-to-right`, `add-complement-100`, `add-round-adjust`, `add-near-doubles`, `add-column-grouping` |
| Subtraction | 7 | `sub-speed-2d1d`, `sub-speed-2d2d`, `sub-speed-3d`, `sub-complement-10`, `sub-borrow-free`, `sub-round-adjust`, `sub-counting-up` |
| Multiplication | 12 | `mul-times-table`, `mul-perfect-squares`, `mul-by-11`, `mul-by-9`, `mul-by-5`, `mul-by-25`, `mul-by-12`, `mul-sq-ending-5`, `mul-near-100`, `mul-double-halve`, `mul-by-99-101`, `mul-foil-mental` |
| Division | 6 | `div-by-5`, `div-by-25`, `div-by-9-digit-sum`, `div-percent-10-5-20`, `div-estimate-adjust`, `div-factor-decompose` |

### Code Style

No semicolons, single quotes, 2-space indent, 100-char print width, trailing commas (ES5). No enums — use union types and `as const`. `import type` for type-only imports. `noUnusedLocals` and `noUnusedParameters` are enforced. Tests are co-located with source (`*.test.ts` next to the file under test); `src/test/` is only for the global Vitest setup.
