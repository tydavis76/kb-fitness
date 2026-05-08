# Handoff: K&B Fitness

A native fitness app for home-based strength training. Centered on kettlebell, dumbbell, TRX, bodyweight, and rowing workouts — with structured multi-phase programs, varied block types (straight sets, supersets, circuits, AMRAP, ladders, intervals, carries, MSTF tempo), live countdown timers, and equipment-aware load logging.

## About the Design Files

The HTML/JSX files in this bundle are **design references** — interactive prototypes built in React + inline Babel showing the intended look, behavior, and information architecture. They are **not** production code to ship as-is.

Your task is to **recreate these designs in the target codebase's environment**:
- Recommended stack for native app: **React Native** + Expo, or **SwiftUI** for iOS-only
- If a codebase already exists: match its established framework, component library, and patterns
- If no codebase exists yet: React Native with TypeScript is the closest analog to the prototype's React + JSX structure

## Fidelity

**High-fidelity.** The prototype defines exact colors, type scale, spacing, layout, and copy. Match it pixel-perfect, but use the target codebase's idiomatic component library for primitives (buttons, sheets, lists). The visual language — dark-default theme, accent-orange for ladder/AMRAP/tempo, work/rest semantic colors, large tabular numerics, generous whitespace — is the source of truth.

## How to Read the Prototype

Open `K&B Fitness.html` in a browser. Two tabs at the top:
- **Canvas overview** — every screen and variation laid out side-by-side for reference
- **Prototype** — the live clickable app inside an iOS device frame; tap through real flows

The Prototype's bottom-nav has four tabs: **Today**, **Programs**, **Progress**, **More**.

## Screens / Views

### 1. Today (`screens/sessions.jsx → TodayScreen`)
Day's session at a glance: phase/week/day badge, big session title, duration estimate, list of blocks with type pills, and a sticky **Start workout** CTA. Tapping any block opens the session preview.

**Empty state** (`programs.jsx → ProgramEmptyToday`): when no program is active — large card prompting "Pick a program to get started" + 4 quick-start tiles (Empty session / Last session / Quick row / Mobility).

### 2. Session Preview (`SessionPreviewScreen`)
Pre-workout summary: hero card with title + duration + total volume estimate, equipment chips, full block-by-block breakdown with exercise count and rest, sticky **Start session** CTA. Auto-regulation hint when applicable.

### 3. Active Workout — One screen per block type
The most differentiated part of the app. Each block type has a dedicated execution UI:

- **`ActiveStraight`** — classic stack: big exercise name, target/load prescription bar, 5 set rows with checkboxes; tap to advance, edit pencil per row opens load editor
- **`ActiveSuperset`** — A1/A2 paired card stack with round counter (1/4 → 4/4) and round dots; rep-pad picker on active card
- **`ActiveCircuit`** — circular round meter + station list (done / active / queued states)
- **`ActiveAmrap`** — large countdown ring (live ticking via `useCountdown`), round counter with +/− buttons, 1-round exercise reminder list with tap-to-mark-complete
- **`ActiveLadder`** — visual ascending rungs (reps × load), big "current rung" card, "Climb to rung N+1" CTA
- **`ActiveInterval`** — work/rest auto-cycling timer (live ticking), 6-round counter, full-screen color-coded ring
- **`ActiveCarry`** — circular time-under-load timer + distance counter (+/−5m increments), heavy-load hero
- **`ActiveTempo`** — MSTF 4-phase cadence (eccentric / bottom / concentric / top), color-coded phase ring, cue list — for high-precision tempo work like 10-2-10-0

All active screens use the shared `ActiveTopBar` (block label + name + type pill + block dot progress + exit).

### 4. Post-workout Recap (`RecapScreen`)
Volume + intensity summary, set-by-set log, **Easy / On point / Hard** auto-regulation buttons that influence next session's loads, optional notes.

