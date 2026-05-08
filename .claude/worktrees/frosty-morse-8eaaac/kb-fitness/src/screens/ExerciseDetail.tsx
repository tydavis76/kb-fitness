import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Dumbbell } from 'lucide-react'
import { getExerciseById } from '../data/exercises'
import { usePersonalBest, useExerciseHistory } from '../hooks/useDB'
import { Card, Chip } from '../components'
import type { Equipment } from '../data/exercises'

const EQUIPMENT_LABELS: Record<Equipment, string> = {
  kettlebell: 'Kettlebell',
  medicine_ball: 'Med Ball',
  bench_or_box: 'Bench',
  flat_surface: 'Floor',
  balance_support: 'Support',
  bodyweight: 'Bodyweight',
}

export default function ExerciseDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const exercise = getExerciseById(id ?? '')
  const { best } = usePersonalBest(id ?? '')
  const { logs } = useExerciseHistory(id ?? '')

  if (!exercise) {
    return (
      <div className="screen-content" style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>
        <p className="t-body">Exercise not found.</p>
      </div>
    )
  }

  const recentLogs = logs.slice(0, 10)

  return (
    <div className="screen-content" style={{ paddingBottom: 80 }}>
      {/* Back header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '12px 8px 4px' }}>
        <button
          onClick={() => navigate(-1)}
          aria-label="Back"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 8, display: 'flex', alignItems: 'center' }}
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="t-heading" style={{ fontSize: 20, flex: 1 }}>{exercise.name}</h1>
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Equipment chips */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {exercise.equipment.map(eq => (
            <Chip key={eq} color="default" label={EQUIPMENT_LABELS[eq]} />
          ))}
        </div>

        {/* Muscle groups */}
        <div>
          <div className="t-label" style={{ color: 'var(--text-muted)', marginBottom: 6 }}>Muscles</div>
          <div className="t-body">{exercise.muscleGroups.join(', ')}</div>
        </div>

        {/* Personal best */}
        {best && (
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Dumbbell size={14} color="var(--primary)" />
              <span className="t-label" style={{ color: 'var(--text-muted)' }}>Personal Best</span>
            </div>
            <span className="t-heading">
              {best.reps} reps × {best.weight} kg
            </span>
          </Card>
        )}

        {/* Instructions */}
        <div>
          <div className="t-label" style={{ color: 'var(--text-muted)', marginBottom: 10 }}>Instructions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {exercise.instructions.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 12 }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%', background: 'var(--primary)',
                  color: 'var(--bg)', fontSize: 12, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {i + 1}
                </div>
                <span className="t-body" style={{ lineHeight: 1.5 }}>{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        {exercise.notes && (
          <Card>
            <div className="t-label" style={{ color: 'var(--text-muted)', marginBottom: 4 }}>Notes</div>
            <span className="t-body">{exercise.notes}</span>
          </Card>
        )}

        {/* History */}
        {recentLogs.length > 0 && (
          <div>
            <div className="t-label" style={{ color: 'var(--text-muted)', marginBottom: 10 }}>Recent Sets</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {recentLogs.map(log => (
                <div key={log.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '8px 12px', background: 'var(--surface-2)', borderRadius: 8,
                  border: '1px solid var(--border)',
                }}>
                  <span className="t-label" style={{ color: 'var(--text-muted)' }}>{log.date}</span>
                  <span className="t-body">
                    {log.reps != null ? `${log.reps} reps` : `${log.durationSec}s`}
                    {log.weight != null ? ` × ${log.weight} kg` : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
