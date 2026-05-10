import { useLiveQuery } from 'dexie-react-hooks'
import { useNavigate } from 'react-router-dom'
import { db } from '../db/db'
import { tokens } from '../styles/tokens'
import { ScreenHeader } from '../components/primitives/ScreenHeader'
import { Card } from '../components/primitives/Card'
import { Chip } from '../components/primitives/Chip'
import { Sectionlabel } from '../components/primitives/Sectionlabel'
import type { WorkoutLog } from '../db/types'

function formatDateParts(ts: number): { day: string; date: string } {
  const d = new Date(ts)
  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
  return {
    day: dayNames[d.getDay()],
    date: String(d.getDate()).padStart(2, '0'),
  }
}

function formatMonthDay(ts: number): string {
  const d = new Date(ts)
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${monthNames[d.getMonth()]} ${d.getDate()}`
}

function formatDuration(seconds: number): string {
  const mins = Math.round(seconds / 60)
  return `${mins}`
}

function ratingToTone(rating: WorkoutLog['rating']): 'work' | 'accent' | 'danger' | 'default' {
  if (rating === 'easy') return 'work'
  if (rating === 'hard') return 'accent'
  if (rating === 'failed') return 'danger'
  return 'default'
}

function ratingLabel(rating: WorkoutLog['rating']): string {
  if (rating === 'easy') return 'Easy'
  if (rating === 'on_point') return 'On point'
  if (rating === 'hard') return 'Hard'
  if (rating === 'failed') return 'Failed'
  return '—'
}

// Compute weekly volume stats for the last 4 weeks
function computeWeeklyVolume(logs: WorkoutLog[]): { thisWeek: number; lastWeek: number } {
  const now = Date.now()
  const weekMs = 7 * 24 * 60 * 60 * 1000
  const thisWeekStart = now - weekMs
  const lastWeekStart = now - 2 * weekMs

  let thisWeek = 0
  let lastWeek = 0

  for (const log of logs) {
    const vol = log.totalVolumeKg ?? 0
    if (log.completedAt >= thisWeekStart) {
      thisWeek += vol
    } else if (log.completedAt >= lastWeekStart) {
      lastWeek += vol
    }
  }

  return { thisWeek, lastWeek }
}

function computeStreak(logs: WorkoutLog[]): number {
  if (logs.length === 0) return 0
  const sorted = [...logs].sort((a, b) => b.completedAt - a.completedAt)
  const dayMs = 24 * 60 * 60 * 1000
  let streak = 0
  let prevDay = Math.floor(Date.now() / dayMs)

  for (const log of sorted) {
    const logDay = Math.floor(log.completedAt / dayMs)
    if (logDay === prevDay || logDay === prevDay - 1) {
      streak++
      prevDay = logDay
    } else {
      break
    }
  }
  return streak
}

export function HistoryScreen() {
  const navigate = useNavigate()

  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000

  const recentLogs = useLiveQuery(
    () => db.workoutLogs.where('completedAt').above(thirtyDaysAgo).reverse().sortBy('completedAt'),
    [],
    [] as WorkoutLog[]
  )

  const allLogs = useLiveQuery(
    () => db.workoutLogs.orderBy('completedAt').toArray(),
    [],
    [] as WorkoutLog[]
  )

  const { thisWeek, lastWeek } = computeWeeklyVolume(allLogs ?? [])
  const wowPct = lastWeek > 0 ? Math.round(((thisWeek - lastWeek) / lastWeek) * 100) : null

  const streak = computeStreak(allLogs ?? [])

  const sessionCount = (recentLogs ?? []).length

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto', background: tokens.bg }}>
      <ScreenHeader title="History" subtitle="Last 30 days" />
      <div style={{ padding: '0 16px 16px' }}>
        {/* Weekly volume card */}
        <Card style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4 }}>
            <div>
              <div style={{
                fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
                textTransform: 'uppercase', color: tokens.textMuted,
              }}>
                Weekly volume
              </div>
              <div style={{
                fontSize: 28, fontWeight: 700, fontVariantNumeric: 'tabular-nums', marginTop: 2,
                color: tokens.text,
              }}>
                {Math.round(thisWeek).toLocaleString()}{' '}
                <span style={{ fontSize: 13, color: tokens.textMuted, fontWeight: 500 }}>kg</span>
              </div>
            </div>
            {wowPct !== null && (
              <Chip tone={wowPct >= 0 ? 'work' : 'danger'} size="sm">
                {wowPct >= 0 ? '+' : ''}{wowPct}% WoW
              </Chip>
            )}
          </div>
        </Card>

        {/* Stats grid */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          {[
            { label: 'Sessions', val: String(sessionCount), sub: 'this month' },
            { label: 'Streak', val: String(streak), sub: 'days' },
          ].map((s) => (
            <Card key={s.label} style={{ flex: 1, padding: 12 }}>
              <div style={{
                fontSize: 10, fontWeight: 600, letterSpacing: '0.08em',
                textTransform: 'uppercase', color: tokens.textMuted,
              }}>
                {s.label}
              </div>
              <div style={{
                fontSize: 24, fontWeight: 700, fontVariantNumeric: 'tabular-nums',
                marginTop: 2, color: tokens.text,
              }}>
                {s.val}
              </div>
              <div style={{ fontSize: 11, color: tokens.textMuted }}>{s.sub}</div>
            </Card>
          ))}
        </div>

        <Sectionlabel>Recent sessions</Sectionlabel>

        {(recentLogs ?? []).length === 0 ? (
          <Card>
            <div style={{ textAlign: 'center', color: tokens.textMuted, fontSize: 14, padding: '12px 0' }}>
              No sessions yet. Complete a workout to see history.
            </div>
          </Card>
        ) : (
          <Card padded={false}>
            {(recentLogs ?? []).map((log, i) => {
              const { day, date } = formatDateParts(log.completedAt)
              return (
                <button
                  key={log.id}
                  onClick={() => navigate(`session/${log.id}`)}
                  style={{
                    display: 'flex', alignItems: 'center', padding: '12px 14px', gap: 12,
                    borderTop: i > 0 ? `1px solid ${tokens.borderSoft}` : 'none',
                    background: 'transparent', border: 'none', color: tokens.text,
                    width: '100%', textAlign: 'left', cursor: 'pointer',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                  }}
                >
                  {/* Date column */}
                  <div style={{ width: 38, textAlign: 'center', flexShrink: 0 }}>
                    <div style={{
                      fontSize: 10, fontWeight: 600, letterSpacing: '0.06em',
                      textTransform: 'uppercase', color: tokens.textMuted,
                    }}>
                      {day}
                    </div>
                    <div style={{
                      fontSize: 18, fontWeight: 700, fontVariantNumeric: 'tabular-nums', marginTop: 2,
                    }}>
                      {date}
                    </div>
                  </div>

                  {/* Session info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{log.sessionId}</div>
                    <div style={{ fontSize: 12, color: tokens.textMuted, marginTop: 1 }}>
                      {formatDuration(log.durationSec)} min
                      {log.totalVolumeKg !== null && ` · ${log.totalVolumeKg.toLocaleString()} kg`}
                    </div>
                  </div>

                  {/* Rating chip */}
                  {log.rating && (
                    <Chip size="sm" tone={ratingToTone(log.rating)}>
                      {ratingLabel(log.rating)}
                    </Chip>
                  )}
                </button>
              )
            })}
          </Card>
        )}
      </div>
    </div>
  )
}
