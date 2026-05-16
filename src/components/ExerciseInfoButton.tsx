import { useState } from 'react'
import { tokens } from '../styles/tokens'
import { ExerciseDetailSheet } from './ExerciseDetailSheet'
import { EXERCISES } from '../data/exercises'

interface ExerciseInfoButtonProps {
  exerciseId: string
}

export function ExerciseInfoButton({ exerciseId }: ExerciseInfoButtonProps) {
  const [open, setOpen] = useState(false)
  const exercise = EXERCISES.find(e => e.id === exerciseId) ?? null
  if (!exercise) return null

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          width: 28, height: 28, borderRadius: '50%',
          background: tokens.surface2, border: `1px solid ${tokens.border}`,
          color: tokens.textMuted, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}
        aria-label="Exercise technique"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
      <ExerciseDetailSheet open={open} exercise={exercise} onClose={() => setOpen(false)} />
    </>
  )
}
