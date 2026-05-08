import 'fake-indexeddb/auto'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { FitnessDB } from '../../src/db/schema'
import { db } from '../../src/db/schema'
import type { SetLog, SessionLog } from '../../src/db/types'
import {
  useLastSetLog,
  useExerciseHistory,
  usePersonalBest,
  useCurrentProgress,
} from '../../src/hooks/useDB'

let testDb: FitnessDB

beforeEach(async () => {
  testDb = new FitnessDB()
  await testDb.open()
  await db.setLogs.clear()
  await db.sessionLogs.clear()
})

afterEach(async () => {
  await testDb.delete()
})

describe('FitnessDB schema', () => {
  it('can write and read a SetLog', async () => {
    const log: SetLog = {
      date: '2026-05-02', week: 1, sessionType: 'strength1',
      exerciseId: 'double-kb-squat', setNumber: 1,
      reps: 8, weight: 20, durationSec: null, notes: '', completedAt: new Date().toISOString(),
    }
    const id = await testDb.setLogs.add(log)
    const stored = await testDb.setLogs.get(id)
    expect(stored?.exerciseId).toBe('double-kb-squat')
    expect(stored?.reps).toBe(8)
  })

  it('can write and read a SessionLog', async () => {
    const session: SessionLog = {
      date: '2026-05-02', week: 1, sessionType: 'strength1',
      durationSec: 2400, completedAt: new Date().toISOString(),
    }
    const id = await testDb.sessionLogs.add(session)
    const stored = await testDb.sessionLogs.get(id)
    expect(stored?.sessionType).toBe('strength1')
    expect(stored?.durationSec).toBe(2400)
  })

  it('can query setLogs by exerciseId', async () => {
    await testDb.setLogs.bulkAdd([
      { date: '2026-05-01', week: 1, sessionType: 'strength1', exerciseId: 'gorilla-row', setNumber: 1, reps: 8, weight: 20, durationSec: null, notes: '', completedAt: new Date().toISOString() },
      { date: '2026-05-03', week: 1, sessionType: 'strength1', exerciseId: 'gorilla-row', setNumber: 1, reps: 8, weight: 24, durationSec: null, notes: '', completedAt: new Date().toISOString() },
      { date: '2026-05-03', week: 1, sessionType: 'strength1', exerciseId: 'double-kb-squat', setNumber: 1, reps: 8, weight: 20, durationSec: null, notes: '', completedAt: new Date().toISOString() },
    ])
    const rows = await testDb.setLogs.where('exerciseId').equals('gorilla-row').toArray()
    expect(rows).toHaveLength(2)
  })
})

describe('useLastSetLog', () => {
  it('returns undefined when no logs exist', async () => {
    const { result } = renderHook(() => useLastSetLog('double-kb-squat'))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.log).toBeUndefined()
  })

  it('returns most recent log for exercise', async () => {
    await db.setLogs.bulkAdd([
      { date: '2026-05-01', week: 1, sessionType: 'strength1', exerciseId: 'double-kb-squat', setNumber: 1, reps: 8, weight: 20, durationSec: null, notes: '', completedAt: '2026-05-01T10:00:00Z' },
      { date: '2026-05-02', week: 1, sessionType: 'strength1', exerciseId: 'double-kb-squat', setNumber: 1, reps: 8, weight: 24, durationSec: null, notes: '', completedAt: '2026-05-02T10:00:00Z' },
    ])
    const { result } = renderHook(() => useLastSetLog('double-kb-squat'))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.log?.weight).toBe(24)
  })
})

describe('useExerciseHistory', () => {
  it('returns sorted logs for exercise', async () => {
    await db.setLogs.bulkAdd([
      { date: '2026-05-01', week: 1, sessionType: 'strength1', exerciseId: 'gorilla-row', setNumber: 1, reps: 8, weight: 20, durationSec: null, notes: '', completedAt: '2026-05-01T10:00:00Z' },
      { date: '2026-05-02', week: 2, sessionType: 'strength1', exerciseId: 'gorilla-row', setNumber: 1, reps: 8, weight: 24, durationSec: null, notes: '', completedAt: '2026-05-02T10:00:00Z' },
    ])
    const { result } = renderHook(() => useExerciseHistory('gorilla-row'))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.logs).toHaveLength(2)
    expect(result.current.logs[0].date).toBe('2026-05-01')
  })
})

describe('usePersonalBest', () => {
  it('returns highest weight x reps set', async () => {
    await db.setLogs.bulkAdd([
      { date: '2026-05-01', week: 1, sessionType: 'strength1', exerciseId: 'kb-swing', setNumber: 1, reps: 10, weight: 16, durationSec: null, notes: '', completedAt: '2026-05-01T10:00:00Z' },
      { date: '2026-05-02', week: 2, sessionType: 'strength1', exerciseId: 'kb-swing', setNumber: 1, reps: 10, weight: 24, durationSec: null, notes: '', completedAt: '2026-05-02T10:00:00Z' },
    ])
    const { result } = renderHook(() => usePersonalBest('kb-swing'))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.best?.weight).toBe(24)
  })
})

describe('useCurrentProgress', () => {
  it('returns week 1 strength1 when no sessions completed', async () => {
    const { result } = renderHook(() => useCurrentProgress())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.week).toBe(1)
    expect(result.current.sessionType).toBe('strength1')
  })

  it('advances to week 2 after 5 sessions', async () => {
    const sessions = ['strength1','conditioning1','strength2','conditioning2','strength3'] as const
    await db.sessionLogs.bulkAdd(sessions.map((s, i) => ({
      date: `2026-04-0${i + 1}`,
      week: 1,
      sessionType: s,
      durationSec: 3600,
      completedAt: `2026-04-0${i + 1}T10:00:00Z`,
    })))
    const { result } = renderHook(() => useCurrentProgress())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.week).toBe(2)
    expect(result.current.sessionType).toBe('strength1')
  })
})
