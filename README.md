# MathSprint

A web app that turns mental-math mastery into a guided, gamified journey.
Pick a technique, drill it until it's automatic, then unlock the next star
on your personal constellation. Built with React 19, TypeScript, Chakra UI
v3, and Redux Toolkit; deployed to GitHub Pages as a static SPA.

See [`VISION.md`](./VISION.md) for the product vision and
[`ROADMAP.md`](./ROADMAP.md) for the phased build plan.

## Stack

- **React 19** + **TypeScript** (strict, `verbatimModuleSyntax`)
- **Vite** for dev/build
- **Chakra UI v3** for styling (token-based design system)
- **Redux Toolkit** + **redux-persist** (localStorage)
- **React Router 7** (HashRouter — GitHub Pages compatible)
- **Vitest** + **jsdom** + **@testing-library/jest-dom** for tests
- **Bun** as the package manager / script runner

## Scripts

```sh
bun install           # install deps
bun run dev           # start the Vite dev server
bun run build         # type-check + production build → dist/
bun run preview       # preview the production build locally
bun run lint          # eslint .
bun run test          # vitest run
bun run deploy        # build + publish dist/ to gh-pages branch
```

## Project structure

```
src/
  app/                Provider, store, theme, router — composition root
  shared/             Cross-feature primitives (types only, for now)
  content/            Static curriculum: techniques, topics, constellation graph
  features/
    generators/       Problem generators (one per technique) + Rng abstraction
    session/          Pure session state machine (drill / challenge)
    progress/         Redux slice for XP, mastery, daily challenges, settings
  test/               Vitest setup
```

Each feature owns its types (`features/<x>/types.ts`), its slice/reducer,
its selectors, and its tests. Cross-feature primitives live in
`src/shared/types.ts`. The `app/` directory is the only place that wires
features together.

## Determinism

The session engine and the Daily Challenge are fully deterministic:

- Generators take an injected `Rng` (see `features/generators/rng.ts`).
  The Daily Challenge uses `createSeededRng(seedFromDate(date))` so every
  user sees the same problem set for a given date.
- The session reducer takes `now` on every action — no `Date.now()` calls.
- XP is computed exclusively by the progress slice on persistence (it
  requires knowledge of prior sessions for the first-session bonus).

## Deployment

The app is a fully static SPA. `bun run deploy` builds to `dist/` and
publishes to the `gh-pages` branch via [`gh-pages`](https://www.npmjs.com/package/gh-pages).
The Vite base path is `/math-trainer/` to match the GitHub Pages URL.
