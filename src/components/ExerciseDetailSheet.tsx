import { tokens } from '../styles/tokens'
import { Icon } from './Icon'
import { Chip } from './primitives/Chip'
import { Card } from './primitives/Card'
import { Sectionlabel } from './primitives/Sectionlabel'
import { Btn } from './primitives/Btn'
import { MuscleDiagram } from './MuscleDiagram'
import { getExerciseDetail, EXERCISES, SUBSTITUTIONS, type Exercise } from '../data/exercises'

function VideoCard({ exercise, height = 180 }: { exercise: Exercise; height?: number }) {
  const det = getExerciseDetail(exercise)
  const eqIcon =
    exercise.equipment === 'kettlebell' ? 'kettlebell' :
    exercise.equipment === 'trx' ? 'trx' :
    exercise.equipment === 'pull-up bar' ? 'pull-bar' :
    exercise.equipment === 'band' ? 'band' :
    exercise.equipment === 'rower' ? 'rower' :
    exercise.equipment === 'bodyweight' ? 'flame' : 'dumbbell'

  return (
    <div style={{
      position: 'relative', width: '100%', height,
      borderRadius: 14, overflow: 'hidden',
      background: `linear-gradient(135deg, ${tokens.surface3} 0%, ${tokens.surface2} 100%)`,
      border: `1px solid ${tokens.border}`,
    }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.08, display: 'flex', alignItems: 'center', justifyContent: 'center', color: tokens.text }}>
        <div style={{ transform: 'scale(4.5) rotate(-12deg)' }}>
          <Icon name={eqIcon} size={28} />
        </div>
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.45) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: det?.youtubeId ? tokens.primary : tokens.surface3,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M8 5l11 7-11 7V5z" fill={det?.youtubeId ? tokens.bg : tokens.textMuted} />
          </svg>
        </div>
      </div>
      <div style={{ position: 'absolute', top: 10, left: 10, padding: '4px 8px', borderRadius: 6, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#fff' }}>
        {exercise.equipment}
      </div>
      {det?.youtubeId ? (
        <div style={{ position: 'absolute', bottom: 10, right: 10, padding: '4px 8px', borderRadius: 6, background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: 11, fontWeight: 700 }}>
          {det.duration} · YouTube
        </div>
      ) : (
        <div style={{ position: 'absolute', bottom: 10, left: 10, fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: tokens.textMuted }}>
          No demo yet
        </div>
      )}
    </div>
  )
}

interface ExerciseDetailSheetProps {
  open: boolean
  onClose: () => void
  exercise: Exercise | null
  mode?: 'view' | 'picker'
  onPick?: (ex: Exercise) => void
}

export function ExerciseDetailSheet({ open, onClose, exercise, mode = 'view', onPick }: ExerciseDetailSheetProps) {
  if (!open || !exercise) return null
  const det = getExerciseDetail(exercise)
  if (!det) return null

  const subs = SUBSTITUTIONS[exercise.id]

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: 64 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} />
      <div style={{
        position: 'relative', maxHeight: '92%', overflow: 'auto',
        background: tokens.bg, borderTopLeftRadius: 22, borderTopRightRadius: 22,
        borderTop: `1px solid ${tokens.border}`,
        boxShadow: '0 -16px 48px rgba(0,0,0,0.55)',
        padding: '10px 16px 24px',
      }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: tokens.border, margin: '4px auto 14px' }} />

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: tokens.accent }}>{det.category}</div>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em', marginTop: 2 }}>{exercise.name}</div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, background: tokens.surface2, border: `1px solid ${tokens.border}`, color: tokens.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="close" size={16} />
          </button>
        </div>

        <div style={{ marginBottom: 14 }}>
          <VideoCard exercise={exercise} height={170} />
        </div>

        {det.youtubeId && (
          <a
            href={`https://www.youtube.com/watch?v=${det.youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              width: '100%', height: 44, marginBottom: 14,
              background: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: 12,
              color: tokens.text, fontFamily: 'inherit', fontWeight: 600, fontSize: 13,
              textDecoration: 'none',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M8 5l11 7-11 7V5z" fill={tokens.text} /></svg>
            Watch demo on YouTube
            <span style={{ marginLeft: 'auto', fontSize: 11, color: tokens.textMuted }}>↗</span>
          </a>
        )}

        <div style={{ fontSize: 14, lineHeight: 1.5, color: tokens.text, marginBottom: 14 }}>
          {det.description}
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 16, padding: 12, background: tokens.surface, borderRadius: 12, border: `1px solid ${tokens.border}` }}>
          <MuscleDiagram primary={[...exercise.primary, ...det.secondary]} size={72} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: tokens.textMuted, marginBottom: 4 }}>Equipment</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                <Chip size="sm">{exercise.equipment}</Chip>
              </div>
            </div>
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: tokens.textMuted, marginBottom: 4 }}>Primary</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {exercise.primary.map(m => <Chip key={m} size="sm" tone="accent">{m}</Chip>)}
              </div>
            </div>
            {det.secondary.length > 0 && (
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: tokens.textMuted, marginBottom: 4 }}>Secondary</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {det.secondary.map(m => <Chip key={m} size="sm">{m}</Chip>)}
                </div>
              </div>
            )}
          </div>
        </div>

        <Sectionlabel>Technique cues</Sectionlabel>
        <Card padded={false} style={{ marginBottom: 14 }}>
          {det.cues.map((cue, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 14px', borderTop: i > 0 ? `1px solid ${tokens.borderSoft}` : 'none' }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: tokens.surface2, color: tokens.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>
                {i + 1}
              </div>
              <div style={{ flex: 1, fontSize: 13, lineHeight: 1.45, paddingTop: 2 }}>{cue}</div>
            </div>
          ))}
        </Card>

        {subs && (
          <>
            <Sectionlabel>Common substitutions</Sectionlabel>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
              {subs.map(sid => {
                const sub = EXERCISES.find(e => e.id === sid)
                return sub ? <Chip key={sid} size="sm">{sub.name}</Chip> : null
              })}
            </div>
          </>
        )}

        {mode === 'picker' && (
          <div style={{ position: 'sticky', bottom: -16, marginLeft: -16, marginRight: -16, marginBottom: -16, padding: 16, background: tokens.bg, borderTop: `1px solid ${tokens.border}` }}>
            <Btn variant="primary" size="lg" full icon="plus" onClick={() => onPick && onPick(exercise)}>
              Add to workout
            </Btn>
          </div>
        )}
      </div>
    </div>
  )
}
