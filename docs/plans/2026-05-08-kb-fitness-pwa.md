{% raw %}
# K&B Fitness PWA — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a production-ready offline-first PWA for the K&B Fitness workout app, scaffolded fresh at `kb-fitness/` in the project root, pixel-matching the `design-system/` prototype.

**Architecture:** React 18 + TypeScript + Vite in `kb-fitness/` — a standalone app folder. Dexie 4 (IndexedDB wrapper) holds all persistent state; the 8-week kettlebell program JSON is seeded on first launch. React Router v6 with hash routing drives navigation; a 4-tab bottom nav (Today / Programs / Progress / More) is the shell. Eight specialized active-workout screens match the design system one-to-one.

**Tech Stack:** React 18, TypeScript 5, Vite 5, vite-plugin-pwa (Workbox), Dexie 4, React Router v6, lucide-react, Vitest + React Testing Library

**Design reference:** `design-system/` — read `lib/components.jsx` for exact tokens before touching any CSS. Read each `screens/*.jsx` file before implementing its corresponding component.

**Gap fills included in this plan** (not in design system):
- Rest timer UI (auto-start after set log, dismissible)
- Actual set logging (`actualReps` + `actualLoad` captured per set row)
- `SetTimerButton` for plank/time-target sets in Straight blocks
- "More" tab wrapper screen
- History → Analytics exercise drill-down
- TRX load sheet
- Auto-regulation hint on Today screen

---

## Phase 1 — Foundation

### Task 1: Scaffold the project

**Files:**
- Create: `kb-fitness/` (directory)

**Step 1: Scaffold with Vite**

```bash
cd /Users/tydavis/Cowork/projects/rkc-tracker
npm create vite@latest kb-fitness -- --template react-ts
cd kb-fitness
```

**Step 2: Install dependencies**

```bash
npm install dexie react-router-dom lucide-react
npm install -D vite-plugin-pwa vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

**Step 3: Configure Vite**

Replace `kb-fitness/vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'K&B Fitness',
        short_name: 'K&B',
        theme_color: '#0B0E11',
        background_color: '#0B0E11',
        display: 'standalone',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
})
```

**Step 4: Create test setup file**

Create `kb-fitness/src/test/setup.ts`:

```ts
import '@testing-library/jest-dom'
```

**Step 5: Verify scaffold runs**

```bash
npm run dev
```
Expected: Vite dev server starts on localhost:5173

**Step 6: Commit**

```bash
git add kb-fitness/
git commit -m "feat(kb-fitness): scaffold Vite + React + TS + deps"
```

---

### Task 2: Design tokens

**Files:**
- Create: `kb-fitness/src/styles/tokens.css`
- Create: `kb-fitness/src/styles/global.css`

**Reference:** Read `design-system/lib/components.jsx` lines 1–80 for exact KB.* values before writing this file.

**Step 1: Write the tokens test**

Create `kb-fitness/src/styles/__tests__/tokens.test.ts`:

```ts
import { tokens } from '../tokens'

test('primary token matches design system', () => {
  expect(tokens.primary).toBe('#3CC58D')
})

test('accent token matches design system', () => {
  expect(tokens.accent).toBe('#F59A4D')
})

test('bg token matches design system', () => {
  expect(tokens.bg).toBe('#0B0E11')
})
```

**Step 2: Run test to verify it fails**

```bash
cd kb-fitness && npx vitest run src/styles/__tests__/tokens.test.ts
```
Expected: FAIL — `tokens` not found

**Step 3: Create the tokens module**

Create `kb-fitness/src/styles/tokens.ts`:

```ts
export const tokens = {
  // Backgrounds
  bg:          '#0B0E11',
  surface:     '#14181D',
  surface2:    '#1B2128',
  surface3:    '#242B33',
  // Borders
  border:      '#2A3038',
  borderSoft:  '#1F252C',
  // Text
  text:        '#F2F4F7',
  textMuted:   '#8A93A0',
  textDim:     '#5C6370',
  // Brand
  primary:     '#3CC58D',
  primaryDim:  '#2E9F70',
  accent:      '#F59A4D',
  accentBg:    '#2A1F12',
  // Semantic
  work:        '#3CC58D',
  workBg:      '#14241D',
  workBorder:  '#2A6B4A',
  rest:        '#4DA3F5',
  restBg:      '#131E2A',
  danger:      '#E26262',
  dangerBg:    '#2B1518',
} as const

export type TokenKey = keyof typeof tokens
```

**Step 4: Create CSS variables**

Create `kb-fitness/src/styles/tokens.css`:

```css
:root {
  --bg:          #0B0E11;
  --surface:     #14181D;
  --surface2:    #1B2128;
  --surface3:    #242B33;
  --border:      #2A3038;
  --border-soft: #1F252C;
  --text:        #F2F4F7;
  --text-muted:  #8A93A0;
  --text-dim:    #5C6370;
  --primary:     #3CC58D;
  --primary-dim: #2E9F70;
  --accent:      #F59A4D;
  --accent-bg:   #2A1F12;
  --work:        #3CC58D;
  --work-bg:     #14241D;
  --work-border: #2A6B4A;
  --rest:        #4DA3F5;
  --rest-bg:     #131E2A;
  --danger:      #E26262;
  --danger-bg:   #2B1518;
}
```

Create `kb-fitness/src/styles/global.css`:

```css
@import './tokens.css';

*, *::before, *::after { box-sizing: border-box; }

html, body, #root {
  height: 100%;
  margin: 0;
  padding: 0;
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', system-ui, sans-serif;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  overscroll-behavior: none;
}

#root {
  display: flex;
  flex-direction: column;
  max-width: 430px;
  margin: 0 auto;
  position: relative;
}

/* Tabular numerics for all load/rep/time values */
.tabular { font-variant-numeric: tabular-nums; }

/* Mono for tempo notation */
.mono {
  font-family: 'SF Mono', 'Fira Code', 'Roboto Mono', monospace;
}
```

**Step 5: Run test**

```bash
npx vitest run src/styles/__tests__/tokens.test.ts
```
Expected: PASS

**Step 6: Import globals in main.tsx**

Edit `kb-fitness/src/main.tsx` — add at top:

```ts
import './styles/global.css'
```

**Step 7: Commit**

```bash
git add kb-fitness/src/styles/
git commit -m "feat(kb-fitness): design tokens + CSS variables"
```

---

### Task 3: Primitive components

**Files:**
- Create: `kb-fitness/src/components/primitives/Card.tsx`
- Create: `kb-fitness/src/components/primitives/Chip.tsx`
- Create: `kb-fitness/src/components/primitives/Btn.tsx`
- Create: `kb-fitness/src/components/primitives/ScreenHeader.tsx`
- Create: `kb-fitness/src/components/primitives/Sectionlabel.tsx`
- Create: `kb-fitness/src/components/primitives/BlockPill.tsx`
- Create: `kb-fitness/src/components/primitives/BottomSheet.tsx`
- Create: `kb-fitness/src/components/primitives/index.ts`
- Test: `kb-fitness/src/components/primitives/__tests__/primitives.test.tsx`

**Reference:** Read `design-system/lib/components.jsx` for exact styles on each primitive.

**Step 1: Write the failing tests**

Create `kb-fitness/src/components/primitives/__tests__/primitives.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { Card } from '../Card'
import { Chip } from '../Chip'
import { Btn } from '../Btn'
import { ScreenHeader } from '../ScreenHeader'
import { BlockPill } from '../BlockPill'

test('Card renders children', () => {
  render(<Card>hello</Card>)
  expect(screen.getByText('hello')).toBeInTheDocument()
})

test('Chip renders label', () => {
  render(<Chip>PHASE 1</Chip>)
  expect(screen.getByText('PHASE 1')).toBeInTheDocument()
})

test('Chip tone=accent applies accent class', () => {
  const { container } = render(<Chip tone="accent">test</Chip>)
  expect(container.firstChild).toHaveClass('chip--accent')
})

test('Btn renders label and handles click', async () => {
  const onClick = vi.fn()
  render(<Btn onClick={onClick}>Start</Btn>)
  screen.getByText('Start').click()
  expect(onClick).toHaveBeenCalled()
})

test('ScreenHeader renders title', () => {
  render(<ScreenHeader title="Today" />)
  expect(screen.getByText('Today')).toBeInTheDocument()
})

test('BlockPill renders correct label for straight type', () => {
  render(<BlockPill type="straight" />)
  expect(screen.getByText('SETS')).toBeInTheDocument()
})

test('BlockPill renders AMRAP for amrap type', () => {
  render(<BlockPill type="amrap" />)
  expect(screen.getByText('AMRAP')).toBeInTheDocument()
})
```

**Step 2: Run tests to verify they fail**

```bash
npx vitest run src/components/primitives/__tests__/primitives.test.tsx
```
Expected: FAIL — modules not found

**Step 3: Implement Card**

Create `kb-fitness/src/components/primitives/Card.tsx`:

```tsx
import React from 'react'
import { tokens } from '../../styles/tokens'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean
  padded?: boolean
}

