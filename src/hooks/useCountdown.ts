import { useReducer, useEffect, useCallback } from 'react'

interface State {
  phase: 'idle' | 'lead' | 'run' | 'paused' | 'done'
  remaining: number   // seconds left in run phase
  total: number       // original duration (for ring percentage)
  leadCount: number   // current lead-in countdown display
}

type Action =
  | { type: 'START'; payload: { leadIn: number } }
  | { type: 'TICK' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'RESET'; payload: { duration: number } }

interface UseCountdownOptions {
  duration: number
  leadIn?: number
  onComplete?: () => void
}

const createInitialState = (duration: number): State => ({
  phase: 'idle',
  remaining: duration,
  total: duration,
  leadCount: 0,
})

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'START': {
      const { leadIn } = action.payload
      if (leadIn > 0) {
        return {
          ...state,
          phase: 'lead',
          leadCount: leadIn,
        }
      }
      return {
        ...state,
        phase: 'run',
      }
    }

    case 'TICK': {
      if (state.phase === 'lead') {
        const newLeadCount = state.leadCount - 1
        if (newLeadCount <= 0) {
          return {
            ...state,
            phase: 'run',
            leadCount: 0,
          }
        }
        return {
          ...state,
          leadCount: newLeadCount,
        }
      }

      if (state.phase === 'run') {
        const newRemaining = state.remaining - 1
        if (newRemaining <= 0) {
          return {
            ...state,
            remaining: 0,
            phase: 'done',
          }
        }
        return {
          ...state,
          remaining: newRemaining,
        }
      }

      return state
    }

    case 'PAUSE': {
      if (state.phase === 'run' || state.phase === 'lead') {
        return {
          ...state,
          phase: 'paused',
        }
      }
      return state
    }

    case 'RESUME': {
      if (state.phase === 'paused') {
        if (state.remaining === 0) {
          return {
            ...state,
            phase: 'done',
          }
        }
        return {
          ...state,
          phase: 'run',
        }
      }
      return state
    }

    case 'RESET': {
      return createInitialState(action.payload.duration)
    }

    default:
      return state
  }
}

export const useCountdown = (options: UseCountdownOptions) => {
  const { duration, leadIn = 0, onComplete } = options
  const [state, dispatch] = useReducer(
    reducer,
    createInitialState(duration),
  )

  // Drive the interval when running or in lead phase
  useEffect(() => {
    if (state.phase !== 'run' && state.phase !== 'lead') {
      return
    }

    const interval = setInterval(() => {
      dispatch({ type: 'TICK' })
    }, 1000)

    return () => clearInterval(interval)
  }, [state.phase])

  // Call onComplete when phase transitions to done
  useEffect(() => {
    if (state.phase === 'done' && onComplete) {
      onComplete()
    }
  }, [state.phase, onComplete])

  const start = useCallback(() => {
    dispatch({ type: 'START', payload: { leadIn } })
  }, [leadIn])

  const pause = useCallback(() => {
    dispatch({ type: 'PAUSE' })
  }, [])

  const resume = useCallback(() => {
    dispatch({ type: 'RESUME' })
  }, [])

  const reset = useCallback(() => {
    dispatch({ type: 'RESET', payload: { duration } })
  }, [duration])

  return {
    phase: state.phase,
    remaining: state.remaining,
    total: state.total,
    leadCount: state.leadCount,
    isRunning: state.phase === 'run' || state.phase === 'lead',
    start,
    pause,
    resume,
    reset,
  }
}
