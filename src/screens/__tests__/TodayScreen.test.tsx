import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import React from 'react'
import { vi } from 'vitest'
import { TodayScreen, WeekStrip } from '../TodayScreen'
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

test('WeekStrip does not call onSelect when a rest day is clicked', () => {
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
  fireEvent.click(screen.getByText('We').closest('button')!)
  expect(onSelect).not.toHaveBeenCalled()
})
