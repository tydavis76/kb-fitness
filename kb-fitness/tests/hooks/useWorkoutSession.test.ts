import 'fake-indexeddb/auto'
import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { db } from '../../src/db/schema'
import { useWorkoutSession } from '../../src/hooks/useWorkoutSession'
import { getSession } from '../../src/data/program'

beforeEach(async () => {
  await db.setLogs.clear()
  await db.sessionLogs.clear()
})

const session = getSession(1, 'strength1')

describe('useWorkoutSession', () => {
  it('starts in WORK phase at block 0 exercise 0 set 1', () => {
    const { result } = renderHook(() => useWorkoutSession(session))
    expect(result.current.phase).toBe('work')
    expect(result.current.currentBlockIndex).toBe(0)
    expect(result.current.currentSet).toBe(1)
  })

  it('transitions to REST after markSetComplete', async () => {
    const { result } = renderHook(() => useWorkoutSession(session))
    await act(async () => { await result.current.markSetComplete(8, 20) })
    expect(result.current.phase).toBe('rest')
  })

  it('writes a SetLog row on markSetComplete', async () => {
    const { result } = renderHook(() => useWorkoutSession(session))
    await act(async () => { await result.current.markSetComplete(8, 24) })
    const logs = await db.setLogs.toArray()
    expect(logs).toHaveLength(1)
    expect(logs[0].reps).toBe(8)
    expect(logs[0].weight).toBe(24)
  })

  it('advances to next set after skipRest', async () => {
    const { result } = renderHook(() => useWorkoutSession(session))
    await act(async () => { await result.current.markSetComplete(8, 20) })
    act(() => { result.current.skipRest() })
    expect(result.current.phase).toBe('work')
    expect(result.current.currentSet).toBe(2)
  })
})
