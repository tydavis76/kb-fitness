import { createContext, useContext, useReducer, useCallback } from 'react'
import type { WorkoutSession, LoggedSet, LoadObject } from '../db/types'
import { db } from '../db/db'

/**
 * Internal state type for the context
 */
interface InternalWorkoutState {
  status: 'idle' | 'active' | 'paused' | 'complete'
  session: WorkoutSession | null
  currentBlockIndex: number
  blockStates: Array<{
    blockIndex: number
    completedSets: number
    setData: LoggedSet[]
  }>
  startedAt: number | null
}

/**
 * Action union type
 */
type WorkoutAction =
  | { type: 'START'; session: WorkoutSession; startedAt: number }
  | { type: 'LOG_SET'; set: LoggedSet }
  | { type: 'NEXT_BLOCK' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'COMPLETE' }
  | { type: 'RESET' }
  | { type: 'UPDATE_LOAD'; exerciseId: string; load: LoadObject }

/**
 * Context value type
 */
interface ActiveWorkoutContextValue {
  state: InternalWorkoutState
  startWorkout: (session: WorkoutSession) => Promise<void>
  logSet: (set: LoggedSet) => void
  nextBlock: () => void
  pauseWorkout: () => void
  resumeWorkout: () => void
  completeWorkout: (rating: 'easy' | 'on_point' | 'hard' | 'failed', notes?: string) => Promise<void>
  updateLoad: (exerciseId: string, load: LoadObject) => Promise<void>
}

const ActiveWorkoutContext = createContext<ActiveWorkoutContextValue | undefined>(undefined)

/**
 * Initial state
 */
const initialState: InternalWorkoutState = {
  status: 'idle',
  session: null,
  currentBlockIndex: 0,
  blockStates: [],
  startedAt: null,
}

/**
 * Reducer function
 */
function workoutReducer(state: InternalWorkoutState, action: WorkoutAction): InternalWorkoutState {
  switch (action.type) {
    case 'START': {
      const { session, startedAt } = action
      // Initialize blockStates for each block in the session
      const blockStates = session.blocks.map((_, blockIndex) => ({
        blockIndex,
        completedSets: 0,
        setData: [] as LoggedSet[],
      }))
      return {
        status: 'active',
        session,
        currentBlockIndex: 0,
        blockStates,
        startedAt,
      }
    }
    case 'LOG_SET': {
      if (state.status !== 'active' || state.blockStates.length === 0) {
        return state
      }
      const { set } = action
      const newBlockStates = [...state.blockStates]
      const currentBlock = newBlockStates[state.currentBlockIndex]
      if (!currentBlock) return state

      newBlockStates[state.currentBlockIndex] = {
        ...currentBlock,
        setData: [...currentBlock.setData, set],
        completedSets: currentBlock.completedSets + 1,
      }
      return {
        ...state,
        blockStates: newBlockStates,
      }
    }
    case 'NEXT_BLOCK': {
      if (state.status !== 'active' || !state.session) return state
      const nextIndex = Math.min(state.currentBlockIndex + 1, state.session.blocks.length - 1)
      return {
        ...state,
        currentBlockIndex: nextIndex,
      }
    }
    case 'PAUSE': {
      return {
        ...state,
        status: 'paused',
      }
    }
    case 'RESUME': {
      return {
        ...state,
        status: 'active',
      }
    }
    case 'COMPLETE': {
      return {
        ...state,
        status: 'complete',
      }
    }
    case 'RESET': {
      return initialState
    }
    case 'UPDATE_LOAD': {
      if (!state.session) return state
      const updatedBlocks = state.session.blocks.map(block => ({
        ...block,
        exercises: block.exercises.map(ex =>
          ex.exercise_id === action.exerciseId
            ? { ...ex, prescription: { ...ex.prescription, load: action.load } }
            : ex
        ),
      }))
      return { ...state, session: { ...state.session, blocks: updatedBlocks } }
    }
    default:
      return state
  }
}

/**
 * Provider component
 */
