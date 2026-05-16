import Dexie, { type Table } from 'dexie'
import type {
  ProgramRecord, SessionRecord, WorkoutLog,
  ActiveWorkoutState, SettingsRecord,
} from './types'

class KBDatabase extends Dexie {
  programs!:      Table<ProgramRecord>
  sessions!:      Table<SessionRecord>
  workoutLogs!:   Table<WorkoutLog>
  activeWorkout!: Table<ActiveWorkoutState>
  settings!:      Table<SettingsRecord>

  constructor() {
    super('kb-fitness')
    this.version(1).stores({
      programs:      '++id, programId, status',
      sessions:      '++id, sessionId, programId',
      workoutLogs:   '++id, sessionId, completedAt, rating',
      activeWorkout: '++id',
      settings:      '++id',
    })
    this.version(2).stores({
      programs:      '++id, programId, status',
      sessions:      '++id, sessionId, programId',
      workoutLogs:   '++id, sessionId, completedAt, rating',
      activeWorkout: '++id',
      settings:      '++id',
    })
    this.version(3).stores({
      programs:      '++id, programId, status',
      sessions:      '++id, sessionId, programId',
      workoutLogs:   '++id, sessionId, completedAt, rating',
      activeWorkout: '++id',
      settings:      '++id',
    })
    this.version(4).stores({
      programs:      '++id, programId, status',
      sessions:      '++id, sessionId, programId',
      workoutLogs:   '++id, sessionId, completedAt, rating',
      activeWorkout: '++id',
      settings:      '++id',
    }).upgrade(tx => {
      return tx.table('settings').toCollection().modify(s => {
        if (!s.ownedKettlebells) s.ownedKettlebells = [16, 20, 24, 32]
      })
    })
    this.version(5).stores({
      programs:      '++id, programId, status',
      sessions:      '++id, sessionId, programId',
      workoutLogs:   '++id, sessionId, completedAt, rating',
      activeWorkout: '++id',
      settings:      '++id',
    }).upgrade(tx => {
      return tx.table('settings').toCollection().modify(s => {
        if (s.sideSwitchSec === undefined) s.sideSwitchSec = 5
      })
    })
  }
}

export const db = new KBDatabase()
