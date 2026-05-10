import { useLiveQuery } from 'dexie-react-hooks'
import { useParams, useNavigate } from 'react-router-dom'
import { db } from '../db/db'
import { tokens } from '../styles/tokens'
import { ScreenHeader } from '../components/primitives/ScreenHeader'
import { Card } from '../components/primitives/Card'
import { Sectionlabel } from '../components/primitives/Sectionlabel'
import type { WorkoutLog } from '../db/types'

interface WeeklyVolume {
  weekLabel: string
  volume: number
}

function getWeekStart(ts: number): number {
  const d = new Date(ts)
  d.setHours(0, 0, 0, 0)
  const day = d.getDay() // 0=Sun
  d.setDate(d.getDate() - day)
  return d.getTime()
}

function formatShortDate(ts: number): string {
  const d = new Date(ts)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[d.getMonth()]} ${d.getDate()}`
}

function computeWeekLabel(weekIndex: number): string {
  return `w${weekIndex + 1}`
}

// Aggregate weekly volume from logs for a specific exercise (last 12 weeks)
function computeWeeklyVolumes(logs: WorkoutLog[], exerciseId: string): WeeklyVolume[] {
  const now = Date.now()
  const twelveWeeksMs = 12 * 7 * 24 * 60 * 60 * 1000
  const cutoff = now - twelveWeeksMs

  // Build a map of weekStart -> total volume
  const weekMap = new Map<number, number>()

  for (const log of logs) {
    if (log.completedAt < cutoff) continue
    for (const set of log.sets ?? []) {
      if (set.exerciseId !== exerciseId) continue
      if (set.actualReps === null || set.actualLoad?.value === null) continue
      const load = set.actualLoad?.value ?? 0
      const unit = set.actualLoad?.unit
      const weightKg = unit === 'lb' ? load / 2.20462 : load
      const vol = (set.actualReps ?? 0) * weightKg

      const weekStart = getWeekStart(log.completedAt)
      weekMap.set(weekStart, (weekMap.get(weekStart) ?? 0) + vol)
    }
  }

  // Sort weeks chronologically and produce exactly 12 buckets (filling gaps with 0)
  const allWeeks: number[] = []
  // Start from 12 weeks ago, stepping by 1 week
  for (let i = 0; i < 12; i++) {
    const weekStart = getWeekStart(now - (11 - i) * 7 * 24 * 60 * 60 * 1000)
    allWeeks.push(weekStart)
  }

  return allWeeks.map((ws, idx) => ({
    weekLabel: computeWeekLabel(idx),
    volume: weekMap.get(ws) ?? 0,
  }))
}

// Gather recent sets for the exercise across all logs (most recent first)
interface RecentSetRow {
  date: string
  sets: number
  topLoad: number | null
  topLoadUnit: string | null
  volume: number
}

function computeRecentSetRows(logs: WorkoutLog[], exerciseId: string): RecentSetRow[] {
  const rows: RecentSetRow[] = []

  // Sort logs newest first
  const sorted = [...logs].sort((a, b) => b.completedAt - a.completedAt)

  for (const log of sorted) {
    const exSets = (log.sets ?? []).filter(s => s.exerciseId === exerciseId)
    if (exSets.length === 0) continue

    let vol = 0
    let topLoad: number | null = null
    let topLoadUnit: string | null = null

    for (const s of exSets) {
      if (s.actualReps !== null && s.actualLoad?.value !== null) {
        const load = s.actualLoad?.value ?? 0
        const unit = s.actualLoad?.unit
        const weightKg = unit === 'lb' ? load / 2.20462 : load
        vol += (s.actualReps ?? 0) * weightKg

        if (topLoad === null || load > topLoad) {
          topLoad = load
          topLoadUnit = unit ?? null
        }
      }
    }

    rows.push({
      date: formatShortDate(log.completedAt),
      sets: exSets.length,
      topLoad,
      topLoadUnit,
      volume: Math.round(vol),
    })

    if (rows.length >= 8) break
  }

  return rows
}

export function AnalyticsScreen() {
  const { exerciseId } = useParams<{ exerciseId: string }>()
  const navigate = useNavigate()

  const logs = useLiveQuery(
    () => db.workoutLogs.orderBy('completedAt').toArray(),
    [],
    [] as WorkoutLog[]
  )

  if (!exerciseId) {
    return (
      <div style={{ flex: 1, background: tokens.bg, padding: 16, color: tokens.textMuted }}>
        No exercise selected.
      </div>
    )
  }

  const weeklyVolumes = computeWeeklyVolumes(logs ?? [], exerciseId)
  const maxVol = Math.max(...weeklyVolumes.map(w => w.volume), 1)

  const recentRows = computeRecentSetRows(logs ?? [], exerciseId)

  // Top working load: highest load seen across all sets for this exercise
  let topLoad: number | null = null
  let topLoadUnit: string | null = null
  for (const log of logs ?? []) {
    for (const s of log.sets ?? []) {
      if (s.exerciseId !== exerciseId) continue
      if (s.actualLoad?.value !== null && s.actualLoad?.value !== undefined) {
        if (topLoad === null || (s.actualLoad.value > topLoad)) {
          topLoad = s.actualLoad.value
          topLoadUnit = s.actualLoad.unit ?? null
        }
      }
    }
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto', background: tokens.bg }}>
      <ScreenHeader
        title={exerciseId}
        subtitle="12-week volume trend"
        leftIcon="‹"
        leftAction={() => navigate(-1)}
      />

      <div style={{ padding: '0 16px 16px' }}>
        {/* Chart card */}
        <Card elevated style={{ marginBottom: 12, padding: 16 }}>
          <div style={{
            display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14,
          }}>
            <div>
              <div style={{
                fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
                textTransform: 'uppercase', color: tokens.textMuted,
              }}>
                Top working load
              </div>
              <div style={{
                fontSize: 36, fontWeight: 700, fontVariantNumeric: 'tabular-nums',
                letterSpacing: '-0.02em', color: tokens.primary, marginTop: 2,
              }}>
                {topLoad !== null ? topLoad : '—'}{' '}
                <span style={{ fontSize: 16, color: tokens.textMuted, fontWeight: 500 }}>
                  {topLoadUnit ?? 'kg'}
                </span>
              </div>
            </div>
          </div>

          {/* Bar chart — 12 weekly bars */}
          <div
            data-testid="weekly-bar-chart"
            style={{
              display: 'flex', alignItems: 'flex-end', gap: 4,
              height: 120, padding: '0 0 18px', position: 'relative',
            }}
          >
            {weeklyVolumes.map((week, i) => {
              const heightPct = maxVol > 0 ? (week.volume / maxVol) * 100 : 0
              const isMax = week.volume === maxVol && week.volume > 0
              const opacity = 0.5 + (i / weeklyVolumes.length) * 0.5

              return (
                <div
                  key={week.weekLabel}
                  style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}
                >
                  <div style={{
                    width: '100%',
                    height: heightPct > 0 ? `${heightPct}%` : 2,
                    background: isMax ? tokens.accent : tokens.primary,
                    opacity: i === weeklyVolumes.length - 1 ? 1 : opacity,
                    borderRadius: '3px 3px 0 0',
                    transition: 'height 0.3s ease',
                  }} />
                  <div style={{
                    fontSize: 9, color: tokens.textMuted, fontVariantNumeric: 'tabular-nums',
                  }}>
                    {week.weekLabel}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Recent sets table */}
        <Sectionlabel>Recent sets</Sectionlabel>

        {recentRows.length === 0 ? (
          <Card>
            <div style={{ textAlign: 'center', color: tokens.textMuted, fontSize: 14, padding: '12px 0' }}>
              No logged sets found for this exercise.
            </div>
          </Card>
        ) : (
          <Card padded={false}>
            {/* Table header */}
            <div style={{
              display: 'flex', padding: '8px 14px', alignItems: 'center', gap: 10,
              fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
              color: tokens.textDim, borderBottom: `1px solid ${tokens.borderSoft}`,
            }}>
              <div style={{ width: 56 }}>Date</div>
              <div style={{ width: 44 }}>Sets</div>
              <div style={{ flex: 1 }}>Load</div>
              <div>Volume</div>
            </div>

            {recentRows.map((row, i) => (
              <div
                key={i}
                style={{
                  display: 'flex', padding: '12px 14px', alignItems: 'center', gap: 10,
                  borderTop: i > 0 ? `1px solid ${tokens.borderSoft}` : 'none',
                  fontSize: 13,
                }}
              >
                <div style={{ width: 56, color: tokens.textMuted, fontSize: 12 }}>{row.date}</div>
                <div style={{ width: 44, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                  {row.sets}×
                </div>
                <div style={{ flex: 1, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                  {row.topLoad !== null
                    ? `${row.topLoad} ${row.topLoadUnit ?? 'kg'}`
                    : '—'}
                </div>
                <div style={{ color: tokens.textMuted, fontVariantNumeric: 'tabular-nums' }}>
                  {row.volume > 0 ? `${row.volume.toLocaleString()} kg` : '—'}
                </div>
              </div>
            ))}
          </Card>
        )}
      </div>
    </div>
  )
}
