import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import React from 'react'
import { TodayScreen } from '../TodayScreen'
import { ActiveWorkoutProvider } from '../../context/ActiveWorkoutContext'
import { vi } from 'vitest'

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

test('renders without crashing', () => {
  render(<TodayScreen />, { wrapper: Wrapper })
  expect(document.body).not.toBeEmptyDOMElement()
})
