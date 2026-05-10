import { useLiveQuery } from 'dexie-react-hooks'
import { useNavigate, useParams } from 'react-router-dom'
import { db } from '../db/db'
import { tokens } from '../styles/tokens'
import { ScreenHeader } from '../components/primitives/ScreenHeader'
import { Chip } from '../components/primitives/Chip'
import { Icon } from '../components/Icon'

const KB_FONT = 'Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif'

const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
const DAY_ABBR: Record<string, string> = {
  monday: 'MON',
  tuesday: 'TUE',
  wednesday: 'WED',
  thursday: 'THU',
  friday: 'FRI',
  saturday: 'SAT',
  sunday: 'SUN',
}

function getDayStatus(dayKey: string, program: {
  phaseIndex: number
  weekIndex: number
  dayIndex: number
  phases: Array<{ weeks: number }>
  weeklyStructure: Record<string, string>
}, absoluteWeek: number): 'done' | 'today' | 'upcoming' | 'rest' {
  const weeksBefore = program.phases
    .slice(0, program.phaseIndex)
    .reduce((a, p) => a + p.weeks, 0)
  const currentAbsoluteWeek = weeksBefore + program.weekIndex + 1

  const sessionId = program.weeklyStructure[dayKey]
  if (!sessionId) return 'rest'

  if (absoluteWeek < currentAbsoluteWeek) return 'done'
  if (absoluteWeek > currentAbsoluteWeek) return 'upcoming'

  // Same week — use dayIndex to determine
  const dayIndex = DAY_ORDER.indexOf(dayKey)
  if (dayIndex < program.dayIndex) return 'done'
  if (dayIndex === program.dayIndex) return 'today'
  return 'upcoming'
}

export function WeekDetailScreen() {
  const { programId, weekNum } = useParams<{ programId: string; weekNum: string }>()
  const navigate = useNavigate()

  const absoluteWeek = parseInt(weekNum ?? '1', 10)

  const program = useLiveQuery(
    () => programId ? db.programs.where('programId').equals(programId).first() : undefined,
    [programId]
  )

  if (!program) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        <ScreenHeader
          title="Week"
          subtitle="Loading…"
          leftIcon="chevron-left"
          leftAction={() => navigate(-1)}
        />
      </div>
    )
  }

  // Find which phase this week belongs to
  let remaining = absoluteWeek - 1
  let phaseName = ''
  for (const phase of program.phases) {
    if (remaining < phase.weeks) {
      phaseName = phase.name
      break
    }
    remaining -= phase.weeks
  }
  const weekInPhase = remaining + 1

  // Determine intensity label (simplified)
  const intensities = ['100%', '105%', '110%', 'deload']
  const intensity = intensities[(weekInPhase - 1) % intensities.length] ?? '100%'

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
      <ScreenHeader
        title={`Week ${absoluteWeek}`}
        subtitle={`${phaseName} · ${intensity}`}
        leftIcon="chevron-left"
        leftAction={() => navigate(-1)}
      />
      <div style={{ padding: '0 16px 16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {DAY_ORDER.map((dayKey) => {
            const sessionId = program.weeklyStructure[dayKey]
            const isRest = !sessionId
            const status = getDayStatus(dayKey, program, absoluteWeek)
            const isToday = status === 'today'
            const isDone = status === 'done'

            return (
              <button
                key={dayKey}
                onClick={() => {
                  if (!isRest && sessionId) {
                    navigate(`/programs/${programId}/session/${sessionId}`)
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: 14,
                  background: isToday ? tokens.accentBg : tokens.surface,
                  border: `1px solid ${isToday ? tokens.accent : tokens.border}`,
                  borderRadius: 14,
                  cursor: isRest ? 'default' : 'pointer',
                  textAlign: 'left',
                  color: tokens.text,
                  fontFamily: KB_FONT,
                }}
              >
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: isToday ? tokens.accent : isDone ? tokens.workBg : tokens.surface2,
                  color: isToday ? tokens.bg : isDone ? tokens.primary : tokens.textMuted,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 13,
                  letterSpacing: '0.04em',
                }}>
                  {DAY_ABBR[dayKey]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: isRest ? tokens.textMuted : tokens.text }}>
                      {isRest ? 'Rest' : sessionId}
                    </div>
                    {isToday && <Chip tone="accent" size="sm">TODAY</Chip>}
                  </div>
                  {!isRest && (
                    <div style={{ fontSize: 12, color: tokens.textMuted, marginTop: 2 }}>
                      Tap to view session
                    </div>
                  )}
                </div>
                {isDone && <Icon name="check-circle" size={22} color={tokens.primary} />}
                {isToday && <Icon name="play" size={22} color={tokens.accent} />}
                {!isToday && !isDone && !isRest && (
                  <Icon name="chevron-right" size={20} color={tokens.textMuted} />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