### 5. Programs (`screens/programs.jsx`)
- **`ProgramLibraryScreen`** — Active program card with phase timeline (Foundation/Build/Peak), library list, "Build a custom program" CTA, **Archive** section for past runs
- **`ProgramDetailScreen`** — Phase timeline, week-by-week schedule, **⋯ menu** in top-right
- **`ProgramMenuSheet`** — Bottom sheet: Restart / Skip to week / Pause / Switch / End program
- **`ProgramConfirmSheet`** — Per-action confirm with stats + week picker for skip
- **`WeekDetailScreen`** — 7-day strip; tap a day to open its session

### 6. Workout Authoring (`screens/programmer.jsx → AuthoringScreen`)
Programmer view for building workouts: editable session metadata (env, tags, duration), drag-handle block list, inline block-type picker grid, block detail editor (rounds, rest), exercise list with sub-labels (B1, B2…) and tempo cues.

### 7. Progress / Analytics (`screens/insights.jsx`)
- **`HistoryScreen`** — Weekly volume sparkline, stat triplet (Sessions / Streak / PRs), recent sessions list with Easy/On-point/Hard tags
- **`AnalyticsScreen`** — Per-exercise: hero "Top working load" with PR badge, 12-week bar chart, Intensity/Volume/Reps/Sessions tab switcher, recent sets table

### 8. Exercise Library (`screens/exercise-detail.jsx`)
- **List** — Search bar + equipment filter chips + grouped-by-pattern card list with video thumbnails
- **Detail Sheet** — Hero video card → "Watch demo on YouTube" CTA, description, equipment chip, primary/secondary muscle chips, body silhouette diagram with targeted muscles highlighted, numbered technique cues, substitutions
- **Picker mode** — when invoked from the workout builder, header swaps to "Pick exercise" and detail sheet shows "Add to workout" CTA

### 9. Settings (`SettingsScreen`)
Units (lb/kg segmented), Sound, Haptics, Theme, Rest defaults, **Lead-in countdown** (Off / 3s / 5s / 10s — controls the pre-timer "get ready" beats before any countdown timer starts).

## Interactions & Behavior

### Live Timers (`lib/timer.jsx`)
The countdown system has three phases: `idle → lead → run → done`. The `useCountdown` hook ticks every 1000ms via `setInterval`. The `CircularTimer` component renders the SVG ring with state-aware colors (accent during lead-in, primary/work-color during run, success on done).

- **AMRAP** — single timer, full duration (e.g. 8:00), lead-in plays once at start
- **Interval** — auto-cycles work → rest, only first work block uses lead-in, advances rounds on rest completion
- **Carry** — single time-under-load timer with manual start/pause
- **Tap-to-start set timer** (`SetTimerButton`) — for plank-style time targets in straight blocks

### Lead-in
A configurable `0/3/5/10s` countdown plays before any timer starts running. Stored in `localStorage` under key `kb.leadIn`. Default is 5s. During lead-in, the ring is full and colored accent (orange), and a giant numeric counts down (5 → 4 → 3 → 2 → 1).

### Auto-regulation
After every session, user picks Easy / On point / Hard. This feedback adjusts the next session's prescribed loads (Easy → +5%, On point → maintain, Hard → −5% or repeat). Show a hint on the next Today screen: "Next session will auto-adjust loads."

### Program Management
Restart resets phase/week pointers but keeps history. Pause sets program to paused state — Today screen swaps to `ProgramEmptyToday`. End archives the run with a summary modal (sessions completed, total volume, PRs).

### Equipment-aware Load Sheets (`screens/sheets.jsx`)
Different load picker UI per equipment type:
- **Kettlebell** — discrete weights (8/12/16/20/24/28/32 kg or lb equivalent)
- **Dumbbell / PowerBlock** — numeric scrubber, 5 lb increments, range 5–100 lb
- **Resistance band** — color picker (yellow/red/black/purple/green) with no number
- **Rowing machine** — damper level 1–10
- **Bodyweight** — no input; optional weighted-vest +load field

