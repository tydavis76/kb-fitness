import { render, screen } from '@testing-library/react'
import { App } from '../App'

// Mock Dexie modules to avoid IndexedDB in test env
vi.mock('../db/db', () => ({
  db: {
    programs:     { where: vi.fn().mockReturnValue({ equals: vi.fn().mockReturnValue({ first: vi.fn().mockResolvedValue(null) }) }) },
    sessions:     { where: vi.fn().mockReturnValue({ equals: vi.fn().mockReturnValue({ first: vi.fn().mockResolvedValue(null) }) }) },
    workoutLogs:  { where: vi.fn().mockReturnValue({ above: vi.fn().mockReturnValue({ reverse: vi.fn().mockReturnValue({ sortBy: vi.fn().mockResolvedValue([]) }) }) }), add: vi.fn() },
    activeWorkout:{ put: vi.fn(), delete: vi.fn() },
    settings:     { get: vi.fn().mockResolvedValue({ id: 1, unit: 'lb', leadIn: 5, sound: true, haptics: true, restDefaults: { straight: 90, superset: 90, circuit: 60 } }) },
  },
}))

vi.mock('../db/seed', () => ({ seedIfNeeded: vi.fn().mockResolvedValue(undefined) }))

test('app renders without crashing', () => {
  render(<App />)
  expect(document.body).not.toBeEmptyDOMElement()
})

test('bottom nav has 4 tabs', () => {
  render(<App />)
  expect(screen.getByText('Today')).toBeInTheDocument()
  expect(screen.getByText('Programs')).toBeInTheDocument()
  expect(screen.getByText('Progress')).toBeInTheDocument()
  expect(screen.getByText('More')).toBeInTheDocument()
})
