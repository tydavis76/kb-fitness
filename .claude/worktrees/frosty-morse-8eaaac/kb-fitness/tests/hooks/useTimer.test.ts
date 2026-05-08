import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useTimer } from '../../src/hooks/useTimer'

beforeEach(() => { vi.useFakeTimers() })
afterEach(() => { vi.useRealTimers() })

describe('useTimer', () => {
  it('initializes with given duration', () => {
    const { result } = renderHook(() => useTimer(30, vi.fn()))
    expect(result.current.remaining).toBe(30)
    expect(result.current.isRunning).toBe(false)
  })

  it('counts down when started', () => {
    const onComplete = vi.fn()
    const { result } = renderHook(() => useTimer(10, onComplete))
    act(() => { result.current.resume() })
    act(() => { vi.advanceTimersByTime(3000) })
    expect(result.current.remaining).toBeLessThanOrEqual(7)
  })

  it('calls onComplete when reaching 0', () => {
    const onComplete = vi.fn()
    const { result } = renderHook(() => useTimer(2, onComplete))
    act(() => { result.current.resume() })
    act(() => { vi.advanceTimersByTime(3000) })
    expect(onComplete).toHaveBeenCalledOnce()
  })

  it('pause stops countdown', () => {
    const { result } = renderHook(() => useTimer(10, vi.fn()))
    act(() => { result.current.resume() })
    act(() => { vi.advanceTimersByTime(2000) })
    act(() => { result.current.pause() })
    const remainingAfterPause = result.current.remaining
    act(() => { vi.advanceTimersByTime(2000) })
    expect(result.current.remaining).toBe(remainingAfterPause)
  })

  it('reset restores original duration', () => {
    const { result } = renderHook(() => useTimer(10, vi.fn()))
    act(() => { result.current.resume() })
    act(() => { vi.advanceTimersByTime(3000) })
    act(() => { result.current.reset(10) })
    expect(result.current.remaining).toBe(10)
    expect(result.current.isRunning).toBe(false)
  })
})
