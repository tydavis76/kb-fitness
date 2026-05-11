import { useState } from 'react'
import type { WorkoutBlock } from '@/db/types'
import { useActiveWorkout } from '@/context/ActiveWorkoutContext'
import { useCountdown } from '@/hooks/useCountdown'
import { useLeadIn } from '@/hooks/useLeadIn'
import { Icon } from '@/components/Icon'
import { Btn } from '@/components/primitives/Btn'
import { Card } from '@/components/primitives/Card'
import { CircularTimer } from '@/components/CircularTimer'
import { ActiveTopBar } from './ActiveTopBar'
import { tokens } from '@/styles/tokens'

interface ActiveAmrapProps {
  block: WorkoutBlock
  onExit: () => void
  onNextBlock: () => void
}

export function ActiveAmrap({
  block,
  onExit,
  onNextBlock,
}: ActiveAmrapProps) {
  const { logSet } = useActiveWorkout()
  const [leadIn] = useLeadIn()
  const [rounds, setRounds] = useState(0)
  const [partial, setPartial] = useState(0)
  const duration = block.duration_sec || 300
  const timer = useCountdown({ duration, leadIn })
  const exercises = block.exercises

  const handleComplete = () => {
    exercises.forEach((ex, idx) => {
      logSet({
        exerciseId: ex.exercise_id,
        setIndex: idx,
        actualReps:
          ex.prescription.type === 'reps' ? (ex.prescription.target as number) : null,
        actualLoad: ex.prescription.load,
        completedAt: Date.now(),
      })
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
        blockName={block.name || 'AMRAP'}
        blockType="amrap"
        current={1}
        total={1}
        onExit={onExit}
      />

      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '8px 16px 140px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Big timer */}
        <div style={{ padding: '12px 0 6px', textAlign: 'center' }}>
          <CircularTimer
            remaining={timer.remaining}
            total={timer.total}
            leadCount={timer.leadCount}
            phase={timer.phase}
            size={240}
            accent={tokens.accent}
          />
        </div>

        {/* Round counter */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
            margin: '14px 0',
          }}
        >
          <button
            onClick={() => setRounds(Math.max(0, rounds - 1))}
            style={{
              width: 44,
              height: 44,
              borderRadius: 999,
              background: tokens.surface2,
              border: `1px solid ${tokens.border}`,
              color: tokens.text,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name="minus" size={18} />
          </button>
          <div style={{ textAlign: 'center', minWidth: 100 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: tokens.textMuted,
              }}
            >
              Rounds
            </div>
            <div
              style={{
                fontSize: 36,
                fontWeight: 700,
                fontVariantNumeric: 'tabular-nums',
                color: tokens.accent,
                lineHeight: 1,
                marginTop: 2,
              }}
            >
              {rounds}
              <span style={{ fontSize: 14, color: tokens.textMuted, fontWeight: 500 }}>
                +{partial}
              </span>
            </div>
          </div>
          <button
            onClick={() => setRounds(rounds + 1)}
            style={{
              width: 44,
              height: 44,
              borderRadius: 999,
              background: tokens.accent,
              border: 'none',
              color: tokens.bg,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name="plus" size={18} />
          </button>
        </div>

        {/* Exercise rotation reminder */}
        <Card padded={false} style={{ overflow: 'hidden' }}>
          <div
            style={{
              padding: '10px 14px',
              borderBottom: `1px solid ${tokens.borderSoft}`,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: tokens.textMuted,
              }}
            >
              1 round
            </div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: tokens.textMuted,
              }}
            >
              tap to mark complete
            </div>
          </div>
          {exercises.map((ex, i) => {
            const done = i < partial
            return (
              <button
                key={i}
                onClick={() => setPartial(done ? i : i + 1)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  background: 'transparent',
                  border: 'none',
                  borderTop: i > 0 ? `1px solid ${tokens.borderSoft}` : 'none',
                  cursor: 'pointer',
                  color: tokens.text,
                  fontFamily: 'inherit',
                  textAlign: 'left',
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: done ? tokens.primary : tokens.surface2,
                    color: done ? tokens.bg : tokens.textMuted,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  {done ? <Icon name="check" size={16} /> : i + 1}
                </div>
                <div style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>
                  {ex.name}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: tokens.textMuted,
                    fontVariantNumeric: 'tabular-nums',
                    fontWeight: 600,
                  }}
                >
                  {ex.prescription.type === 'reps'
                    ? `${ex.prescription.target} reps`
                    : `${ex.prescription.target}s`}
                </div>
              </button>
            )
          })}
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
        {timer.phase === 'idle' || timer.phase === 'done' ? (
          <Btn
            variant="primary"
            size="lg"
            onClick={() => {
              timer.start()
            }}
            style={{ width: '100%' }}
            icon="play"
            accent={tokens.accent}
          >
            {timer.phase === 'done' ? 'Restart timer' : 'Start AMRAP'}
          </Btn>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn
              variant="secondary"
              size="lg"
              icon={timer.phase === 'paused' ? 'play' : 'pause'}
              style={{ width: 56, padding: 0 }}
              onClick={() => {
                if (timer.phase === 'paused') timer.start()
                else timer.pause()
              }}
            >
              {''}
            </Btn>
            <Btn
              variant="primary"
              size="lg"
              onClick={handleComplete}
              style={{ flex: 1 }}
              icon="flag"
              accent={tokens.accent}
            >
              End AMRAP
            </Btn>
          </div>
        )}
      </div>
    </div>
  )
}
