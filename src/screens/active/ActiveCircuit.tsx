import { useState } from 'react'
import type { WorkoutBlock } from '@/db/types'
import { useActiveWorkout } from '@/context/ActiveWorkoutContext'
import { Icon } from '@/components/Icon'
import { Btn } from '@/components/primitives/Btn'
import { Chip } from '@/components/primitives/Chip'
import { RestTimer } from '@/components/RestTimer'
import { ActiveTopBar } from './ActiveTopBar'
import { tokens } from '@/styles/tokens'

interface ActiveCircuitProps {
  block: WorkoutBlock
  onExit: () => void
  onNextBlock: () => void
}

export function ActiveCircuit({
  block,
  onExit,
  onNextBlock,
}: ActiveCircuitProps) {
  const { logSet } = useActiveWorkout()
  const [round, setRound] = useState(1)
  const [exerciseIdx, setExerciseIdx] = useState(0)
  const [showRest, setShowRest] = useState(false)

  const rounds = block.rounds || 1
  const exercises = block.exercises

  if (exercises.length === 0) return null

  const handleDoneExercise = () => {
    const ex = exercises[exerciseIdx]
    logSet({
      exerciseId: ex.exercise_id,
      setIndex: (round - 1) * exercises.length + exerciseIdx,
      actualReps:
        ex.prescription.type === 'reps' ? (ex.prescription.target as number) : null,
      actualLoad: ex.prescription.load,
      completedAt: Date.now(),
    })

    if (exerciseIdx === exercises.length - 1) {
      if (round >= rounds) {
        onNextBlock()
      } else {
        if ((block.rest_sec ?? 0) > 0) {
          setShowRest(true)
        } else {
          setRound(round + 1)
          setExerciseIdx(0)
        }
      }
    } else {
      setExerciseIdx(exerciseIdx + 1)
    }
  }

  const handleRestDone = () => {
    setShowRest(false)
    if (round < rounds) {
      setRound(round + 1)
      setExerciseIdx(0)
    } else {
      onNextBlock()
    }
  }

  if (showRest) {
    return <RestTimer durationSec={block.rest_sec ?? 60} onDone={handleRestDone} />
  }

  const progressPercent = (round / rounds) * 100

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
        blockName={block.name || 'Circuit'}
        blockType="circuit"
        current={round}
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
        {/* Round meter */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 18,
            padding: 16,
            background: tokens.surface,
            borderRadius: 14,
            border: `1px solid ${tokens.border}`,
          }}
        >
          <svg width="64" height="64" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="26" fill="none" stroke={tokens.border} strokeWidth="6" />
            <circle
              cx="32"
              cy="32"
              r="26"
              fill="none"
              stroke={tokens.primary}
              strokeWidth="6"
              strokeDasharray={`${(progressPercent / 100) * 163} 163`}
              strokeLinecap="round"
              transform="rotate(-90 32 32)"
            />
            <text
              x="32"
              y="38"
              textAnchor="middle"
              fontSize="20"
              fontWeight="700"
              fill={tokens.text}
              fontFamily="system-ui"
            >
              {round}
            </text>
          </svg>
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
              Round
            </div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>
              {round} of {rounds}
            </div>
            <div style={{ fontSize: 12, color: tokens.textMuted, marginTop: 2 }}>
              {block.rest_sec || 60}s rest between rounds
            </div>
          </div>
        </div>

        {/* Circuit station list */}
        {exercises.map((ex, idx) => {
          const done = idx < exerciseIdx
          const active = idx === exerciseIdx
          const targetValue =
            ex.prescription.type === 'reps'
              ? (ex.prescription.target as number)
              : ex.prescription.type === 'time'
                ? (ex.prescription.target as number)
                : 1

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '14px 14px',
                marginBottom: 8,
                background: active ? tokens.workBg : tokens.surface,
                border: `1px solid ${active ? tokens.primary : tokens.border}`,
                borderRadius: 14,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: done ? tokens.primary : active ? tokens.surface3 : tokens.surface2,
                  color: done ? tokens.bg : active ? tokens.primary : tokens.textMuted,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {done ? <Icon name="check" size={18} /> : idx + 1}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: done ? tokens.textMuted : tokens.text,
                  }}
                >
                  {ex.name}
                </div>
                <div style={{ fontSize: 12, color: tokens.textMuted, marginTop: 2 }}>
                  {targetValue}
                  {ex.prescription.type === 'time' ? 's' : ' reps'} · {ex.prescription.load.label}
                </div>
              </div>
              {active && (
                <Chip tone="work" size="sm">
                  NOW
                </Chip>
              )}
            </div>
          )
        })}
      </div>

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
        <Btn
          variant="primary"
          size="lg"
          onClick={handleDoneExercise}
          style={{ width: '100%' }}
          icon="check"
        >
          Done · Next station
        </Btn>
      </div>
    </div>
  )
}
