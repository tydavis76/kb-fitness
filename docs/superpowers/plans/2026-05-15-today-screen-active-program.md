# Today Screen: Active Program & One-Tap Start Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Today screen the single control center for the week — tapping a day swaps the session card inline, "Start Workout" navigates directly to the active workout (skipping the preview screen), and past missed days can be started or marked skipped.

**Architecture:** Local `selectedDayKey` state on `TodayScreen` drives which session is loaded via a second `useLiveQuery`. `WeekStrip` gains a `selectedKey` prop and its `onSelect` now passes back a `dayKey` string. CTA buttons are derived from `isToday / isPast / isFuture` booleans. No new files, no schema changes.

**Tech Stack:** React (useState, derived state), Dexie + dexie-react-hooks (useLiveQuery), react-router-dom (useNavigate), Vitest + @testing-library/react

---

### Task 1: Update WeekStrip — selectedKey prop and dayKey callback

**Files:**
- Modify: `src/screens/TodayScreen.tsx` (WeekStrip component only, lines ~60–115)

- [ ] **Step 1: Update WeekStripProps**

Replace the existing `WeekStripProps` interface (around line 63):

```tsx
interface WeekStripProps {
  weeklyStructure: Record<string, string>
  phaseId: string
  todayKey: string
  selectedKey: string
  doneSessionIds: Set<string>
  onSelect: (dayKey: string) => void
}
```

- [ ] **Step 2: Update WeekStrip render logic**

Replace the `WeekStrip` function body. The key changes: `isSelected` drives the highlight (was `isToday`), `isToday` only affects the dot color; `onSelect` passes `dayKey` not `fullSessionId`.

