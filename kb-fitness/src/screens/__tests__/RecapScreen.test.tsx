import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { RecapScreen } from '../RecapScreen'
import { ActiveWorkoutProvider, useActiveWorkout } from '../../context/ActiveWorkoutContext'
import type { WorkoutSession } from '../../db/types'

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
})
