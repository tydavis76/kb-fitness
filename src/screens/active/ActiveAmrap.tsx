import { useState } from 'react'
import type { WorkoutBlock } from '@/db/types'
import { useActiveWorkout } from '@/context/ActiveWorkoutContext'
import { useCountdown } from '@/hooks/useCountdown'
import { useLeadIn } from '@/hooks/useLeadIn'
import { Icon } from '@/components/Icon'
import { Btn } from '@/components/primitives/Btn'
import { Card } from '@/components/primitives/Card'
import { CircularTimer } from '@/components/CircularTimer'
import { ExerciseInfoButton } from '@/components/ExerciseInfoButton'
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
        {/* Exercise names + info buttons */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', padding: '4px 0 8px' }}>
          {exercises.map(ex => (
            <div key={ex.exercise_id} style={{ display: 'flex', alignItems: 'center', gap: 6, background: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: 20, padding: '5px 10px 5px 12px' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: tokens.text }}>{ex.name}</span>
              <ExerciseInfoButton exerciseId={ex.exercise_id} />
            </div>
          ))}
        </div>

        {/* Big timer */}
        <div style={{ padding: '4px 0 6px', textAlign: 'center' }}>
          <CircularTimer
            remaining={timer.remaining}
            total={timer.total}
            leadCount={timer.leadCount}
            phase={timer.phase}
            size={200}
            accent={tokens.accent}
          />
        </div>

        {/* Tap-zone round counter */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => {
            setRounds(r => r + 1)
            setPartial(0)
          }}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setRounds(r => r + 1)
              setPartial(0)
            }
          }}
          style={{
            position: 'relative',
            margin: '12px 0',
            background: 'rgba(245,158,11,0.07)',
            border: '2px solid rgba(245,158,11,0.35)',
            borderRadius: 20,
            padding: '14px 16px 12px',
            textAlign: 'center',
            cursor: 'pointer',
            width: '100%',
            color: tokens.text,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
              color: tokens.textMuted,
              marginBottom: 4,
            }}
          >
            Rounds — tap to add
          </div>
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: tokens.accent,
              lineHeight: 1,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {rounds}
          </div>
          {partial > 0 && (
            <div
              style={{
                fontSize: 13,
                color: tokens.textDim,
                marginTop: 4,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              +{' '}
              <span style={{ color: tokens.textMuted }}>
                {partial} of {exercises.length}
              </span>{' '}
              exercises
            </div>
          )}
          <button
            type="button"
            onClick={e => {
              e.stopPropagation()
              setRounds(r => Math.max(0, r - 1))
              setPartial(0)
            }}
            style={{
              position: 'absolute',
              top: 8,
              right: 12,
              fontSize: 11,
              color: tokens.textDim,
              textDecoration: 'underline',
              cursor: 'pointer',
              background: 'transparent',
              border: 'none',
              padding: 0,
              fontFamily: 'inherit',
            }}
          >
            −1
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
              Round {rounds + 1} in progress
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
                onClick={() => {
                  if (done) {
                    setPartial(i)
                  } else if (i + 1 === exercises.length) {
                    setRounds(r => r + 1)
                    setPartial(0)
                  } else {
                    setPartial(i + 1)
                  }
                }}
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
                <ExerciseInfoButton exerciseId={ex.exercise_id} />
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
          bottom: 64,
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