## State Management

Per-screen local state is fine for prototype-level concerns. For real app, persist:

- **`activeProgram`**: `{ programId, phaseIndex, weekIndex, dayIndex, status: 'active' | 'paused' | 'archived' }`
- **`session`** (during active workout): `{ blocks: [{id, completedSets, actualReps[], actualLoad, restStart}] }`
- **`history`**: append-only log of completed sessions with full set data for analytics
- **`settings`**: `{ unit: 'lb' | 'kg', leadIn: 0|3|5|10, sound, haptics, restDefaults }`
- **`exerciseLibrary`**: static seed + user customizations + substitution mappings

The prototype already persists `unit` and `leadIn` to `localStorage`. Add the rest server-side or use SQLite/MMKV in React Native.

## Design Tokens

All in `lib/components.jsx` as `KB.*`. Core palette (dark theme):

```
bg          #0B0E11   surface         #14181D   surface2     #1B2128   surface3    #242B33
border      #2A3038   borderSoft      #1F252C
text        #F2F4F7   textMuted       #8A93A0   textDim      #5C6370
primary     #3CC58D   primaryDim      #2E9F70   (work / strength accent)
accent      #F59A4D   accentBg        #2A1F12   (ladder / AMRAP / tempo)
work        #3CC58D   workBg          #14241D   workBorder   #2A6B4A
rest        #4DA3F5   restBg          #131E2A
danger      #E26262   dangerBg        #2B1518
```

Type:
- **Sans**: `KB_FONT` — system stack, tight letter-spacing on display sizes (-0.02em to -0.04em)
- **Mono**: `KB_MONO` — for tempo notation, sub-labels (B1/B2)
- Tabular numerics on every load/rep/time display: `fontVariantNumeric: 'tabular-nums'`

Spacing: 4 / 6 / 8 / 10 / 12 / 14 / 16 / 18 / 20 / 24 px scale.
Radius: 6 (chips) / 8 / 10 (buttons) / 12 / 14 (cards) / 999 (round buttons).

## Assets

Icons are inline SVG in `lib/components.jsx` → `function I({ name, ... })`. ~50 hand-drawn glyphs (kettlebell, dumbbell, TRX, band, rower, pull-bar, bodyweight stick figure, timer, flame, flag, etc.). Use Lucide or Heroicons in real implementation; map names 1:1 where possible, redraw equipment-specific ones (kettlebell, TRX, rower) as custom SVGs since no icon library has them.

No bitmap assets. Exercise demo videos are placeholders — wire up YouTube embed or Mux for production.

## Files in This Bundle

- `K&B Fitness.html` — root prototype, includes script tags for React, Babel, and all .jsx modules
- `App.jsx` — root React component, screen routing, mode switcher (canvas vs prototype)
- `lib/components.jsx` — KB design tokens, icon set, primitives (Card, Chip, Btn, ScreenHeader, Sectionlabel, BlockPill)
- `lib/data.jsx` — seed data: programs, today's session, exercise library, history, week template
- `lib/timer.jsx` — useCountdown hook, CircularTimer, SetTimerButton, useLeadIn
- `lib/units.jsx` — unit conversion (lb ↔ kg) + useUnit hook
- `lib/ios-frame.jsx`, `lib/design-canvas.jsx`, `lib/tweaks-panel.jsx` — prototype scaffolding (not needed in real app)
- `screens/sessions.jsx` — Today, Session preview, Recap
- `screens/active.jsx` — All 8 active-workout block types
- `screens/programs.jsx` — Library, Detail, Week, Menu/Confirm sheets, Empty-today state
- `screens/programmer.jsx` — Workout authoring
- `screens/insights.jsx` — History, Analytics, Settings, Exercise library
- `screens/exercise-detail.jsx` — Exercise detail sheet, video card, picker mode
- `screens/sheets.jsx` — Load picker sheets per equipment type
