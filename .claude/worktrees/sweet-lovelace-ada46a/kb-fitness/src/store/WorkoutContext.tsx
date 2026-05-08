import { createContext, useContext, useState, type ReactNode } from 'react'
import type { ProgramSession } from '../data/program'

interface WorkoutContextValue {
  activeSession: ProgramSession | null
  startSession: (session: ProgramSession) => void
  clearSession: () => void
}

const WorkoutContext = createContext<WorkoutContextValue | null>(null)

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const [activeSession, setActiveSession] = useState<ProgramSession | null>(null)
  return (
    <WorkoutContext.Provider value={{
      activeSession,
      startSession: setActiveSession,
      clearSession: () => setActiveSession(null),
    }}>
      {children}
    </WorkoutContext.Provider>
  )
}

export function useWorkoutContext() {
  const ctx = useContext(WorkoutContext)
  if (!ctx) throw new Error('useWorkoutContext must be used within WorkoutProvider')
  return ctx
}