export function ActiveWorkoutProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(workoutReducer, initialState)

  const startWorkout = useCallback(async (session: WorkoutSession) => {
    const startedAt = Date.now()
    dispatch({ type: 'START', session, startedAt })

    // Persist to Dexie for crash recovery
    await db.activeWorkout.put({
      id: 1, // Single active workout record
      sessionId: session.session_id,
      programId: '',
      startedAt,
      pausedAt: null,
      currentBlockIndex: 0,
      blockStates: session.blocks.map((_, blockIndex) => ({
        blockIndex,
        completedSets: 0,
        setData: [],
      })),
    })
  }, [])

  const logSet = useCallback((set: LoggedSet) => {
    dispatch({ type: 'LOG_SET', set })
  }, [])

  const nextBlock = useCallback(() => {
    dispatch({ type: 'NEXT_BLOCK' })
  }, [])

  const pauseWorkout = useCallback(() => {
    dispatch({ type: 'PAUSE' })
  }, [])

  const resumeWorkout = useCallback(() => {
    dispatch({ type: 'RESUME' })
  }, [])

  const completeWorkout = useCallback(async (rating: 'easy' | 'on_point' | 'hard' | 'failed', notes: string = '') => {
    if (!state.session || state.startedAt === null) return

    const completedAt = Date.now()
    const durationSec = Math.floor((completedAt - state.startedAt) / 1000)

    // Flatten all block setData into one array
    const allSets: LoggedSet[] = []
    for (const blockState of state.blockStates) {
      allSets.push(...blockState.setData)
    }

    // Compute totalVolumeKg (sum of reps × kg per set, converting lb→kg)
    let totalVolumeKg = 0
    for (const set of allSets) {
      if (set.actualReps !== null && set.actualLoad && set.actualLoad.value !== null) {
        let weightKg = set.actualLoad.value
        if (set.actualLoad.unit === 'lb') {
          weightKg = set.actualLoad.value / 2.20462 // Convert lb to kg
        }
        totalVolumeKg += set.actualReps * weightKg
      }
    }

    // Write WorkoutLog to Dexie
    await db.workoutLogs.add({
      sessionId: state.session.session_id,
      programId: '',
      completedAt,
      durationSec,
      rating,
      notes,
      totalVolumeKg: totalVolumeKg > 0 ? totalVolumeKg : null,
      sets: allSets,
    })

    // Update load multiplier for auto-regulation on next session
    const multiplier = rating === 'easy' ? 1.05 : rating === 'hard' ? 0.95 : 1.0
    await db.sessions.where('sessionId').equals(state.session.session_id).modify({ loadMultiplier: multiplier })

    // Clear crash recovery
    await db.activeWorkout.delete(1)

    dispatch({ type: 'COMPLETE' })
  }, [state.session, state.startedAt, state.blockStates])

  const updateLoad = useCallback(async (exerciseId: string, load: LoadObject) => {
    dispatch({ type: 'UPDATE_LOAD', exerciseId, load })
    if (!state.session) return
    const record = await db.sessions.where('sessionId').equals(state.session.session_id).first()
    if (!record) return
    const updatedTemplate = {
      ...record.template,
      blocks: record.template.blocks.map(block => ({
        ...block,
        exercises: block.exercises.map(ex =>
          ex.exercise_id === exerciseId
            ? { ...ex, prescription: { ...ex.prescription, load } }
            : ex
        ),
      })),
    }
    await db.sessions.where('sessionId').equals(state.session.session_id).modify({ template: updatedTemplate })
  }, [state.session])

  const value: ActiveWorkoutContextValue = {
    state,
    startWorkout,
    logSet,
    nextBlock,
    pauseWorkout,
    resumeWorkout,
    completeWorkout,
    updateLoad,
  }

  return (
    <ActiveWorkoutContext.Provider value={value}>
      {children}
    </ActiveWorkoutContext.Provider>
  )
}

/**
 * Hook to use the active workout context
 */
export function useActiveWorkout(): ActiveWorkoutContextValue {
  const context = useContext(ActiveWorkoutContext)
  if (context === undefined) {
    throw new Error('useActiveWorkout must be used within ActiveWorkoutProvider')
  }
  return context
}
