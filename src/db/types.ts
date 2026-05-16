// WorkoutSessionV2 schema types — matches programs/8-week-kettlebell-program.json

export interface LoadObject {
  value: number | null
  unit: string | null
  label: string
}

export interface Prescription {
  type: 'reps' | 'time' | 'distance' | 'failure'
  target: string | number
  load: LoadObject
}

export interface ProtocolConstraints {
  tempo?: string
  cues?: string[]
}

export interface ExerciseInstance {
  exercise_id: string
  name: string
  sub_label?: string
  prescription: Prescription
  protocol_constraints?: ProtocolConstraints
  ladder?: { rungs: Array<{ reps: number; load: LoadObject }> }
}

export interface WorkoutBlock {
  type: 'straight' | 'superset' | 'circuit' | 'amrap' | 'ladder' | 'interval' | 'carry' | 'tempo'
  label?: string
  name?: string
  rounds?: number
  rest_sec?: number
  duration_sec?: number
  exercises: ExerciseInstance[]
}

export interface WorkoutSession {
  session_id: string
  metadata: {
    title: string
    environment?: 'Home' | 'Gym' | 'Travel'
    tags?: string[]
  }
  blocks: WorkoutBlock[]
}

export interface ProgramRecord {
  id?: number
  programId: string
  title: string
  author: string
  phases: Array<{ id: string; name: string; weeks: number; description: string }>
  weeklyStructure: Record<string, string>
  status: 'active' | 'paused' | 'archived'
  phaseIndex: number
  weekIndex: number
  dayIndex: number
  startedAt: number
}

export interface SessionRecord {
  id?: number
  sessionId: string
  programId: string
  template: WorkoutSession
  loadMultiplier?: number
}

export interface LoggedSet {
  exerciseId: string
  setIndex: number
  actualReps: number | null
  actualLoad: LoadObject | null
  completedAt: number
}

export interface WorkoutLog {
  id?: number
  sessionId: string
  programId: string
  completedAt: number
  durationSec: number
  rating: 'easy' | 'on_point' | 'hard' | 'failed' | null
  notes: string
  totalVolumeKg: number | null
  sets: LoggedSet[]
}

export interface ActiveWorkoutState {
  id?: number
  sessionId: string
  programId: string
  startedAt: number
  pausedAt: number | null
  currentBlockIndex: number
  blockStates: Array<{
    blockIndex: number
    completedSets: number
    setData: LoggedSet[]
  }>
}

export interface SettingsRecord {
  id?: number
  unit: 'lb' | 'kg'
  leadIn: 0 | 3 | 5 | 10
  sound: boolean
  haptics: boolean
  restDefaults: { straight: number; superset: number; circuit: number }
  ownedKettlebells: number[]
}

export interface ExerciseLibraryEntry {
  id: string
  name: string
  equipment: 'kettlebell' | 'dumbbell' | 'trx' | 'pull-up bar' | 'bodyweight' | 'band' | 'rower'
  pattern: 'hinge' | 'squat' | 'push' | 'pull' | 'carry' | 'core' | 'cardio' | 'power'
  primary: string[]
  secondary?: string[]
  cues?: string[]
  substitutions?: string[]
  youtubeId?: string
}
