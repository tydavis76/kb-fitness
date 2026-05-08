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
