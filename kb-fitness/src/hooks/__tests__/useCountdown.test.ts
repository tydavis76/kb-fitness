import { renderHook, act } from '@testing-library/react'
import { useCountdown } from '../useCountdown'

test('starts in idle phase', () => {
  const { result } = renderHook(() => useCountdown({ duration: 60 }))
  expect(result.current.phase).toBe('idle')
  expect(result.current.remaining).toBe(60)
})

test('transitions to run on start (no lead-in)', () => {
  const { result } = renderHook(() => useCountdown({ duration: 60, leadIn: 0 }))
  act(() => { result.current.start() })
  expect(result.current.phase).toBe('run')
})

test('transitions to lead on start with lead-in', () => {
  const { result } = renderHook(() => useCountdown({ duration: 60, leadIn: 3 }))
  act(() => { result.current.start() })
  expect(result.current.phase).toBe('lead')
  expect(result.current.leadCount).toBe(3)
})

test('pause stops progression', () => {
  const { result } = renderHook(() => useCountdown({ duration: 60, leadIn: 0 }))
  act(() => { result.current.start() })
  act(() => { result.current.pause() })
  expect(result.current.phase).toBe('paused')
})

test('reset returns to idle', () => {
  const { result } = renderHook(() => useCountdown({ duration: 60, leadIn: 0 }))
  act(() => { result.current.start() })
  act(() => { result.current.reset() })
  expect(result.current.phase).toBe('idle')
  expect(result.current.remaining).toBe(60)
})
