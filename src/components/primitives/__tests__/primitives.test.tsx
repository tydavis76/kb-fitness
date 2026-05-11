import { render, screen } from '@testing-library/react'
import { describe, test, expect, vi } from 'vitest'
import { Card } from '../Card'
import { Chip } from '../Chip'
import { Btn } from '../Btn'
import { ScreenHeader } from '../ScreenHeader'
import { BlockPill } from '../BlockPill'

describe('Card', () => {
  test('Card renders children', () => {
    render(<Card>hello</Card>)
    expect(screen.getByText('hello')).toBeInTheDocument()
  })
})

describe('Chip', () => {
  test('Chip renders label', () => {
    render(<Chip>PHASE 1</Chip>)
    expect(screen.getByText('PHASE 1')).toBeInTheDocument()
  })

  test('Chip tone=accent applies accent class', () => {
    const { container } = render(<Chip tone="accent">test</Chip>)
    expect(container.firstChild).toHaveClass('chip--accent')
  })
})

describe('Btn', () => {
  test('Btn renders label and handles click', async () => {
    const onClick = vi.fn()
    render(<Btn onClick={onClick}>Start</Btn>)
    screen.getByText('Start').click()
    expect(onClick).toHaveBeenCalled()
  })
})

describe('ScreenHeader', () => {
  test('ScreenHeader renders title', () => {
    render(<ScreenHeader title="Today" />)
    expect(screen.getByText('Today')).toBeInTheDocument()
  })
})

describe('BlockPill', () => {
  test('BlockPill renders correct label for straight type', () => {
    render(<BlockPill type="straight" />)
    expect(screen.getByText('SETS')).toBeInTheDocument()
  })

  test('BlockPill renders AMRAP for amrap type', () => {
    render(<BlockPill type="amrap" />)
    expect(screen.getByText('AMRAP')).toBeInTheDocument()
  })
})
