import { useState, useCallback } from 'react'
import { db } from '../db/schema'
import type { ProgramSession } from '../data/program'

export type WorkoutPhase = 'work' | 'rest' | 'amrap' | 'complete'

export interface WorkoutSessionState {
  phase: WorkoutPhase
  currentBlockIndex: number
  currentExerciseIndex: number
  currentSet: number
  startedAt: number
  markSetComplete: (reps: number | null, weight: number | null, durationSec?: number | null) => Promise<void>
  markAmrapComplete: (totalReps: number) => Promise<void>
  skipRest: () => void
  finishSession: () => Promise<void>
}

interface Position {
  blockIndex: number
  exerciseIndex: number
  setNum: number
}

function advancePosition(session: ProgramSession, pos: Position): { next: Position; phase: WorkoutPhase } {
  const block = session.blocks[pos.blockIndex]

  if (block.type === 'superset') {
    // Interleave: finish all exercises in the round before incrementing set number
    const nextExerciseIndex = pos.exerciseIndex + 1
    if (nextExerciseIndex < block.sets.length) {
      return { next: { blockIndex: pos.blockIndex, exerciseIndex: nextExerciseIndex, setNum: pos.setNum }, phase: 'rest' }
    }
    const totalSets = parseInt(block.sets[0].sets.split('-')[0], 10) || 1
    if (pos.setNum < totalSets) {
      return { next: { blockIndex: pos.blockIndex, exerciseIndex: 0, setNum: pos.setNum + 1 }, phase: 'rest' }
    }
  } else {
    const totalSetsInExercise = parseInt(block.sets[pos.exerciseIndex].sets.split('-')[0], 10) || 1
    if (pos.setNum < totalSetsInExercise) {
      return { next: { ...pos, setNum: pos.setNum + 1 }, phase: 'rest' }
    }
    const nextExerciseIndex = pos.exerciseIndex + 1
    if (nextExerciseIndex < block.sets.length) {
      return { next: { blockIndex: pos.blockIndex, exerciseIndex: nextExerciseIndex, setNum: 1 }, phase: 'rest' }
    }
  }

  const nextBlockIndex = pos.blockIndex + 1
  if (nextBlockIndex < session.blocks.length) {
    const nextBlock = session.blocks[nextBlockIndex]
    if (nextBlock.type === 'amrap') {
      return { next: { blockIndex: nextBlockIndex, exerciseIndex: 0, setNum: 1 }, phase: 'amrap' }
    }
    return { next: { blockIndex: nextBlockIndex, exerciseIndex: 0, setNum: 1 }, phase: 'work' }
  }

  return { next: pos, phase: 'complete' }
}

export function useWorkoutSession(session: ProgramSession): WorkoutSessionState {
  const [phase, setPhase] = useState<WorkoutPhase>('work')
  const [pos, setPos] = useState<Position>({ blockIndex: 0, exerciseIndex: 0, setNum: 1 })
  const [startedAt] = useState(() => Date.now())

  const markSetComplete = useCallback(async (
    reps: number | null,
    weight: number | null,
    durationSec: number | null = null,
  ) => {
    const now = new Date()
    const block = session.blocks[pos.blockIndex]
    const exerciseId = block.sets[pos.exerciseIndex].exerciseId

    await db.setLogs.add({
      date: now.toISOString().slice(0, 10),
      week: 1,
      sessionType: session.type,
      exerciseId,
      setNumber: pos.setNum,
      reps,
      weight,
      durationSec,
      completedAt: now.toISOString(),
    })

    const { phase: nextPhase } = advancePosition(session, pos)
    setPhase(nextPhase)
  }, [session, pos])

  const markAmrapComplete = useCallback(async (totalReps: number) => {
    const now = new Date()
    const block = session.blocks[pos.blockIndex]
    const exerciseId = block.sets[pos.exerciseIndex]?.exerciseId ?? ''

    await db.setLogs.add({
      date: now.toISOString().slice(0, 10),
      week: 1,
      sessionType: session.type,
      exerciseId,
      setNumber: 1,
      reps: totalReps,
      weight: null,
      durationSec: null,
      completedAt: now.toISOString(),
    })

    const nextBlockIndex = pos.blockIndex + 1
    if (nextBlockIndex < session.blocks.length) {
      setPos({ blockIndex: nextBlockIndex, exerciseIndex: 0, setNum: 1 })
      setPhase('work')
    } else {
      setPhase('complete')
    }
  }, [session, pos])

  const skipRest = useCallback(() => {
    const { next, phase: nextPhase } = advancePosition(session, pos)
    setPos(next)
    setPhase(nextPhase === 'rest' ? 'work' : nextPhase)
  }, [session, pos])

  const finishSession = useCallback(async () => {
    const now = new Date()
    const durationSec = Math.round((Date.now() - startedAt) / 1000)

    await db.sessionLogs.add({
      date: now.toISOString().slice(0, 10),
      week: 1,
      sessionType: session.type,
      durationSec,
      completedAt: now.toISOString(),
    })

    setPhase('complete')
  }, [session, startedAt])

  return {
    phase,
    currentBlockIndex: pos.blockIndex,
    currentExerciseIndex: pos.exerciseIndex,
    currentSet: pos.setNum,
    startedAt,
    markSetComplete,
    markAmrapComplete,
    skipRest,
    finishSession,
  }
}
