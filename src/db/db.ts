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
    }).upgrade(() => {
      localStorage.removeItem('kb.seeded')
    })
  }
}

export const db = new KBDatabase()
