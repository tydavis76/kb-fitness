import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { SkipForward, CheckCircle, X, Minus, Plus } from 'lucide-react'
import { useWorkoutContext } from '../store/WorkoutContext'
import { useWorkoutSession } from '../hooks/useWorkoutSession'
import { useTimer } from '../hooks/useTimer'
import { Chip, PrimaryBtn, SecondaryBtn, Stepper, Card } from '../components'
import type { ProgramSession } from '../data/program'

const DEFAULT_REST_SEC = 90

export default function ActiveWorkout() {
  const { activeSession, clearSession } = useWorkoutContext()
  const navigate = useNavigate()

  if (!activeSession) {
    navigate('/', { replace: true })
    return null
  }

  return <WorkoutView session={activeSession} onFinish={() => { clearSession(); navigate('/') }} />
}

function WorkoutView({ session, onFinish }: { session: ProgramSession; onFinish: () => void }) {
  const ws = useWorkoutSession(session)
  const [reps, setReps] = useState(8)
  const [weight, setWeight] = useState(16)
  const [confirmQuit, setConfirmQuit] = useState(false)

  const block = session.blocks[ws.currentBlockIndex]
  const setSpec = block?.sets[ws.currentExerciseIndex]
  const restSec = setSpec?.restSec ?? DEFAULT_REST_SEC

  const timer = useTimer(restSec, () => ws.skipRest())

  useEffect(() => {
    if (ws.phase === 'rest') {
      timer.reset(restSec)
      timer.resume()
    } else {
      timer.reset(restSec)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ws.phase, ws.currentBlockIndex, ws.currentExerciseIndex, ws.currentSet])

  if (ws.phase === 'complete') {
    return <CompletionView onFinish={onFinish} />
  }

  const exerciseName = setSpec?.exerciseId.replace(/-/g, ' ') ?? ''
  const setsSpec = setSpec?.sets ?? '—'
  const repsSpec = setSpec?.reps ?? '—'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', background: 'var(--bg)', padding: '0 16px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 'env(safe-area-inset-top, 16px)', paddingBottom: 12, minHeight: 56 }}>
        <div>
          <div className="t-label" style={{ color: 'var(--text-muted)' }}>{session.name}</div>
          <div className="t-label" style={{ color: 'var(--text-muted)' }}>Block {ws.currentBlockIndex + 1}/{session.blocks.length}</div>
        </div>
        <button
          aria-label="Quit workout"
          onClick={() => setConfirmQuit(true)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 8 }}
        >
          <X size={22} />
        </button>
      </div>

      <div style={{ marginBottom: 12 }}>
        <Chip color={block?.color ?? 'default'} label={block?.name ?? ''} style={{ marginBottom: 8 }} />
      </div>

      {ws.phase === 'rest' ? (
        <RestView
          remaining={timer.remaining}
          isRunning={timer.isRunning}
          onPause={timer.pause}
          onResume={timer.resume}
          onAdd30={() => timer.addSeconds(30)}
          onSkip={ws.skipRest}
        />
      ) : (
        <WorkView
          exerciseName={exerciseName}
          setNum={ws.currentSet}
          setsSpec={setsSpec}
          repsSpec={repsSpec}
          reps={reps}
          weight={weight}
          onRepsDecrement={() => setReps(r => Math.max(0, r - 1))}
          onRepsIncrement={() => setReps(r => r + 1)}
          onWeightDecrement={() => setWeight(w => Math.max(0, w - 1))}
          onWeightIncrement={() => setWeight(w => w + 1)}
          onComplete={() => ws.markSetComplete(reps, weight)}
          notes={setSpec?.notes}
        />
      )}

      {confirmQuit && (
        <QuitDialog
          onConfirm={async () => { await ws.finishSession(); onFinish() }}
          onCancel={() => setConfirmQuit(false)}
        />
      )}
    </div>
  )
}

interface WorkViewProps {
  exerciseName: string
  setNum: number
  setsSpec: string
  repsSpec: string
  reps: number
  weight: number
  onRepsDecrement: () => void
  onRepsIncrement: () => void
  onWeightDecrement: () => void
  onWeightIncrement: () => void
  onComplete: () => void
  notes?: string
}