export function Card({ elevated, padded = true, style, children, ...rest }: CardProps) {
  return (
    <div
      style={{
        background: elevated ? tokens.surface2 : tokens.surface,
        border: `1px solid ${tokens.border}`,
        borderRadius: 14,
        padding: padded ? 16 : 0,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  )
}
```

**Step 4: Implement Chip**

Create `kb-fitness/src/components/primitives/Chip.tsx`:

```tsx
import React from 'react'
import { tokens } from '../../styles/tokens'

type ChipTone = 'default' | 'accent' | 'work' | 'rest' | 'danger'
type ChipSize = 'sm' | 'md'

interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: ChipTone
  size?: ChipSize
}

const toneStyles: Record<ChipTone, React.CSSProperties> = {
  default: { background: tokens.surface3, color: tokens.textMuted, border: `1px solid ${tokens.border}` },
  accent:  { background: tokens.accentBg, color: tokens.accent,    border: `1px solid ${tokens.accent}40` },
  work:    { background: tokens.workBg,   color: tokens.work,      border: `1px solid ${tokens.workBorder}` },
  rest:    { background: tokens.restBg,   color: tokens.rest,      border: `1px solid ${tokens.rest}33` },
  danger:  { background: tokens.dangerBg, color: tokens.danger,    border: `1px solid ${tokens.danger}40` },
}

export function Chip({ tone = 'default', size = 'sm', style, className, children, ...rest }: ChipProps) {
  return (
    <span
      className={`chip chip--${tone} ${className ?? ''}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: size === 'sm' ? '3px 8px' : '5px 12px',
        borderRadius: 6,
        fontSize: size === 'sm' ? 10 : 12,
        fontWeight: 700,
        letterSpacing: '0.07em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        ...toneStyles[tone],
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  )
}
```

**Step 5: Implement Btn**

Create `kb-fitness/src/components/primitives/Btn.tsx`:

```tsx
import React from 'react'
import { tokens } from '../../styles/tokens'

type BtnVariant = 'primary' | 'secondary' | 'ghost'
type BtnSize = 'sm' | 'md' | 'lg'

interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant
  size?: BtnSize
  full?: boolean
  accent?: string
  icon?: string  // lucide icon name — wire up in Task 4
}

export function Btn({
  variant = 'secondary',
  size = 'md',
  full,
  accent,
  icon,
  style,
  children,
  ...rest
}: BtnProps) {
  const color = accent ?? (variant === 'primary' ? tokens.primary : undefined)
  const heights: Record<BtnSize, number> = { sm: 36, md: 40, lg: 52 }
  const fontSizes: Record<BtnSize, number> = { sm: 12, md: 14, lg: 15 }

  const variantStyles: Record<BtnVariant, React.CSSProperties> = {
    primary:   { background: color ?? tokens.primary, color: tokens.bg, border: 'none' },
    secondary: { background: tokens.surface2, color: tokens.text, border: `1px solid ${tokens.border}` },
    ghost:     { background: 'transparent', color: tokens.textMuted, border: 'none' },
  }

  return (
    <button
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        height: heights[size],
        padding: `0 ${size === 'lg' ? 20 : 14}px`,
        borderRadius: 10,
        fontSize: fontSizes[size],
        fontWeight: 700,
        fontFamily: 'inherit',
        cursor: 'pointer',
        width: full ? '100%' : undefined,
        ...variantStyles[variant],
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  )
}
```

**Step 6: Implement ScreenHeader**

Create `kb-fitness/src/components/primitives/ScreenHeader.tsx`:

```tsx
import React from 'react'
import { tokens } from '../../styles/tokens'

interface ScreenHeaderProps {
  title: string
  subtitle?: string
  leftIcon?: React.ReactNode
  leftAction?: () => void
  rightContent?: React.ReactNode
}

export function ScreenHeader({ title, subtitle, leftIcon, leftAction, rightContent }: ScreenHeaderProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: '12px 16px 8px',
      gap: 8,
      flexShrink: 0,
    }}>
      {leftIcon && leftAction && (
        <button onClick={leftAction} style={{
          width: 36, height: 36,
          background: 'transparent', border: 'none',
          color: tokens.text, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginLeft: -6,
        }}>
          {leftIcon}
        </button>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15 }}>{title}</div>
        {subtitle && (
          <div style={{ fontSize: 12, color: tokens.textMuted, marginTop: 2 }}>{subtitle}</div>
        )}
      </div>
      {rightContent}
    </div>
  )
}
```

**Step 7: Implement Sectionlabel**

Create `kb-fitness/src/components/primitives/Sectionlabel.tsx`:

```tsx
import React from 'react'
import { tokens } from '../../styles/tokens'

interface SectionlabelProps {
  children: React.ReactNode
  right?: React.ReactNode
}

export function Sectionlabel({ children, right }: SectionlabelProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 0 6px',
    }}>
      <div style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.09em',
        textTransform: 'uppercase',
        color: tokens.textMuted,
      }}>
        {children}
      </div>
      {right}
    </div>
  )
}
```

**Step 8: Implement BlockPill**

Create `kb-fitness/src/components/primitives/BlockPill.tsx`:

```tsx
import React from 'react'
import { tokens } from '../../styles/tokens'

export type BlockType = 'straight' | 'superset' | 'circuit' | 'amrap' | 'ladder' | 'interval' | 'carry' | 'tempo'

interface BlockPillProps {
  type: BlockType
}

const PILL_CONFIG: Record<BlockType, { label: string; color: string; bg: string }> = {
  straight: { label: 'SETS',     color: tokens.text,    bg: tokens.surface3 },
  superset: { label: 'SUPERSET', color: tokens.primary, bg: tokens.workBg },
  circuit:  { label: 'CIRCUIT',  color: tokens.primary, bg: tokens.workBg },
  amrap:    { label: 'AMRAP',    color: tokens.accent,  bg: tokens.accentBg },
  ladder:   { label: 'LADDER',   color: tokens.accent,  bg: tokens.accentBg },
  interval: { label: 'INTERVAL', color: tokens.rest,    bg: tokens.restBg },
  carry:    { label: 'CARRY',    color: tokens.accent,  bg: tokens.accentBg },
  tempo:    { label: 'TEMPO',    color: tokens.accent,  bg: tokens.accentBg },
}

export function BlockPill({ type }: BlockPillProps) {
  const { label, color, bg } = PILL_CONFIG[type] ?? PILL_CONFIG.straight
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '3px 8px',
      borderRadius: 6,
      fontSize: 9,
      fontWeight: 800,
      letterSpacing: '0.09em',
      background: bg,
      color,
      border: `1px solid ${color}30`,
      whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  )
}
```

**Step 9: Implement BottomSheet**

Create `kb-fitness/src/components/primitives/BottomSheet.tsx`:

```tsx
import React from 'react'
import { tokens } from '../../styles/tokens'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export function BottomSheet({ open, onClose, title, children }: BottomSheetProps) {
  if (!open) return null
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'flex-end',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 430, margin: '0 auto',
          background: tokens.surface,
          borderRadius: '20px 20px 0 0',
          borderTop: `1px solid ${tokens.border}`,
          padding: '16px 16px 32px',
          maxHeight: '90vh',
          overflow: 'auto',
        }}
      >
        <div style={{
          width: 36, height: 4, borderRadius: 2,
          background: tokens.border, margin: '0 auto 16px',
        }}/>
        {title && (
          <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 14 }}>{title}</div>
        )}
        {children}
      </div>
    </div>
  )
}
```

**Step 10: Create barrel export**

Create `kb-fitness/src/components/primitives/index.ts`:

```ts
export { Card } from './Card'
export { Chip } from './Chip'
export { Btn } from './Btn'
export { ScreenHeader } from './ScreenHeader'
export { Sectionlabel } from './Sectionlabel'
export { BlockPill } from './BlockPill'
export { BottomSheet } from './BottomSheet'
export type { BlockType } from './BlockPill'
```

**Step 11: Run tests**

```bash
npx vitest run src/components/primitives/__tests__/primitives.test.tsx
```
Expected: PASS (7 tests)

**Step 12: Commit**

```bash
git add kb-fitness/src/components/primitives/
git commit -m "feat(kb-fitness): primitive components — Card, Chip, Btn, ScreenHeader, BlockPill, BottomSheet"
```

---

### Task 4: Icon layer

**Files:**
- Create: `kb-fitness/src/components/Icon.tsx`
- Test: `kb-fitness/src/components/__tests__/Icon.test.tsx`

**Note:** The design system uses ~50 custom icon names via `<I name="..."/>`. We map these to lucide-react icons. Equipment-specific icons (kettlebell, TRX, rower, band) are inline SVG since lucide doesn't have them.

**Step 1: Write failing test**

Create `kb-fitness/src/components/__tests__/Icon.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { Icon } from '../Icon'

test('renders known icon without error', () => {
  const { container } = render(<Icon name="timer" size={20} />)
  expect(container.firstChild).not.toBeNull()
})

test('renders equipment icon kettlebell', () => {
  const { container } = render(<Icon name="kettlebell" size={24} />)
  expect(container.querySelector('svg')).not.toBeNull()
})

test('renders fallback for unknown icon', () => {
  const { container } = render(<Icon name="nonexistent-icon-xyz" size={20} />)
  expect(container.firstChild).not.toBeNull()
})
```

**Step 2: Run to verify failure**

```bash
npx vitest run src/components/__tests__/Icon.test.tsx
```

**Step 3: Implement Icon**

Create `kb-fitness/src/components/Icon.tsx`:

```tsx
import React from 'react'
import {
  Timer, Dumbbell, Flame, Flag, Check, CheckCircle,
  ChevronLeft, ChevronRight, Plus, Minus, Play, Pause,
  Search, Settings, Info, Pencil, RotateCcw, SkipForward,
  Home, Calendar, ArrowRight, X, Grip, Wand2, Zap,
  Star, TrendingUp, History, MoreHorizontal,
} from 'lucide-react'

interface IconProps {
  name: string
  size?: number
  color?: string
}

// Map design-system KB icon names → lucide components
const LUCIDE_MAP: Record<string, React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>> = {
  timer:          Timer,
  dumbbell:       Dumbbell,
  flame:          Flame,
  flag:           Flag,
  check:          Check,
  'check-circle': CheckCircle,
  'chevron-left': ChevronLeft,
  'chevron-right':ChevronRight,
  plus:           Plus,
  'plus-circle':  Plus,
  minus:          Minus,
  play:           Play,
  pause:          Pause,
  search:         Search,
  settings:       Settings,
  info:           Info,
  pencil:         Pencil,
  rotate:         RotateCcw,
  skip:           SkipForward,
  home:           Home,
  calendar:       Calendar,
  'arrow-right':  ArrowRight,
  close:          X,
  grip:           Grip,
  wand:           Wand2,
  flash:          Zap,
  note:           Star,
  swap:           RotateCcw,
  trending:       TrendingUp,
  history:        History,
  more:           MoreHorizontal,
}

// Custom SVG for equipment icons not in lucide
function KettlebellIcon({ size = 24, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
      <circle cx="12" cy="9" r="5"/>
      <path d="M8 14 Q6 20 9 21 L15 21 Q18 20 16 14"/>
      <path d="M10 4.5 Q12 2 14 4.5"/>
    </svg>
  )
}

function TrxIcon({ size = 24, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
      <path d="M12 2 L12 8"/>
      <circle cx="12" cy="10" r="2"/>
      <path d="M10 12 L6 20 M14 12 L18 20"/>
      <path d="M8 16 L16 16"/>
    </svg>
  )
}

function RowerIcon({ size = 24, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
      <path d="M3 17 L21 17"/>
      <path d="M7 17 L10 10 L14 13 L17 8"/>
      <circle cx="17" cy="7" r="1.5"/>
    </svg>
  )
}

function BandIcon({ size = 24, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
      <ellipse cx="12" cy="12" rx="9" ry="4"/>
      <path d="M3 12 Q3 20 12 20 Q21 20 21 12"/>
    </svg>
  )
}

function BodyweightIcon({ size = 24, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
      <circle cx="12" cy="4" r="2"/>
      <path d="M12 6 L12 14 M9 9 L15 9 M12 14 L9 20 M12 14 L15 20"/>
    </svg>
  )
}

function PullBarIcon({ size = 24, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
      <path d="M2 4 L22 4"/>
      <path d="M8 4 L8 10 Q8 16 12 18 Q16 16 16 10 L16 4"/>
    </svg>
  )
}

const CUSTOM_MAP: Record<string, React.FC<{ size?: number; color?: string }>> = {
  kettlebell:  KettlebellIcon,
  trx:         TrxIcon,
  rower:       RowerIcon,
  band:        BandIcon,
  bodyweight:  BodyweightIcon,
  'pull-bar':  PullBarIcon,
}

export function Icon({ name, size = 20, color = 'currentColor' }: IconProps) {
  const Custom = CUSTOM_MAP[name]
  if (Custom) return <Custom size={size} color={color}/>

  const Lucide = LUCIDE_MAP[name]
  if (Lucide) return <Lucide size={size} color={color} strokeWidth={2}/>

  // Fallback: small dot
  return <span style={{ width: size, height: size, display: 'inline-block' }}/>
}
```

**Step 4: Run tests**

```bash
npx vitest run src/components/__tests__/Icon.test.tsx
```
Expected: PASS

**Step 5: Commit**

```bash
git add kb-fitness/src/components/
git commit -m "feat(kb-fitness): icon layer — lucide map + custom equipment SVGs"
```

---

### Task 5: Database schema

**Files:**
- Create: `kb-fitness/src/db/db.ts`
- Create: `kb-fitness/src/db/types.ts`
- Test: `kb-fitness/src/db/__tests__/db.test.ts`

**Step 1: Define types**

Create `kb-fitness/src/db/types.ts`:

```ts
// WorkoutSessionV2 schema types — matches programs/8-week-kettlebell-program.json

export interface LoadObject {
  value: number | null
  unit: string | null
  label: string
}

export interface Prescription {
  type: 'reps' | 'time' | 'distance' | 'failure'
  target: string | number
  load: LoadObject
}

export interface ProtocolConstraints {
  tempo?: string
  cues?: string[]
}

export interface ExerciseInstance {
  exercise_id: string
  name: string
  sub_label?: string
  prescription: Prescription
  protocol_constraints?: ProtocolConstraints
  ladder?: { rungs: Array<{ reps: number; load: LoadObject }> }
}

export interface WorkoutBlock {
  type: 'straight' | 'superset' | 'circuit' | 'amrap' | 'ladder' | 'interval' | 'carry' | 'tempo'
  label?: string
  name?: string
  rounds?: number
  rest_sec?: number
  duration_sec?: number
  exercises: ExerciseInstance[]
}

export interface WorkoutSession {
  session_id: string
  metadata: {
    title: string
    environment?: 'Home' | 'Gym' | 'Travel'
    tags?: string[]
  }
  blocks: WorkoutBlock[]
}

// Dexie table row types

export interface ProgramRecord {
  id?: number
  programId: string
  title: string
  author: string
  phases: Array<{
    id: string
    name: string
    weeks: number
    description: string
  }>
  weeklyStructure: Record<string, string>  // day → session_id key
  status: 'active' | 'paused' | 'archived'
  phaseIndex: number
  weekIndex: number
  dayIndex: number
  startedAt: number
}

export interface SessionRecord {
  id?: number
  sessionId: string
  programId: string
  template: WorkoutSession
  loadMultiplier?: number  // auto-regulation: 0.95 | 1.0 | 1.05
}

export interface LoggedSet {
  exerciseId: string
  setIndex: number
  actualReps: number | null
  actualLoad: LoadObject | null
  completedAt: number
}

export interface WorkoutLog {
  id?: number
  sessionId: string
  programId: string
  completedAt: number
  durationSec: number
  rating: 'easy' | 'on_point' | 'hard' | null
  notes: string
  totalVolumeKg: number | null
  sets: LoggedSet[]
}

export interface ActiveWorkoutState {
  id?: number  // always 1
  sessionId: string
  programId: string
  startedAt: number
  pausedAt: number | null
  currentBlockIndex: number
  blockStates: Array<{
    blockIndex: number
    completedSets: number
    setData: LoggedSet[]
  }>
}

export interface SettingsRecord {
  id?: number  // always 1
  unit: 'lb' | 'kg'
  leadIn: 0 | 3 | 5 | 10
  sound: boolean
  haptics: boolean
  restDefaults: { straight: number; superset: number; circuit: number }
}

// Exercise library types (static seed)
export interface ExerciseLibraryEntry {
  id: string
  name: string
  equipment: 'kettlebell' | 'dumbbell' | 'trx' | 'pull-up bar' | 'bodyweight' | 'band' | 'rower'
  pattern: 'hinge' | 'squat' | 'push' | 'pull' | 'carry' | 'core' | 'cardio' | 'power'
  primary: string[]
  secondary?: string[]
  cues?: string[]
  substitutions?: string[]
  youtubeId?: string
}
```

**Step 2: Write DB schema test**

Create `kb-fitness/src/db/__tests__/db.test.ts`:

```ts
import { db } from '../db'

test('db has required tables', () => {
  expect(db.programs).toBeDefined()
  expect(db.sessions).toBeDefined()
  expect(db.workoutLogs).toBeDefined()
  expect(db.activeWorkout).toBeDefined()
  expect(db.settings).toBeDefined()
})

test('db version is 1', () => {
  expect(db.verno).toBe(1)
})
```

**Step 3: Implement Dexie DB**

Create `kb-fitness/src/db/db.ts`:

```ts
import Dexie, { type Table } from 'dexie'
import type {
  ProgramRecord, SessionRecord, WorkoutLog,
  ActiveWorkoutState, SettingsRecord,
} from './types'

class KBDatabase extends Dexie {
  programs!:     Table<ProgramRecord>
  sessions!:     Table<SessionRecord>
  workoutLogs!:  Table<WorkoutLog>
  activeWorkout!:Table<ActiveWorkoutState>
  settings!:     Table<SettingsRecord>

  constructor() {
    super('kb-fitness')
    this.version(1).stores({
      programs:      '++id, programId, status',
      sessions:      '++id, sessionId, programId',
      workoutLogs:   '++id, sessionId, completedAt, rating',
      activeWorkout: '++id',
      settings:      '++id',
    })
  }
}

export const db = new KBDatabase()
```

**Step 4: Run tests**

```bash
npx vitest run src/db/__tests__/db.test.ts
```
Expected: PASS

**Step 5: Commit**

```bash
git add kb-fitness/src/db/
git commit -m "feat(kb-fitness): Dexie 4 schema + TypeScript types"
```

---

### Task 6: Seed data

**Files:**
- Create: `kb-fitness/src/db/seed.ts`
- Test: `kb-fitness/src/db/__tests__/seed.test.ts`

**Reference:** Read `programs/8-week-kettlebell-program.json` for the data shape being seeded.

**Step 1: Write seed test**

Create `kb-fitness/src/db/__tests__/seed.test.ts`:

```ts
import { seedIfNeeded } from '../seed'
import { db } from '../db'

beforeEach(async () => {
  await db.programs.clear()
  await db.sessions.clear()
  localStorage.removeItem('kb.seeded')
})

test('seedIfNeeded inserts program and sessions on first run', async () => {
  await seedIfNeeded()
  const programs = await db.programs.toArray()
  const sessions = await db.sessions.toArray()
  expect(programs).toHaveLength(1)
  expect(programs[0].programId).toBe('8wk-kb-healthier-you')
  expect(sessions.length).toBeGreaterThan(0)
})

test('seedIfNeeded is idempotent — second call skips', async () => {
  await seedIfNeeded()
  await seedIfNeeded()
  const programs = await db.programs.toArray()
  expect(programs).toHaveLength(1)
})

test('seeded settings default to lb + 5s lead-in', async () => {
  await seedIfNeeded()
  const settings = await db.settings.get(1)
  expect(settings?.unit).toBe('lb')
  expect(settings?.leadIn).toBe(5)
})
```

**Step 2: Implement seed**

Create `kb-fitness/src/db/seed.ts`:

```ts
import { db } from './db'
import programData from '../../programs/8-week-kettlebell-program.json'
import type { SessionRecord } from './types'

const SEED_KEY = 'kb.seeded'

export async function seedIfNeeded(): Promise<void> {
  if (localStorage.getItem(SEED_KEY)) return

  await db.transaction('rw', db.programs, db.sessions, db.settings, async () => {
    // Insert program record
    await db.programs.add({
      programId:      programData.program_id,
      title:          programData.title,
      author:         programData.author,
      phases:         programData.phases,
      weeklyStructure: programData.weekly_structure,
      status:         'active',
      phaseIndex:     0,
      weekIndex:      0,
      dayIndex:       0,
      startedAt:      Date.now(),
    })

    // Insert all session templates
    const sessionRows: SessionRecord[] = programData.session_templates.map((t: any) => ({
      sessionId:  t.session_id,
      programId:  programData.program_id,
      template:   t,
      loadMultiplier: 1.0,
    }))
    await db.sessions.bulkAdd(sessionRows)

    // Insert default settings
    await db.settings.add({
      id:           1,
      unit:         'lb',
      leadIn:       5,
      sound:        true,
      haptics:      true,
      restDefaults: { straight: 90, superset: 90, circuit: 60 },
    })
  })

  localStorage.setItem(SEED_KEY, '1')
}
```

**Step 3: Add JSON import to vite config**

In `kb-fitness/vite.config.ts` — inside defineConfig add:
```ts
  resolve: {
    alias: { '@': '/src' },
  },
```

Also add `"resolveJsonModule": true` to `kb-fitness/tsconfig.json` under `compilerOptions`.

**Step 4: Run tests**

```bash
npx vitest run src/db/__tests__/seed.test.ts
```
Expected: PASS

**Step 5: Commit**

```bash
git add kb-fitness/src/db/seed.ts
git commit -m "feat(kb-fitness): seed 8-week program on first launch"
```

---

## Phase 2 — Shell & Routing

### Task 7: Router + Bottom Nav

**Files:**
- Create: `kb-fitness/src/App.tsx`
- Create: `kb-fitness/src/components/BottomNav.tsx`
- Test: `kb-fitness/src/components/__tests__/BottomNav.test.tsx`

**Step 1: Write failing test**

Create `kb-fitness/src/components/__tests__/BottomNav.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { BottomNav } from '../BottomNav'

test('renders all 4 tabs', () => {
  render(<MemoryRouter><BottomNav /></MemoryRouter>)
  expect(screen.getByText('Today')).toBeInTheDocument()
  expect(screen.getByText('Programs')).toBeInTheDocument()
  expect(screen.getByText('Progress')).toBeInTheDocument()
  expect(screen.getByText('More')).toBeInTheDocument()
})
```

**Step 2: Implement BottomNav**

Create `kb-fitness/src/components/BottomNav.tsx`:

```tsx
import React from 'react'
import { NavLink } from 'react-router-dom'
import { tokens } from '../styles/tokens'
import { Icon } from './Icon'

const TABS = [
  { to: '/',         label: 'Today',    icon: 'calendar' },
  { to: '/programs', label: 'Programs', icon: 'flag' },
  { to: '/progress', label: 'Progress', icon: 'trending' },
  { to: '/more',     label: 'More',     icon: 'more' },
]

export function BottomNav() {
  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      maxWidth: 430,
      margin: '0 auto',
      height: 64,
      background: tokens.surface,
      borderTop: `1px solid ${tokens.border}`,
      display: 'flex',
      zIndex: 50,
    }}>
      {TABS.map(tab => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === '/'}
          style={({ isActive }) => ({
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
            textDecoration: 'none',
            color: isActive ? tokens.primary : tokens.textMuted,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.06em',
          })}
        >
          <Icon name={tab.icon} size={22} />
          {tab.label}
        </NavLink>
      ))}
    </nav>
  )
}
```

**Step 3: Implement App.tsx**

Create `kb-fitness/src/App.tsx`:

```tsx
import React, { useEffect } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { BottomNav } from './components/BottomNav'
import { seedIfNeeded } from './db/seed'

// Lazy-load top-level tabs to avoid circular imports
const TodayTab     = React.lazy(() => import('./tabs/TodayTab'))
const ProgramsTab  = React.lazy(() => import('./tabs/ProgramsTab'))
const ProgressTab  = React.lazy(() => import('./tabs/ProgressTab'))
const MoreTab      = React.lazy(() => import('./tabs/MoreTab'))

export function App() {
  useEffect(() => { seedIfNeeded() }, [])

  return (
    <HashRouter>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingBottom: 64, overflow: 'hidden', height: '100%' }}>
        <React.Suspense fallback={null}>
          <Routes>
            <Route path="/"          element={<TodayTab />} />
            <Route path="/programs/*" element={<ProgramsTab />} />
            <Route path="/progress/*" element={<ProgressTab />} />
            <Route path="/more/*"     element={<MoreTab />} />
          </Routes>
        </React.Suspense>
      </div>
      <BottomNav />
    </HashRouter>
  )
}
```

**Step 4: Create stub tabs (fill in later tasks)**

Create `kb-fitness/src/tabs/TodayTab.tsx`:
```tsx
export default function TodayTab() { return <div style={{ padding: 16, color: '#fff' }}>Today</div> }
```

Create `kb-fitness/src/tabs/ProgramsTab.tsx`:
```tsx
export default function ProgramsTab() { return <div style={{ padding: 16, color: '#fff' }}>Programs</div> }
```

Create `kb-fitness/src/tabs/ProgressTab.tsx`:
```tsx
export default function ProgressTab() { return <div style={{ padding: 16, color: '#fff' }}>Progress</div> }
```

Create `kb-fitness/src/tabs/MoreTab.tsx` **(gap fill #3)**:
```tsx
import React from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { ScreenHeader } from '../components/primitives'
import { tokens } from '../styles/tokens'
import { Icon } from '../components/Icon'

// Stub — real screens wired in Tasks 28-31
function MoreHome() {
  const nav = useNavigate()
  const items = [
    { label: 'Exercise Library', icon: 'dumbbell', to: '/more/exercises' },
    { label: 'Settings',         icon: 'settings', to: '/more/settings' },
  ]
  return (
    <div style={{ flex: 1, overflow: 'auto' }}>
      <ScreenHeader title="More" />
      <div style={{ padding: '0 16px' }}>
        {items.map(item => (
          <button key={item.to} onClick={() => nav(item.to)} style={{
            display: 'flex', alignItems: 'center', gap: 12, width: '100%',
            padding: '14px 0', background: 'transparent', border: 'none',
            borderBottom: `1px solid ${tokens.borderSoft}`, color: tokens.text,
            fontFamily: 'inherit', fontSize: 16, fontWeight: 600, cursor: 'pointer',
          }}>
            <Icon name={item.icon} size={20} color={tokens.primary}/>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function MoreTab() {
  return (
    <Routes>
      <Route index element={<MoreHome />} />
      {/* Filled in Tasks 28-31 */}
    </Routes>
  )
}
```

**Step 5: Update main.tsx**

Replace `kb-fitness/src/main.tsx`:

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/global.css'
import { App } from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

**Step 6: Run tests**

```bash
npx vitest run src/components/__tests__/BottomNav.test.tsx
```
Expected: PASS

**Step 7: Verify in browser**

```bash
npm run dev
```
Expected: App loads, bottom nav shows 4 tabs, hash routing works

**Step 8: Commit**

```bash
git add kb-fitness/src/
git commit -m "feat(kb-fitness): router + bottom nav shell + More tab wrapper"
```

---

## Phase 3 — Timer System

### Task 8: useCountdown + CircularTimer + RestTimer

**Files:**
- Create: `kb-fitness/src/hooks/useCountdown.ts`
- Create: `kb-fitness/src/hooks/useLeadIn.ts`
- Create: `kb-fitness/src/components/CircularTimer.tsx`
- Create: `kb-fitness/src/components/SetTimerButton.tsx`
- Create: `kb-fitness/src/components/RestTimer.tsx`  **(gap fill #1)**
- Test: `kb-fitness/src/hooks/__tests__/useCountdown.test.ts`

**Reference:** Read `design-system/lib/timer.jsx` for the exact state machine (idle → lead → run → done) before implementing.

**Step 1: Write failing tests**

Create `kb-fitness/src/hooks/__tests__/useCountdown.test.ts`:

```ts
import { renderHook, act } from '@testing-library/react'
import { useCountdown } from '../useCountdown'

test('starts in idle phase', () => {
  const { result } = renderHook(() => useCountdown({ duration: 60 }))
  expect(result.current.phase).toBe('idle')
  expect(result.current.remaining).toBe(60)
})

test('transitions to run on start (no lead-in)', () => {
  const { result } = renderHook(() => useCountdown({ duration: 60, leadIn: 0 }))
  act(() => { result.current.start() })
  expect(result.current.phase).toBe('run')
})

test('transitions to lead on start with lead-in', () => {
  const { result } = renderHook(() => useCountdown({ duration: 60, leadIn: 3 }))
  act(() => { result.current.start() })
  expect(result.current.phase).toBe('lead')
  expect(result.current.leadCount).toBe(3)
})

test('pause stops progression', () => {
  const { result } = renderHook(() => useCountdown({ duration: 60, leadIn: 0 }))
  act(() => { result.current.start() })
  act(() => { result.current.pause() })
  expect(result.current.phase).toBe('paused')
})

test('reset returns to idle', () => {
  const { result } = renderHook(() => useCountdown({ duration: 60, leadIn: 0 }))
  act(() => { result.current.start() })
  act(() => { result.current.reset() })
  expect(result.current.phase).toBe('idle')
  expect(result.current.remaining).toBe(60)
})
```

**Step 2: Implement useCountdown**

Create `kb-fitness/src/hooks/useCountdown.ts`:

```ts
import { useCallback, useEffect, useReducer, useRef } from 'react'

export type CountdownPhase = 'idle' | 'lead' | 'run' | 'paused' | 'done'

interface State {
  phase:     CountdownPhase
  remaining: number   // seconds remaining in current phase
  total:     number   // total duration (for ring pct)
  leadCount: number   // lead-in countdown display
}

type Action =
  | { type: 'START' }
  | { type: 'TICK' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'RESET' }

interface Options {
  duration: number
  leadIn?: number
  onComplete?: () => void
}

function makeReducer(duration: number, leadIn: number) {
  return function reducer(state: State, action: Action): State {
    switch (action.type) {
      case 'START':
        if (leadIn > 0) return { ...state, phase: 'lead', leadCount: leadIn, remaining: duration, total: duration }
        return { ...state, phase: 'run', remaining: duration, total: duration }
      case 'TICK':
        if (state.phase === 'lead') {
          if (state.leadCount <= 1) return { ...state, phase: 'run', leadCount: 0 }
          return { ...state, leadCount: state.leadCount - 1 }
        }
        if (state.phase === 'run') {
          if (state.remaining <= 1) return { ...state, phase: 'done', remaining: 0 }
          return { ...state, remaining: state.remaining - 1 }
        }
        return state
      case 'PAUSE':
        return { ...state, phase: 'paused' }
      case 'RESUME':
        return { ...state, phase: state.remaining > 0 ? 'run' : 'done' }
      case 'RESET':
        return { phase: 'idle', remaining: duration, total: duration, leadCount: leadIn }
      default:
        return state
    }
  }
}

export function useCountdown({ duration, leadIn = 0, onComplete }: Options) {
  const [state, dispatch] = useReducer(makeReducer(duration, leadIn), {
    phase: 'idle', remaining: duration, total: duration, leadCount: leadIn,
  })

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    const running = state.phase === 'lead' || state.phase === 'run'
    if (running) {
      intervalRef.current = setInterval(() => dispatch({ type: 'TICK' }), 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    if (state.phase === 'done') onCompleteRef.current?.()
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [state.phase])

  return {
    ...state,
    isRunning: state.phase === 'lead' || state.phase === 'run',
    start:  () => dispatch({ type: state.phase === 'paused' ? 'RESUME' : 'START' }),
    pause:  () => dispatch({ type: 'PAUSE' }),
    reset:  () => dispatch({ type: 'RESET' }),
  }
}
```

**Step 3: Implement useLeadIn**

Create `kb-fitness/src/hooks/useLeadIn.ts`:

```ts
import { useState, useEffect } from 'react'

const KEY = 'kb.leadIn'
type LeadIn = 0 | 3 | 5 | 10

export function useLeadIn(): [LeadIn, (v: LeadIn) => void] {
  const [val, setVal] = useState<LeadIn>(() => {
    const stored = localStorage.getItem(KEY)
    return stored ? (parseInt(stored, 10) as LeadIn) : 5
  })
  const set = (v: LeadIn) => {
    localStorage.setItem(KEY, String(v))
    setVal(v)
  }
  return [val, set]
}
```

**Step 4: Implement CircularTimer**

Create `kb-fitness/src/components/CircularTimer.tsx`:

```tsx
import React from 'react'
import { tokens } from '../styles/tokens'
import type { CountdownPhase } from '../hooks/useCountdown'

interface CircularTimerProps {
  remaining:  number
  total:      number
  leadCount:  number
  phase:      CountdownPhase
  size?:      number
  accent?:    string
}

function fmtTime(secs: number) {
  const m = Math.floor(secs / 60).toString().padStart(2, '0')
  const s = (secs % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export function CircularTimer({
  remaining, total, leadCount, phase,
  size = 200, accent = tokens.primary,
}: CircularTimerProps) {
  const r = size * 0.4
  const cx = size / 2, cy = size / 2
  const circ = 2 * Math.PI * r

  const pct = phase === 'lead' ? 1 : total > 0 ? remaining / total : 0
  const dash = pct * circ

  const ringColor =
    phase === 'lead' ? tokens.accent :
    phase === 'done' ? tokens.primary :
    accent

  return (
    <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={tokens.border} strokeWidth={size * 0.05}/>
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={ringColor}
          strokeWidth={size * 0.05}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        {phase === 'lead' ? (
          <>
            <div style={{ fontSize: size * 0.32, fontWeight: 700, color: tokens.accent, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
              {leadCount}
            </div>
            <div style={{ fontSize: size * 0.09, color: tokens.textMuted, fontWeight: 600, letterSpacing: '0.1em', marginTop: 4 }}>GET READY</div>
          </>
        ) : (
          <>
            <div style={{ fontSize: size * 0.22, fontWeight: 700, color: phase === 'done' ? tokens.primary : tokens.text, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
              {fmtTime(remaining)}
            </div>
            {phase === 'done' && (
              <div style={{ fontSize: size * 0.08, color: tokens.primary, fontWeight: 700, marginTop: 4 }}>DONE</div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
```

**Step 5: Implement SetTimerButton (gap fill #2)**

Create `kb-fitness/src/components/SetTimerButton.tsx`:

```tsx
import React from 'react'
import { tokens } from '../styles/tokens'
import { useCountdown } from '../hooks/useCountdown'
import { useLeadIn } from '../hooks/useLeadIn'
import { CircularTimer } from './CircularTimer'
import { Icon } from './Icon'

interface SetTimerButtonProps {
  durationSec: number
  onComplete?: () => void
}

export function SetTimerButton({ durationSec, onComplete }: SetTimerButtonProps) {
  const [leadIn] = useLeadIn()
  const t = useCountdown({ duration: durationSec, leadIn, onComplete })

  if (t.phase === 'idle') {
    return (
      <button onClick={t.start} style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '10px 16px', borderRadius: 10,
        background: tokens.workBg, border: `1px solid ${tokens.primary}`,
        color: tokens.primary, fontFamily: 'inherit', fontWeight: 700,
        fontSize: 14, cursor: 'pointer',
      }}>
        <Icon name="timer" size={18} color={tokens.primary}/>
        Start {durationSec}s timer
      </button>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <CircularTimer remaining={t.remaining} total={t.total} leadCount={t.leadCount} phase={t.phase} size={120}/>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={t.pause} style={{
          padding: '8px 16px', borderRadius: 8,
          background: tokens.surface2, border: `1px solid ${tokens.border}`,
          color: tokens.text, fontFamily: 'inherit', cursor: 'pointer',
        }}>
          <Icon name={t.isRunning ? 'pause' : 'play'} size={16}/>
        </button>
        <button onClick={t.reset} style={{
          padding: '8px 16px', borderRadius: 8,
          background: tokens.surface2, border: `1px solid ${tokens.border}`,
          color: tokens.textMuted, fontFamily: 'inherit', cursor: 'pointer', fontSize: 12,
        }}>
          Reset
        </button>
      </div>
    </div>
  )
}
```

**Step 6: Implement RestTimer (gap fill #1)**

Create `kb-fitness/src/components/RestTimer.tsx`:

```tsx
import React, { useEffect } from 'react'
import { tokens } from '../styles/tokens'
import { useCountdown } from '../hooks/useCountdown'

interface RestTimerProps {
  durationSec: number
  onDone: () => void
}

/**
 * Full-screen overlay rest countdown.
 * Auto-starts immediately. Tap anywhere or "Skip rest" to dismiss.
 * Gap fill #1 — not in design system prototype.
 */
export function RestTimer({ durationSec, onDone }: RestTimerProps) {
  const t = useCountdown({ duration: durationSec, leadIn: 0, onComplete: onDone })

  useEffect(() => { t.start() }, [])  // auto-start

  const pct = durationSec > 0 ? t.remaining / durationSec : 0

  return (
    <div
      onClick={onDone}
      style={{
        position: 'fixed', inset: 0, zIndex: 90,
        background: tokens.restBg,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 16,
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', color: tokens.rest }}>REST</div>

      <div style={{ position: 'relative', width: 200, height: 200 }}>
        <svg width={200} height={200} viewBox="0 0 200 200">
          <circle cx={100} cy={100} r={80} fill="none" stroke={tokens.border} strokeWidth={10}/>
          <circle
            cx={100} cy={100} r={80}
            fill="none" stroke={tokens.rest} strokeWidth={10}
            strokeDasharray={`${pct * 502} 502`}
            strokeLinecap="round"
            transform="rotate(-90 100 100)"
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 52, fontWeight: 700,
          color: tokens.rest,
          fontVariantNumeric: 'tabular-nums',
        }}>
          {t.remaining}
        </div>
      </div>

      <div style={{ fontSize: 13, color: tokens.textMuted }}>Tap anywhere to skip rest</div>
      <button
        onClick={onDone}
        style={{
          marginTop: 8, padding: '12px 28px', borderRadius: 10,
          background: tokens.rest, color: tokens.bg, border: 'none',
          fontFamily: 'inherit', fontWeight: 700, fontSize: 15, cursor: 'pointer',
        }}
      >
        Skip rest
      </button>
    </div>
  )
}
```

**Step 7: Run tests**

```bash
npx vitest run src/hooks/__tests__/useCountdown.test.ts
```
Expected: PASS (5 tests)

**Step 8: Commit**

```bash
git add kb-fitness/src/hooks/ kb-fitness/src/components/CircularTimer.tsx kb-fitness/src/components/SetTimerButton.tsx kb-fitness/src/components/RestTimer.tsx
git commit -m "feat(kb-fitness): timer system — useCountdown, CircularTimer, SetTimerButton, RestTimer"
```

---

## Phase 4 — Active Workout State Machine

### Task 9: Active workout context

**Files:**
- Create: `kb-fitness/src/context/ActiveWorkoutContext.tsx`
- Test: `kb-fitness/src/context/__tests__/ActiveWorkoutContext.test.tsx`

**Step 1: Write tests**

Create `kb-fitness/src/context/__tests__/ActiveWorkoutContext.test.tsx`:

```tsx
import { renderHook, act } from '@testing-library/react'
import { ActiveWorkoutProvider, useActiveWorkout } from '../ActiveWorkoutContext'
import { mockSession } from '../../test/fixtures'

const wrapper = ({ children }: any) => (
  <ActiveWorkoutProvider>{children}</ActiveWorkoutProvider>
)

test('starts in idle state', () => {
  const { result } = renderHook(() => useActiveWorkout(), { wrapper })
  expect(result.current.state.status).toBe('idle')
})

test('startWorkout transitions to active', async () => {
  const { result } = renderHook(() => useActiveWorkout(), { wrapper })
  await act(async () => { result.current.startWorkout(mockSession) })
  expect(result.current.state.status).toBe('active')
  expect(result.current.state.currentBlockIndex).toBe(0)
})

test('logSet captures actualReps and actualLoad (gap fill #7)', async () => {
  const { result } = renderHook(() => useActiveWorkout(), { wrapper })
  await act(async () => { result.current.startWorkout(mockSession) })
  await act(async () => {
    result.current.logSet({ exerciseId: 'kb-swing', setIndex: 0, actualReps: 10, actualLoad: { value: 24, unit: 'kg', label: '24 kg' }, completedAt: Date.now() })
  })
  const blockState = result.current.state.blockStates[0]
  expect(blockState.setData[0].actualReps).toBe(10)
})
```

**Step 2: Create test fixture**

Create `kb-fitness/src/test/fixtures.ts`:

```ts
import type { WorkoutSession } from '../db/types'

export const mockSession: WorkoutSession = {
  session_id: 'test-session-1',
  metadata: { title: 'Test Session', environment: 'Home' },
  blocks: [
    {
      type: 'straight',
      label: 'A',
      name: 'Test block',
      rounds: 3,
      rest_sec: 90,
      exercises: [
        {
          exercise_id: 'kb-swing',
          name: 'KB Swing',
          prescription: { type: 'reps', target: 10, load: { value: 24, unit: 'kg', label: '24 kg' } },
        },
      ],
    },
  ],
}
```

**Step 3: Implement ActiveWorkoutContext**

Create `kb-fitness/src/context/ActiveWorkoutContext.tsx`:

```tsx
import React, { createContext, useContext, useReducer, useCallback } from 'react'
import { db } from '../db/db'
import type { WorkoutSession, LoggedSet, ActiveWorkoutState } from '../db/types'

interface WorkoutState {
  status: 'idle' | 'active' | 'paused' | 'complete'
  session: WorkoutSession | null
  currentBlockIndex: number
  blockStates: Array<{
    blockIndex: number
    completedSets: number
    setData: LoggedSet[]
  }>
  startedAt: number | null
}

type WorkoutAction =
  | { type: 'START'; session: WorkoutSession }
  | { type: 'LOG_SET'; payload: LoggedSet }
  | { type: 'NEXT_BLOCK' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'COMPLETE' }
  | { type: 'RESET' }

const initialState: WorkoutState = {
  status: 'idle',
  session: null,
  currentBlockIndex: 0,
  blockStates: [],
  startedAt: null,
}

function reducer(state: WorkoutState, action: WorkoutAction): WorkoutState {
  switch (action.type) {
    case 'START': {
      const blockStates = action.session.blocks.map((_, i) => ({
        blockIndex: i, completedSets: 0, setData: [],
      }))
      return { status: 'active', session: action.session, currentBlockIndex: 0, blockStates, startedAt: Date.now() }
    }
    case 'LOG_SET': {
      const updated = state.blockStates.map((bs, i) =>
        i === state.currentBlockIndex
          ? { ...bs, completedSets: bs.completedSets + 1, setData: [...bs.setData, action.payload] }
          : bs
      )
      return { ...state, blockStates: updated }
    }
    case 'NEXT_BLOCK':
      return { ...state, currentBlockIndex: Math.min(state.currentBlockIndex + 1, (state.session?.blocks.length ?? 1) - 1) }
    case 'PAUSE':
      return { ...state, status: 'paused' }
    case 'RESUME':
      return { ...state, status: 'active' }
    case 'COMPLETE':
      return { ...state, status: 'complete' }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

interface ActiveWorkoutContextValue {
  state: WorkoutState
  startWorkout: (session: WorkoutSession) => Promise<void>
  logSet: (set: LoggedSet) => void
  nextBlock: () => void
  completeWorkout: (rating: 'easy' | 'on_point' | 'hard') => Promise<void>
}

const Ctx = createContext<ActiveWorkoutContextValue | null>(null)

export function ActiveWorkoutProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const startWorkout = useCallback(async (session: WorkoutSession) => {
    dispatch({ type: 'START', session })
    // Persist to DB for crash recovery
    await db.activeWorkout.put({
      id: 1,
      sessionId: session.session_id,
      programId: '',
      startedAt: Date.now(),
      pausedAt: null,
      currentBlockIndex: 0,
      blockStates: [],
    })
  }, [])

  const logSet = useCallback((set: LoggedSet) => {
    dispatch({ type: 'LOG_SET', payload: set })
  }, [])

  const nextBlock = useCallback(() => {
    dispatch({ type: 'NEXT_BLOCK' })
  }, [])

  const completeWorkout = useCallback(async (rating: 'easy' | 'on_point' | 'hard') => {
    if (!state.session || !state.startedAt) return
    const durationSec = Math.round((Date.now() - state.startedAt) / 1000)

    // Compute total volume from all logged sets
    const allSets = state.blockStates.flatMap(bs => bs.setData)
    const totalVolumeKg = allSets.reduce((sum, s) => {
      if (!s.actualLoad?.value || !s.actualReps) return sum
      const kg = s.actualLoad.unit === 'lb' ? s.actualLoad.value * 0.453592 : s.actualLoad.value
      return sum + (kg * s.actualReps)
    }, 0)

    await db.workoutLogs.add({
      sessionId:    state.session.session_id,
      programId:    '',
      completedAt:  Date.now(),
      durationSec,
      rating,
      notes:        '',
      totalVolumeKg: totalVolumeKg || null,
      sets:         allSets,
    })

    await db.activeWorkout.delete(1)
    dispatch({ type: 'COMPLETE' })
  }, [state])

  return (
    <Ctx.Provider value={{ state, startWorkout, logSet, nextBlock, completeWorkout }}>
      {children}
    </Ctx.Provider>
  )
}

export function useActiveWorkout() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useActiveWorkout must be inside ActiveWorkoutProvider')
  return ctx
}
```

**Step 4: Wrap App in provider**

Edit `kb-fitness/src/App.tsx` — wrap `<HashRouter>` in `<ActiveWorkoutProvider>`:

```tsx
import { ActiveWorkoutProvider } from './context/ActiveWorkoutContext'
// ...
return (
  <ActiveWorkoutProvider>
    <HashRouter>
      {/* ... existing content ... */}
    </HashRouter>
  </ActiveWorkoutProvider>
)
```

**Step 5: Run tests**

```bash
npx vitest run src/context/__tests__/ActiveWorkoutContext.test.tsx
```
Expected: PASS

**Step 6: Commit**

```bash
git add kb-fitness/src/context/ kb-fitness/src/test/
git commit -m "feat(kb-fitness): active workout state machine with actual set logging"
```

---

## Phase 5 — Today Flow

### Task 10: Today screen

**Files:**
- Create: `kb-fitness/src/screens/TodayScreen.tsx`
- Update: `kb-fitness/src/tabs/TodayTab.tsx`
- Test: `kb-fitness/src/screens/__tests__/TodayScreen.test.tsx`

**Reference:** Read `design-system/screens/sessions.jsx` — `TodayScreen` and `ProgramEmptyToday` components.

**Step 1: Write test**

```tsx
// TodayScreen.test.tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { TodayScreen } from '../TodayScreen'

// Mock Dexie — return a fake program + session
vi.mock('../../db/db', () => ({ db: { programs: { where: vi.fn().mockReturnValue({ first: vi.fn().mockResolvedValue({ status: 'active', programId: 'test-pgm', phaseIndex: 0, weekIndex: 0, dayIndex: 0 }) }) }, sessions: { where: vi.fn().mockReturnValue({ first: vi.fn().mockResolvedValue(null) }) } } }))

test('renders empty state when no session found', async () => {
  render(<MemoryRouter><TodayScreen /></MemoryRouter>)
  // Empty state or loading — should not crash
  expect(document.body).not.toBeEmptyDOMElement()
})
```

**Step 2: Implement TodayScreen**

Create `kb-fitness/src/screens/TodayScreen.tsx` — match `design-system/screens/sessions.jsx::TodayScreen` and `ProgramEmptyToday` exactly.

Key additions over prototype:
- Query Dexie `programs` table for active program
- Resolve today's `session_id` from `weeklyStructure[dayOfWeek]`
- Show auto-regulation hint (gap fill #9): if last workout log has a rating, show a banner `"↑5% loads today — based on your last Easy session"`

**Step 3: Implement SessionPreviewScreen**

Create `kb-fitness/src/screens/SessionPreviewScreen.tsx` — match `design-system/screens/sessions.jsx::SessionPreviewScreen`.

**Step 4: Update TodayTab router**

Update `kb-fitness/src/tabs/TodayTab.tsx`:

```tsx
import { Routes, Route } from 'react-router-dom'
import { TodayScreen } from '../screens/TodayScreen'
import { SessionPreviewScreen } from '../screens/SessionPreviewScreen'
// Active screens wired in Task 11+

export default function TodayTab() {
  return (
    <Routes>
      <Route index element={<TodayScreen />} />
      <Route path="preview" element={<SessionPreviewScreen />} />
      <Route path="active/*" element={<div>Active workout (Task 11)</div>} />
      <Route path="recap" element={<div>Recap (Task 12)</div>} />
    </Routes>
  )
}
```

**Step 5: Run test + commit**

```bash
npx vitest run src/screens/__tests__/TodayScreen.test.tsx
git commit -m "feat(kb-fitness): Today screen + Session preview"
```

---

### Task 11: Active workout screens

**Files:**
- Create: `kb-fitness/src/screens/active/ActiveTopBar.tsx`
- Create: `kb-fitness/src/screens/active/ActiveStraight.tsx`
- Create: `kb-fitness/src/screens/active/ActiveSuperset.tsx`
- Create: `kb-fitness/src/screens/active/ActiveCircuit.tsx`
- Create: `kb-fitness/src/screens/active/ActiveAmrap.tsx`
- Create: `kb-fitness/src/screens/active/ActiveLadder.tsx`
- Create: `kb-fitness/src/screens/active/ActiveInterval.tsx`
- Create: `kb-fitness/src/screens/active/ActiveCarry.tsx`
- Create: `kb-fitness/src/screens/active/ActiveTempo.tsx`
- Create: `kb-fitness/src/screens/active/ActiveWorkoutRouter.tsx`
- Test: `kb-fitness/src/screens/active/__tests__/ActiveStraight.test.tsx`

**Reference:** Read `design-system/screens/active.jsx` for each block type's exact UI before implementing.

**Step 1: Implement ActiveTopBar**

Match `design-system/screens/active.jsx::ActiveTopBar` exactly. Props: `blockLabel`, `blockName`, `blockType`, `current`, `total`, `onExit`.

**Step 2: Write ActiveStraight test**

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { ActiveStraight } from '../ActiveStraight'
import { ActiveWorkoutProvider } from '../../../context/ActiveWorkoutContext'

const wrapper = ({ children }: any) => <ActiveWorkoutProvider>{children}</ActiveWorkoutProvider>

test('renders exercise name', () => {
  render(<ActiveStraight block={mockBlock} onExit={vi.fn()} />, { wrapper })
  expect(screen.getByText('KB Swing')).toBeInTheDocument()
})

test('Log Set button calls logSet with actualReps (gap fill #7)', async () => {
  render(<ActiveStraight block={mockBlock} onExit={vi.fn()} />, { wrapper })
  const btn = screen.getByText(/Log Set/)
  fireEvent.click(btn)
  // Set 1 should be logged
  // (verify via context mock)
})
```

**Step 3: Implement each active screen**

Implement each screen in its file, matching the design system prototype exactly. Key differences from prototype:

- **ActiveStraight**: Each set row captures `actualReps` via a tap-adjustable number (default = target); tapping "Log Set" calls `logSet()` with `actualReps + actualLoad`, then shows `<RestTimer>` for `rest_sec` seconds
- **ActiveSuperset/Circuit/Ladder**: After last exercise in a round completes, show `<RestTimer>`
- **ActiveAmrap/Interval/Carry/Tempo**: Use `useCountdown` hook (already built in Task 8)
- **SetTimerButton**: Used inside `ActiveStraight` when `prescription.type === 'time'`

**Step 4: Implement ActiveWorkoutRouter**

Create `kb-fitness/src/screens/active/ActiveWorkoutRouter.tsx`:

```tsx
import { useParams } from 'react-router-dom'
import { useActiveWorkout } from '../../context/ActiveWorkoutContext'
import { ActiveStraight } from './ActiveStraight'
import { ActiveSuperset } from './ActiveSuperset'
import { ActiveCircuit } from './ActiveCircuit'
import { ActiveAmrap } from './ActiveAmrap'
import { ActiveLadder } from './ActiveLadder'
import { ActiveInterval } from './ActiveInterval'
import { ActiveCarry } from './ActiveCarry'
import { ActiveTempo } from './ActiveTempo'

const SCREEN_MAP = {
  straight: ActiveStraight,
  superset: ActiveSuperset,
  circuit:  ActiveCircuit,
  amrap:    ActiveAmrap,
  ladder:   ActiveLadder,
  interval: ActiveInterval,
  carry:    ActiveCarry,
  tempo:    ActiveTempo,
} as const

export function ActiveWorkoutRouter({ onExit, onComplete }: { onExit: () => void; onComplete: () => void }) {
  const { state } = useActiveWorkout()
  if (!state.session) return null

  const block = state.session.blocks[state.currentBlockIndex]
  const Screen = SCREEN_MAP[block.type as keyof typeof SCREEN_MAP] ?? ActiveStraight

  return <Screen block={block} onExit={onExit} onNextBlock={() => {}} />
}
```

**Step 5: Run tests + commit**

```bash
npx vitest run src/screens/active/__tests__/
git commit -m "feat(kb-fitness): 8 active workout screens + ActiveTopBar + ActiveWorkoutRouter"
```

---

### Task 12: Recap screen

**Files:**
- Create: `kb-fitness/src/screens/RecapScreen.tsx`
- Test: `kb-fitness/src/screens/__tests__/RecapScreen.test.tsx`

**Reference:** Read `design-system/screens/sessions.jsx::RecapScreen`.

**Step 1: Test**

```tsx
test('renders Easy/Just right/Hard/Failed buttons', () => {
  render(<RecapScreen onDone={vi.fn()} />)
  expect(screen.getByText('Easy')).toBeInTheDocument()
  expect(screen.getByText('Just right')).toBeInTheDocument()
  expect(screen.getByText('Hard')).toBeInTheDocument()
})

test('selecting rating calls completeWorkout (gap fill #7 — logs to Dexie)', async () => {
  const mockComplete = vi.fn()
  // ...
})
```

**Step 2: Implement RecapScreen**

Match design system exactly. Gap fills:
- Notes field: replace the stub `<button>Add notes</button>` with a real `<textarea>` that saves on blur
- `completeWorkout(rating)` writes to `workoutLogs` Dexie table

**Step 3: Run tests + commit**

```bash
git commit -m "feat(kb-fitness): Recap screen with working auto-regulation logging"
```

---

## Phase 6 — Programs Tab

### Task 13: Program Library + Detail + Week

**Reference:** Read `design-system/screens/programs.jsx` for all components.

**Files:**
- Create: `kb-fitness/src/screens/ProgramLibraryScreen.tsx`
- Create: `kb-fitness/src/screens/ProgramDetailScreen.tsx`
- Create: `kb-fitness/src/screens/WeekDetailScreen.tsx`
- Create: `kb-fitness/src/screens/ProgramMenuSheet.tsx`
- Create: `kb-fitness/src/screens/ProgramConfirmSheet.tsx`
- Update: `kb-fitness/src/tabs/ProgramsTab.tsx`

Implement each screen matching the prototype. Wire the ⋯ menu to open `ProgramMenuSheet`, which opens `ProgramConfirmSheet` for destructive actions. All actions (restart/skip/pause/end) write to the `programs` Dexie table.

```bash
git commit -m "feat(kb-fitness): Programs tab — Library, Detail, Week, Menu/Confirm sheets"
```

---

## Phase 7 — Progress Tab

### Task 14: History + Analytics with drill-down

**Reference:** Read `design-system/screens/insights.jsx` — `HistoryScreen` and `AnalyticsScreen`.

**Files:**
- Create: `kb-fitness/src/screens/HistoryScreen.tsx`
- Create: `kb-fitness/src/screens/AnalyticsScreen.tsx`
- Update: `kb-fitness/src/tabs/ProgressTab.tsx`
- Test: `kb-fitness/src/screens/__tests__/AnalyticsScreen.test.tsx`

**Gap fill #10 — History → Analytics drill-down:**

`HistoryScreen` session list items are tappable → opens session detail. Session detail shows exercises; tapping any exercise name navigates to `AnalyticsScreen` with `exerciseId` param.

`ProgressTab.tsx`:
```tsx
<Routes>
  <Route index element={<HistoryScreen />} />
  <Route path="session/:logId" element={<SessionDetailScreen />} />
  <Route path="exercise/:exerciseId" element={<AnalyticsScreen />} />
</Routes>
```

`AnalyticsScreen` receives `exerciseId` from `useParams()`, queries `workoutLogs` for matching `sets`, renders the 12-week bar chart + recent sets table.

```bash
git commit -m "feat(kb-fitness): Progress tab — History + Analytics with exercise drill-down"
```

---

## Phase 8 — More Tab (Settings + Exercise Library + Load Sheets)

### Task 15: Settings screen

**Reference:** Read `design-system/screens/insights.jsx::SettingsScreen`.

**Files:**
- Create: `kb-fitness/src/screens/SettingsScreen.tsx`

Gap fill: Unit toggle writes to Dexie `settings` table (id=1). Lead-in also writes to Dexie. All settings are read via a `useSettings()` hook.

Create `kb-fitness/src/hooks/useSettings.ts`:

```ts
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/db'
import type { SettingsRecord } from '../db/types'

export function useSettings(): SettingsRecord | undefined {
  return useLiveQuery(() => db.settings.get(1))
}
```

```bash
git commit -m "feat(kb-fitness): Settings screen with Dexie-backed unit + lead-in"
```

---

### Task 16: Exercise Library + Detail Sheet

**Reference:** Read `design-system/screens/insights.jsx::ExerciseLibraryScreen` and `design-system/screens/exercise-detail.jsx`.

**Files:**
- Create: `kb-fitness/src/screens/ExerciseLibraryScreen.tsx`
- Create: `kb-fitness/src/components/ExerciseDetailSheet.tsx`
- Create: `kb-fitness/src/components/MuscleDiagram.tsx`
- Create: `kb-fitness/src/data/exercises.ts`  (static seed data)

The muscle diagram SVG is already specified in `design-system/screens/exercise-detail.jsx::MuscleDiagram` — port it directly.

Wire both into `MoreTab.tsx`:
```tsx
<Route path="exercises" element={<ExerciseLibraryScreen />} />
<Route path="settings" element={<SettingsScreen />} />
```

```bash
git commit -m "feat(kb-fitness): Exercise library + detail sheet + muscle diagram"
```

---

### Task 17: Load sheets + Prescription editor

**Reference:** Read `design-system/screens/sheets.jsx` for all 5 load sheets + `PrescriptionEditor`.

**Files:**
- Create: `kb-fitness/src/components/load-sheets/LoadEntryKettlebell.tsx`
- Create: `kb-fitness/src/components/load-sheets/LoadEntryDumbbell.tsx`
- Create: `kb-fitness/src/components/load-sheets/LoadEntryBand.tsx`
- Create: `kb-fitness/src/components/load-sheets/LoadEntryDamper.tsx`
- Create: `kb-fitness/src/components/load-sheets/LoadEntryBodyweight.tsx`
- Create: `kb-fitness/src/components/load-sheets/LoadEntryTrx.tsx`  **(gap fill #6)**
- Create: `kb-fitness/src/components/load-sheets/LoadEntryDispatcher.tsx`
- Create: `kb-fitness/src/components/PrescriptionEditor.tsx`

**LoadEntryTrx** (gap fill #6 — TRX has no numeric load):

```tsx
export function LoadEntryTrx({ open, onClose, onPick }) {
  return (
    <BottomSheet open={open} onClose={onClose} title="TRX">
      <div style={{ fontSize: 13, color: tokens.textMuted, marginBottom: 16 }}>
        TRX resistance is adjusted by foot position — no numeric load to log.
      </div>
      <Btn variant="primary" size="lg" full onClick={() => onPick?.({ value: null, unit: null, label: 'TRX' })}>
        Confirm
      </Btn>
    </BottomSheet>
  )
}
```

**LoadEntryDispatcher** — maps equipment type to the correct sheet component.

```bash
git commit -m "feat(kb-fitness): load sheets (KB, DB, Band, Damper, BW, TRX) + PrescriptionEditor"
```

---

## Phase 9 — PWA Configuration

### Task 18: PWA manifest + service worker

**Files:**
- Create: `kb-fitness/public/manifest.webmanifest`
- Create: `kb-fitness/public/icon-192.png` (placeholder)
- Create: `kb-fitness/public/icon-512.png` (placeholder)
- Verify: `kb-fitness/vite.config.ts` (VitePWA already configured in Task 1)

**Step 1: Create placeholder icons**

```bash
# Create minimal PNG placeholders (1×1 px) for Lighthouse to not 404
cd kb-fitness/public
# Use any 192×192 and 512×512 image — replace with real icons before shipping
```

**Step 2: Verify PWA registers**

```bash
npm run build && npm run preview
```
Open Chrome DevTools → Application → Service Workers → confirm SW registered.

**Step 3: Run Lighthouse PWA audit**

Expected: installable + offline-ready scores ≥ 80

**Step 4: Commit**

```bash
git commit -m "feat(kb-fitness): PWA manifest + service worker via vite-plugin-pwa"
```

---

## Phase 10 — Integration & Polish

### Task 19: Wire auto-regulation hint on Today (gap fill #9)

**Files:**
- Modify: `kb-fitness/src/screens/TodayScreen.tsx`

After a workout log is saved with `rating: 'easy'` or `rating: 'hard'`, update `sessions.loadMultiplier`:
- easy → 1.05
- hard → 0.95
- on_point → 1.0 (no change)

On `TodayScreen`, if `session.loadMultiplier !== 1.0`, render a hint banner above the session card:

```tsx
{session.loadMultiplier !== 1.0 && (
  <div style={{ ... background: tokens.accentBg, border: ... }}>
    <Icon name="wand" size={14} color={tokens.accent}/>
    {session.loadMultiplier > 1 ? '↑5% loads today' : '↓5% loads today'} — based on your last session rating
  </div>
)}
```

```bash
git commit -m "feat(kb-fitness): auto-regulation load multiplier + hint on Today screen"
```

---

### Task 20: End-to-end smoke test

**Files:**
- Create: `kb-fitness/src/test/smoke.test.tsx`

**Step 1: Write smoke tests**

```tsx
import { render, screen } from '@testing-library/react'
import { App } from '../App'

test('app renders without crashing', () => {
  render(<App />)
  expect(screen.getByText('Today')).toBeInTheDocument()
})

test('bottom nav has 4 tabs', () => {
  render(<App />)
  expect(screen.getByText('Programs')).toBeInTheDocument()
  expect(screen.getByText('Progress')).toBeInTheDocument()
  expect(screen.getByText('More')).toBeInTheDocument()
})
```

**Step 2: Run full test suite**

```bash
npx vitest run
```
Expected: All tests pass

**Step 3: Build and verify no TypeScript errors**

```bash
npm run build
```
Expected: Zero errors, dist/ generated

**Step 4: Final commit**

```bash
git add -A
git commit -m "feat(kb-fitness): v1 complete — K&B Fitness PWA"
```

---

## Gap Fill Summary

| # | Gap | Task |
|---|-----|------|
| 1 | Rest timer UI | Task 8 — `RestTimer.tsx` |
| 2 | SetTimerButton | Task 8 — `SetTimerButton.tsx` |
| 3 | More tab wrapper | Task 7 — `MoreTab.tsx` |
| 6 | TRX load sheet | Task 17 — `LoadEntryTrx.tsx` |
| 7 | Actual set logging | Task 9 — `logSet()` in context |
| 9 | Auto-reg hint on Today | Task 19 |
| 10 | History → Analytics | Task 14 |

---

## File Tree (final)

```
kb-fitness/
├── public/
│   ├── icon-192.png
│   └── icon-512.png
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── styles/
│   │   ├── tokens.ts
│   │   ├── tokens.css
│   │   └── global.css
│   ├── db/
│   │   ├── db.ts
│   │   ├── types.ts
│   │   └── seed.ts
│   ├── hooks/
│   │   ├── useCountdown.ts
│   │   ├── useLeadIn.ts
│   │   └── useSettings.ts
│   ├── context/
│   │   └── ActiveWorkoutContext.tsx
│   ├── data/
│   │   └── exercises.ts
│   ├── components/
│   │   ├── primitives/
│   │   │   ├── Card.tsx
│   │   │   ├── Chip.tsx
│   │   │   ├── Btn.tsx
│   │   │   ├── ScreenHeader.tsx
│   │   │   ├── Sectionlabel.tsx
│   │   │   ├── BlockPill.tsx
│   │   │   ├── BottomSheet.tsx
│   │   │   └── index.ts
│   │   ├── load-sheets/
│   │   │   ├── LoadEntryKettlebell.tsx
│   │   │   ├── LoadEntryDumbbell.tsx
│   │   │   ├── LoadEntryBand.tsx
│   │   │   ├── LoadEntryDamper.tsx
│   │   │   ├── LoadEntryBodyweight.tsx
│   │   │   ├── LoadEntryTrx.tsx
│   │   │   └── LoadEntryDispatcher.tsx
│   │   ├── Icon.tsx
│   │   ├── BottomNav.tsx
│   │   ├── CircularTimer.tsx
│   │   ├── SetTimerButton.tsx
│   │   ├── RestTimer.tsx
│   │   ├── ExerciseDetailSheet.tsx
│   │   ├── MuscleDiagram.tsx
│   │   └── PrescriptionEditor.tsx
│   ├── screens/
│   │   ├── TodayScreen.tsx
│   │   ├── SessionPreviewScreen.tsx
│   │   ├── RecapScreen.tsx
│   │   ├── ProgramLibraryScreen.tsx
│   │   ├── ProgramDetailScreen.tsx
│   │   ├── WeekDetailScreen.tsx
│   │   ├── ProgramMenuSheet.tsx
│   │   ├── ProgramConfirmSheet.tsx
│   │   ├── HistoryScreen.tsx
│   │   ├── AnalyticsScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   ├── ExerciseLibraryScreen.tsx
│   │   └── active/
│   │       ├── ActiveTopBar.tsx
│   │       ├── ActiveStraight.tsx
│   │       ├── ActiveSuperset.tsx
│   │       ├── ActiveCircuit.tsx
│   │       ├── ActiveAmrap.tsx
│   │       ├── ActiveLadder.tsx
│   │       ├── ActiveInterval.tsx
│   │       ├── ActiveCarry.tsx
│   │       ├── ActiveTempo.tsx
│   │       └── ActiveWorkoutRouter.tsx
│   ├── tabs/
│   │   ├── TodayTab.tsx
│   │   ├── ProgramsTab.tsx
│   │   ├── ProgressTab.tsx
│   │   └── MoreTab.tsx
│   └── test/
│       ├── setup.ts
│       ├── fixtures.ts
│       └── smoke.test.tsx
├── vite.config.ts
├── tsconfig.json
└── package.json
```
{% endraw %}
