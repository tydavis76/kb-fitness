import { useLiveQuery } from 'dexie-react-hooks'
import { useParams, useNavigate } from 'react-router-dom'
import { db } from '../db/db'
import { tokens } from '../styles/tokens'
import { ScreenHeader } from '../components/primitives/ScreenHeader'
import { Card } from '../components/primitives/Card'
import { Chip } from '../components/primitives/Chip'
import { Sectionlabel } from '../components/primitives/Sectionlabel'
import type { LoggedSet } from '../db/types'

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${String(secs).padStart(2, '0')}`
}

function formatDate(ts: number): string {
  const d = new Date(ts)
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${dayNames[d.getDay()]}, ${monthNames[d.getMonth()]} ${d.getDate()}`
}

function ratingToTone(rating: string | null): 'work' | 'accent' | 'danger' | 'default' {
  if (rating === 'easy') return 'work'
  if (rating === 'hard') return 'accent'
  if (rating === 'failed') return 'danger'
  return 'default'
}

function ratingLabel(rating: string | null): string {
  if (rating === 'easy') return 'Easy'
  if (rating === 'on_point') return 'On point'
  if (rating === 'hard') return 'Hard'
  if (rating === 'failed') return 'Failed'
  return '—'
}

// Group sets by exerciseId and deduplicate for display
function groupSetsByExercise(sets: LoggedSet[]): Map<string, LoggedSet[]> {
  const map = new Map<string, LoggedSet[]>()
  for (const set of sets) {
    const existing = map.get(set.exerciseId) ?? []
    existing.push(set)
    map.set(set.exerciseId, existing)
  }
  return map
}

export function SessionDetailScreen() {
  const { logId } = useParams<{ logId: string }>()
  const navigate = useNavigate()

  const log = useLiveQuery(
    () => logId ? db.workoutLogs.get(Number(logId)) : undefined,
    [logId]
  )

  if (log === undefined) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: tokens.bg }}>
        <ScreenHeader
          title="Session"
          leftIcon="‹"
          leftAction={() => navigate(-1)}
        />
        <div style={{ padding: 16, color: tokens.textMuted, textAlign: 'center' }}>
          Loading…
        </div>
      </div>
    )
  }

  if (!log) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: tokens.bg }}>
        <ScreenHeader
          title="Session"
          leftIcon="‹"
          leftAction={() => navigate(-1)}
        />
        <div style={{ padding: 16, color: tokens.textMuted, textAlign: 'center' }}>
          Session not found.
        </div>
      </div>
    )
  }

  const exerciseGroups = groupSetsByExercise(log.sets ?? [])

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto', background: tokens.bg }}>
      <ScreenHeader
        title="Session"
        subtitle={formatDate(log.completedAt)}
        leftIcon="‹"
        leftAction={() => navigate(-1)}
      />

      <div style={{ padding: '0 16px 16px' }}>
        {/* Summary card */}
        <Card elevated style={{ marginBottom: 12, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: tokens.text }}>{log.sessionId}</div>
            {log.rating && (
              <Chip size="sm" tone={ratingToTone(log.rating)}>
                {ratingLabel(log.rating)}
              </Chip>
            )}
          </div>

          <div style={{ display: 'flex', gap: 20 }}>
            <div>
              <div style={{
                fontSize: 10, fontWeight: 600, letterSpacing: '0.08em',
                textTransform: 'uppercase', color: tokens.textMuted, marginBottom: 2,
              }}>
                Duration
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: tokens.text }}>
                {formatDuration(log.durationSec)}
              </div>
            </div>

            {log.totalVolumeKg !== null && (
              <div>
                <div style={{
                  fontSize: 10, fontWeight: 600, letterSpacing: '0.08em',
                  textTransform: 'uppercase', color: tokens.textMuted, marginBottom: 2,
                }}>
                  Volume
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: tokens.text }}>
                  {log.totalVolumeKg.toLocaleString()}{' '}
                  <span style={{ fontSize: 12, color: tokens.textMuted, fontWeight: 500 }}>kg</span>
                </div>
              </div>
            )}

            <div>
              <div style={{
                fontSize: 10, fontWeight: 600, letterSpacing: '0.08em',
                textTransform: 'uppercase', color: tokens.textMuted, marginBottom: 2,
              }}>
                Sets
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: tokens.text }}>
                {(log.sets ?? []).length}
              </div>
            </div>
          </div>

          {log.notes ? (
            <div style={{
              marginTop: 12, padding: '10px 12px',
              background: tokens.surface3, borderRadius: 10,
              fontSize: 13, color: tokens.textMuted, lineHeight: 1.5,
            }}>
              {log.notes}
            </div>
          ) : null}
        </Card>

        {/* Exercises breakdown */}
        {exerciseGroups.size > 0 && (
          <>
            <Sectionlabel>Exercises</Sectionlabel>
            <Card padded={false}>
              {Array.from(exerciseGroups.entries()).map(([exerciseId, sets], i) => {
                // Compute total volume for this exercise
                let exVolume = 0
                for (const s of sets) {
                  if (s.actualReps !== null && s.actualLoad?.value !== null) {
                    const load = s.actualLoad?.value ?? 0
                    const unit = s.actualLoad?.unit
                    const weightKg = unit === 'lb' ? load / 2.20462 : load
                    exVolume += (s.actualReps ?? 0) * weightKg
                  }
                }

                return (
                  <button
                    key={exerciseId}
                    onClick={() => navigate(`../../exercise/${exerciseId}`)}
                    style={{
                      display: 'flex', alignItems: 'center', padding: '12px 14px', gap: 12,
                      borderTop: i > 0 ? `1px solid ${tokens.borderSoft}` : 'none',
                      background: 'transparent', border: 'none', color: tokens.text,
                      width: '100%', textAlign: 'left', cursor: 'pointer',
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{exerciseId}</div>
                      <div style={{ fontSize: 12, color: tokens.textMuted, marginTop: 1 }}>
                        {sets.length} sets
                        {exVolume > 0 && ` · ${Math.round(exVolume).toLocaleString()} kg`}
                      </div>
                    </div>
                    <span style={{ fontSize: 16, color: tokens.textMuted }}>›</span>
                  </button>
                )
              })}
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
