import Dexie, { type Table } from 'dexie'
import type { SetLog, SessionLog } from './types'

export class FitnessDB extends Dexie {
  setLogs!: Table<SetLog>
  sessionLogs!: Table<SessionLog>

  constructor() {
    super('kb-fitness-db')
    this.version(1).stores({
      setLogs:     '++id, date, exerciseId, sessionType, week',
      sessionLogs: '++id, date, sessionType, week',
    })
  }
}

export const db = new FitnessDB()
