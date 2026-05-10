import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { vi } from 'vitest'
import { AnalyticsScreen } from '../AnalyticsScreen'
import type { WorkoutLog } from '../../db/types'

// Mock dexie-react-hooks so we control what useLiveQuery returns
vi.mock('dexie-react-hooks', () => ({
  useLiveQuery: vi.fn(),
}))

// Mock db to avoid real IndexedDB in tests
vi.mock('../../db/db', () => ({
  db: {
    workoutLogs: {
      orderBy: vi.fn().mockReturnValue({
        toArray: vi.fn().mockResolvedValue([]),
      }),
    },
  },
}))

import { useLiveQuery } from 'dexie-react-hooks'

const mockUseLiveQuery = vi.mocked(useLiveQuery)

function renderAnalytics(exerciseId: string) {
  return render(
    <MemoryRouter initialEntries={[`/progress/exercise/${exerciseId}`]}>
      <Routes>
        <Route path="/progress/exercise/:exerciseId" element={<AnalyticsScreen />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('AnalyticsScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders the exercise name as the screen title when no logs exist', () => {
    mockUseLiveQuery.mockReturnValue([] as WorkoutLog[])

    renderAnalytics('kettlebell-swing')

    expect(screen.getByText('kettlebell-swing')).toBeInTheDocument()
    expect(screen.getByText(/12-week volume trend/i)).toBeInTheDocument()
  })

  test('renders the bar chart with 12 bars', () => {
    mockUseLiveQuery.mockReturnValue([] as WorkoutLog[])

    renderAnalytics('kb-press')

    // The chart wrapper has data-testid="weekly-bar-chart"
    const chart = screen.getByTestId('weekly-bar-chart')
    expect(chart).toBeInTheDocument()

    // Should render exactly 12 week labels (w1 through w12)
    expect(screen.getByText('w1')).toBeInTheDocument()
    expect(screen.getByText('w12')).toBeInTheDocument()
  })

  test('renders "No logged sets found" empty state when exercise has no sets', () => {
    mockUseLiveQuery.mockReturnValue([] as WorkoutLog[])

    renderAnalytics('goblet-squat')

    expect(screen.getByText(/No logged sets found/i)).toBeInTheDocument()
  })

  test('displays top working load from logs for the given exercise', () => {
    const mockLogs: WorkoutLog[] = [
      {
        id: 1,
        sessionId: 'session-A',
        programId: 'prog-1',
        completedAt: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
        durationSec: 3600,
        rating: 'on_point',
        notes: '',
        totalVolumeKg: 500,
        sets: [
          {
            exerciseId: 'kb-swing',
            setIndex: 0,
            actualReps: 10,
            actualLoad: { value: 32, unit: 'kg', label: '32 kg' },
            completedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
          },
          {
            exerciseId: 'kb-swing',
            setIndex: 1,
            actualReps: 10,
            actualLoad: { value: 28, unit: 'kg', label: '28 kg' },
            completedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
          },
        ],
      },
    ]

    mockUseLiveQuery.mockReturnValue(mockLogs)

    renderAnalytics('kb-swing')

    // Top load should be 32 kg
    expect(screen.getByText('32')).toBeInTheDocument()

    // Recent sets row should appear
    expect(screen.getByText('Recent sets')).toBeInTheDocument()
  })

  test('displays recent set rows grouped by session', () => {
    const now = Date.now()
    const mockLogs: WorkoutLog[] = [
      {
        id: 2,
        sessionId: 'session-B',
        programId: 'prog-1',
        completedAt: now - 3 * 24 * 60 * 60 * 1000,
        durationSec: 2400,
        rating: 'easy',
        notes: '',
        totalVolumeKg: 320,
        sets: [
          {
            exerciseId: 'deadlift',
            setIndex: 0,
            actualReps: 5,
            actualLoad: { value: 60, unit: 'kg', label: '60 kg' },
            completedAt: now - 3 * 24 * 60 * 60 * 1000,
          },
        ],
      },
    ]

    mockUseLiveQuery.mockReturnValue(mockLogs)

    renderAnalytics('deadlift')

    // Should show the set's top load
    expect(screen.getByText('60 kg')).toBeInTheDocument()
    // Volume = 5 * 60 = 300 kg
    expect(screen.getByText('300 kg')).toBeInTheDocument()
  })
})
