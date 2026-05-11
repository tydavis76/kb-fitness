import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import { RecapScreen } from '../RecapScreen'
import { ActiveWorkoutProvider, useActiveWorkout } from '../../context/ActiveWorkoutContext'
import type { WorkoutSession } from '../../db/types'
import * as dbModule from '../../db/db'

// Mock the db module
vi.mock('../../db/db', () => ({
  db: {
    activeWorkout: {
      put: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn().mockResolvedValue(undefined),
    },
    workoutLogs: {
      add: vi.fn().mockResolvedValue(undefined),
    },
  },
}))

// Mock component to set up the active workout state
function MockWrapper({ children }: { children: React.ReactNode }) {
  return (
    <MemoryRouter>
      <ActiveWorkoutProvider>
        <SetupMockWorkout>{children}</SetupMockWorkout>
      </ActiveWorkoutProvider>
    </MemoryRouter>
  )
}

function SetupMockWorkout({ children }: { children: React.ReactNode }) {
  const { startWorkout } = useActiveWorkout()

  // Set up mock session on mount
  React.useEffect(() => {
    const mockSession: WorkoutSession = {
      session_id: 'test-session',
      metadata: {
        title: 'Test Workout',
      },
      blocks: [
        {
          type: 'straight',
          label: 'A',
          name: 'Block A',
          exercises: [
            {
              exercise_id: 'ex1',
              name: 'Exercise 1',
              prescription: { type: 'reps', target: 10, load: { value: 20, unit: 'kg', label: '20 kg' } },
            },
          ],
        },
        {
          type: 'straight',
          label: 'B',
          name: 'Block B',
          exercises: [
            {
              exercise_id: 'ex2',
              name: 'Exercise 2',
              prescription: { type: 'reps', target: 8, load: { value: 25, unit: 'kg', label: '25 kg' } },
            },
          ],
        },
      ],
    }
    startWorkout(mockSession)
  }, [startWorkout])

  return <>{children}</>
}

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MockWrapper>{children}</MockWrapper>
)

import React from 'react'

describe('RecapScreen', () => {
  test('renders Easy/Just right/Hard/Failed buttons', () => {
    render(<RecapScreen />, { wrapper })
    expect(screen.getByText('Easy')).toBeInTheDocument()
    expect(screen.getByText('Just right')).toBeInTheDocument()
    expect(screen.getByText('Hard')).toBeInTheDocument()
    expect(screen.getByText('Failed')).toBeInTheDocument()
  })

  test('selecting a rating highlights it', async () => {
    render(<RecapScreen />, { wrapper })
    const btn = screen.getByText('Just right').closest('button') as HTMLElement
    fireEvent.click(btn)
    // Check for aria-pressed state
    expect(btn).toHaveAttribute('aria-pressed', 'true')
  })

  test('renders textarea for notes', () => {
    render(<RecapScreen />, { wrapper })
    const textarea = screen.getByPlaceholderText(/add notes/i)
    expect(textarea).toBeInTheDocument()
  })

  test('renders Done button', () => {
    render(<RecapScreen />, { wrapper })
    const doneBtn = screen.getByText(/done/i)
    expect(doneBtn).toBeInTheDocument()
  })

  test('selecting rating and clicking Done calls completeWorkout with correct rating', async () => {
    // Clear mocks before test
    vi.clearAllMocks()

    render(<RecapScreen />, { wrapper })

    // Select "Just right" rating
    const justRightBtn = screen.getByText('Just right').closest('button') as HTMLElement
    fireEvent.click(justRightBtn)

    // Verify button is selected
    expect(justRightBtn).toHaveAttribute('aria-pressed', 'true')

    // Click Done button
    const doneBtn = screen.getByText(/done/i) as HTMLElement
    fireEvent.click(doneBtn)

    // Wait for the async completeWorkout to finish
    await waitFor(() => {
      // Verify that db.workoutLogs.add was called (which is called by completeWorkout)
      expect(dbModule.db.workoutLogs.add).toHaveBeenCalled()
    })

    // Verify the call to db.workoutLogs.add includes the 'on_point' rating
    // (the 'on_point' id maps to 'Just right' label)
    const addCall = (dbModule.db.workoutLogs.add as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(addCall[0]).toMatchObject({
      rating: 'on_point',
      notes: '',
    })
  })
})
