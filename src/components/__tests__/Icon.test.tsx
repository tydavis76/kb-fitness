import { render } from '@testing-library/react'
import { Icon } from '../Icon'

test('renders known icon without error', () => {
  const { container } = render(<Icon name="timer" size={20} />)
  expect(container.firstChild).not.toBeNull()
})

test('renders equipment icon kettlebell', () => {
  const { container } = render(<Icon name="kettlebell" size={24} />)
  expect(container.querySelector('svg')).not.toBeNull()
})

test('renders bodyweight icon', () => {
  const { container } = render(<Icon name="bodyweight" size={20} />)
  expect(container.querySelector('svg')).not.toBeNull()
})

test('renders fallback for unknown icon', () => {
  const { container } = render(<Icon name="nonexistent-icon-xyz" size={20} />)
  expect(container.firstChild).not.toBeNull()
})