function WorkView({
  exerciseName, setNum, setsSpec, repsSpec,
  reps, weight, onRepsDecrement, onRepsIncrement,
  onWeightDecrement, onWeightIncrement, onComplete, notes,
}: WorkViewProps) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1 }}>
        <div className="t-heading" style={{ fontSize: 26, marginBottom: 4, textTransform: 'capitalize' }}>
          {exerciseName}
        </div>
        <div className="t-label" style={{ color: 'var(--text-muted)', marginBottom: 24 }}>
          Set {setNum} · Target {setsSpec} sets × {repsSpec} reps
        </div>

        {notes && (
          <Card style={{ marginBottom: 20 }}>
            <span className="t-label" style={{ color: 'var(--text-muted)' }}>{notes}</span>
          </Card>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <div className="t-label" style={{ color: 'var(--text-muted)', marginBottom: 8 }}>Reps</div>
            <Stepper value={reps} onDecrement={onRepsDecrement} onIncrement={onRepsIncrement} unit="reps" />
          </div>
          <div>
            <div className="t-label" style={{ color: 'var(--text-muted)', marginBottom: 8 }}>Weight</div>
            <Stepper value={weight} onDecrement={onWeightDecrement} onIncrement={onWeightIncrement} unit="kg" />
          </div>
        </div>
      </div>

      <PrimaryBtn large onClick={onComplete} icon={CheckCircle} style={{ width: '100%' }}>
        Complete Set
      </PrimaryBtn>
    </div>
  )
}

interface RestViewProps {
  remaining: number
  isRunning: boolean
  onPause: () => void
  onResume: () => void
  onAdd30: () => void
  onSkip: () => void
}

function RestView({ remaining, isRunning, onPause, onResume, onAdd30, onSkip }: RestViewProps) {
  const mins = Math.floor(remaining / 60)
  const secs = remaining % 60
  const display = `${mins}:${String(secs).padStart(2, '0')}`

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 72, fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: 'var(--primary)', lineHeight: 1 }}>
          {display}
        </div>
        <div className="t-label" style={{ color: 'var(--text-muted)', marginTop: 8 }}>Rest</div>
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <SecondaryBtn icon={isRunning ? Minus : Plus} onClick={isRunning ? onPause : onResume}>
          {isRunning ? 'Pause' : 'Resume'}
        </SecondaryBtn>
        <SecondaryBtn onClick={onAdd30}>+30s</SecondaryBtn>
        <SecondaryBtn icon={SkipForward} onClick={onSkip}>Skip Rest</SecondaryBtn>
      </div>
    </div>
  )
}

function CompletionView({ onFinish }: { onFinish: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh', gap: 24, padding: '0 32px', background: 'var(--bg)' }}>
      <CheckCircle size={64} color="var(--primary)" />
      <div className="t-heading" style={{ fontSize: 28, textAlign: 'center' }}>Workout Complete!</div>
      <div className="t-label" style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Great work. Your session has been saved.</div>
      <PrimaryBtn large onClick={onFinish} style={{ width: '100%' }}>Done</PrimaryBtn>
    </div>
  )
}

function QuitDialog({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'flex-end', zIndex: 200,
    }}>
      <div style={{
        width: '100%', background: 'var(--surface)', borderRadius: '20px 20px 0 0',
        padding: '24px 20px calc(env(safe-area-inset-bottom, 16px) + 24px)',
      }}>
        <div className="t-heading" style={{ marginBottom: 8 }}>End workout?</div>
        <div className="t-label" style={{ color: 'var(--text-muted)', marginBottom: 24 }}>
          Your sets so far will be saved.
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <SecondaryBtn onClick={onCancel} style={{ flex: 1 }}>Keep going</SecondaryBtn>
          <PrimaryBtn onClick={onConfirm} style={{ flex: 1, background: 'var(--danger)' }}>End workout</PrimaryBtn>
        </div>
      </div>
    </div>
  )
}
