import { useNavigate } from 'react-router-dom'
import { useCurrentProgress, useSessionLogs } from '../hooks/useDB'
import { getSession, getPhaseForWeek } from '../data/program'
import { ScreenHeader, Card, CardElevated, PrimaryBtn, Chip, Divider } from '../components'
import { useWorkoutContext } from '../store/WorkoutContext'
import { useState } from 'react'
import { Dumbbell, Clock, CheckCircle, Settings } from 'lucide-react'

const EQUIPMENT_KEY = 'kb_equipment_dismissed'

export default function Today() {
  const navigate = useNavigate()
  const { startSession } = useWorkoutContext()
  const { week, sessionType, loading } = useCurrentProgress()
  const { logs: recentLogs, loading: logsLoading } = useSessionLogs()
  const [equipmentDismissed, setEquipmentDismissed] = useState(
    () => localStorage.getItem(EQUIPMENT_KEY) === 'true'
  )

  if (loading) return <div className="screen-content" />

  const session = getSession(week, sessionType)
  const phase = getPhaseForWeek(week)
  const recent = [...recentLogs].sort((a, b) => b.completedAt.localeCompare(a.completedAt)).slice(0, 2)

  function handleStart() {
    startSession(session)
    navigate('/workout')
  }

  function dismissEquipment() {
    localStorage.setItem(EQUIPMENT_KEY, 'true')
    setEquipmentDismissed(true)
  }

  return (
    <div className="screen-content" style={{ paddingBottom: 80 }}>
      <ScreenHeader
        title="Today"
        subtitle={`Week ${week} · Phase ${phase.phase}`}
        right={<button onClick={() => navigate('/settings')} aria-label="Settings" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 8, display: 'flex' }}><Settings size={20} /></button>}
      />

      {!equipmentDismissed && (
        <Card style={{ margin: '0 16px 16px', background: 'var(--surface-2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <span className="t-heading">Equipment Needed</span>
            <button onClick={dismissEquipment} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 20, lineHeight: 1 }}>×</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { item: 'Kettlebell(s)', note: '1 minimum, 2 recommended' },
              { item: 'Bench or box', note: 'For split squats, elevated pushups' },
              { item: 'Flat hard surface', note: 'For renegade rows' },
              { item: 'Medicine ball', note: 'Optional — bench works for floor press' },
              { item: 'Balance support', note: 'Optional — wall or doorframe' },
            ].map(({ item, note }) => (
              <div key={item} style={{ display: 'flex', gap: 8 }}>
                <CheckCircle size={16} color="var(--primary)" style={{ marginTop: 2, flexShrink: 0 }} />
                <div>
                  <span className="t-body">{item}</span>
                  <span className="t-label" style={{ color: 'var(--text-muted)', display: 'block' }}>{note}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <CardElevated style={{ margin: '0 16px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <span className="t-title" style={{ flex: 1 }}>{session.name}</span>
          <Chip color="work" label={`W${week}`} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16, color: 'var(--text-muted)' }}>
          <Clock size={14} />
          <span className="t-label">~{session.estimatedMin} min</span>
          <span className="t-label" style={{ margin: '0 4px' }}>·</span>
          <Dumbbell size={14} />
          <span className="t-label">{session.blocks.length} blocks</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
          {session.blocks.map(block => (
            <Chip key={block.name} color={block.color} label={block.name} />
          ))}
        </div>
        <PrimaryBtn onClick={handleStart} style={{ width: '100%' }}>Start Workout</PrimaryBtn>
      </CardElevated>

      {!logsLoading && recent.length > 0 && (
        <>
          <div style={{ padding: '0 16px', marginBottom: 8 }}>
            <span className="t-heading">Recent</span>
          </div>
          <Divider />
          {recent.map(log => (
            <Card key={log.id} style={{ margin: '0 16px 8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span className="t-body">{log.sessionType.replace(/(\d)/, ' $1').toUpperCase()}</span>
                  <span className="t-label" style={{ color: 'var(--text-muted)', display: 'block' }}>{log.date}</span>
                </div>
                <span className="t-label" style={{ color: 'var(--text-muted)' }}>
                  {Math.round(log.durationSec / 60)} min
                </span>
              </div>
            </Card>
          ))}
        </>
      )}
    </div>
  )
}
