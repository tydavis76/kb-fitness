import { useState, useEffect } from 'react'
import type { WorkoutBlock } from '@/db/types'
import { useActiveWorkout } from '@/context/ActiveWorkoutContext'
import { Icon } from '@/components/Icon'
import { Btn } from '@/components/primitives/Btn'
import { Chip } from '@/components/primitives/Chip'
import { RestTimer } from '@/components/RestTimer'
import { CircularTimer } from '@/components/CircularTimer'
import { ExerciseInfoButton } from '@/components/ExerciseInfoButton'
import { ActiveTopBar } from './ActiveTopBar'
import { useCountdown } from '@/hooks/useCountdown'
import { useLeadIn } from '@/hooks/useLeadIn'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db/db'
import { tokens } from '@/styles/tokens'

function ExerciseTimer({ durationSec, leadIn, onComplete }: { durationSec: number; leadIn: number; onComplete: () => void }) {
  const timer = useCountdown({ duration: durationSec, leadIn, onComplete })
  useEffect(() => { timer.start() }, [])
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0', position: 'relative' }}>
      <CircularTimer remaining={timer.remaining} total={timer.total} leadCount={timer.leadCount} phase={timer.phase} size={88} />
    </div>
  )
}

function SideTransition({ durationSec, nextSide, onDone }: { durationSec: number; nextSide: 'right'; onDone: () => void }) {
  const timer = useCountdown({ duration: durationSec, leadIn: 0, onComplete: onDone })
  useEffect(() => { timer.start() }, [])
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, padding: '0 32px' }}>
      <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: tokens.textMuted }}>
        Get ready
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>
        Switch to {nextSide} side
      </div>
      <CircularTimer remaining={timer.remaining} total={timer.total} leadCount={0} phase={timer.phase} size={140} accent={tokens.accent} />
      <button
        onClick={onDone}
        style={{ marginTop: 8, fontSize: 13, color: tokens.textMuted, background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'underline' }}
      >
        Skip
      </button>
    </div>
  )
}

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
  const [leadIn] = useLeadIn()
  const settings = useLiveQuery(() => db.settings.get(1))
  const [round, setRound] = useState(1)
  const [exerciseIdx, setExerciseIdx] = useState(0)
  const [showRest, setShowRest] = useState(false)
  const [selectedKg, setSelectedKg] = useState<number | null>(null)
  const [sidePhase, setSidePhase] = useState<'left' | 'switching' | 'right'>('left')

  const rounds = block.rounds || 1
  const exercises = block.exercises
  const currentEx = exercises[exerciseIdx]
  const isCurrentTimeBased = currentEx?.prescription.type === 'time'
  const isCurrentPerSide = currentEx?.prescription.per_side === true && isCurrentTimeBased
  const effectiveRestSec = block.rest_sec ?? settings?.restDefaults?.circuit ?? 60
  const sideSwitchSec = settings?.sideSwitchSec ?? 5

  const isKettlebellOnly = exercises.every(ex =>
    ex.prescription.load.unit === 'lbs' || ex.prescription.load.label.toLowerCase().includes('kettlebell')
  )
  const ownedKettlebells: number[] = settings?.ownedKettlebells ?? [16, 20, 24, 32]

  const kgLoad = (kg: number): import('@/db/types').LoadObject => ({
    value: kg, unit: 'kg', label: `${kg} kg`,
  })

  // Reset side phase when exercise changes
  useEffect(() => { setSidePhase('left') }, [exerciseIdx])

  if (exercises.length === 0) return null

  const handleDoneExercise = () => {
    const ex = exercises[exerciseIdx]
    const load = isKettlebellOnly && selectedKg !== null
      ? kgLoad(selectedKg)
      : ex.prescription.load
    logSet({
      exerciseId: ex.exercise_id,
      setIndex: (round - 1) * exercises.length + exerciseIdx,
      actualReps:
        ex.prescription.type === 'reps' ? (ex.prescription.target as number) : null,
      actualLoad: load,
      completedAt: Date.now(),
    })

    if (exerciseIdx === exercises.length - 1) {
      if (round >= rounds) {
        onNextBlock()
      } else {
        if (effectiveRestSec > 0) {
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

  const handleTimerComplete = () => {
    if (isCurrentPerSide && sidePhase === 'left') {
      setSidePhase('switching')
    } else {
      handleDoneExercise()
    }
  }

  if (showRest) {
    return <RestTimer durationSec={effectiveRestSec} onDone={handleRestDone} />
  }

  if (isCurrentPerSide && sidePhase === 'switching') {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <ActiveTopBar
          blockLabel={block.label || 'A'}
          blockName={block.name || 'Circuit'}
          blockType="circuit"
          current={round}
          total={rounds}
          onExit={onExit}
        />
        <SideTransition
          durationSec={sideSwitchSec}
          nextSide="right"
          onDone={() => setSidePhase('right')}
        />
      </div>
    )
  }

  if (isKettlebellOnly && selectedKg === null) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <ActiveTopBar
          blockLabel={block.label || 'A'}
          blockName={block.name || 'Circuit'}
          blockType="circuit"
          current={1}
          total={rounds}
          onExit={onExit}
        />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 24px 80px' }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: tokens.textMuted, marginBottom: 8, textAlign: 'center' }}>
            Select kettlebell
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', textAlign: 'center', marginBottom: 4 }}>
            {block.name || 'Circuit'}
          </div>
          <div style={{ fontSize: 13, color: tokens.textMuted, textAlign: 'center', marginBottom: 32 }}>
            {exercises.length} exercises · {rounds} rounds
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {ownedKettlebells.map(kg => (
              <button
                key={kg}
                onClick={() => setSelectedKg(kg)}
                style={{
                  width: '100%', padding: '20px 24px',
                  borderRadius: 16, border: `1px solid ${tokens.border}`,
                  background: tokens.surface,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  cursor: 'pointer', fontFamily: 'inherit', color: tokens.text,
                }}
              >
                <span style={{ fontSize: 28, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{kg} kg</span>
                <span style={{ fontSize: 13, color: tokens.textMuted, fontWeight: 600 }}>
                  {Math.round(kg * 2.205)} lb
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
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
              {effectiveRestSec}s rest between rounds
            </div>
            {selectedKg !== null && (
              <div style={{ fontSize: 12, color: tokens.accent, marginTop: 2, fontWeight: 600 }}>
                {selectedKg} kg kettlebell
              </div>
            )}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: done ? tokens.textMuted : tokens.text,
                      flex: 1,
                    }}
                  >
                    {ex.name}
                  </div>
                  <ExerciseInfoButton exerciseId={ex.exercise_id} />
                </div>
                <div style={{ fontSize: 12, color: tokens.textMuted, marginTop: 2 }}>
                  {ex.prescription.per_side ? `${targetValue}s per side` : `${targetValue}${ex.prescription.type === 'time' ? 's' : ' reps'}`}
                  {' · '}{ex.prescription.load.label}
                </div>
                {active && ex.prescription.type === 'time' && (
                  <>
                    {ex.prescription.per_side && (
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: tokens.accent, marginTop: 6 }}>
                        {sidePhase === 'right' ? 'Right side' : 'Left side'}
                      </div>
                    )}
                    <ExerciseTimer
                      key={`${round}-${idx}-${sidePhase}`}
                      durationSec={targetValue}
                      leadIn={active && idx === exerciseIdx ? leadIn : 0}
                      onComplete={handleTimerComplete}
                    />
                  </>
                )}
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
          bottom: 64,
          padding: 16,
          background: tokens.bg,
          borderTop: `1px solid ${tokens.border}`,
        }}
      >
        <Btn
          variant={isCurrentTimeBased ? 'secondary' : 'primary'}
          size="lg"
          onClick={isCurrentTimeBased ? handleTimerComplete : handleDoneExercise}
          style={{ width: '100%' }}
          icon={isCurrentTimeBased ? 'arrow-right' : 'check'}
        >
          {isCurrentTimeBased
            ? (isCurrentPerSide && sidePhase === 'left' ? 'Skip to right side' : 'Skip')
            : 'Next'}
        </Btn>
      </div>
    </div>
  )
}
