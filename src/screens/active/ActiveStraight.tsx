import { useState } from 'react'
import type { WorkoutBlock } from '@/db/types'
import { useActiveWorkout } from '@/context/ActiveWorkoutContext'
import { Icon } from '@/components/Icon'
import { Btn } from '@/components/primitives/Btn'
import { Card } from '@/components/primitives/Card'
import { RestTimer } from '@/components/RestTimer'
import { SetTimerButton } from '@/components/SetTimerButton'
import { PrescriptionEditor } from '@/components/PrescriptionEditor'
import { ExerciseInfoButton } from '@/components/ExerciseInfoButton'
import { ActiveTopBar } from './ActiveTopBar'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db/db'
import { tokens } from '@/styles/tokens'

interface ActiveStraightProps {
  block: WorkoutBlock
  onExit: () => void
  onNextBlock: () => void
}

// Parse "8-10" → { display: "8–10", max: 10 } or 8 → { display: "8", max: 8 }
function parseTarget(raw: string | number): { display: string; max: number } {
  if (typeof raw === 'number') return { display: String(raw), max: raw }
  const parts = String(raw).split('-').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n))
  if (parts.length === 2) return { display: `${parts[0]}–${parts[1]}`, max: parts[1] }
  if (parts.length === 1) return { display: String(parts[0]), max: parts[0] }
  return { display: String(raw), max: 10 }
}

export function ActiveStraight({
  block,
  onExit,
  onNextBlock,
}: ActiveStraightProps) {
  const { logSet, updateLoad } = useActiveWorkout()
  const settings = useLiveQuery(() => db.settings.get(1))
  const [completedSets, setCompletedSets] = useState(0)
  const [showRest, setShowRest] = useState(false)
  const [actualReps, setActualReps] = useState<Record<number, number>>({})
  const [editingLoad, setEditingLoad] = useState(false)

  const totalSets = block.rounds || 1  // for straight sets, rounds = number of sets
  const exercise = block.exercises[0]
  const effectiveRestSec = block.rest_sec ?? settings?.restDefaults?.straight ?? 90

  if (!exercise) return null

  const isTimeBase = exercise.prescription.type === 'time'
  const target = parseTarget(exercise.prescription.target)

  const handleLogSet = () => {
    const reps = actualReps[completedSets] ?? target.max
    logSet({
      exerciseId: exercise.exercise_id,
      setIndex: completedSets,
      actualReps: isTimeBase ? null : reps,
      actualLoad: exercise.prescription.load,
      completedAt: Date.now(),
    })

    const nextIdx = completedSets + 1
    if (nextIdx >= totalSets) {
      onNextBlock()
    } else if (effectiveRestSec > 0) {
      setShowRest(true)
    } else {
      setCompletedSets(nextIdx)
    }
  }

  const handleRestDone = () => {
    setShowRest(false)
    setCompletedSets(completedSets + 1)
  }

  if (showRest) {
    return <RestTimer durationSec={effectiveRestSec} onDone={handleRestDone} />
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <ActiveTopBar
        blockLabel={block.label || 'A'}
        blockName={block.name || 'Block'}
        blockType={block.type as any}
        current={completedSets + 1}
        total={totalSets}
        onExit={onExit}
      />

      <div style={{ flex: 1, overflow: 'auto', padding: '8px 16px 120px' }}>
        {/* Exercise name */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1, flex: 1 }}>
              {exercise.name}
            </div>
            <ExerciseInfoButton exerciseId={exercise.exercise_id} />
          </div>
          {exercise.protocol_constraints?.cues?.[0] && (
            <div style={{ fontSize: 14, color: tokens.textMuted, marginTop: 4 }}>
              {exercise.protocol_constraints.cues[0]}
            </div>
          )}
        </div>

        {/* Prescription bar */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <Card style={{ flex: 1, padding: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: tokens.textMuted }}>
              Target
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>
              {target.display}{' '}
              <span style={{ fontSize: 12, color: tokens.textMuted, fontWeight: 500 }}>
                {isTimeBase ? 's' : 'reps'}
              </span>
            </div>
          </Card>
          <Card style={{ flex: 1, padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: tokens.textMuted }}>
                Load
              </div>
              <button
                onClick={() => setEditingLoad(true)}
                style={{ fontSize: 10, fontWeight: 700, color: tokens.primary, background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.06em', textTransform: 'uppercase' }}
              >
                EDIT
              </button>
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, marginTop: 4 }}>
              {exercise.prescription.load.label}
            </div>
          </Card>
        </div>

        {/* Set list */}
        {Array.from({ length: totalSets }, (_, i) => {
          const done = i < completedSets
          const active = i === completedSets

          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '12px 14px',
                marginBottom: 8,
                background: active ? tokens.workBg : tokens.surface,
                border: `1px solid ${active ? tokens.primary : tokens.border}`,
                borderRadius: 14,
                color: tokens.text,
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: done ? tokens.primary : tokens.surface2,
                color: done ? tokens.bg : active ? tokens.primary : tokens.textMuted,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 14,
              }}>
                {done ? <Icon name="check" size={18} /> : i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: done ? tokens.textMuted : tokens.text }}>
                  Set {i + 1}
                </div>
                <div style={{ fontSize: 12, color: tokens.textMuted }}>
                  {target.display} reps · {exercise.prescription.load.label}
                </div>
              </div>
              {done && (
                <div style={{ fontSize: 13, fontWeight: 700, color: tokens.textMuted, fontVariantNumeric: 'tabular-nums' }}>
                  {actualReps[i] ?? target.max}
                </div>
              )}
            </div>
          )
        })}

        {/* Actual reps adjuster for active set */}
        {completedSets < totalSets && !isTimeBase && (() => {
          const reps = actualReps[completedSets] ?? target.max
          return (
            <Card style={{ marginTop: 12, padding: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: tokens.textMuted, marginBottom: 10 }}>
                Actual reps
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <button
                  onClick={() => setActualReps({ ...actualReps, [completedSets]: Math.max(0, reps - 1) })}
                  style={{ width: 36, height: 36, borderRadius: 10, background: tokens.surface2, color: tokens.text, border: `1px solid ${tokens.border}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Icon name="minus" size={16} />
                </button>
                <div style={{ flex: 1, textAlign: 'center', fontSize: 24, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                  {reps}
                </div>
                <button
                  onClick={() => setActualReps({ ...actualReps, [completedSets]: reps + 1 })}
                  style={{ width: 36, height: 36, borderRadius: 10, background: tokens.primary, color: tokens.bg, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Icon name="plus" size={16} />
                </button>
              </div>
            </Card>
          )
        })()}

        {/* Timer for time-based sets */}
        {completedSets < totalSets && isTimeBase && (
          <Card style={{ marginTop: 12, padding: 14, textAlign: 'center' }}>
            <SetTimerButton durationSec={target.max} onComplete={handleLogSet} />
          </Card>
        )}
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 64, padding: 16, background: tokens.bg, borderTop: `1px solid ${tokens.border}` }}>
        <Btn variant="primary" size="lg" onClick={handleLogSet} style={{ width: '100%' }} icon="check">
          Log Set {completedSets + 1} of {totalSets}
        </Btn>
      </div>

      <PrescriptionEditor
        open={editingLoad}
        onClose={() => setEditingLoad(false)}
        exerciseName={exercise.name}
        initialLoad={exercise.prescription.load.value ?? undefined}
        initialUnit={exercise.prescription.load.unit === 'kg' ? 'kg' : 'lb'}
        onSave={(load) => updateLoad(exercise.exercise_id, load)}
      />
    </div>
  )
}