```tsx
function WeekStrip({ weeklyStructure, phaseId, todayKey, selectedKey, doneSessionIds, onSelect }: WeekStripProps) {
  return (
    <div style={{ display: 'flex', gap: 4, padding: '10px 16px 6px' }}>
      {DAY_KEYS.map(dayKey => {
        const baseId = weeklyStructure[dayKey]
        const isRest = !baseId || baseId.startsWith('rest')
        const isToday = dayKey === todayKey
        const isSelected = dayKey === selectedKey
        const fullSessionId = baseId && !isRest ? `${baseId}_${phaseId}` : null
        const isDone = fullSessionId ? doneSessionIds.has(fullSessionId) : false

        return (
          <button
            key={dayKey}
            onClick={() => onSelect(dayKey)}
            disabled={isRest}
            style={{
              flex: 1,
              padding: '7px 2px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 5,
              borderRadius: 10,
              border: `1px solid ${isSelected ? tokens.primary : isToday ? tokens.border : 'transparent'}`,
              background: isSelected && !isRest ? tokens.workBg : 'transparent',
              cursor: isRest ? 'default' : 'pointer',
              opacity: isRest ? 0.4 : 1,
            }}
          >
            <div style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.04em',
              color: isSelected ? tokens.primary : isToday ? tokens.accent : tokens.textMuted,
            }}>
              {DAY_2[dayKey]}
            </div>
            <div style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: isDone
                ? tokens.primary
                : isRest
                  ? 'transparent'
                  : isToday || isSelected
                    ? tokens.primary
                    : tokens.surface3,
              border: isDone || isRest ? 'none' : `1.5px solid ${isToday || isSelected ? tokens.primary : tokens.border}`,
            }} />
          </button>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 3: Export WeekStrip so tests can import it**

Change the function declaration:

```tsx
export function WeekStrip({
```

- [ ] **Step 4: Run tests to make sure nothing is broken**

```bash
cd /Users/tydavis/Cowork/projects/kb-fitness && npm test -- --run 2>&1 | tail -20
```

Expected: existing tests still pass (TypeScript will error on the WeekStrip call site — that's expected, fixed in Task 2).

- [ ] **Step 5: Commit**

```bash
git add src/screens/TodayScreen.tsx
git commit -m "refactor(today): WeekStrip accepts selectedKey and emits dayKey"
```

---

### Task 2: Add selectedDayKey state and re-key session query

**Files:**
- Modify: `src/screens/TodayScreen.tsx` (TodayScreen function, top section)

- [ ] **Step 1: Add useState import if not present**

At the top of `TodayScreen.tsx`, ensure `useState` is imported:

```tsx
import { useState } from 'react'
```

- [ ] **Step 2: Add selectedDayKey state and derived booleans**

Inside `TodayScreen`, after the existing `dayOfWeekKey` declaration, add:

```tsx
const [selectedDayKey, setSelectedDayKey] = useState(dayOfWeekKey)

const todayIndex     = DAY_KEYS.indexOf(dayOfWeekKey)
const selectedIndex  = DAY_KEYS.indexOf(selectedDayKey)
const isToday        = selectedDayKey === dayOfWeekKey
const isPast         = selectedIndex < todayIndex
const isFuture       = selectedIndex > todayIndex
```

- [ ] **Step 3: Re-key the session query to use selectedDayKey**

Replace the three existing lines that compute `baseSessionId`, `sessionId`, and the `session` live query:

```tsx
const selectedBaseId = program?.weeklyStructure?.[selectedDayKey]
const isRestDay = !selectedBaseId || selectedBaseId.startsWith('rest')
const selectedSessionId = selectedBaseId && currentPhaseId && !isRestDay
  ? `${selectedBaseId}_${currentPhaseId}`
  : undefined

const session = useLiveQuery(() =>
  selectedSessionId ? db.sessions.where('sessionId').equals(selectedSessionId).first() : undefined,
  [selectedSessionId]
)
```

Remove the old `baseSessionId`, `sessionId`, and `isRestDay` declarations.

- [ ] **Step 4: Update the WeekStrip JSX call site**

Replace the `weekStrip` construction to use the new props and callback:

```tsx
const weekStrip = (
  <WeekStrip
    weeklyStructure={program.weeklyStructure}
    phaseId={currentPhaseId}
    todayKey={dayOfWeekKey}
    selectedKey={selectedDayKey}
    doneSessionIds={doneSessionIds}
    onSelect={(dayKey) => setSelectedDayKey(dayKey)}
  />
)
```

- [ ] **Step 5: Update the isDone check for the selected session**

The existing `doneSessionIds` is still derived from `workoutLogs`. Add a derived boolean for whether the currently selected session is already done:

```tsx
const isSelectedDone = selectedSessionId ? doneSessionIds.has(selectedSessionId) : false
```

Add this line after the `doneSessionIds` declaration.

- [ ] **Step 6: Run tests**

```bash
cd /Users/tydavis/Cowork/projects/kb-fitness && npm test -- --run 2>&1 | tail -20
```

Expected: all tests pass.

- [ ] **Step 7: Commit**

```bash
git add src/screens/TodayScreen.tsx
git commit -m "feat(today): selectedDayKey state drives session card"
```

---

### Task 3: Add handleStart — direct Today → Active navigation

**Files:**
- Modify: `src/screens/TodayScreen.tsx`

- [ ] **Step 1: Import useActiveWorkout**

Add to the imports at the top of `TodayScreen.tsx`:

```tsx
import { useActiveWorkout } from '../context/ActiveWorkoutContext'
```

- [ ] **Step 2: Destructure startWorkout inside TodayScreen**

Near the top of the `TodayScreen` function, after `const navigate = useNavigate()`:

```tsx
const { startWorkout } = useActiveWorkout()
```

- [ ] **Step 3: Add handleStart function**

Inside `TodayScreen`, before the return, add:

```tsx
const handleStart = async () => {
  if (!session?.template) return
  await startWorkout(session.template)
  navigate('active')
}
```

- [ ] **Step 4: Replace "Start Workout" onClick**

Find the existing `<Btn>` with `onClick={() => navigate('preview', { state: { sessionId, session } })}` (near the bottom of the return) and replace it:

```tsx
<Btn variant="primary" size="lg" full icon="play" onClick={handleStart}>
  Start Workout
</Btn>
```

- [ ] **Step 5: Run tests**

```bash
cd /Users/tydavis/Cowork/projects/kb-fitness && npm test -- --run 2>&1 | tail -20
```

Expected: all tests pass.

- [ ] **Step 6: Verify in browser**

Open http://localhost:5173/kb-fitness/ — tapping "Start Workout" should jump directly to the active workout screen without a preview step.

- [ ] **Step 7: Commit**

```bash
git add src/screens/TodayScreen.tsx
git commit -m "feat(today): Start Workout navigates directly to active workout"
```

---

### Task 4: Add handleSkip and context-aware CTA row

**Files:**
- Modify: `src/screens/TodayScreen.tsx`

- [ ] **Step 1: Add a helper to compute the date of any day in the current week**

Add this helper function near the other helpers at the top of the file (below `getDayOfWeekKey`):

```tsx
function getDateForDayKey(today: Date, dayKey: string): Date {
  const todayIndex    = today.getDay() === 0 ? 6 : today.getDay() - 1
  const targetIndex   = DAY_KEYS.indexOf(dayKey)
  const date          = new Date(today)
  date.setDate(today.getDate() + (targetIndex - todayIndex))
  date.setHours(12, 0, 0, 0)
  return date
}
```

- [ ] **Step 2: Add handleSkip function**

Inside `TodayScreen`, after `handleStart`:

```tsx
const handleSkip = async () => {
  if (!selectedSessionId || !program?.programId) return
  const skippedDate = getDateForDayKey(today, selectedDayKey)
  await db.workoutLogs.add({
    sessionId:      selectedSessionId,
    programId:      program.programId,
    completedAt:    skippedDate.getTime(),
    durationSec:    0,
    rating:         'on_point',
    notes:          '',
    totalVolumeKg:  null,
    sets:           [],
  })
}
```

- [ ] **Step 3: Replace the hard-coded CTA button with a conditional CTA row**

Find the `<div style={{ padding: 16, paddingTop: 4 }}>` block that contains the single `<Btn>` and replace the entire block:

```tsx
<div style={{ padding: 16, paddingTop: 4, display: 'flex', flexDirection: 'column', gap: 8 }}>
  {!isSelectedDone && !isRestDay && (
    <Btn variant="primary" size="lg" full icon="play" onClick={handleStart}>
      {isToday ? 'Start Workout' : isFuture ? 'Start Early' : 'Start Anyway'}
    </Btn>
  )}
  {isPast && !isSelectedDone && !isRestDay && (
    <Btn variant="ghost" size="lg" full onClick={handleSkip}>
      Mark Skipped
    </Btn>
  )}
</div>
```

- [ ] **Step 4: Run tests**

```bash
cd /Users/tydavis/Cowork/projects/kb-fitness && npm test -- --run 2>&1 | tail -20
```

Expected: all tests pass.

- [ ] **Step 5: Verify in browser**

1. Open http://localhost:5173/kb-fitness/
2. Tap today's day → "Start Workout" button visible → tap it → lands on active workout screen
3. Tap a past day → "Start Anyway" + "Mark Skipped" buttons appear
4. Tap "Mark Skipped" → dot on the strip fills in immediately
5. Tap a future day → "Start Early" button
6. Tap a rest day → recovery card, no buttons

- [ ] **Step 6: Commit**

```bash
git add src/screens/TodayScreen.tsx
git commit -m "feat(today): context-aware CTA row with skip support for past days"
```

---

### Task 5: Tests for new behaviors

**Files:**
- Modify: `src/screens/__tests__/TodayScreen.test.tsx`

- [ ] **Step 1: Expand the test file with behavior tests**

Replace the entire content of `src/screens/__tests__/TodayScreen.test.tsx`:

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import React from 'react'
import { vi } from 'vitest'
import { TodayScreen } from '../TodayScreen'
import { ActiveWorkoutProvider } from '../../context/ActiveWorkoutContext'

// Minimal mock — returns undefined for all queries (no active program state)
vi.mock('dexie-react-hooks', () => ({
  useLiveQuery: (fn: () => any) => {
    try { fn() } catch { }
    return undefined
  }
}))

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ActiveWorkoutProvider>
    <MemoryRouter>
      {children}
    </MemoryRouter>
  </ActiveWorkoutProvider>
)

test('renders without crashing when no active program', () => {
  render(<TodayScreen />, { wrapper: Wrapper })
  expect(document.body).not.toBeEmptyDOMElement()
})

test('shows Browse Programs button when no active program', () => {
  render(<TodayScreen />, { wrapper: Wrapper })
  expect(screen.getByText('Browse Programs')).toBeInTheDocument()
})

// ---- WeekStrip unit tests ----

// Pull WeekStrip out for isolated testing via the module
// These test the visual/callback contract directly.

import { WeekStrip } from '../TodayScreen'

const STRUCTURE: Record<string, string> = {
  monday: 'A', tuesday: 'B', wednesday: 'rest', thursday: 'C',
  friday: 'D', saturday: 'rest', sunday: 'rest',
}

test('WeekStrip calls onSelect with the day key when a workout day is tapped', () => {
  const onSelect = vi.fn()
  render(
    <MemoryRouter>
      <WeekStrip
        weeklyStructure={STRUCTURE}
        phaseId="phase1"
        todayKey="monday"
        selectedKey="monday"
        doneSessionIds={new Set()}
        onSelect={onSelect}
      />
    </MemoryRouter>
  )
  fireEvent.click(screen.getByText('Tu').closest('button')!)
  expect(onSelect).toHaveBeenCalledWith('tuesday')
})

test('WeekStrip disables rest days', () => {
  render(
    <MemoryRouter>
      <WeekStrip
        weeklyStructure={STRUCTURE}
        phaseId="phase1"
        todayKey="monday"
        selectedKey="monday"
        doneSessionIds={new Set()}
        onSelect={vi.fn()}
      />
    </MemoryRouter>
  )
  expect(screen.getByText('We').closest('button')).toBeDisabled()
})
```

- [ ] **Step 2: Run tests and confirm they pass**

```bash
cd /Users/tydavis/Cowork/projects/kb-fitness && npm test -- --run 2>&1 | tail -30
```

Expected: all tests pass including the two new WeekStrip tests.

- [ ] **Step 4: Commit**

```bash
git add src/screens/__tests__/TodayScreen.test.tsx src/screens/TodayScreen.tsx
git commit -m "test(today): add WeekStrip unit tests and no-program smoke test"
```
