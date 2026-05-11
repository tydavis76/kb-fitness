import { useState } from 'react'
import type { WorkoutBlock } from '@/db/types'
import { useActiveWorkout } from '@/context/ActiveWorkoutContext'
import { useCountdown } from '@/hooks/useCountdown'
import { useLeadIn } from '@/hooks/useLeadIn'
import { Btn } from '@/components/primitives/Btn'
import { Card } from '@/components/primitives/Card'
import { CircularTimer } from '@/components/CircularTimer'
import { ActiveTopBar } from './ActiveTopBar'
import { tokens } from '@/styles/tokens'

interface ActiveCarryProps {
  block: WorkoutBlock
  onExit: () => void
  onNextBlock: () => void
}

export function ActiveCarry({
  block,
  onExit,
  onNextBlock,
}: ActiveCarryProps) {
  const { logSet } = useActiveWorkout()
  const [leadIn] = useLeadIn()
  const duration = block.duration_sec || 40
  const [distance, setDistance] = useState(0)
  const [targetDistance] = useState(40)
  const t = useCountdown({ duration, leadIn })
  const exercise = block.exercises[0]

  const handleDone = () => {
    logSet({
      exerciseId: exercise?.exercise_id || '',
      setIndex: 0,
      actualReps: distance,
      actualLoad: exercise?.prescription.load || null,
      completedAt: Date.now(),
    })
    onNextBlock()
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
        blockName={block.name || 'Carry'}
        blockType="carry"
        current={1}
        total={1}
        onExit={onExit}
      />

      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '8px 16px 120px',
        }}
      >
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em' }}>
            {exercise?.name || 'Carry'}
          </div>
          <div style={{ fontSize: 14, color: tokens.textMuted, marginTop: 4 }}>
            Round 1 of 1 · {block.rest_sec || 90}s rest
          </div>
        </div>

        {/* Live time-under-load timer */}
        <Card style={{ padding: 16, marginBottom: 12 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: tokens.textMuted,
              marginBottom: 12,
              textAlign: 'center',
            }}
          >
            Time under load
          </div>
          <CircularTimer
            remaining={t.remaining}
            total={t.total}
            leadCount={t.leadCount}
            phase={t.phase}
            size={180}
            accent={tokens.primary}
          />
          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center' }}>
            <Btn
              variant={t.isRunning ? 'secondary' : 'primary'}
              size="md"
              icon={t.isRunning ? 'pause' : 'play'}
              onClick={() => (t.isRunning ? t.pause() : t.start())}
            >
              {t.phase === 'idle'
                ? 'Start'
                : t.isRunning
                  ? 'Pause'
                  : t.phase === 'done'
                    ? 'Restart'
                    : 'Resume'}
            </Btn>
          </div>
        </Card>

        {/* Massive load */}
        <Card
          elevated
          style={{
            padding: 24,
            marginBottom: 14,
            textAlign: 'center',
            borderColor: tokens.accent,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
              color: tokens.textMuted,
              marginBottom: 8,
            }}
          >
            Load
          </div>
          <div
            style={{
              fontSize: 60,
              fontWeight: 800,
              color: tokens.accent,
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '-0.03em',
              lineHeight: 1,
            }}
          >
            {exercise?.prescription.load.label || '32 kg'}
          </div>
          <div style={{ fontSize: 14, color: tokens.textMuted, marginTop: 4 }}>
            ×2 kettlebells
          </div>
        </Card>

        {/* Distance counter */}
        <Card style={{ padding: 18, marginBottom: 12 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
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
                Distance
              </div>
              <div
                style={{
                  fontSize: 36,
                  fontWeight: 700,
                  fontVariantNumeric: 'tabular-nums',
                  marginTop: 4,
                }}
              >
                {distance}
                <span style={{ fontSize: 14, color: tokens.textMuted, fontWeight: 500 }}>
                  {' '}
                  / {targetDistance} m
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setDistance(Math.max(0, distance - 5))}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: tokens.surface2,
                  border: `1px solid ${tokens.border}`,
                  color: tokens.text,
                  cursor: 'pointer',
                  fontWeight: 700,
                }}
              >
                −5
              </button>
              <button
                onClick={() => setDistance(Math.min(targetDistance, distance + 5))}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: tokens.primary,
                  border: 'none',
                  color: tokens.bg,
                  cursor: 'pointer',
                  fontWeight: 700,
                }}
              >
                +5
              </button>
            </div>
          </div>
          {/* Progress bar */}
          <div
            style={{
              marginTop: 12,
              height: 6,
              borderRadius: 3,
              background: tokens.border,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${(distance / targetDistance) * 100}%`,
                height: '100%',
                background: tokens.primary,
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </Card>
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
          onClick={handleDone}
          style={{ width: '100%' }}
          icon="check"
        >
          Drop · End round
        </Btn>
      </div>
    </div>
  )
}
