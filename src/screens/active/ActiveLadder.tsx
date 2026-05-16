import { useState } from 'react'
import type { WorkoutBlock } from '@/db/types'
import { useActiveWorkout } from '@/context/ActiveWorkoutContext'
import { Btn } from '@/components/primitives/Btn'
import { Card } from '@/components/primitives/Card'
import { Chip } from '@/components/primitives/Chip'
import { RestTimer } from '@/components/RestTimer'
import { ExerciseInfoButton } from '@/components/ExerciseInfoButton'
import { ActiveTopBar } from './ActiveTopBar'
import { tokens } from '@/styles/tokens'

interface ActiveLadderProps {
  block: WorkoutBlock
  onExit: () => void
  onNextBlock: () => void
}

export function ActiveLadder({
  block,
  onExit,
  onNextBlock,
}: ActiveLadderProps) {
  const { logSet } = useActiveWorkout()
  const [step, setStep] = useState(0)
  const [showRest, setShowRest] = useState(false)

  const exercise = block.exercises[0]
  if (!exercise?.ladder) return null

  const rungs = exercise.ladder.rungs

  const handleClimb = () => {
    const currentRung = rungs[step]
    logSet({
      exerciseId: exercise.exercise_id,
      setIndex: step,
      actualReps: currentRung.reps,
      actualLoad: currentRung.load,
      completedAt: Date.now(),
    })

    if (step >= rungs.length - 1) {
      onNextBlock()
    } else {
      if ((block.rest_sec ?? 0) > 0) {
        setShowRest(true)
      } else {
        setStep(step + 1)
      }
    }
  }

  const handleRestDone = () => {
    setShowRest(false)
    if (step < rungs.length - 1) {
      setStep(step + 1)
    } else {
      onNextBlock()
    }
  }

  if (showRest) {
    return <RestTimer durationSec={block.rest_sec ?? 60} onDone={handleRestDone} />
  }

  const currentRung = rungs[step]

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
        blockName={block.name || 'Ladder'}
        blockType="ladder"
        current={step + 1}
        total={rungs.length}
        onExit={onExit}
      />

      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '8px 16px 120px',
        }}
      >
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', flex: 1 }}>
              {exercise.name}
            </div>
            <ExerciseInfoButton exerciseId={exercise.exercise_id} />
          </div>
          <div style={{ fontSize: 12, color: tokens.textMuted, marginTop: 2 }}>
            {rungs.length} rungs · {block.rest_sec || 60}s rest
          </div>
        </div>

        {/* Rung visualization */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column-reverse',
            gap: 6,
            padding: 14,
            background: tokens.surface,
            borderRadius: 14,
            border: `1px solid ${tokens.border}`,
            marginBottom: 14,
          }}
        >
          {rungs.map((rung, i) => {
            const isDone = i < step
            const isActive = i === step
            const w = 50 + i * 10

            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 7,
                    background: isDone
                      ? tokens.primary
                      : isActive
                        ? tokens.accentBg
                        : tokens.surface2,
                    color: isDone
                      ? tokens.bg
                      : isActive
                        ? tokens.accent
                        : tokens.textMuted,
                    border: `1px solid ${isActive ? tokens.accent : 'transparent'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </div>
                <div
                  style={{
                    flex: 1,
                    height: 36,
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      width: `${w}%`,
                      height: 28,
                      borderRadius: 8,
                      background: isDone
                        ? tokens.workBg
                        : isActive
                          ? tokens.accentBg
                          : tokens.surface2,
                      border: `1px solid ${
                        isDone ? tokens.primary : isActive ? tokens.accent : tokens.border
                      }`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0 10px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: isDone
                          ? tokens.primary
                          : isActive
                            ? tokens.accent
                            : tokens.textMuted,
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {rung.reps} reps
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: isDone
                          ? tokens.primary
                          : isActive
                            ? tokens.accent
                            : tokens.textMuted,
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {rung.load.label}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Current rung display */}
        <Card elevated style={{ padding: 18, borderColor: tokens.accent }}>
          <Chip tone="accent" size="sm" style={{ marginBottom: 12 }}>
            RUNG {step + 1} OF {rungs.length}
          </Chip>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: tokens.textMuted,
                }}
              >
                Reps
              </div>
              <div
                style={{
                  fontSize: 44,
                  fontWeight: 800,
                  fontVariantNumeric: 'tabular-nums',
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                  marginTop: 4,
                }}
              >
                {currentRung.reps}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div
                style={{
                  fontSize: 11,
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
                  fontSize: 30,
                  fontWeight: 800,
                  fontVariantNumeric: 'tabular-nums',
                  letterSpacing: '-0.01em',
                  color: tokens.accent,
                  marginTop: 4,
                }}
              >
                {currentRung.load.label}
              </div>
            </div>
          </div>
        </Card>
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
          variant="primary"
          size="lg"
          onClick={handleClimb}
          style={{ width: '100%' }}
          icon="check"
        >
          Climb to rung {step + 2}
        </Btn>
      </div>
    </div>
  )
}
