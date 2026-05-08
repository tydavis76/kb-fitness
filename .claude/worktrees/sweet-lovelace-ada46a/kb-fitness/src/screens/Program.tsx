import { useState } from 'react'
import { useSessionLogs } from '../hooks/useDB'
import { SESSION_ORDER, getSession, getPhaseForWeek } from '../data/program'
import type { SessionType } from '../db/types'
import { ScreenHeader, Card, Chip, ProgressBar, BottomSheet } from '../components'
import { CheckCircle, Clock, ChevronRight } from 'lucide-react'

const TOTAL_SESSIONS = 8 * SESSION_ORDER.length

export default function Program() {
  const { logs, loading } = useSessionLogs()
  const [selectedWeek, setSelectedWeek] = useState(1)
  const [previewSession, setPreviewSession] = useState<SessionType | null>(null)

  if (loading) return <div className="screen-content" />

  const completedSet = new Set(logs.map(l => `${l.week}-${l.sessionType}`))
  const totalCompleted = logs.length
  const progressPct = Math.round((totalCompleted / TOTAL_SESSIONS) * 100)
  const phase = getPhaseForWeek(selectedWeek)

  return (
    <div className="screen-content" style={{ paddingBottom: 80 }}>
      <ScreenHeader title="Program" subtitle="8 Weeks to a Healthier You" />

      <div style={{ padding: '0 16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span className="t-label" style={{ color: 'var(--text-muted)' }}>Overall progress</span>
          <span className="t-label">{totalCompleted}/{TOTAL_SESSIONS} sessions</span>
        </div>
        <ProgressBar value={progressPct} />
      </div>

      <div style={{ overflowX: 'auto', padding: '0 16px 16px', display: 'flex', gap: 8, scrollbarWidth: 'none' }}>
        {Array.from({ length: 8 }, (_, i) => i + 1).map(w => {
          const weekCompleted = SESSION_ORDER.filter(s => completedSet.has(`${w}-${s}`)).length
          const isSelected = w === selectedWeek
          return (
            <button
              key={w}
              onClick={() => setSelectedWeek(w)}
              style={{
                flexShrink: 0,
                padding: '8px 16px',
                borderRadius: 999,
                border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                background: isSelected ? 'var(--surface-2)' : 'var(--surface)',
                color: isSelected ? 'var(--primary)' : 'var(--text)',
                cursor: 'pointer',
                position: 'relative',
              }}
            >
              <span className="t-label">W{w}</span>
              {weekCompleted === SESSION_ORDER.length && (
                <span style={{ position: 'absolute', top: -4, right: -4, width: 10, height: 10, borderRadius: '50%', background: 'var(--primary)' }} />
              )}
            </button>
          )
        })}
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span className="t-label" style={{ color: 'var(--text-muted)', marginBottom: 4 }}>Phase {phase.phase}</span>
        {SESSION_ORDER.map(sessionType => {
          const session = getSession(selectedWeek, sessionType)
          const done = completedSet.has(`${selectedWeek}-${sessionType}`)
          return (
            <Card
              key={sessionType}
              style={{ opacity: done ? 0.5 : 1, cursor: 'pointer' }}
              onClick={() => setPreviewSession(sessionType)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span className="t-body">{session.name}</span>
                    {done && <CheckCircle size={14} color="var(--primary)" />}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)' }}>
                    <Clock size={12} />
                    <span className="t-label">~{session.estimatedMin} min</span>
                    <span className="t-label">·</span>
                    <Chip color={session.blocks[0]?.color ?? 'default'} label={session.type} />
                  </div>
                </div>
                <ChevronRight size={16} color="var(--text-muted)" />
              </div>
            </Card>
          )
        })}
      </div>

      {previewSession && (
        <BottomSheet onClose={() => setPreviewSession(null)}>
          <SessionPreview week={selectedWeek} sessionType={previewSession} />
        </BottomSheet>
      )}
    </div>
  )
}

function SessionPreview({ week, sessionType }: { week: number; sessionType: SessionType }) {
  const session = getSession(week, sessionType)
  return (
    <div>
      <h2 className="t-heading" style={{ marginBottom: 4 }}>{session.name}</h2>
      <span className="t-label" style={{ color: 'var(--text-muted)' }}>~{session.estimatedMin} min</span>
      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {session.blocks.map(block => (
          <div key={block.name}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Chip color={block.color} label={block.name} />
              {block.durationMin && (
                <span className="t-label" style={{ color: 'var(--text-muted)' }}>{block.durationMin} min</span>
              )}
            </div>
            {block.sets.map((s, i) => (
              <div key={i} style={{ padding: '6px 0', borderBottom: '1px solid var(--border)', display: 'flex', gap: 8 }}>
                <span className="t-label" style={{ flex: 1, color: 'var(--text)' }}>{s.exerciseId.replace(/-/g, ' ')}</span>
                <span className="t-label" style={{ color: 'var(--text-muted)' }}>{s.sets} × {s.reps}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
