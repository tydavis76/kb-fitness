import { useState } from 'react'
import { useSessionLogs } from '../hooks/useDB'
import { SESSION_ORDER } from '../data/program'
import { ScreenHeader, Card } from '../components'
import { Flame, Target } from 'lucide-react'
import type { SessionLog } from '../db/types'

function getStreakDays(logs: SessionLog[]): number {
  if (logs.length === 0) return 0
  const dates = [...new Set(logs.map(l => l.date))].sort().reverse()
  let streak = 0
  let prev: Date | null = null
  for (const d of dates) {
    const cur = new Date(d)
    if (!prev) { streak = 1; prev = cur; continue }
    const diff = (prev.getTime() - cur.getTime()) / 86400000
    if (diff <= 2) { streak++; prev = cur } else break
  }
  return streak
}

export default function History() {
  const { logs, loading } = useSessionLogs()
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null)

  if (loading) return <div className="screen-content" />

  const streak = getStreakDays(logs)
  const byWeek: Record<number, SessionLog[]> = {}
  logs.forEach(l => { byWeek[l.week] = [...(byWeek[l.week] ?? []), l] })
  const weeks = Object.keys(byWeek).map(Number).sort((a, b) => b - a)

  return (
    <div className="screen-content" style={{ paddingBottom: 80 }}>
      <ScreenHeader title="History" />

      <div style={{ display: 'flex', gap: 12, padding: '0 16px 20px' }}>
        <Card style={{ flex: 1, textAlign: 'center' }}>
          <Flame size={20} color="var(--accent)" style={{ margin: '0 auto 4px' }} />
          <div className="t-heading">{streak}</div>
          <div className="t-label" style={{ color: 'var(--text-muted)' }}>Day streak</div>
        </Card>
        <Card style={{ flex: 1, textAlign: 'center' }}>
          <Target size={20} color="var(--primary)" style={{ margin: '0 auto 4px' }} />
          <div className="t-heading">{logs.length}</div>
          <div className="t-label" style={{ color: 'var(--text-muted)' }}>Sessions</div>
        </Card>
      </div>

      {weeks.length === 0 && (
        <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>
          <p className="t-body">No sessions yet. Start your first workout!</p>
        </div>
      )}

      {weeks.map(week => {
        const weekLogs = byWeek[week]
        const completedTypes = new Set(weekLogs.map(l => l.sessionType))
        const isExpanded = expandedWeek === week
        return (
          <div key={week} style={{ margin: '0 16px 12px' }}>
            <button
              onClick={() => setExpandedWeek(isExpanded ? null : week)}
              style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' }}
            >
              <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span className="t-heading">Week {week}</span>
                  <span className="t-label" style={{ color: 'var(--text-muted)' }}>
                    {weekLogs.length}/{SESSION_ORDER.length} sessions
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {SESSION_ORDER.map(s => (
                    <div
                      key={s}
                      title={s}
                      style={{
                        width: 10, height: 10, borderRadius: '50%',
                        background: completedTypes.has(s) ? 'var(--primary)' : 'var(--border)',
                      }}
                    />
                  ))}
                </div>
              </Card>
            </button>

            {isExpanded && weekLogs.sort((a, b) => a.completedAt.localeCompare(b.completedAt)).map(log => (
              <div key={log.id} style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', background: 'var(--surface-2)', borderRadius: 8, marginTop: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="t-body">{log.sessionType.replace(/(\d)/, ' $1').toUpperCase()}</span>
                  <span className="t-label" style={{ color: 'var(--text-muted)' }}>{Math.round(log.durationSec / 60)} min</span>
                </div>
                <span className="t-label" style={{ color: 'var(--text-muted)' }}>{log.date}</span>
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}
