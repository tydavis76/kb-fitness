import { useState, useEffect } from 'react'
import type { WorkoutBlock } from '@/db/types'
import { useActiveWorkout } from '@/context/ActiveWorkoutContext'
import { useCountdown } from '@/hooks/useCountdown'
import { useLeadIn } from '@/hooks/useLeadIn'
import { Btn } from '@/components/primitives/Btn'
import { Card } from '@/components/primitives/Card'
import { Chip } from '@/components/primitives/Chip'
import { CircularTimer } from '@/components/CircularTimer'
import { ActiveTopBar } from './ActiveTopBar'
import { tokens } from '@/styles/tokens'

interface ActiveIntervalProps {
  block: WorkoutBlock
  onExit: () => void
  onNextBlock: () => void
}

export function ActiveInterval({
  block,
  onExit,
  onNextBlock,
}: ActiveIntervalProps) {
  const { logSet } = useActiveWorkout()
  const [leadIn] = useLeadIn()
  const WORK = 60
  const REST = 60
  const TOTAL_ROUNDS = block.rounds || 6
  const [intervalPhase, setIntervalPhase] = useState<'work' | 'rest'>('work')
  const [round, setRound] = useState(1)
  const exercise = block.exercises[0]

  const advance = () => {
    setIntervalPhase((p) => {
      if (p === 'work') return 'rest'
      setRound((r) => Math.min(TOTAL_ROUNDS, r + 1))
      return 'work'
    })
  }

  const t = useCountdown({
    duration: intervalPhase === 'work' ? WORK : REST,
    leadIn: intervalPhase === 'work' && round === 1 ? leadIn : 0,
    onComplete: () => setTimeout(advance, 100),
  })

  // Reset countdown when phase or round changes
  useEffect(() => {
    t.reset()
    t.start()
  }, [intervalPhase, round])

  const c = intervalPhase === 'work' ? tokens.work : tokens.rest
  const cBg = intervalPhase === 'work' ? tokens.workBg : tokens.restBg

  const handleSkip = () => {
    if (round >= TOTAL_ROUNDS && intervalPhase === 'rest') {
      logSet({
        exerciseId: exercise?.exercise_id || '',
        setIndex: round - 1,
        actualReps: null,
        actualLoad: exercise?.prescription.load || null,
        completedAt: Date.now(),
      })
      onNextBlock()
    } else {
      advance()
    }
  }

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: cBg,
      }}
    >
      <ActiveTopBar
        blockLabel={block.label || 'A'}
        blockName={block.name || 'Intervals'}
        blockType="interval"
        current={round}
        total={TOTAL_ROUNDS}
        onExit={onExit}
      />

      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '8px 16px 120px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Phase indicator */}
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 800,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: c,
            }}
          >
            {intervalPhase}
          </div>
          <div style={{ fontSize: 12, color: tokens.textMuted, marginTop: 4 }}>
            Round {round} of {TOTAL_ROUNDS}
          </div>
        </div>

        {/* Massive timer */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 280,
          }}
        >
          <CircularTimer
            remaining={t.remaining}
            total={t.total}
            leadCount={t.leadCount}
            phase={t.phase}
            size={260}
            accent={c}
          />
        </div>

        {/* Target callout */}
        <Card
          style={{
            marginTop: 16,
            padding: 14,
            borderColor: c,
            background: tokens.surface,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
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
                Target
              </div>
              <div style={{ fontSize: 17, fontWeight: 700, marginTop: 3 }}>
                {intervalPhase === 'work' ? '250 m' : '—'} / {WORK}s
              </div>
            </div>
            <Chip size="sm">DAMPER 5</Chip>
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
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn
            variant="secondary"
            size="lg"
            icon={t.phase === 'paused' ? 'play' : t.phase === 'idle' ? 'play' : 'pause'}
            style={{ width: 56, padding: 0 }}
            onClick={() => {
              if (t.isRunning) t.pause()
              else t.start()
            }}
          >
            {''}
          </Btn>
          <Btn
            variant="primary"
            size="lg"
            onClick={handleSkip}
            style={{ flex: 1 }}
            icon="skip"
            accent={c}
          >
            Skip {intervalPhase === 'work' ? 'to rest' : 'rest'}
          </Btn>
        </div>
      </div>
    </div>
  )
}
