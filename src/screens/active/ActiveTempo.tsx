import { useState } from 'react'
import type { WorkoutBlock } from '@/db/types'
import { useActiveWorkout } from '@/context/ActiveWorkoutContext'
import { Icon } from '@/components/Icon'
import { Btn } from '@/components/primitives/Btn'
import { Card } from '@/components/primitives/Card'
import { Chip } from '@/components/primitives/Chip'
import { RestTimer } from '@/components/RestTimer'
import { ActiveTopBar } from './ActiveTopBar'
import { tokens } from '@/styles/tokens'

interface ActiveTempoProps {
  block: WorkoutBlock
  onExit: () => void
  onNextBlock: () => void
}

export function ActiveTempo({
  block,
  onExit,
  onNextBlock,
}: ActiveTempoProps) {
  const { logSet } = useActiveWorkout()
  const [currentRound, setCurrentRound] = useState(1)
  const [completedSets, setCompletedSets] = useState(0)
  const [showRest, setShowRest] = useState(false)

  const rounds = block.rounds || 1
  const totalSets = 4 // Default for tempo blocks
  const exercise = block.exercises[0]

  if (!exercise) return null

  const targetValue =
    exercise.prescription.type === 'reps'
      ? (exercise.prescription.target as number)
      : 1

  const tempo = exercise.protocol_constraints?.tempo || '3-1-2-0'
  const tempoPhases = tempo.split('-').map((v) => parseInt(v, 10))

  const handleLogSet = () => {
    logSet({
      exerciseId: exercise.exercise_id,
      setIndex: completedSets,
      actualReps: targetValue,
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
        blockName={block.name || 'Tempo'}
        blockType="tempo"
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
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em' }}>
            {exercise.name}
          </div>
          <div
            style={{
              fontSize: 13,
              color: tokens.textMuted,
              marginTop: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Chip tone="accent" size="sm">
              TEMPO
            </Chip>
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: 14,
                color: tokens.text,
                fontWeight: 700,
              }}
            >
              {tempo}
            </span>
          </div>
        </div>

        {/* Phase ring visualization */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px 0',
          }}
        >
          <svg width="200" height="200" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="80" fill="none" stroke={tokens.border} strokeWidth="8" />
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke={tokens.accent}
              strokeWidth="8"
              strokeDasharray="251 251"
              strokeLinecap="round"
              transform="rotate(-90 100 100)"
            />
          </svg>
          <div style={{ position: 'absolute', textAlign: 'center' }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: tokens.accent,
              }}
            >
              Eccentric
            </div>
            <div
              style={{
                fontSize: 64,
                fontWeight: 700,
                fontVariantNumeric: 'tabular-nums',
                color: tokens.text,
                letterSpacing: '-0.03em',
                lineHeight: 1,
                marginTop: 4,
              }}
            >
              3
            </div>
            <div style={{ fontSize: 12, color: tokens.textMuted, marginTop: 4 }}>
              of {tempoPhases[0]}s
            </div>
          </div>
        </div>

        {/* Phase row */}
        <div style={{ display: 'flex', gap: 6, marginTop: 14 }}>
          {['Eccentric', 'Bottom', 'Concentric', 'Top'].map((label, i) => (
            <div
              key={i}
              style={{
                flex: Math.max(0.4, tempoPhases[i] || 0.4),
                padding: '10px 8px',
                borderRadius: 10,
                background: i === 0 ? `${tokens.accent}22` : tokens.surface,
                border: `1px solid ${i === 0 ? tokens.accent : tokens.border}`,
                textAlign: 'center',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: i === 0 ? tokens.accent : tokens.textMuted,
                }}
              >
                {label}
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: i === 0 ? tokens.accent : tokens.text,
                  fontVariantNumeric: 'tabular-nums',
                  marginTop: 2,
                }}
              >
                {tempoPhases[i]}
              </div>
            </div>
          ))}
        </div>

        {/* Cues */}
        <Card style={{ marginTop: 14, padding: 14 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: tokens.textMuted,
              marginBottom: 8,
            }}
          >
            Cues
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {['Maximal slow tempo', 'No rest at bottom', 'Tension throughout'].map(
              (c, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 13,
                    color: tokens.text,
                  }}
                >
                  <div
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: 2,
                      background: tokens.accent,
                    }}
                  />
                  {c}
                </div>
              ),
            )}
          </div>
        </Card>

        {/* Set list */}
        <div style={{ marginTop: 14 }}>
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
            Sets
          </div>
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

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: done ? tokens.textMuted : tokens.text,
                    }}
                  >
                    Rep {i + 1}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: tokens.textMuted,
                      fontFamily: 'monospace',
                    }}
                  >
                    {tempo}
                  </div>
                </div>
              </div>
            )
          })}
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
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn variant="secondary" size="lg" icon="pause" style={{ width: 56, padding: 0 }}>
            {''}
          </Btn>
          <Btn
            variant="primary"
            size="lg"
            onClick={handleLogSet}
            style={{ flex: 1 }}
            icon="check"
          >
            Complete rep · {completedSets + 1} of {totalSets}
          </Btn>
        </div>
      </div>
    </div>
  )
}
