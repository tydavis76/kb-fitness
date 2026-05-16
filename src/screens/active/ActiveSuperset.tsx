import { useState, useEffect } from 'react'
import type { WorkoutBlock } from '@/db/types'
import { useActiveWorkout } from '@/context/ActiveWorkoutContext'
import { Icon } from '@/components/Icon'
import { Btn } from '@/components/primitives/Btn'
import { Card } from '@/components/primitives/Card'
import { Chip } from '@/components/primitives/Chip'
import { RestTimer } from '@/components/RestTimer'
import { CircularTimer } from '@/components/CircularTimer'
import { PrescriptionEditor } from '@/components/PrescriptionEditor'
import { ExerciseInfoButton } from '@/components/ExerciseInfoButton'
import { ActiveTopBar } from './ActiveTopBar'
import { useCountdown } from '@/hooks/useCountdown'
import { useLeadIn } from '@/hooks/useLeadIn'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db/db'

function ExerciseTimer({ durationSec, leadIn, onComplete }: { durationSec: number; leadIn: number; onComplete: () => void }) {
  const timer = useCountdown({ duration: durationSec, leadIn, onComplete })
  useEffect(() => { timer.start() }, [])
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0', position: 'relative' }}>
      <CircularTimer remaining={timer.remaining} total={timer.total} leadCount={timer.leadCount} phase={timer.phase} size={88} />
    </div>
  )
}
import { tokens } from '@/styles/tokens'

interface ActiveSupersetProps {
  block: WorkoutBlock
  onExit: () => void
  onNextBlock: () => void
}

