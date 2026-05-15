# Today Screen: Active Program & One-Tap Start

**Date:** 2026-05-15  
**Status:** Approved

## Problem

Starting today's workout requires two taps: "Start Workout" on the Today screen navigates to a Preview screen, which then has a "Begin Workout" button that actually starts the workout. The Preview screen is redundant since the Today screen already shows the session card with all the detail needed.

Additionally, the week strip only highlights today — it doesn't let the user act on other days (catch-up, skip missed sessions).

## Goal

- Reduce today's workout to one tap: Today screen → Active workout
- Make the week strip the control center for the full week: tapping any day swaps the session card inline and shows context-appropriate actions

## Approach

Local `selectedDayKey` state on `TodayScreen`. No new routes, no new files, no schema changes.

## State & Data

- Add `selectedDayKey: string` state to `TodayScreen`, initialized to today's day key
- Re-key the existing `session` live query to load the session for `selectedDayKey` (not always today)
- Derive three booleans from `selectedDayKey` vs today:
  - `isToday` — selected day is today
  - `isPast` — selected day is before today in the current Mon–Sun week
  - `isFuture` — selected day is after today
- `WeekStrip` gains a `selectedKey` prop (highlighted independently from `todayKey`)
- `WeekStrip`'s `onSelect` callback sets `selectedDayKey` instead of navigating to preview

## Session Card & CTAs

The session card is unchanged. Only the action row at the bottom varies:

| Selected day | Condition | Actions |
|---|---|---|
| Today | workout day, not done | "Start Workout" (primary) → direct to active |
| Past | workout day, not done | "Start Anyway" (primary) + "Mark Skipped" (ghost) |
| Future | workout day | "Start Early" (primary) → direct to active |
| Any | rest day | Recovery card, no CTA |
| Any | already done | Dot filled, no CTA |

All "start" actions call `startWorkout(template)` then `navigate('../active')` — no preview screen.

## Mark Skipped

Writes a minimal `WorkoutLog` entry:
- `sessionId`, `programId` from the selected session
- `completedAt`: noon (12:00) of the selected day's date
- `durationSec: 0`
- `rating: 'on_point'`
- `notes: ''`, `totalVolumeKg: null`, `sets: []`

The strip dot fills in immediately via the existing `doneSessionIds` live query.

## Files Changed

| File | Change |
|---|---|
| `src/screens/TodayScreen.tsx` | All logic changes — state, derived booleans, handleStart, handleSkip, CTA row |

`SessionPreviewScreen.tsx` is untouched — it remains accessible from `WeekDetailScreen` and other routes that navigate to it.

## Out of Scope

- Adding a `'skipped'` value to `WorkoutLog.rating` union — use `'on_point'` instead
- Changes to the preview screen
- Any changes to how programs are activated
