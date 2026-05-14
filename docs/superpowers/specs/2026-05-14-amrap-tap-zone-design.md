# AMRAP Screen — Tap-Zone Round Counter

**Date:** 2026-05-14  
**File:** `src/screens/active/ActiveAmrap.tsx`

## Problem

The current round counter uses a small inline row of 44px buttons (− count +). The `+` button is too small to hit reliably mid-workout when sweaty and moving fast.

## Design

### Tap Zone (hero element)

Replace the inline row with a large outlined tap zone:

- Rounded rectangle, full-width minus padding, `border: 2px solid rgba(245,158,11,0.35)`, `background: rgba(245,158,11,0.07)`
- Label at top: "ROUNDS — TAP TO ADD" (small caps, muted)
- Round count centered in large text (~72px, bold, `tokens.accent`)
- Partial progress below the count: "+ 2 of 3 exercises" (muted, hidden when partial === 0)
- "−1" undo link in the top-right corner of the zone (small, `tokens.textDim`, underlined)
- Tapping anywhere in the zone increments `rounds` by 1 and resets `partial` to 0

### Exercise Checklist

The existing exercise list below the counter is retained with one behavioral change:

- Checking the **last** exercise (i.e., `i + 1 === exercises.length`) triggers `setRounds(r => r + 1)` and `setPartial(0)` in addition to the existing partial state update
- All other exercise taps continue to update `partial` only (existing behavior)
- The checklist header updates to show "Round N in progress" using `rounds + 1`

### Undo (−1)

- Tapping "−1" in the tap zone corner: `setRounds(Math.max(0, rounds - 1))`, resets `partial` to 0
- No confirmation dialog needed — misfire risk is low and the round count is visible

## State

No new state fields. Existing `rounds` (int) and `partial` (int) cover everything.

- `rounds` — completed full rounds
- `partial` — exercises completed in the current in-progress round

## What Does Not Change

- Timer, CircularTimer, pause/resume/start flow — untouched
- `handleComplete` logging logic — untouched  
- Bottom CTA bar (Start / Pause + End AMRAP) — untouched
- ActiveTopBar — untouched

## Scope

Change is isolated to `ActiveAmrap.tsx`. No new components, no shared state changes.
