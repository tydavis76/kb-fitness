import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Stepper } from '../../src/components/Stepper'

describe('Stepper', () => {
  it('displays value', () => {
    render(<Stepper value={8} onDecrement={vi.fn()} onIncrement={vi.fn()} />)
    expect(screen.getByText('8')).toBeInTheDocument()
  })

  it('calls onIncrement when + clicked', async () => {
    const onIncrement = vi.fn()
    render(<Stepper value={8} onDecrement={vi.fn()} onIncrement={onIncrement} />)
    await userEvent.click(screen.getByRole('button', { name: '+' }))
    expect(onIncrement).toHaveBeenCalledOnce()
  })

  it('calls onDecrement when − clicked', async () => {
    const onDecrement = vi.fn()
    render(<Stepper value={8} onDecrement={onDecrement} onIncrement={vi.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: '−' }))
    expect(onDecrement).toHaveBeenCalledOnce()
  })

  it('shows unit label when provided', () => {
    render(<Stepper value={24} onDecrement={vi.fn()} onIncrement={vi.fn()} unit="kg" />)
    expect(screen.getByText('kg')).toBeInTheDocument()
  })
})
