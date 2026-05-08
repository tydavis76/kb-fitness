import { useState, useEffect } from 'react'
import { db } from '../db/schema'
import type { SetLog, SessionLog } from '../db/types'
import { progressFromCompletedSessions } from '../data/program'
import type { SessionType } from '../db/types'

export function useLastSetLog(exerciseId: string) {
  const [log, setLog] = useState<SetLog | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    db.setLogs.where('exerciseId').equals(exerciseId).sortBy('completedAt').then(logs => {
      setLog(logs[logs.length - 1])
      setLoading(false)
    })
  }, [exerciseId])
  return { log, loading }
}

export function useExerciseHistory(exerciseId: string) {
  const [logs, setLogs] = useState<SetLog[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    db.setLogs.where('exerciseId').equals(exerciseId).sortBy('completedAt').then(result => {
      setLogs(result)
      setLoading(false)
    })
  }, [exerciseId])
  return { logs, loading }
}

export function usePersonalBest(exerciseId: string) {
  const [best, setBest] = useState<SetLog | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    db.setLogs.where('exerciseId').equals(exerciseId).toArray().then(logs => {
      const withWeight = logs.filter(l => l.weight !== null && l.reps !== null)
      const top = withWeight.sort((a, b) => (b.weight! * b.reps!) - (a.weight! * a.reps!))[0]
      setBest(top)
      setLoading(false)
    })
  }, [exerciseId])
  return { best, loading }
}

export function useSessionLogs(week?: number) {
  const [logs, setLogs] = useState<SessionLog[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const query = week !== undefined
      ? db.sessionLogs.where('week').equals(week)
      : db.sessionLogs.toCollection()
    query.sortBy('completedAt').then(result => {
      setLogs(result)
      setLoading(false)
    })
  }, [week])
  return { logs, loading }
}

export function useCurrentProgress() {
  const [result, setResult] = useState({ week: 1, sessionType: 'strength1' as SessionType, sessionIndexInWeek: 0, loading: true })
  useEffect(() => {
    db.sessionLogs.count().then(count => {
      const progress = progressFromCompletedSessions(count)
      setResult({ ...progress, loading: false })
    })
  }, [])
  return result
}
