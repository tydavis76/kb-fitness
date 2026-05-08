import { render, screen } from '@testing-library/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { ActiveStraight } from '../ActiveStraight'
import { ActiveWorkoutProvider } from '../../../context/ActiveWorkoutContext'
import { mockSession } from '../../../test/fixtures'
import { describe, it, expect, vi } from 'vitest'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ActiveWorkoutProvider>
    <MemoryRouter>
      {children}
    </MemoryRouter>
  </ActiveWorkoutProvider>
)

describe('ActiveStraight', () => {
  it('renders exercise name', () => {
    const block = mockSession.blocks[0]
    render(<ActiveStraight block={block} onExit={vi.fn()} onNextBlock={vi.fn()} />, { wrapper })
    expect(screen.getByText('KB Swing')).toBeInTheDocument()
  })

  it('renders Log Set button', () => {
    const block = mockSession.blocks[0]
    render(<ActiveStraight block={block} onExit={vi.fn()} onNextBlock={vi.fn()} />, { wrapper })
    expect(screen.getByText(/Log Set/i)).toBeInTheDocument()
  })
})
