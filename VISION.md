# MathSprint — Product Vision Document

> Last updated: May 2026  
> Status: Pre-development brainstorm & planning

---

## Table of Contents

1. [Concept & Positioning](#1-concept--positioning)
2. [Core Philosophy](#2-core-philosophy)
3. [Target Audience](#3-target-audience)
4. [The Three Mastery Dimensions](#4-the-three-mastery-dimensions)
5. [Content Scope — V1](#5-content-scope--v1)
6. [Skill Constellation Map](#6-skill-constellation-map)
7. [Three-Tier Training Architecture](#7-three-tier-training-architecture)
8. [The Problem Reference System](#8-the-problem-reference-system)
9. [Post-Run Report](#9-post-run-report)
10. [Gamification System](#10-gamification-system)
11. [Daily Challenge](#11-daily-challenge)
12. [Pact Mode](#12-pact-mode)
13. [Progress & Persistence](#13-progress--persistence)
14. [Tech Stack](#14-tech-stack)
15. [V1 Scope — In vs. Out](#15-v1-scope--in-vs-out)
16. [Roadmap — V2 and Beyond](#16-roadmap--v2-and-beyond)
17. [Key Risks & Mitigations](#17-key-risks--mitigations)
18. [Open Questions Before Building](#18-open-questions-before-building)

---

## 1. Concept & Positioning

A free, browser-based mental math trainer focused on **speed, accuracy, and breadth** of calculation skills.

Unlike Duolingo: no daily streak pressure, no paywall, no lives system.  
Unlike Khan Academy: not a curriculum — it's a **skills gym**.  
Closest analogy: a typing speed trainer, but for mental arithmetic.

**Core loop:** Learn a technique → Drill it → Challenge yourself to master it → Track three dimensions of mastery.

**Tagline (working):** *"Think faster. Calculate sharper."*

---

## 2. Core Philosophy

| Principle | Detail |
|-----------|--------|
| Free forever | No premium tier, no paywalled content, no ads |
| Self-paced | No streaks, no guilt, no expiring lives |
| Skill depth over hollow gamification | XP and stars mean something real |
| Desktop and mobile parity | First-class experience on both |
| No account required at launch | localStorage-first, everything works day one |
| Fail is part of learning | Challenges are designed to be hard; failure is framed positively |

**On the "no streaks" decision:** This is a deliberate brand differentiator. The absence of streak anxiety is a feature, not an oversight. Lean into it in positioning: *"No streaks. No pressure. Just progress."*

---

## 3. Target Audience

Intentionally broad:
- **Students (10–18):** need motivation hooks, skill progression visibility
- **Adults / professionals:** sharper mental math for daily life, finance, work
- **Competitive math enthusiasts:** speed math, mental math competitions

**Design implication:** The UI must not alienate beginners while still feeling rewarding to power users. The constellation map + pact mode toggle + difficulty labels per node is the mechanism for serving all three audiences without separate onboarding flows.

---

## 4. The Three Mastery Dimensions

Every topic is measured on three independent axes. Together they form a per-topic mastery radar visible on each constellation node.

| Dimension | Definition | Example thresholds |
|-----------|------------|--------------------|
| **Speed** | Avg. correct answers per minute | < 3/min → Slow · 3–6 → Medium · 6+ → Fast |
| **Accuracy** | % correct answers over last N sessions | < 80% → Learning · 80–95% → Solid · 95%+ → Sharp |
| **Range** | Difficulty coverage within the topic | Easy only → 1 star · +Medium → 2 stars · +Hard → 3 stars |

**Global stats** on the profile page aggregate these:
- Max Speed (best topic speed)
- Avg Accuracy (across all practiced topics)
- Breadth (% of topics with at least one mastery star)

**Why Range matters:** Most math apps only track right/wrong. Range captures whether you've actually practiced the hard cases, or just coasted on easy ones. This is a key differentiator worth highlighting in marketing.

---

## 5. Content Scope — V1

**Target: ~25 technique nodes** across four core operations. Each technique is a standalone node on the constellation map.

### Addition (5 techniques)

| Technique ID | Name |
|---|---|
| `add-left-to-right` | Left-to-right addition |
| `add-complement-100` | Complement of 100 method |
| `add-round-adjust` | Round and adjust |
| `add-near-doubles` | Near-doubles shortcut |
| `add-column-grouping` | Column grouping for multi-digit |

### Subtraction (4 techniques)

| Technique ID | Name |
|---|---|
| `sub-complement-10` | Complement of 10 |
| `sub-borrow-free` | Borrow-free subtraction |
| `sub-round-adjust` | Round and adjust (subtract) |
| `sub-counting-up` | Counting up method |

### Multiplication (10 techniques)

| Technique ID | Name |
|---|---|
| `mul-by-11` | Multiply by 11 (digit trick) |
| `mul-by-9` | Multiply by 9 (10x − x) |
| `mul-by-5` | Multiply by 5 (÷2 × 10) |
| `mul-by-25` | Multiply by 25 (÷4 × 100) |
| `mul-by-12` | Multiply by 12 |
| `mul-sq-ending-5` | Squares of numbers ending in 5 |
| `mul-near-100` | Multiply numbers near 100 |
| `mul-double-halve` | Doubling and halving |
| `mul-by-99-101` | Multiply by 99 / 101 |
| `mul-foil-mental` | FOIL-style mental multiplication |

### Division (6 techniques)

| Technique ID | Name |
|---|---|
| `div-by-5` | Divide by 5 (× 2 ÷ 10) |
| `div-by-25` | Divide by 25 |
| `div-by-9-digit-sum` | Divide by 9 (digit sum trick) |
| `div-percent-10-5-20` | Percentage shortcuts (10%, 5%, 15%, 20%) |
| `div-estimate-adjust` | Estimate and adjust |
| `div-factor-decompose` | Factor decomposition method |

**Scope discipline:** Resist adding fractions, algebra, or exponents at V1. Mental arithmetic speed for integers and simple percentages is a complete enough domain to create genuine mastery depth. Expand the map in V2 based on user requests.

---

## 6. Skill Constellation Map

### Visual concept

A galaxy/web of ~25 nodes floating in space. No forced linear path. Nodes are connected by lines showing logical relationships (not hard prerequisite chains). The map is pannable and zoomable.

### Node anatomy

Each node displays:
- Technique name
- Difficulty badge (Beginner / Intermediate / Advanced)
- Three mastery icons (Speed / Accuracy / Range) with fill state
- Which tiers have been completed (Technique read / Drills done / Challenge passed)

### Node visual states

| State | Visual treatment |
|-------|-----------------|
| Not visited | Dim, grey outline |
| Technique read | Slight glow, base color shows |
| Drills in progress | Glowing, partial mastery fill |
| Fully mastered (all 3 stars) | Bright, pulsing glow — "lit star" |
| Soft-locked (pact mode on) | Visible but greyed with "Suggested: complete X first" tooltip |

### Tier completion icons on each node

| Icon | Meaning |
|------|---------|
| Book (filled/empty) | Technique card read |
| Dumbbell (0–3 stars) | Drill mastery progress |
| Lightning bolt (pass/fail) | Challenge passed |

### First-visit experience

No formal onboarding. Instead:
- 3–4 beginner nodes have a faint "Start here" label on first visit only
- One dismissable tooltip: *"Tap any node to begin training"*
- No wizard, no forced flow — but enough to prevent blank-page paralysis

---

## 7. Three-Tier Training Architecture

Each topic node on the constellation map has three distinct activity types with different purposes, feels, and mastery signals.

```
Topic Node
    │
    ▼
[Techniques] ◄── must complete first (read all slides)
    │
    ├──► [Drills]      ─┐
    │                   ├─ both unlock simultaneously after Techniques
    └──► [Challenge]   ─┘
```

---

### Tier 1 — Techniques (Theory Cards)

**Purpose:** Learn the trick before you practice it. Not a test. Not timed. The reference anchor the whole system links back to.

**Format:** 3–5 card slides per technique

| Slide | Content |
|-------|---------|
| 1 | The concept / mental model ("Why does this work?") |
| 2 | Step-by-step worked example |
| 3 | Second worked example with different numbers |
| 4 (optional) | Edge cases and gotchas |
| 5 | "Try it yourself" — one guided problem with hints shown |

**Unlock gate:** User taps "Got it" on the final slide. This marks the Technique as read and unlocks Drills and Challenge simultaneously.

**Always accessible:** After unlocking, the Technique card is reachable via a "?" reference button from inside any Drill or Challenge session.

**Tone:** Explanatory, not graded. Like a well-designed textbook page, not a quiz.

---

### Tier 2 — Drills (Randomized Practice)

**Purpose:** Build fluency through repetition. Low-stakes, improvement-focused. The gym workout.

- **15 problems per session** (default; configurable later)
- Problems span all difficulty levels within the topic
- Each problem is tagged with a single `techniqueId` at generation time
- Problems may cover related sub-techniques within a topic cluster
- No pass/fail — tracks Speed, Accuracy, and Range progress over time
- After each answer: immediate feedback (correct/wrong + correct approach shown if wrong)
- Post-session report appears after every Drill session

**Tone:** Encouraging, not graded. *"You solved 13/15. Here's what to review."*

---

### Tier 3 — Challenge (Speed Exam)

**Purpose:** Prove mastery under real conditions. High-stakes, top difficulty. The exam.

- **All problems are Hard difficulty** — no warm-up, no easy questions
- **Timed sprint format:** 60 seconds, as many correct answers as possible
- **Pass condition:** Both Speed threshold AND Accuracy threshold must be met simultaneously
  - Thresholds defined per-topic, shown to the user on the Challenge entry screen
  - Example: ≥ 6 correct/min AND ≥ 90% accuracy
- **Failing is expected initially** — the app must frame this as normal, not demoralizing
- Failing does not reset Drill progress
- **Passing earns the Speed mastery star** for the topic
- Post-session report appears after every Challenge

**Soft nudge for new users:** On the Challenge entry screen, if the user has never done a Drill for this topic, show: *"Recommended: complete a few Drills first to warm up."* Do not block access — just nudge.

**Tone:** Direct, competitive. More intense visual treatment — timer more prominent, darker UI tone during the session.

---

### Session Entry Screen (per tier)

Before each Drill or Challenge session, user sees:
- Which technique this session covers
- What the mastery thresholds are (for Challenge)
- Their current mastery state
- "Start" CTA

---

## 8. The Problem Reference System

The architectural backbone that powers weak-area reporting across all session types.

### Core rule

**Every generated problem carries a `techniqueId` — set at generation time, never inferred afterward.**

```typescript
interface Problem {
  id: string
  techniqueId: string         // e.g. "mul-by-11"
  topicId: string             // e.g. "multiplication"
  difficulty: "easy" | "medium" | "hard"
  prompt: string              // e.g. "34 × 11 = ?"
  answer: number
  // populated after user answers:
  userAnswer?: number
  correct?: boolean
  timeMs?: number
}
```

### Why this matters

- Post-run reports can say: *"Weakest areas: Multiply by 11 (2/6 correct), Division by 9 (1/4 correct)"*
- Reports link directly to the specific Technique card, not just the topic node
- Global multi-topic runs (daily challenges, future global runs) still carry technique tags, enabling cross-topic weak area detection
- Long-term user profiling: which techniques does this user consistently struggle with across all session types?

### Problem generator contract

Each technique must have a problem generator function that:
1. Accepts a `difficulty` parameter
2. Returns a `Problem` with the correct `techniqueId` pre-filled
3. Generates numbers that are genuinely suited to the technique (e.g., a `mul-by-11` generator should not produce `11 × 11` as a "hard" problem — that's trivial)

---

## 9. Post-Run Report

**Shown after:** Drills and Challenge sessions. Not after Technique cards (no score to report).

### Report contents

1. **Session summary:** problems attempted, correct %, XP earned, speed (problems/min)
2. **Mastery delta:** which dimensions moved (e.g., "Accuracy: +4% toward star")
3. **Weak area highlights:** always surface the 2 lowest-accuracy `techniqueId`s from the session
   - Shown only if the session had ≥ 5 problems (avoid noise from tiny samples)
   - Each weak area shows: technique name, your result (e.g., 2/5 correct), and a "Review Technique →" CTA
4. **For global/multi-topic runs:** weak areas can span multiple topics

### Example report layout

```
Session Complete — Multiplication Drills
────────────────────────────────────────
13 / 15 correct  ·  87% accuracy  ·  4.2/min  ·  +140 XP

▲ Accuracy progressing toward star  (83% → 87%)

Review these techniques:
⚠  Multiply by 11 (edge cases)   2 / 4 correct    [Review →]
⚠  Numbers near 100              3 / 5 correct    [Review →]
```

### Challenge fail screen

When a Challenge is failed, the fail screen must:
- Show the score vs. required thresholds clearly
- Not use negative language ("failed", "wrong") — use progress framing ("Not there yet")
- Suggest Drills as the path forward
- Show the two weakest techniques from that attempt

---

## 10. Gamification System

### XP Formula

```
Session XP = (problems_correct × 10)
           + (accuracy_bonus: +50 if ≥ 95%, +25 if ≥ 80%)
           + (speed_bonus: +20 if ≥ 8/min, +10 if ≥ 5/min)
           + (first_completion_bonus: +100 on first session per topic per tier)
```

### Global Level

- Cumulative XP → global level (Level 1–∞)
- Levels are **cosmetic at V1** — shown on profile, potentially unlock constellation background themes
- **Do not gate any content behind global level**

### Per-Topic Mastery Stars

- 3 stars per topic, one per mastery dimension (Speed / Accuracy / Range)
- Each star earned independently when the threshold for that dimension is reached
- Stars update as performance improves — they are not one-time unlocks
- The Speed star for a topic requires **passing the Challenge**, not just Drills

### No Streaks at V1

This is intentional. Do not add streaks without strong user retention data demanding it. If streaks are added later, they must be **opt-in only**, never the default pressure mechanic.

---

## 11. Daily Challenge

### Mechanics

- Same 10-problem set for all users on a given calendar date
- Problems seeded by `YYYY-MM-DD` — no backend required, fully deterministic
- Mixed topics, all difficulties represented
- Available to any user regardless of their progress state (no unlock required)
- Counts toward XP and topic mastery if the techniques match topics the user has trained on
- Each problem carries a `techniqueId` — post-challenge report surfaces weak areas

### Shareable result card

Designed for organic growth — one tap to copy to clipboard on mobile.

```
MathSprint Daily #42
⚡ 8/10 correct · 47s
🟩🟩🟩🟥🟩🟩🟩🟥🟩🟩
mathsprint.app/daily/42
```

**The shareable result format should be designed before anything else in this feature.** It's the primary organic growth vector.

### Daily challenge constraints

- Can be attempted only once per day (result saved to localStorage)
- If user has already completed today's challenge, show their result and a countdown to tomorrow's
- No retry — this is what makes it feel meaningful and shareable

---

## 12. Pact Mode

A toggle in Settings. Off by default.

### When OFF (default)

All nodes on the constellation are equally accessible. Pure free exploration. No suggested path visible.

### When ON

- A recommended learning sequence becomes visible on the map (suggested edges light up)
- Nodes outside the current suggested next steps show a soft-lock indicator: *"Recommended: complete X first"*
- User can still tap through and start any node — this is a **soft lock, never a hard block**
- The mode is designed for users who want structure but don't want to be forced into it

### Design note

The pact mode toggle itself should be easy to find and clearly explained. A user who turns it on should immediately understand what changed on the map.

---

## 13. Progress & Persistence

### V1: localStorage only

All progress lives in the browser. Zero backend required.

### Data schema

```typescript
interface UserProgress {
  xp: number
  level: number
  topicProgress: Record<string, TopicProgress>
  dailyChallenges: Record<string, DailyChallengeResult>  // keyed by "YYYY-MM-DD"
  settings: UserSettings
}

interface TopicProgress {
  techniqueRead: boolean
  drillSessions: SessionSummary[]      // last 20 sessions
  challengePassed: boolean
  speedStar: boolean
  accuracyStar: boolean
  rangeStar: boolean
  // aggregated stats for mastery calculation:
  totalCorrect: number
  totalAttempted: number
  bestSpeedPerMin: number
  difficultiesCovered: Set<"easy" | "medium" | "hard">
}

interface SessionSummary {
  date: string
  type: "drill" | "challenge"
  correct: number
  attempted: number
  accuracyPct: number
  speedPerMin: number
  xpEarned: number
  weakTechniqueIds: string[]
}

interface UserSettings {
  pactModeEnabled: boolean
  // future: theme, session length, etc.
}
```

### Export / Import (strongly recommended for V1)

A 2-hour feature that builds significant user trust:
- Profile page: "Export progress" → downloads a JSON file
- "Import progress" → restores from a JSON file
- Handles the "I cleared my browser / switched devices" problem without requiring a backend

---

## 14. Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | React + TypeScript | Ecosystem, hire-ability, type safety |
| State management | Redux Toolkit (RTK) | Scales cleanly for complex session state and mastery tracking |
| Persistence | `redux-persist` → localStorage | Automatic, zero user friction |
| Styling | Chakra UI v3 | Token-based design system; accessible primitives out of the box |
| Animation | Framer Motion | Constellation glow effects, session transitions, card flips |
| Routing | React Router v6 | SPA — Map / Topic / Session / Daily / Profile |
| Build tool | Vite | Best-in-class DX for React + TS |
| Testing | Vitest + React Testing Library | Fast unit tests, component tests |
| Hosting | Vercel or Netlify | Free tier, zero config, instant deploys |

### Application routes (planned)

```
/                        → Constellation map (main screen)
/topic/:techniqueId      → Topic node detail (3 tiers)
/topic/:techniqueId/technique  → Technique card slides
/topic/:techniqueId/drill      → Drill session
/topic/:techniqueId/challenge  → Challenge session
/daily                   → Daily challenge
/profile                 → Stats, XP, mastery overview, export/import
/settings                → Pact mode toggle, preferences
```

### Mobile-specific UX requirements

- **Custom numeric overlay** for answer input — never the system keyboard
- Large tap targets on the constellation map nodes
- Swipe gestures for Technique card slides
- All session screens optimized for one-thumb use

---

## 15. V1 Scope — In vs. Out

### Must ship (V1)

- [ ] Constellation skill map with node states and tier completion icons
- [ ] Three-tier architecture per topic node (Techniques / Drills / Challenge)
- [ ] Technique card slides (3–5 slides per topic, ~25 topics)
- [ ] Drills session (15 problems, all difficulties, immediate feedback)
- [ ] Challenge session (60s timed, hard difficulty, pass/fail thresholds)
- [ ] Custom mobile numpad for answer input
- [ ] Problem `techniqueId` tagging in all generators
- [ ] Post-run report with 2 weakest technique references and Review links
- [ ] Challenge fail screen with positive framing and drill suggestion
- [ ] Speed / Accuracy / Range mastery tracking per topic
- [ ] Global XP + per-topic mastery stars (3 stars per topic)
- [ ] Daily challenge (date-seeded, 10 problems, once per day)
- [ ] Shareable daily challenge result card
- [ ] Pact mode toggle (soft lock, not hard block)
- [ ] localStorage persistence via redux-persist
- [ ] Export / Import progress (JSON)
- [ ] Profile / stats page
- [ ] "Start here" indicators for beginner nodes on first visit
- [ ] ~25 technique nodes with fully implemented problem generators

### Explicitly out of V1

- [ ] Backend / auth / cloud sync
- [ ] Global run (real-time or async competition)
- [ ] Streaks
- [ ] Social leaderboards or friend challenges
- [ ] Fractions, percentages, exponents as standalone topic clusters
- [ ] Custom session length settings
- [ ] Achievement / badge system
- [ ] Difficulty setting override by user

---

## 16. Roadmap — V2 and Beyond

| Priority | Feature | Dependency |
|----------|---------|------------|
| High | Achievement / badge system | Existing XP + mastery data |
| High | "Challenge a friend" (shared link to same problem set) | Hash-based seed — no backend needed |
| High | Global run — async leaderboard (daily challenge variant) | Optional lightweight backend |
| Medium | Cloud sync / account creation | Backend |
| Medium | New topic clusters (fractions, percentages, squares, roots) | Content + generator work |
| Medium | Custom session length in Drills | None |
| Medium | Performance charts over time on profile page | Existing session history data |
| Low | Real-time global run (everyone races simultaneously) | Backend + WebSockets |
| Low | Streaks (opt-in only, never default pressure) | None |
| Low | Adaptive difficulty in Drills (auto-adjusts based on performance) | None |
| Low | Offline PWA support | Service worker setup |

---

## 17. Key Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| 25 nodes feels thin at launch | 25 nodes × 3 tiers × 3 difficulties = 225+ distinct experiences. Sufficient for beta. |
| Open constellation confuses new users | "Start here" visual on 3–4 beginner nodes + one dismissable tooltip. No full onboarding. |
| Mobile text input UX is broken | Build custom numpad overlay from day one, never the system keyboard |
| No retention loop without streaks | Daily challenge is the retention hook. Make it feel like Wordle. Design the share card first. |
| localStorage data loss | Export/import in V1. Takes a day to build, builds lasting user trust. |
| Problem generators are too easy/hard | Each technique needs a well-designed difficulty curve. This is the most time-intensive technical work in V1. Plan generator design as a first-class task. |
| Challenge fail rate is demoralizing | Fail screen must use progress-positive language and route clearly to Drills. Test this UX carefully. |
| Broad audience = no one feels it's "for them" | Difficulty badges on nodes (Beginner / Intermediate / Advanced) let all users self-select entry points. |

---

## 18. Open Questions Before Building

1. **App name:** Working title is *MathSprint*. Needs validation — is it available as a domain? Does it conflict with existing apps?

2. **Visual design direction:** Dark space/galaxy theme (fits constellation metaphor)? Clean white? Neon retro? This decision affects the entire Framer Motion animation budget.

3. **Sub-techniques as separate nodes or difficulty tiers?** E.g., "Multiply by 11 (2-digit)" vs "Multiply by 11 (3-digit)" — two nodes, or one node with internal difficulty progression? This directly affects constellation density and content volume.

4. **Exact mastery thresholds per topic:** Speed/accuracy/range star thresholds need to be defined per technique before the Challenge sessions can be built. Some techniques are inherently faster to solve than others.

5. **Technique card content:** Who writes the explanation copy and worked examples for all 25 techniques? This is a content authoring task that can block development if not planned early.

6. **Problem generator design session:** Before writing any code, a dedicated planning session should define the generator contract and difficulty parameters for each of the 25 techniques. This is the most risk-prone technical area.
