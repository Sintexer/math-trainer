# MathSprint — Development Roadmap

A phased, incremental build plan. Each phase produces a working, demonstrable artifact and lays the groundwork for the next. No phase introduces work the previous phase didn't enable.

---

## Table of Contents

1. [Phase-by-Phase Breakdown](#phase-by-phase-breakdown)
2. [Dependency Graph](#dependency-graph)
3. [Key Principles](#key-principles)
4. [Parallelization Strategy](#parallelization-strategy)
5. [Phase Deliverables Checklist](#phase-deliverables-checklist)

---

## Phase-by-Phase Breakdown

### Phase 0 — Foundation & Project Setup

**Duration estimate:** 1–2 days  
**Goal:** A running, deployable empty React app with the toolchain locked in.

#### Deliverables:

- [ ] Vite + React + TypeScript project initialized
- [ ] Tailwind CSS configured and working
- [ ] ESLint, Prettier, Vitest configured
- [ ] Redux Toolkit set up with redux-persist skeleton (empty slices)
- [ ] Folder structure established:
  - `src/app/` — store, router config, main App component
  - `src/features/` — feature modules (sessions, topics, profile, etc.)
  - `src/shared/` — types, utils, components, hooks
  - `src/content/` — static data and content registry
- [ ] React Router v6 configured with placeholder routes:
  - `/` — constellation map (placeholder)
  - `/topic/:techniqueId` — topic detail (placeholder)
  - `/daily` — daily challenge (placeholder)
  - `/profile` — profile page (placeholder)
  - `/settings` — settings (placeholder)
- [ ] Base TypeScript types defined in `src/shared/types/`:
  - `Problem` (id, techniqueId, topicId, difficulty, prompt, answer, userAnswer?, correct?, timeMs?)
  - `Technique` (id, name, topic, description, difficulty, prerequisites)
  - `Topic` (id, name, color, techniques)
  - `SessionSummary` (type, date, correct, attempted, accuracyPct, speedPerMin, xpEarned, weakTechniqueIds)
  - `UserProgress` (xp, level, topicProgress, dailyChallenges, settings)
  - `TopicProgress` (techniqueRead, drillSessions, challengePassed, stars, aggregates)
- [ ] CI configured (lint + test + build)
- [ ] Vercel / Netlify deploy working
- [ ] Hot reload verified on both desktop and mobile

#### Exit criteria:
Empty app deploys to a live URL. Hot reload works. `npm run test` and `npm run build` succeed.

---

### Phase 1 — Content Model & Static Data Layer

**Duration estimate:** 2–3 days  
**Depends on:** Phase 0  
**Goal:** The 25 techniques exist as data, queryable from the app.

#### Deliverables:

- [ ] Static content registry in `src/content/techniques/` with all 25 technique metadata:
  - id, name, topic, description, difficulty, prerequisites (array of related techniqueIds)
  - mastery thresholds (speed, accuracy, range targets)
- [ ] Topic definitions (`src/content/topics/`):
  - Addition (5 techniques)
  - Subtraction (4 techniques)
  - Multiplication (10 techniques)
  - Division (6 techniques)
- [ ] Constellation graph data:
  - Edges between related techniques (defines visual connections and pact mode path)
- [ ] Content registry module (`src/content/index.ts`):
  - `getAllTechniques()`
  - `getTechnique(id)`
  - `getRelatedTechniques(id)`
  - `getTopic(id)`
  - `getConstellationGraph()`
  - `getMasteryThresholds(techniqueId)`
- [ ] Validation tests:
  - All technique IDs are unique
  - All edges reference valid techniques
  - No circular dependencies in prerequisites
  - All mastery thresholds are sensible (speed > 0, accuracy 0–100, range 1–3)

#### Exit criteria:
`getTechnique('mul-by-11')` returns correct metadata. All 25 techniques loadable. Content integrity tests pass.

---

### Phase 2 — Problem Generator Engine

**Duration estimate:** 3–4 weeks (most time-intensive module of V1)  
**Depends on:** Phase 1  
**Goal:** Every technique can produce tagged problems on demand.

#### High-level modules:

**2.1 Generator Contract & Registry**
- Define `ProblemGenerator` interface (input: difficulty; output: `Problem` with pre-filled `techniqueId`, `topicId`, `difficulty`, `prompt`, `answer`)
- Build generator registry mapping `techniqueId` → generator function
- Implement `generateProblem(techniqueId, difficulty)` that routes to correct generator
- Implement `generateProblems(techniqueId, difficulty, count)` for batch generation

**2.2 Single-Technique Generators (all 25)**

Per each technique, implement in `src/features/generators/techniques/`:
- `generate${TechniqueName}Problem(difficulty)`
- Problem-specific RNG for fair difficulty distribution
- Valid problem constraints (e.g., don't generate trivial cases as "hard")

Techniques (by operation):
- **Addition:** left-to-right, complement-100, round-adjust, near-doubles, column-grouping
- **Subtraction:** complement-10, borrow-free, round-adjust, counting-up
- **Multiplication:** by-11, by-9, by-5, by-25, by-12, sq-ending-5, near-100, double-halve, by-99-101, foil-mental
- **Division:** by-5, by-25, by-9-digit-sum, percent-10-5-20, estimate-adjust, factor-decompose

**2.3 Multi-Technique Generator**
- For daily challenge and future global runs
- Takes array of techniqueIds (or null for "all") and count
- Generates balanced mix (representative sampling)
- Assigns difficulty mix: 40% easy, 40% medium, 20% hard

**2.4 Generator Tests**
- Property-based tests per generator:
  - Every problem has valid `techniqueId`
  - `answer` is arithmetically correct
  - `prompt` is solvable and sensible for stated difficulty
  - No unrealistic edge cases (e.g., multiplying by 0)
- Difficulty distribution tests:
  - "Easy" problems solve in ~1–2 seconds on average
  - "Medium" in ~3–4 seconds
  - "Hard" in ~5+ seconds (approximate expectations for validation)
- Multi-technique generator balances topics and difficulties

#### Exit criteria:
All 25 generators tested. Calling `generateProblem('mul-by-11', 'hard')` returns valid problem with `techniqueId: 'mul-by-11'`. Multi-technique generator produces balanced problem sets.

---

### Phase 3 — Core Session Engine

**Duration estimate:** 2–3 days  
**Depends on:** Phase 2  
**Goal:** A headless training session can run end-to-end in tests. No UI yet.

#### High-level modules:

**3.1 Session State Machine**
- States: Idle → Running → Answering → Evaluating → NextProblem → Complete
- Immutable state transitions with reducers
- No side effects, pure logic

**3.2 Session Modes**

**Drill Mode:**
- Fixed problem count (e.g., 15)
- No global timer, unlimited time per problem
- User paces themselves
- Continues until all problems answered

**Challenge Mode:**
- Fixed time (e.g., 60 seconds)
- As many problems as possible in time
- Timer active and visible
- Ends when time expires

**3.3 Problem Evaluation**
- Check `userAnswer === problem.answer`
- Record time (ms from problem display to answer submit)
- Accumulate correctness streak (current session only)

**3.4 SessionSummary Generation**
- At session end, aggregate:
  - `correct` (count)
  - `attempted` (count)
  - `accuracyPct` (correct / attempted × 100)
  - `speedPerMin` (correct answered per minute)
  - `xpEarned` (formula from Vision doc)
  - `weakTechniqueIds` (2 lowest-performing `techniqueId`s)
  - Per-technique breakdown (for post-run report)

**3.5 Weak Technique Detection**
- For each `techniqueId` in session, track correct % 
- Sort by accuracy (ascending)
- Return top 2 with lowest accuracy
- Only if session had ≥ 5 problems (avoid noise)

**3.6 Engine Tests**
- Drill session: 15 problems answered, correct summary generated
- Challenge session: time expires, final count captured
- XP calculation correct per formula
- Weak techniques correctly identified (2 weakest surfaced)
- Streak handling (reset on wrong answer, increment on correct)

#### Exit criteria:
Test spins up Drill, feeds answers, receives correct summary with weak techniques. Challenge session respects 60s timer.

---

### Phase 4 — Persistence Layer

**Duration estimate:** 2 days  
**Depends on:** Phase 3  
**Goal:** User progress is durable across reloads.

#### High-level modules:

**4.1 Redux UserProgress Slice**
- Reducers for:
  - `completeSession(topicId, sessionSummary)` — updates topic progress with new session
  - `markTechniqueRead(techniqueId)` — unlocks Drills and Challenge
  - `togglePactMode(enabled)` — updates settings
  - `importProgress(data)` — overwrites all progress from JSON
- Selectors for:
  - `selectUserXP()`, `selectUserLevel()`
  - `selectTopicProgress(techniqueId)` — returns topic progress
  - `selectTechniqueRead(techniqueId)`
  - `selectMasteryStars(techniqueId)` — returns { speed, accuracy, range } booleans
  - `selectGlobalStats()` — max speed, avg accuracy, breadth %
  - `selectWeakTechniques()` — cross-topic weak areas

**4.2 Mastery Calculation Selectors**
- Per-topic Star Logic:
  - **Speed star:** Avg speed from last 5 Drill sessions ≥ speed threshold
  - **Accuracy star:** Avg accuracy from last 5 Drill sessions ≥ accuracy threshold
  - **Range star:** Session history includes correct problems at all 3 difficulties
- Stars only earned, never lost (one-way gates)

**4.3 XP & Level Calculation**
- Cumulative XP from all sessions (formula in Vision doc)
- Level = floor(XP / 1000) — cosmetic at V1
- Level never decrements

**4.4 localStorage Persistence**
- redux-persist configured with localStorage
- Schema versioning for future migrations
- Data retained across browser reload

**4.5 Export/Import Progress**
- Export button: downloads `mathsprint-progress-${date}.json`
- Import button: file picker, parses JSON, validates schema, overwrites progress with confirmation
- Handles old schema gracefully (fallback to empty progress if version mismatch)

**4.6 Persistence Tests**
- Round-trip: complete session → reload page → progress persists
- Mastery selectors: mock progress data → correct star calculation
- Export/import: export → import → data identical
- Schema versioning: old version gracefully migrated or rejected

#### Exit criteria:
Completing a session updates persistent progress. Reloading shows updated stats. Export/import works end-to-end.

---

### Phase 5 — Input UI Primitives

**Duration estimate:** 2–3 days  
**Depends on:** Phase 0  
**Can parallelize with:** Phase 3–4  
**Goal:** Reusable, mobile-first input components ready for session screens.

#### High-level modules:

**5.1 Custom Numeric Keypad**
- Mobile-first grid (0–9, backspace, submit)
- Large tap targets (min 44px)
- Visual feedback on tap
- Display area shows typed digits, max 3–4 digits
- Submit button enabled only after digit entered
- Works on desktop via click, mobile via touch

**5.2 Desktop Keyboard Input Handler**
- Digit keys (0–9) append to answer
- Backspace clears last digit
- Enter submits answer
- Tab moves focus (optional, for accessibility)

**5.3 Answer Feedback Component**
- Correct: green flash animation, brief celebration tone
- Incorrect: red flash, correct answer revealed inline
- Disappears/next problem button appears after brief delay

**5.4 Timer Display**
- MM:SS format (e.g., "1:23" for 83 seconds)
- Countdown animation
- Warning color change when < 10s
- Pulsing animation in final 5 seconds

**5.5 Progress Indicators**
- Problems completed count (e.g., "12 / 15")
- Accuracy percentage live update
- Speed (problems/min) live calculation
- Visual bar for progress toward goal

**5.6 Component Tests & Demo**
- Storybook or dev route showcasing all primitives
- Tests: numeric keypad input, keyboard shortcuts, animations trigger correctly
- Mobile and desktop viewport versions

#### Exit criteria:
All components render correctly in isolation. Keyboard + numpad both work. Feedback animations smooth.

---

### Phase 6 — Drill Session UI (Vertical Slice)

**Duration estimate:** 3–4 days  
**Depends on:** Phase 4, Phase 5  
**Goal:** End-to-end playable Drill session for one technique. Full feature verification.

#### High-level modules:

**6.1 Drill Entry Screen**
- Show technique name and description
- Display current mastery state (stars, last session date/score)
- "Start Drill" CTA
- Back button to topic detail

**6.2 In-Session Screen**
- Problem displayed prominently
- Input component (numeric keypad + keyboard handler)
- Feedback component for correctness
- Timer (if challenge mode) or elapsed time (if drill)
- Progress indicator showing position in session
- No ability to skip or go back

**6.3 Post-Session Report Screen**
- Session summary: problems/correct/accuracy/speed/XP
- Mastery delta visual (which stars progressed toward completion)
- Weak technique highlights (2 lowest-accuracy techniques with [Review] CTA)
- "Back to Map" or "Next Topic" CTA

**6.4 Integration with Session Engine**
- Wire Drill UI to session state machine from Phase 3
- On answer submit, evaluate and transition state
- Session engine generates `SessionSummary` at end
- Report screen consumes summary

**6.5 Integration with Persistence**
- On session complete, dispatch `completeSession(topicId, summary)` 
- Mastery selectors update stars on report screen
- Progress visible before leaving report

**6.6 Choose Pilot Technique**
- Pick one technique with well-tested generator (e.g., `mul-by-11`)
- Verify full flow: entry → problems → feedback → report → updated progress
- All three difficulties represented in generator

**6.7 Tests**
- Navigation: entry screen → start → session runs → report → back
- Session progression: correct/incorrect answers handled, streak tracked
- Report: correct stats, weak techniques identified
- Persistence: session saved, progress updated, reload shows changes

#### Exit criteria:
User can navigate to Drill for chosen technique, solve 15 problems, receive report with correct stats, return to map with visual progress update.

---

### Phase 7 — Challenge Session UI (Speed Exam)

**Duration estimate:** 2–3 days  
**Depends on:** Phase 4, Phase 5, Phase 6  
**Goal:** Top-tier exam mode with pass/fail framing and mastery gating.

#### High-level modules:

**7.1 Challenge Entry Screen**
- Technique name and description
- **Pass threshold display**: "Speed: ≥6 correct/min AND Accuracy: ≥90%" (clear, bold)
- Current topic mastery state
- Soft nudge if no Drills completed: "Recommended: complete a few Drills first"
- "Start Challenge" CTA (not blocked, just nudged)
- Back button

**7.2 Challenge In-Session Screen**
- Visual intensity: darker background, more prominent timer
- Problem displayed (same size as Drill)
- Input component, feedback component
- Timer **very prominent** (larger font, color change near end)
- Progress counter (problems attempted only, no total)
- High-energy animation style

**7.3 Pass Screen**
- "🎉 Challenge Passed!" header
- Speed and accuracy stats vs. required thresholds (both highlighted as met)
- **Speed mastery star earned** visual (star animation, glow effect)
- XP earned (higher XP for challenge pass)
- "Back to Map" CTA

**7.4 Fail Screen**
- **Progress-positive framing:** "Not there yet" (never "Failed" or "Wrong")
- Speed and accuracy stats vs. required thresholds (which ones missed)
- Two weakest techniques with review links
- Encouragement: "A few more Drills will get you there"
- "Try Drills" button → route to Drill session entry
- "Try Again" button → restart Challenge

**7.5 Integration with Session Engine**
- Challenge mode variant of session engine (fixed time, problem stream)
- At time expiration, evaluate against pass thresholds
- SessionSummary includes pass/fail flag

**7.6 Mastery Star Gating**
- Only passing Challenge earns Speed star
- Failing does not regress Drill progress (Drill stars independent)
- Star state visible on entry screen and persisted

**7.7 Tests**
- Pass flow: correct answers exceed threshold, pass screen shown, star earned
- Fail flow: answers below threshold, fail screen shown, star not earned, Drill state unchanged
- Timer expires correctly at 60s
- Weak technique identification in fail screen

#### Exit criteria:
Challenge completable, both pass and fail screens polished and clear. Mastery star earned/not earned based on thresholds. UI intensity noticeably higher than Drill mode.

---

### Phase 8 — Technique Card UI (Tier 1 Theory)

**Duration estimate:** 2 weeks (content authoring is the longest part)  
**Depends on:** Phase 0  
**Can parallelize with:** Phases 3–7  
**Goal:** The unlock gate for Drills and Challenge. All 25 techniques have readable, learnable explanations.

#### High-level modules:

**8.1 Technique Card Slide Viewer Component**
- Render one slide at a time
- Navigation: swipe on mobile, arrow buttons on desktop
- Slide counter (e.g., "3 / 5")
- "Got it" CTA on final slide (marks technique as read)
- Reference button ("?") accessible from Drill/Challenge (backlinks to this card)
- Smooth slide transitions

**8.2 Technique Content Schema**
- Per technique: array of slides
- Slide types:
  - Text + image (for concept explanation)
  - Worked example (problem + step-by-step solution)
  - Interactive example (problem with hint-on-demand)
- Stored in `src/content/techniques/{techniqueId}/content.ts`

**8.3 Author All 25 Technique Cards**
- Each technique: 3–5 slides
- Content per slide:
  - Slide 1: "Why does this work?" / mental model
  - Slide 2: Worked example A (step-by-step)
  - Slide 3: Worked example B (different numbers)
  - Slide 4 (optional): Edge cases / gotchas
  - Slide 5: "Try it" — guided practice with hints
- Writing style: clear, concise, visual-first (show > tell)
- Worked examples use the actual problem numbers from corresponding techniques

**8.4 Content Validation**
- All 25 techniques have content
- No blank slides
- Examples are numerically correct
- Examples demonstrate the technique effectively

**8.5 Unlock Gate Integration**
- Entry from topic detail screen: [Technique] tab
- On final slide "Got it", dispatch `markTechniqueRead(techniqueId)`
- Drills and Challenge tabs unlock after technique marked as read
- Persistence: `techniqueRead` flag visible on topic detail

**8.6 Reference Access**
- From inside Drill/Challenge, "?" button opens technique card in modal
- Returns to session on close (does not exit session)

**8.7 Tests**
- All 25 techniques loadable
- Slide navigation works (swipe, arrows)
- "Got it" updates persistence correctly
- Reference access does not lose session state

#### Exit criteria:
All 25 technique cards written, slide viewer works, "Got it" unlocks the two practice tiers. Users can reference technique explanations during sessions.

---

### Phase 9 — Topic Node Detail Screen

**Duration estimate:** 2 days  
**Depends on:** Phase 6, Phase 7, Phase 8  
**Goal:** Single screen surfacing all three tiers for a topic. Central hub for a technique.

#### High-level modules:

**9.1 Topic Detail Layout**
- Header: technique name, difficulty badge, mastery radar (3 stars)
- Three tier cards:
  - Card 1: Techniques (book icon, "Read the technique" → slides modal)
  - Card 2: Drills (dumbbell icon, "Practice with drills" → entry screen)
  - Card 3: Challenge (lightning icon, "Test your speed" → entry screen)
- Each card shows completion state and progress

**9.2 Tier Card Styling & States**
- Techniques:
  - Locked (greyed, with "Read techniques first" message) if not yet read
  - Unlocked (bright) after technique card marked complete
  - "Read again" option visible after first completion
- Drills:
  - Locked if technique not read
  - Unlocked after technique read
  - Shows: last session date, current mastery progress (stars toward completion), XP from drills
  - CTA: "Start Drill"
- Challenge:
  - Locked if technique not read
  - Unlocked after technique read
  - Shows: pass status (passed / not yet attempted), required thresholds
  - Soft nudge if no Drills completed
  - CTA: "Start Challenge" or "Try Again"

**9.3 Mastery Radar**
- Three-point star display: Speed / Accuracy / Range
- Filled star = threshold met
- Partial fill = progressing
- Shows numeric progress: e.g., "4.2/min (need 6)" for Speed

**9.4 Navigation**
- Back to constellation map button
- Deep links from map go directly to this screen
- Clicking tier CTA navigates to that tier's entry screen

**9.5 Integration Points**
- Reads from persistence: `selectTopicProgress(techniqueId)`, `selectMasteryStars(techniqueId)`
- Navigates to: technique slides modal, Drill entry, Challenge entry
- Reflects live updates when returning from a session (due to RTK subscriptions)

**9.6 Responsive Design**
- Desktop: three cards side-by-side or in a row
- Mobile: cards stacked, each card touches left/right edges (full width)

**9.7 Tests**
- All tier cards visible and show correct state
- Navigation to each tier works
- Mastery stars calculated correctly per topic
- Updated stats from returned sessions reflected immediately

#### Exit criteria:
Every technique has a fully working detail page. All three tiers accessible. Mastery state clearly visible. Navigation flows work end-to-end.

---

### Phase 10 — Constellation Map

**Duration estimate:** 3–4 days  
**Depends on:** Phase 9  
**Goal:** The main entry point and emotional core. Visualize all 25 techniques and progress.

#### High-level modules:

**10.1 Node Layout & Positioning**
- ~25 nodes for techniques
- Hand-tuned static layout (x, y positions per node) — not procedural for V1
- Positions reflect constellation metaphor (grouped by topic, visually appealing)
- Coordinates stored in `src/content/graph-layout.ts`

**10.2 Node Component**
- Display technique name and icon
- Three tier completion icons (book / dumbbell / lightning) with filled/empty states
- Mastery stars (0–3 per topic) displayed on or near node
- Visual states:
  - Not visited: dim, grey outline
  - In progress (technique read or drills started): glowing, base color
  - Mastered (all 3 stars): bright, pulsing glow
  - Soft-locked (pact mode): greyed, "Suggested: complete X first" tooltip
- Hover state shows technique name (tooltip)

**10.3 Edge Rendering**
- Lines between related techniques (from graph data in Phase 1)
- Subtle, not overwhelming (possibly draw on canvas for perf)
- Stronger glow on hover over connected nodes
- Pact mode: highlight suggested path edges

**10.4 Pan & Zoom**
- Desktop: drag to pan, scroll wheel to zoom (or pinch track pad)
- Mobile: one-finger drag to pan, pinch to zoom
- Zoom bounds: min 0.5x, max 2x (prevent over-zoom)
- Pan bounds: keep nodes mostly in view

**10.5 Interaction**
- Click/tap node → navigate to topic detail screen
- Visual feedback on click (node grows slightly, then routes)
- Drag/pan does not trigger click if not moving (or very little movement)

**10.6 First-Visit Indicators**
- 3–4 beginner-difficulty nodes labeled "Start here" (faint, non-intrusive)
- One dismissable tooltip on first load: "Tap any node to begin training"
- After dismiss, never shown again (stored in localStorage)

**10.7 Canvas/SVG vs. DOM**
- Nodes: DOM (React components) for flexibility
- Edges: SVG or canvas for performance and visual polish
- Hybrid approach acceptable if needed

**10.8 Responsive Design**
- Desktop: full pan/zoom, large nodes with text labels
- Mobile: nodes still pannable/zoomable, slightly smaller, icons + labels legible

**10.9 Tests**
- All 25 nodes render
- Pan and zoom work on desktop and mobile
- Node click navigates correctly
- First-visit tooltip appears and dismisses
- Mastery state icons update after returning from sessions

#### Exit criteria:
Constellation is the app's landing page. All 25 techniques visible. Navigation, pan, zoom, and progress states all working. Feels alive with icon animations on completed nodes.

---

### Phase 11 — Pact Mode

**Duration estimate:** 1–2 days  
**Depends on:** Phase 10  
**Goal:** Optional structured learning path overlay. Tight, self-contained feature.

#### High-level modules:

**11.1 Settings Toggle**
- Settings page (or modal): "Pact Mode" toggle (off by default)
- Persisted in Redux settings slice
- Immediately visible change when toggled

**11.2 Suggested Learning Sequence**
- Define in `src/content/pact-sequence.ts` or within constellation graph
- List of technique IDs in recommended order (e.g., Addition → Subtraction → Multiplication)
- Frontend builds a set of "in-path" and "out-of-path" nodes

**11.3 Map Visual Changes (Pact Mode ON)**
- Out-of-path nodes: greyed, with semi-transparent overlay
- Tooltip on out-of-path node: "Suggested: complete [prerequisite] first"
- In-path edge: highlighted or pulsing glow
- Subtle visual distinction (not jarring)

**11.4 Soft Lock, Not Hard Block**
- Out-of-path nodes remain **clickable**
- Navigation to topic detail works
- Tiers are accessible (no hard gate)
- Tooltip is purely informational

**11.5 Toggle UX**
- Pact Mode OFF: all nodes bright, no visual hierarchy
- Pact Mode ON: path highlighted, others de-emphasized
- Toggle switch clearly shows state

**11.6 Tests**
- Toggle persists across reload
- In-path nodes highlighted correctly
- Out-of-path nodes still clickable
- No hard-block behavior

#### Exit criteria:
Pact mode toggle visible in settings. Map visual state changes noticeably when toggled. Nodes remain accessible even when out-of-path.

---

### Phase 12 — Daily Challenge

**Duration estimate:** 2–3 days  
**Depends on:** Phase 2, Phase 4  
**Can parallelize with:** Phase 10–11  
**Goal:** Shareable, retention-driving daily mode. One problem set per calendar date, everyone gets the same.

#### High-level modules:

**12.1 Date-Seeded RNG**
- Seed function: take `YYYY-MM-DD` as string, produce deterministic RNG state
- Same date on any device → identical problem sequence
- Example: `seedRng('2026-05-31')` always produces same random sequence

**12.2 Multi-Technique Problem Generator**
- Generate 10 problems for daily challenge
- Seed the RNG with today's date
- Mix techniques: diverse set across multiple topics
- Difficulty distribution: 40% easy, 40% medium, 20% hard
- Each problem carries `techniqueId`

**12.3 Daily Challenge Session**
- Entry screen: "Today's Challenge" with date, description, no spoilers
- Session: use Challenge mode engine (timed, 60s)
- Post-session: shareable result card
- One attempt per calendar day (enforced via persistence)

**12.4 Shareable Result Card**
- **Design first before building.** Example format (Wordle-inspired):
  ```
  MathSprint Daily #42
  ⚡ 8/10 correct · 47s
  🟩🟩🟩🟥🟩🟩🟩🟥🟩🟩
  mathsprint.app/daily/42
  ```
- Copy to clipboard button (mobile: one tap)
- Share via social links (optional v1, can add in v2)

**12.5 Result Screen**
- Show score vs. personal best on this challenge (if retryable) or just show score
- Weak techniques highlighted with [Review] links (same as other post-run reports)
- Countdown to tomorrow's challenge
- Link back to constellation map

**12.6 Already-Completed State**
- If user already completed today's challenge, show their result
- Display countdown to next challenge (hh:mm:ss until midnight UTC or local)
- Offer to review weaknesses or explore other topics

**12.7 Persistence**
- Daily challenge results stored in `dailyChallenges: Record<YYYY-MM-DD, result>`
- Synced to profile stats

**12.8 Tests**
- Same date on two test runs produces identical problems
- Different dates produce different problems
- One-per-day enforcement works
- Shareable string correctly formatted
- Result matches XP / session summary expectations

#### Exit criteria:
Daily challenge accessible from main menu. Same date = same problems for all users. Result card shareable. One attempt per day enforced. Post-run report shows weak techniques.

---

### Phase 13 — Profile & Stats Page

**Duration estimate:** 2 days  
**Depends on:** Phase 4  
**Can parallelize with:** Phase 10–12  
**Goal:** A home base for viewing overall progress and managing data.

#### High-level modules:

**13.1 Profile Header**
- User identity (anonymous or custom name if added later)
- Global XP and level (large, prominent)
- Global mastery aggregates:
  - Max Speed (best topic speed achieved)
  - Avg Accuracy (across all attempted topics)
  - Breadth % (% of techniques with at least one mastery star)

**13.2 Mastery Overview**
- Grid or list of all techniques
- Per technique: 3-star display (Speed / Accuracy / Range)
- Color-coded: empty / partial / filled
- Sortable: by topic, by mastery %, by recently practiced

**13.3 Session History**
- Scrollable list of last 20 sessions (most recent first)
- Per session: date, technique, type (Drill/Challenge), score, XP
- Optional: click to see detailed breakdown (accuracy per technique in that session)

**13.4 Daily Challenge History**
- List of past daily challenges completed (last 30 days)
- Per day: date, score, personal best note
- Shareable result card view (same format as immediate post-session)

**13.5 Settings Section**
- Pact Mode toggle (on/off)
- Future: theme preference, session length, language
- Reset progress (dangerous action — requires confirmation)

**13.6 Export/Import**
- **Export:** Button → downloads `mathsprint-progress-${date}.json`
- **Import:** File picker → loads JSON → confirms schema validity → overwrites progress with user confirmation dialog
- Clear messaging: "This will replace all your current progress"
- Success message after import: "Progress imported successfully"

**13.7 Responsive Design**
- Desktop: 2–3 column layout (header, mastery grid, session history side-by-side)
- Mobile: full-width stacked layout

**13.8 Tests**
- Global stats calculated correctly
- Session history shows correct data
- Export generates valid JSON
- Import restores data correctly
- Persistence updates reflected on page

#### Exit criteria:
Profile page accessible. Shows global progress, per-technique mastery, session history, daily challenge history, settings, and export/import tools. Responsive on mobile and desktop.

---

### Phase 14 — Polish, Animation, and Theming

**Duration estimate:** 3–4 days  
**Depends on:** All previous phases (integrates across entire app)  
**Goal:** App feels alive, finished, and delightful.

#### High-level modules:

**14.1 Constellation Map Animations**
- Node glow on hover
- Mastered nodes: pulsing glow effect
- Edge lines: subtle gradient or opacity fade
- Pan/zoom: smooth easing
- Click feedback: node scales briefly on tap

**14.2 Session Screen Animations**
- Problem slide-in on new problem
- Feedback flash (green correct / red incorrect)
- Timer pulse in final 5 seconds
- Progress bar fill on correct answer
- XP number pop-up animation

**14.3 Technique Card Animations**
- Slide transitions (swipe on mobile, fade on desktop)
- Slide counter animation
- "Got it" button highlight / celebration animation on final slide

**14.4 Report Screen Animations**
- Stats numbers count-up to final values
- Stars glow/pulse as they're earned
- Weak technique cards slide in sequentially

**14.5 Visual Design Pass**
- Color palette finalized (if not already)
- Typography hierarchy confirmed (font sizes, weights)
- Icon design consistent across app
- Dark / light theme (or single theme if chosen)
- Button and card styling polished

**14.6 Empty States**
- No progress yet: encouraging illustration + CTA
- No daily challenge today: countdown to next
- No sessions in history: "Start training" CTA
- Consistency and brand voice across all empty states

**14.7 Mobile UX Audit**
- One-thumb usability: all CTA buttons reachable from bottom
- Tap target sizing: all buttons/nodes ≥ 44px
- Keyboard behavior: numpad never pops up unexpectedly
- Scroll smoothness: pan, zoom, infinite scroll (if history is long)
- Safe area / notch handling: layout not obscured

**14.8 Animation Performance**
- Frame rate test: 60 fps on target devices (iPhone 12+, Pixel 5+, modern desktop)
- Lighthouse performance audit: aim for 90+ score
- Bundle size check: main JS < 500KB gzipped (reasonable for this complexity)

**14.9 Brand & Tone**
- Consistent voice across all UI text (encouraging, not condescending)
- Celebration on wins (e.g., challenge pass, star earned)
- Supportive messaging on failure (e.g., challenge fail, weak areas)

**14.10 Tests**
- Visual regression tests (if feasible) or manual spot-check list
- Animation perf: no jank, smooth 60fps
- Mobile usability: one-thumb test on real device
- Accessibility: tab nav, screen reader basics

#### Exit criteria:
App feels production-quality. Animations are smooth and meaningful. Mobile experience optimized. All empty states designed. Lighthouse score 90+.

---

### Phase 15 — Pre-Launch Hardening

**Duration estimate:** 2–3 days  
**Depends on:** Phase 14  
**Goal:** Ship-ready robustness and polish.

#### High-level modules:

**15.1 Cross-Browser Testing**
- Chrome (desktop and mobile)
- Safari (desktop and iOS)
- Firefox (desktop)
- Edge (desktop)
- Test matrix: all routes, all input methods, all feedback states
- Document any quirks or fallbacks needed

**15.2 Performance Audit**
- Lighthouse run: Performance, Accessibility, Best Practices, SEO
- Target scores: 90+, 95+, 90+, 90+ respectively
- Fix critical issues (LCP, CLS, FID)
- Analyze bundle size: identify and lazy-load if possible

**15.3 localStorage & Storage**
- localStorage quota test: what happens at 5MB limit? (unlikely to hit, but handle gracefully)
- localStorage is unavailable (private browsing mode): app should degrade gracefully or show message
- Schema versioning: test that old schema detected and handled

**15.4 Error Boundaries & Graceful Degradation**
- Unhandled errors don't crash the app
- Error boundary components catch React errors
- Fallback UI: "Something went wrong. Refresh the page."
- Session data not lost on error (persisted before error)

**15.5 Accessibility**
- Keyboard navigation: Tab through all interactive elements, Enter/Space to activate
- Screen reader basics: alt text on images, semantic HTML, ARIA labels where needed
- Color contrast: WCAG AA standard (4.5:1 for text)
- Focus indicators: visible on all buttons/inputs

**15.6 Data Export Robustness**
- Export file naming consistent
- Large export files (100+ sessions) handle correctly
- Import: invalid JSON rejection with error message
- Schema mismatch: detected, user warned

**15.7 Privacy & Analytics (Optional)**
- Privacy policy if any data collected (or stated that no data leaves device)
- No tracking pixels or third-party analytics cookies unless explicitly stated
- localStorage only, no backend requests (for V1)

**15.8 SSL / Domain**
- Domain acquired and HTTPS configured
- Redirect HTTP → HTTPS
- Vercel / Netlify SSL auto-configured

**15.9 Launch Checklist**
- [ ] All routes reachable and working
- [ ] No console errors on any page
- [ ] Mobile and desktop both tested
- [ ] All three tiers (Techniques/Drills/Challenge) tested on all topics
- [ ] Export/import tested
- [ ] Daily challenge generates correct problems
- [ ] Pact mode toggle works
- [ ] Accessibility checked (keyboard nav, contrast)
- [ ] Performance targets met
- [ ] Error boundaries in place
- [ ] Privacy policy / data statement visible (if needed)

**15.10 Documentation**
- README with feature overview and roadmap
- Architecture doc (optional but helpful for contributors)
- Content authoring guide (if more techniques will be added)

#### Exit criteria:
All tests pass. No console errors on any page. Performance audit 90+. Accessibility baseline met. Ready to launch.

---

## Dependency Graph

```
Phase 0 (Foundation)
    ↓
Phase 1 (Content Model)
    ↓
Phase 2 (Generators) ←─┐
    ↓                  │
Phase 3 (Session Engine) ←─┐
    ↓                      │
Phase 4 (Persistence) ←─┐  │
    ↓                   │  │
Phase 5 (UI Primitives)─┴──┘
    ↓
Phase 6 (Drill UI)
    ↓
Phase 7 (Challenge UI)
    ↓
Phase 8 (Technique Cards) ←─ [can start earlier, parallelizable]
    ↓
Phase 9 (Topic Detail)
    ↓
Phase 10 (Constellation Map)
    ↓
Phase 11 (Pact Mode)
    ↓
Phase 12 (Daily Challenge) ←─ [can parallelize with 10–11]
    ↓
Phase 13 (Profile) ←─ [can parallelize with 10–12]
    ↓
Phase 14 (Polish & Animation) [integrates across all previous]
    ↓
Phase 15 (Pre-Launch Hardening)
```

### Parallelization Opportunities

- **Phase 5 (UI Primitives)** can start once Phase 0 is done, doesn't block Phase 3
- **Phase 8 (Technique Cards)** content authoring can start in Phase 1–2, component implementation can start after Phase 0
- **Phases 10–13** (Map, Pact, Daily, Profile) can be parallelized after Phase 9
- **Phase 14 (Polish)** happens throughout; major animation pass in final days

---

## Key Principles

1. **Data before UI.** Phases 1–2 lock content and generators before any screen exists. Prevents UI rework when content shape changes.

2. **Engine before screens.** Phase 3's session engine is fully testable headlessly. Phases 6/7 wrap it in UI, not the other way around.

3. **One vertical slice before going wide.** Phase 6 ships one fully working technique end-to-end before generalizing to all techniques.

4. **The map comes late.** It's the most visible feature, but depends on everything else working. Building it earlier risks rewriting it.

5. **No phase introduces capability the next phase rewrites.** Each phase extends, never replaces.

6. **Persistence early.** Phase 4 comes right after session engine. User data durability is not a detail; it's core.

7. **Mobile-first in primitives.** Phase 5 designs for mobile (small keypad, touch input) and adapts to desktop, not vice versa.

---

## Phase Deliverables Checklist

Use this checklist to track completion and PR readiness per phase.

### Phase 0 ✅
- [x] Project initialized (Vite, React, TS, Tailwind)
- [x] Redux + redux-persist skeleton
- [x] Folder structure
- [x] Router configured (placeholder routes)
- [x] Base types defined
- [x] CI set up
- [x] Deploy working
- **Status:** `Done`

### Phase 1 ✅
- [x] 25 technique metadata authored
- [x] Topic definitions
- [x] Constellation graph edges
- [x] Content registry module
- [x] Validation tests
- **Status:** `Done`

### Phase 2 ✅
- [x] Generator contract and registry
- [x] All 25 technique generators implemented
- [x] Multi-technique generator
- [x] Property-based tests per generator
- [x] Difficulty distribution validated
- **Status:** `Done`

### Phase 3 ✅
- [x] Session state machine
- [x] Drill mode implementation
- [x] Challenge mode implementation
- [x] Answer evaluation
- [x] SessionSummary generation
- [x] Weak technique detection
- [x] Full session flow tests
- **Status:** `Done`

### Phase 4 ✅
- [x] UserProgress Redux slice
- [x] Mastery calculation selectors
- [x] XP & level selectors
- [x] redux-persist configured
- [x] Export/import functions
- [x] Persistence round-trip tests
- **Status:** `Done`

### Phase 5 ⏳
- [ ] Numeric keypad component
- [ ] Keyboard input handler
- [ ] Feedback component
- [ ] Timer component
- [ ] Progress indicators
- [ ] Component tests
- [ ] Demo route
- **Status:** `Next`

### Phase 6 ⏳
- [ ] Drill entry screen
- [ ] In-session screen
- [ ] Post-session report
- [ ] Session engine integration
- [ ] Persistence integration
- [ ] Pilot technique verified end-to-end
- [ ] Navigation tests
- **Status:** `Pending`

### Phase 7 ⏳
- [ ] Challenge entry screen
- [ ] In-session screen (high intensity)
- [ ] Pass screen with star animation
- [ ] Fail screen with positive framing
- [ ] Session engine (challenge mode) integration
- [ ] Mastery star gating
- [ ] Pass/fail tests
- **Status:** `Pending`

### Phase 8 ⏳
- [ ] Technique card slide viewer
- [ ] Content schema defined
- [ ] All 25 technique cards authored
- [ ] "Got it" unlock gate
- [ ] Reference access from session
- [ ] Content validation
- [ ] Slide navigation tests
- **Status:** `Pending`

### Phase 9 ⏳
- [ ] Topic detail layout
- [ ] Tier card styling & states
- [ ] Mastery radar display
- [ ] Navigation & deep linking
- [ ] Responsive design
- [ ] Integration tests
- **Status:** `Pending`

### Phase 10 ⏳
- [ ] Node layout (hand-tuned coordinates)
- [ ] Node component with all states
- [ ] Edge rendering
- [ ] Pan & zoom (desktop & mobile)
- [ ] Click/tap interaction
- [ ] First-visit indicators
- [ ] Responsive design
- [ ] Navigation tests
- **Status:** `Pending`

### Phase 11 ⏳
- [ ] Settings toggle for pact mode
- [ ] Suggested sequence defined
- [ ] Map visual changes (pact mode)
- [ ] Soft lock (clickable, not hard-blocked)
- [ ] Tests
- **Status:** `Pending`

### Phase 12 ⏳
- [ ] Date-seeded RNG
- [ ] Multi-technique daily generator
- [ ] Daily challenge session
- [ ] Shareable result card (design first!)
- [ ] Result screen
- [ ] Already-completed state
- [ ] Persistence
- [ ] Tests
- **Status:** `Pending`

### Phase 13 ⏳
- [ ] Profile header
- [ ] Mastery overview grid
- [ ] Session history
- [ ] Daily challenge history
- [ ] Settings section
- [ ] Export/import
- [ ] Responsive design
- [ ] Tests
- **Status:** `Pending`

### Phase 14 ⏳
- [ ] Constellation animations
- [ ] Session screen animations
- [ ] Technique card animations
- [ ] Report animations
- [ ] Visual design pass
- [ ] Empty states
- [ ] Mobile UX audit
- [ ] Performance audit (60fps, Lighthouse)
- [ ] Brand & tone
- [ ] Tests
- **Status:** `Pending`

### Phase 15 ⏳
- [ ] Cross-browser testing
- [ ] Performance audit (90+ Lighthouse)
- [ ] localStorage edge cases
- [ ] Error boundaries
- [ ] Accessibility (WCAG AA)
- [ ] Export/import robustness
- [ ] Privacy & analytics
- [ ] SSL & domain
- [ ] Launch checklist
- [ ] Documentation
- **Status:** `Pending`

---

## Notes for Execution

### Before Starting Phase 0:
1. Confirm domain name availability
2. Decide on visual design direction (theme, color palette)
3. Lock tech stack choices (any deviations from Vite + React + TS + RTK?)

### Before Starting Phase 2:
1. Complete problem generator design session for all 25 techniques
   - Document difficulty parameters per technique
   - Define number ranges for each difficulty level
   - Clarify what "easy," "medium," "hard" means numerically per technique
2. Ensure Phase 1 content is fully authored

### Before Starting Phase 8:
1. Write all technique card content (3–5 slides × 25 techniques = 75–125 slides of content)
2. Source or create example images/diagrams if visual aids needed
3. Get content reviewed for clarity and accuracy

### Content Authoring Track (Parallel to Development):
- Phase 1: Technique metadata (IDs, names, descriptions, prerequisites)
- Phase 2–7: Develop generators and sessions (dev proceeding)
- Phase 8: Write all 25 technique card slides (can be done in parallel with Phases 3–7)

---

**Status:** Phases 0–4 complete. Starting Phase 5 (Input UI Primitives).
