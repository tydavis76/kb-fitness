import { useState } from 'react'
import type { WorkoutBlock } from '@/db/types'
import { useActiveWorkout } from '@/context/ActiveWorkoutContext'
import { Icon } from '@/components/Icon'
import { Btn } from '@/components/primitives/Btn'
import { Card } from '@/components/primitives/Card'
import { RestTimer } from '@/components/RestTimer'
import { SetTimerButton } from '@/components/SetTimerButton'
import { ActiveTopBar } from './ActiveTopBar'
import { tokens } from '@/styles/tokens'

interface ActiveStraightProps {
  block: WorkoutBlock
  onExit: () => void
  onNextBlock: () => void
}

export function ActiveStraight({
  block,
  onExit,
  onNextBlock,
}: ActiveStraightProps) {
  const { logSet } = useActiveWorkout()
  const [currentRound, setCurrentRound] = useState(1)
  const [completedSets, setCompletedSets] = useState(0)
  const [showRest, setShowRest] = useState(false)
  const [actualReps, setActualReps] = useState<Record<number, number>>({})

  const rounds = block.rounds || 1
  const totalSets = (block.exercises[0]?.prescription.target as number) || 1
  const exercise = block.exercises[0]

  if (!exercise) return null

  const isTimeBase = exercise.prescription.type === 'time'
  const targetValue =
    exercise.prescription.type === 'reps'
      ? (exercise.prescription.target as number)
      : exercise.prescription.type === 'time'
        ? (exercise.prescription.target as number)
        : 1

  const handleLogSet = () => {
    const reps = actualReps[completedSets] ?? targetValue
    logSet({
      exerciseId: exercise.exercise_id,
      setIndex: completedSets,
      actualReps: reps,
      actualLoad: exercise.prescription.load,
      completedAt: Date.now(),
    })

    const nextSetIdx = completedSets + 1
    if (nextSetIdx >= totalSets) {
      if (currentRound >= rounds) {
        onNextBlock()
      } else {
        if ((block.rest_sec ?? 0) > 0) {
          setShowRest(true)
        } else {
          setCurrentRound(currentRound + 1)
          setCompletedSets(0)
        }
      }
    } else {
      if ((block.rest_sec ?? 0) > 0) {
        setShowRest(true)
      } else {
        setCompletedSets(nextSetIdx)
      }
    }
  }

  const handleRestDone = () => {
    setShowRest(false)
    const nextSetIdx = completedSets + 1
    if (nextSetIdx >= totalSets) {
      if (currentRound < rounds) {
        setCurrentRound(currentRound + 1)
        setCompletedSets(0)
      } else {
        onNextBlock()
      }
    } else {
      setCompletedSets(nextSetIdx)
    }
  }

  if (showRest) {
    return <RestTimer durationSec={block.rest_sec ?? 60} onDone={handleRestDone} />
  }

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
        blockName={block.name || 'Block'}
        blockType={block.type as any}
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
        {/* Exercise name and notes */}
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}
            >
              {exercise.name}
            </div>
            {exercise.protocol_constraints?.cues?.[0] && (
              <div style={{ fontSize: 14, color: tokens.textMuted, marginTop: 4 }}>
                {exercise.protocol_constraints.cues[0]}
              </div>
            )}
          </div>
        </div>

        {/* Prescription bar */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <Card style={{ flex: 1, padding: 14 }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: tokens.textMuted,
              }}
            >
              Target
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                marginTop: 4,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {targetValue}{' '}
              <span style={{ fontSize: 12, color: tokens.textMuted, fontWeight: 500 }}>
                {isTimeBase ? 's' : 'reps'}
              </span>
            </div>
          </Card>
          <Card style={{ flex: 1, padding: 14 }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: tokens.textMuted,
              }}
            >
              Load
            </div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                marginTop: 4,
              }}
            >
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
                width: '100%',
                padding: '12px 14px',
                marginBottom: 8,
                background: active ? tokens.workBg : tokens.surface,
                border: `1px solid ${active ? tokens.primary : tokens.border}`,
                borderRadius: 14,
                color: tokens.text,
              }}
            >
              <button
                onClick={() => {
                  if (active) handleLogSet()
                }}
                disabled={!active && !done}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: done ? tokens.primary : tokens.surface2,
                  color: done ? tokens.bg : active ? tokens.primary : tokens.textMuted,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 14,
                  border: 'none',
                  cursor: active ? 'pointer' : 'default',
                  flexShrink: 0,
                }}
              >
                {done ? <Icon name="check" size={18} /> : i + 1}
              </button>

              {active && !isTimeBase ? (
                <div style={{ flex: 1, display: 'flex', gap: 8, alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>Set {i + 1}</div>
                    <div style={{ fontSize: 12, color: tokens.textMuted }}>
                      {targetValue} reps · {exercise.prescription.load.label}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: done ? tokens.textMuted : tokens.text,
                    }}
                  >
                    Set {i + 1}
                  </div>
                  <div style={{ fontSize: 12, color: tokens.textMuted }}>
                    {targetValue} reps · {exercise.prescription.load.label}
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {/* Time-based reps stepper or regular set logging */}
        {completedSets < totalSets && !isTimeBase && (() => {
          const reps = actualReps[completedSets] ?? targetValue
          return (
            <Card style={{ marginTop: 12, padding: 14 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: tokens.textMuted,
                  marginBottom: 10,
                }}
              >
                Actual reps
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <button
                  onClick={() => {
                    const newVal = Math.max(0, (actualReps[completedSets] ?? targetValue) - 1)
                    setActualReps({ ...actualReps, [completedSets]: newVal })
                  }}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: tokens.surface2,
                    color: tokens.text,
                    border: `1px solid ${tokens.border}`,
                    cursor: 'pointer',
                    fontSize: 16,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon name="minus" size={16} />
                </button>
                <div
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    fontSize: 24,
                    fontWeight: 700,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {reps}
                </div>
                <button
                  onClick={() => {
                    const newVal = (actualReps[completedSets] ?? targetValue) + 1
                    setActualReps({ ...actualReps, [completedSets]: newVal })
                  }}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: tokens.primary,
                    color: tokens.bg,
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 16,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon name="plus" size={16} />
                </button>
              </div>
            </Card>
          )
        })()}

        {/* Timer for time-based exercises */}
        {completedSets < totalSets && isTimeBase && (
          <Card style={{ marginTop: 12, padding: 14, textAlign: 'center' }}>
            <SetTimerButton
              durationSec={targetValue}
              onComplete={handleLogSet}
            />
          </Card>
        )}
      </div>

      {/* Sticky bottom — log set CTA */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          padding: 16,
          background: tokens.bg,
          borderTop: `1px solid ${tokens.border}`,
        }}
      >
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn variant="secondary" size="lg" icon="skip" style={{ width: 56, padding: 0 }}>
            {''}
          </Btn>
          <Btn
            variant="primary"
            size="lg"
            onClick={handleLogSet}
            style={{ flex: 1 }}
            icon="check"
          >
            Log Set {completedSets + 1}
          </Btn>
        </div>
      </div>
    </div>
  )
}
