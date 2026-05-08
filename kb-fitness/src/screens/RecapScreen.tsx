import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useActiveWorkout } from '@/context/ActiveWorkoutContext'
import { tokens } from '@/styles/tokens'

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const calculateTotalVolume = (state: any): number => {
  let total = 0
  for (const blockState of state.blockStates) {
    for (const set of blockState.setData) {
      if (set.actualReps !== null && set.actualLoad?.value !== null) {
        let weightKg = set.actualLoad.value
        if (set.actualLoad.unit === 'lb') {
          weightKg = set.actualLoad.value / 2.20462
        }
        total += set.actualReps * weightKg
      }
    }
  }
  return Math.round(total)
}

interface RatingOption {
  id: 'easy' | 'on_point' | 'hard' | 'failed'
  label: string
  sub: string
  tone: string
}

const RATING_OPTIONS: RatingOption[] = [
  { id: 'easy', label: 'Easy', sub: 'Add 5 lb', tone: tokens.primary },
  { id: 'on_point', label: 'Just right', sub: 'Hold load', tone: tokens.text },
  { id: 'hard', label: 'Hard', sub: '−5 lb', tone: tokens.accent },
  { id: 'failed', label: 'Failed', sub: 'Repeat day', tone: tokens.danger },
]

export function RecapScreen() {
  const nav = useNavigate()
  const { state, completeWorkout } = useActiveWorkout()
  const [selectedRating, setSelectedRating] = useState<'easy' | 'on_point' | 'hard' | 'failed' | null>(null)
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!state.session || state.startedAt === null) {
    return <div style={{ padding: 16, color: tokens.text }}>No active workout</div>
  }

  const totalVolumeKg = calculateTotalVolume(state)
  const elapsedSeconds = Math.floor((Date.now() - state.startedAt) / 1000)
  const durationStr = formatDuration(elapsedSeconds)
  const totalSets = state.blockStates.reduce((sum: number, bs: any) => sum + bs.setData.length, 0)

  const handleDone = async () => {
    if (!selectedRating) return
    setIsSubmitting(true)
    try {
      await completeWorkout(selectedRating, notes)
      nav('/')
    } catch (error) {
      console.error('Failed to complete workout:', error)
      setIsSubmitting(false)
    }
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto', background: tokens.bg }}>
      {/* Header */}
      <div style={{ padding: '16px', borderBottom: `1px solid ${tokens.borderSoft}`, background: tokens.surface }}>
        <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 4, color: tokens.text }}>Workout complete</div>
        <div style={{ fontSize: 14, color: tokens.textMuted }}>
          {state.session.metadata.title} · {durationStr}
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ padding: '16px', flex: 1, overflow: 'auto' }}>
        {/* Total volume card */}
        <div
          style={{
            background: tokens.surface,
            border: `1px solid ${tokens.border}`,
            borderRadius: 12,
            padding: 20,
            marginBottom: 16,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: tokens.textMuted, marginBottom: 8 }}>
            Total volume
          </div>
          <div
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: tokens.primary,
              letterSpacing: '-0.02em',
              fontVariantNumeric: 'tabular-nums',
              lineHeight: 1,
            }}
          >
            {totalVolumeKg.toLocaleString()}
          </div>
          <div style={{ fontSize: 14, color: tokens.textMuted, marginTop: 4 }}>
            kg moved · {totalSets} sets logged
          </div>
        </div>

        {/* Block breakdown */}
        <div style={{ marginBottom: 8, fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: tokens.textMuted }}>
          Breakdown
        </div>
        <div
          style={{
            background: tokens.surface,
            border: `1px solid ${tokens.border}`,
            borderRadius: 12,
            overflow: 'hidden',
            marginBottom: 16,
          }}
        >
          {state.session.blocks.map((block, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 14px',
                gap: 10,
                borderTop: i > 0 ? `1px solid ${tokens.borderSoft}` : 'none',
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 6,
                  background: tokens.surface3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 700,
                  color: tokens.text,
                }}
              >
                {block.label || i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: tokens.text }}>{block.name || `Block ${i + 1}`}</div>
                <div style={{ fontSize: 12, color: tokens.textMuted }}>
                  {block.exercises.length} ex · {block.type}
                </div>
              </div>
              <div style={{ color: tokens.primary, fontSize: 20 }}>✓</div>
            </div>
          ))}
        </div>

        {/* Rating section */}
        <div style={{ marginBottom: 8, fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: tokens.textMuted }}>
          How did that feel?
        </div>
        <div
          style={{
            background: tokens.surface,
            border: `1px solid ${tokens.border}`,
            borderRadius: 12,
            overflow: 'hidden',
            marginBottom: 16,
          }}
        >
          <div style={{ padding: 14, display: 'flex', gap: 8 }}>
            {RATING_OPTIONS.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedRating(option.id)}
                aria-pressed={selectedRating === option.id}
                style={{
                  flex: 1,
                  padding: '12px 6px',
                  background: selectedRating === option.id ? tokens.surface2 : 'transparent',
                  border: `1px solid ${selectedRating === option.id ? option.tone : tokens.border}`,
                  borderRadius: 12,
                  cursor: 'pointer',
                  color: tokens.text,
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, color: selectedRating === option.id ? option.tone : tokens.text }}>
                  {option.label}
                </div>
                <div style={{ fontSize: 10, color: tokens.textMuted, marginTop: 3, fontVariantNumeric: 'tabular-nums' }}>
                  {option.sub}
                </div>
              </button>
            ))}
          </div>
          {selectedRating && (
            <div
              style={{
                padding: '12px 14px',
                borderTop: `1px solid ${tokens.borderSoft}`,
                fontSize: 12,
                color: tokens.textMuted,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span style={{ fontSize: 14 }}>✨</span>
              <span>Next workout will auto-adjust loads based on your feedback.</span>
            </div>
          )}
        </div>

        {/* Notes textarea */}
        <div style={{ marginBottom: 8, fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: tokens.textMuted }}>
          Notes
        </div>
        <textarea
          placeholder="Add notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={{
            width: '100%',
            padding: 12,
            marginBottom: 16,
            background: tokens.surface,
            border: `1px solid ${tokens.border}`,
            borderRadius: 12,
            color: tokens.text,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: 14,
            resize: 'vertical',
            minHeight: 80,
            boxSizing: 'border-box',
          }}
        />

        {/* Done button */}
        <button
          onClick={handleDone}
          disabled={!selectedRating || isSubmitting}
          style={{
            width: '100%',
            padding: '12px 16px',
            height: 44,
            background: selectedRating && !isSubmitting ? tokens.primary : tokens.surface3,
            border: 'none',
            borderRadius: 12,
            color: selectedRating && !isSubmitting ? tokens.bg : tokens.textMuted,
            fontWeight: 700,
            fontSize: 14,
            cursor: selectedRating && !isSubmitting ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s ease',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          {isSubmitting ? 'Saving...' : 'Done'}
        </button>
      </div>
    </div>
  )
}
