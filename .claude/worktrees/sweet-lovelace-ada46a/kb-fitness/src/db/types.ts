export type SessionType =
  | 'strength1' | 'strength2' | 'strength3'
  | 'conditioning1' | 'conditioning2'

export interface SetLog {
  id?: number
  date: string            // ISO "2026-05-02"
  week: number            // 1–8
  sessionType: SessionType
  exerciseId: string
  setNumber: number
  reps: number | null     // null for timed sets
  weight: number | null   // always kg; null for bodyweight
  durationSec: number | null
  notes?: string
  completedAt: string     // ISO timestamp
}

export interface SessionLog {
  id?: number
  date: string
  week: number
  sessionType: SessionType
  durationSec: number
  completedAt: string
}