export function ActiveSuperset({
  block,
  onExit,
  onNextBlock,
}: ActiveSupersetProps) {
  const { logSet, updateLoad } = useActiveWorkout()
  const [leadIn] = useLeadIn()
  const settings = useLiveQuery(() => db.settings.get(1))
  const [currentRound, setCurrentRound] = useState(1)
  const [activeExerciseIdx, setActiveExerciseIdx] = useState(0)
  const [showRest, setShowRest] = useState(false)
  const [actualReps, setActualReps] = useState<Record<string, number>>({})
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null)

  const rounds = block.rounds || 1
  const exercises = block.exercises
  const isCurrentTimeBased = exercises[activeExerciseIdx]?.prescription.type === 'time'
  const effectiveRestSec = block.rest_sec ?? settings?.restDefaults?.superset ?? 60

  if (exercises.length < 2) return null

  const currentExercise = exercises[activeExerciseIdx]
  const targetReps =
    currentExercise.prescription.type === 'reps'
      ? (currentExercise.prescription.target as number)
      : 1

  const handleLogSet = () => {
    const reps = actualReps[currentExercise.exercise_id] ?? targetReps
    logSet({
      exerciseId: currentExercise.exercise_id,
      setIndex: currentRound - 1,
      actualReps: reps,
      actualLoad: currentExercise.prescription.load,
      completedAt: Date.now(),
    })

    if (activeExerciseIdx === exercises.length - 1) {
      if (currentRound >= rounds) {
        onNextBlock()
      } else {
        if (effectiveRestSec > 0) {
          setShowRest(true)
        } else {
          setCurrentRound(currentRound + 1)
          setActiveExerciseIdx(0)
        }
      }
    } else {
      setActiveExerciseIdx(activeExerciseIdx + 1)
    }
  }

  const handleRestDone = () => {
    setShowRest(false)
    if (currentRound < rounds) {
      setCurrentRound(currentRound + 1)
      setActiveExerciseIdx(0)
    } else {
      onNextBlock()
    }
  }

  if (showRest) {
    return <RestTimer durationSec={effectiveRestSec} onDone={handleRestDone} />
  }

  const reps = actualReps[currentExercise.exercise_id] ?? targetReps

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <ActiveTopBar
        blockLabel={block.label || 'A'}
        blockName={block.name || 'Superset'}
        blockType="superset"
        current={currentRound}
        total={rounds}
        onExit={onExit}
      />

      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '8px 16px 120px',
        }}
      >
        {/* Round counter */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
                color: tokens.textMuted,
              }}
            >
              Round
            </div>
            <div
              style={{
                fontSize: 36,
                fontWeight: 700,
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: '-0.02em',
              }}
            >
              {currentRound}
              <span style={{ fontSize: 18, color: tokens.textMuted, fontWeight: 500 }}>
                {' '}
                / {rounds}
              </span>
            </div>
          </div>
          {/* Round dots */}
          <div style={{ display: 'flex', gap: 4 }}>
            {Array.from({ length: rounds }, (_, r) => (
              <div
                key={r}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background:
                    r < currentRound - 1
                      ? tokens.primary
                      : r === currentRound - 1
                        ? tokens.workBg
                        : tokens.surface2,
                  border: `1px solid ${r === currentRound - 1 ? tokens.primary : tokens.border}`,
                  color:
                    r < currentRound - 1
                      ? tokens.bg
                      : r === currentRound - 1
                        ? tokens.primary
                        : tokens.textMuted,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {r + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Exercise cards */}
        {exercises.map((ex, idx) => {
          const isActive = idx === activeExerciseIdx
          const isDone = idx < activeExerciseIdx
          const subLabel = ex.sub_label || String.fromCharCode(65 + idx) + (idx + 1)

          return (
            <Card
              key={idx}
              elevated={isActive}
              style={{
                marginBottom: 10,
                padding: 0,
                overflow: 'hidden',
                background: isActive ? tokens.surface2 : tokens.surface,
                borderColor: isActive ? tokens.primary : tokens.border,
              }}
            >
              <div style={{ padding: 16 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing: '0.10em',
                      color: isActive ? tokens.primary : tokens.textMuted,
                      fontFamily: 'monospace',
                    }}
                  >
                    {subLabel}
                  </span>
                  {isActive && (
                    <Chip tone="work" size="sm">
                      NOW
                    </Chip>
                  )}
                  {isDone && (
                    <Chip size="sm">DONE</Chip>
                  )}
                  {!isActive && !isDone && (
                    <Chip size="sm">NEXT</Chip>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 700,
                      letterSpacing: '-0.01em',
                      flex: 1,
                    }}
                  >
                    {ex.name}
                  </div>
                  <ExerciseInfoButton exerciseId={ex.exercise_id} />
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: 14,
                    fontSize: 13,
                    color: tokens.textMuted,
                    alignItems: 'center',
                  }}
                >
                  <span>
                    <span style={{ color: tokens.text, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                      {ex.prescription.type === 'reps' ? ex.prescription.target : '×'}
                    </span>{' '}
                    {ex.prescription.type === 'reps' ? 'reps' : 'exercise'}
                  </span>
                  <span>·</span>
                  <span style={{ color: tokens.text, fontWeight: 600 }}>
                    {ex.prescription.load.label}
                  </span>
                  {ex.protocol_constraints?.tempo && (
                    <>
                      <span>·</span>
                      <span
                        style={{
                          fontFamily: 'monospace',
                          color: tokens.accent,
                          fontWeight: 700,
                        }}
                      >
                        {ex.protocol_constraints.tempo}
                      </span>
                    </>
                  )}
                  {isActive && (
                    <button
                      onClick={() => setEditingExerciseId(ex.exercise_id)}
                      style={{ fontSize: 10, fontWeight: 700, color: tokens.primary, background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.06em', textTransform: 'uppercase', marginLeft: 'auto' }}
                    >
                      EDIT
                    </button>
                  )}
                </div>
              </div>

              {isActive && ex.prescription.type === 'time' && (
                <div style={{ padding: '0 16px 10px', background: tokens.bg, borderTop: `1px solid ${tokens.borderSoft}` }}>
                  <ExerciseTimer
                    key={`${currentRound}-${idx}`}
                    durationSec={ex.prescription.type === 'time' ? (ex.prescription.target as number) : 1}
                    leadIn={leadIn}
                    onComplete={handleLogSet}
                  />
                </div>
              )}
              {isActive && ex.prescription.type !== 'time' && (
                <div
                  style={{
                    padding: '10px 16px',
                    background: tokens.bg,
                    borderTop: `1px solid ${tokens.borderSoft}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', gap: 6 }}>
                    {Array.from(
                      { length: Math.max(3, Math.min(8, targetReps + 2)) },
                      (_, i) => Math.max(1, targetReps - 2 + i),
                    ).map((n) => (
                      <button
                        key={n}
                        onClick={() => setActualReps({ ...actualReps, [ex.exercise_id]: n })}
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          background: reps === n ? tokens.primary : 'transparent',
                          color: reps === n ? tokens.bg : tokens.text,
                          border: `1px solid ${reps === n ? tokens.primary : tokens.border}`,
                          fontSize: 13,
                          fontWeight: 700,
                          cursor: 'pointer',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                  <div style={{ fontSize: 11, color: tokens.textMuted }}>
                    actual reps
                  </div>
                </div>
              )}
            </Card>
          )
        })}

        {/* Rest hint */}
        <div
          style={{
            marginTop: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 14px',
            background: tokens.restBg,
            borderRadius: 10,
            border: `1px solid ${tokens.rest}33`,
          }}
        >
          <Icon name="timer" size={16} color={tokens.rest} />
          <span
            style={{
              fontSize: 13,
              color: tokens.rest,
              fontWeight: 600,
            }}
          >
            Rest {effectiveRestSec}s after round
          </span>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 64,
          padding: 16,
          background: tokens.bg,
          borderTop: `1px solid ${tokens.border}`,
        }}
      >
        <Btn
          variant={isCurrentTimeBased ? 'secondary' : 'primary'}
          size="lg"
          onClick={handleLogSet}
          style={{ width: '100%' }}
          icon={isCurrentTimeBased ? 'arrow-right' : 'arrow-right'}
        >
          {isCurrentTimeBased ? 'Skip' : 'Next'}
        </Btn>
      </div>

      {editingExerciseId && (() => {
        const ex = exercises.find(e => e.exercise_id === editingExerciseId)
        if (!ex) return null
        return (
          <PrescriptionEditor
            open={true}
            onClose={() => setEditingExerciseId(null)}
            exerciseName={ex.name}
            initialLoad={ex.prescription.load.value ?? undefined}
            initialUnit={ex.prescription.load.unit === 'kg' ? 'kg' : 'lb'}
            onSave={(load) => updateLoad(ex.exercise_id, load)}
          />
        )
      })()}
    </div>
  )
}
