import { useState, useEffect } from 'react'
import type { WorkoutBlock, LoadObject } from '@/db/types'
import { useActiveWorkout } from '@/context/ActiveWorkoutContext'
import { Icon } from '@/components/Icon'
import { Btn } from '@/components/primitives/Btn'
import { Chip } from '@/components/primitives/Chip'
import { RestTimer } from '@/components/RestTimer'
import { CircularTimer } from '@/components/CircularTimer'
import { ExerciseInfoButton } from '@/components/ExerciseInfoButton'
import { ActiveTopBar } from './ActiveTopBar'
import { useCountdown } from '@/hooks/useCountdown'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db/db'
import { tokens } from '@/styles/tokens'

function SideTransition({ durationSec, onDone }: { durationSec: number; onDone: () => void }) {
  const timer = useCountdown({ duration: durationSec, leadIn: 0, onComplete: onDone })
  useEffect(() => { timer.start() }, [])
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, padding: '0 32px' }}>
      <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: tokens.textMuted }}>
        Get ready
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>
        Switch to right side
      </div>
      <CircularTimer remaining={timer.remaining} total={timer.total} leadCount={0} phase={timer.phase} size={140} accent={tokens.accent} />
      <button onClick={onDone} style={{ fontSize: 13, color: tokens.textMuted, background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'underline' }}>
        Skip
      </button>
    </div>
  )
}

interface ActiveComplexProps {
  block: WorkoutBlock
  onExit: () => void
  onNextBlock: () => void
}

export function ActiveComplex({ block, onExit, onNextBlock }: ActiveComplexProps) {
  const { logSet } = useActiveWorkout()
  const settings = useLiveQuery(() => db.settings.get(1))
  const [round, setRound] = useState(1)
  const [sidePhase, setSidePhase] = useState<'left' | 'switching' | 'right'>('left')
  const [showRest, setShowRest] = useState(false)
  const [selectedKg, setSelectedKg] = useState<number | null>(null)

  const rounds = block.rounds || 1
  const exercises = block.exercises
  const effectiveRestSec = block.rest_sec ?? 60
  const sideSwitchSec = settings?.sideSwitchSec ?? 5
  const ownedKettlebells: number[] = settings?.ownedKettlebells ?? [16, 20, 24, 32]

  const isPerSide = exercises.some(ex =>
    ex.prescription.load.label.toLowerCase().includes('per side')
  )

  const kgLoad = (kg: number): LoadObject => ({ value: kg, unit: 'kg', label: `${kg} kg` })

  const logRound = (side: 'left' | 'right') => {
    exercises.forEach((ex, idx) => {
      logSet({
        exerciseId: ex.exercise_id,
        setIndex: (round - 1) * exercises.length * (isPerSide ? 2 : 1) + idx + (side === 'right' ? exercises.length : 0),
        actualReps: ex.prescription.type === 'reps' ? (ex.prescription.target as number) : null,
        actualLoad: selectedKg !== null ? kgLoad(selectedKg) : ex.prescription.load,
        completedAt: Date.now(),
      })
    })
  }

  const handleCompleteSide = () => {
    if (isPerSide && sidePhase === 'left') {
      logRound('left')
      setSidePhase('switching')
    } else {
      if (isPerSide) logRound('right')
      else logRound('left')

      if (round >= rounds) {
        onNextBlock()
      } else if (effectiveRestSec > 0) {
        setShowRest(true)
      } else {
        setRound(r => r + 1)
        setSidePhase('left')
      }
    }
  }

  const handleRestDone = () => {
    setShowRest(false)
    setRound(r => r + 1)
    setSidePhase('left')
  }

  if (showRest) {
    return <RestTimer durationSec={effectiveRestSec} onDone={handleRestDone} />
  }

  // Kettlebell weight picker
  if (selectedKg === null) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <ActiveTopBar blockLabel={block.label || 'A'} blockName={block.name || 'Complex'} blockType="complex" current={1} total={rounds} onExit={onExit} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 24px 80px' }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: tokens.textMuted, marginBottom: 8, textAlign: 'center' }}>
            Select kettlebell
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', textAlign: 'center', marginBottom: 4 }}>
            {block.name || 'Complex'}
          </div>
          <div style={{ fontSize: 13, color: tokens.textMuted, textAlign: 'center', marginBottom: 6 }}>
            {exercises.length} exercises · {rounds} rounds{isPerSide ? ' · per side' : ''}
          </div>
          <div style={{ fontSize: 12, color: tokens.accent, textAlign: 'center', marginBottom: 28, fontWeight: 600 }}>
            Same weight both sides — don't set down between exercises
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {ownedKettlebells.map(kg => (
              <button key={kg} onClick={() => setSelectedKg(kg)} style={{ width: '100%', padding: '20px 24px', borderRadius: 16, border: `1px solid ${tokens.border}`, background: tokens.surface, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontFamily: 'inherit', color: tokens.text }}>
                <span style={{ fontSize: 28, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{kg} kg</span>
                <span style={{ fontSize: 13, color: tokens.textMuted, fontWeight: 600 }}>{Math.round(kg * 2.205)} lb</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Side transition screen
  if (sidePhase === 'switching') {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <ActiveTopBar blockLabel={block.label || 'A'} blockName={block.name || 'Complex'} blockType="complex" current={round} total={rounds} onExit={onExit} />
        <SideTransition durationSec={sideSwitchSec} onDone={() => setSidePhase('right')} />
      </div>
    )
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <ActiveTopBar blockLabel={block.label || 'A'} blockName={block.name || 'Complex'} blockType="complex" current={round} total={rounds} onExit={onExit} />

      <div style={{ flex: 1, overflow: 'auto', padding: '8px 16px 120px' }}>
        {/* Round + side header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: tokens.textMuted, fontWeight: 600 }}>Round {round} of {rounds}</div>
            <div style={{ fontSize: 11, color: tokens.textMuted, marginTop: 2 }}>
              {selectedKg} kg · don't set down between exercises
            </div>
          </div>
          {isPerSide && (
            <Chip tone={sidePhase === 'left' ? 'work' : 'accent'} size="sm">
              {sidePhase === 'left' ? 'LEFT SIDE' : 'RIGHT SIDE'}
            </Chip>
          )}
        </div>

        {/* Exercise flow list */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {exercises.map((ex, i) => (
            <div key={ex.exercise_id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px', background: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: 14 }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: tokens.surface2, color: tokens.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{ex.name}</div>
                  <div style={{ fontSize: 12, color: tokens.textMuted, marginTop: 2 }}>
                    {ex.prescription.target} reps · {selectedKg} kg
                  </div>
                </div>
                <ExerciseInfoButton exerciseId={ex.exercise_id} />
              </div>
              {i < exercises.length - 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0' }}>
                  <Icon name="chevron-down" size={16} color={tokens.textDim} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 64, padding: 16, background: tokens.bg, borderTop: `1px solid ${tokens.border}` }}>
        <Btn variant="primary" size="lg" style={{ width: '100%' }} icon="check" onClick={handleCompleteSide}>
          {isPerSide
            ? (sidePhase === 'left' ? 'Complete left side' : 'Complete right side')
            : 'Complete round'}
        </Btn>
      </div>
    </div>
  )
}
