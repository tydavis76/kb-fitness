# AMRAP Tap-Zone Round Counter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the small inline ±44px round counter buttons on the AMRAP screen with a large tap-zone hero that makes incrementing rounds reliable mid-workout.

**Architecture:** Single-file change to `ActiveAmrap.tsx`. The inline `− count +` row is removed and replaced by a styled `<button>` tap zone. The exercise list gains auto-increment behavior when the last item is checked. No new components, no new state fields.

**Tech Stack:** React 18, TypeScript, inline styles via design tokens (`src/styles/tokens.ts`), Vite/ESLint for build/lint.

---

### Task 1: Replace the inline round counter row with a tap-zone

**Files:**
- Modify: `src/screens/active/ActiveAmrap.tsx:85-157` (the round counter section)

- [ ] **Step 1: Remove the existing counter section**

Delete the entire `{/* Round counter */}` block (lines 85–157 in the original file). This removes the flex row containing the minus button, count display, and plus button.

- [ ] **Step 2: Insert the tap-zone in its place**

Add this block immediately after the `{/* Big timer */}` closing `</div>` (around line 83):

```tsx
{/* Tap-zone round counter */}
<button
  onClick={() => {
    setRounds(r => r + 1)
    setPartial(0)
  }}
  style={{
    position: 'relative',
    margin: '12px 0',
    background: 'rgba(245,158,11,0.07)',
    border: '2px solid rgba(245,158,11,0.35)',
    borderRadius: 20,
    padding: '14px 16px 12px',
    textAlign: 'center',
    cursor: 'pointer',
    width: '100%',
    fontFamily: 'inherit',
    color: tokens.text,
  }}
>
  <div
    style={{
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.10em',
      textTransform: 'uppercase',
      color: tokens.textMuted,
      marginBottom: 4,
    }}
  >
    Rounds — tap to add
  </div>
  <div
    style={{
      fontSize: 72,
      fontWeight: 800,
      color: tokens.accent,
      lineHeight: 1,
      fontVariantNumeric: 'tabular-nums',
    }}
  >
    {rounds}
  </div>
  {partial > 0 && (
    <div
      style={{
        fontSize: 13,
        color: tokens.textDim,
        marginTop: 4,
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      +{' '}
      <span style={{ color: tokens.textMuted }}>
        {partial} of {exercises.length}
      </span>{' '}
      exercises
    </div>
  )}
  <span
    role="button"
    onClick={e => {
      e.stopPropagation()
      setRounds(r => Math.max(0, r - 1))
      setPartial(0)
    }}
    style={{
      position: 'absolute',
      top: 8,
      right: 12,
      fontSize: 11,
      color: tokens.textDim,
      textDecoration: 'underline',
      cursor: 'pointer',
    }}
  >
    −1
  </span>
</button>
```

- [ ] **Step 3: Verify `tokens.textDim` exists**

Check `src/styles/tokens.ts` for `textDim`. If it is not present, use `'#6E7785'` as a literal fallback for both `color` values that reference it, and do not add it to tokens.

- [ ] **Step 4: Run lint**

```bash
npm run lint
```

Expected: 0 errors. Fix any TypeScript/ESLint errors before continuing.

- [ ] **Step 5: Commit**

```bash
git add src/screens/active/ActiveAmrap.tsx
git commit -m "feat(amrap): replace inline counter row with tap-zone hero"
```

---

### Task 2: Update the exercise checklist — auto-increment on last exercise

**Files:**
- Modify: `src/screens/active/ActiveAmrap.tsx` (exercise list onClick and header label)

- [ ] **Step 1: Update the checklist header label**

Find the header div inside the `Card` that currently shows `"1 round"`. Replace it with:

```tsx
<div
  style={{
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: tokens.textMuted,
  }}
>
  Round {rounds + 1} in progress
</div>
```

- [ ] **Step 2: Update the exercise row onClick to auto-increment on last exercise**

Find the `onClick` for each exercise row button. The current handler is:

```tsx
onClick={() => setPartial(done ? i : i + 1)}
```

Replace it with:

```tsx
onClick={() => {
  if (done) {
    setPartial(i)
  } else if (i + 1 === exercises.length) {
    setRounds(r => r + 1)
    setPartial(0)
  } else {
    setPartial(i + 1)
  }
}}
```

- [ ] **Step 3: Run lint**

```bash
npm run lint
```

Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/screens/active/ActiveAmrap.tsx
git commit -m "feat(amrap): auto-increment rounds when last exercise is checked"
```

---

### Task 3: Manual verification

**Files:** none (browser testing only)

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

- [ ] **Step 2: Navigate to an AMRAP workout and verify these behaviors**

Check each item manually:

1. **Tap zone renders** — full-width amber-outlined box below the circular timer; shows "ROUNDS — TAP TO ADD", large `0` in amber, no partial indicator.
2. **Tap zone increments** — tapping the zone increments the count (0 → 1 → 2…) and the partial indicator stays hidden until partial > 0.
3. **Partial indicator appears** — tap the first exercise in the list; the indicator "+ 1 of N exercises" appears below the round count.
4. **Partial indicator hides on tap-zone tap** — while partial > 0, tapping the zone increments rounds and the partial indicator disappears.
5. **−1 undo** — tap "−1" in the top-right of the zone; rounds decrements by 1 and partial resets to 0. Does not fire the round-increment handler.
6. **Undo at 0** — tapping "−1" when rounds is 0 keeps rounds at 0 (no negative values).
7. **Auto-increment on last exercise** — check all exercises in order; checking the last one increments rounds, resets the checklist, and clears the partial indicator.
8. **Check un-check** — tapping a completed exercise (re-tapping) reverts the partial back (existing undo behavior still works).
9. **Header label** — checklist header reads "Round 1 in progress" at start, "Round 2 in progress" after one full round, etc.
10. **Timer/CTA unaffected** — Start/Pause/End AMRAP buttons and the circular timer function normally.

- [ ] **Step 3: Commit if any cosmetic tweaks were made**

```bash
git add src/screens/active/ActiveAmrap.tsx
git commit -m "fix(amrap): cosmetic tweaks from manual review"
```

Only create this commit if changes were made.
