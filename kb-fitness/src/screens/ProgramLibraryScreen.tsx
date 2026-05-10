import { useLiveQuery } from 'dexie-react-hooks'
import { useNavigate } from 'react-router-dom'
import { db } from '../db/db'
import type { ProgramRecord } from '../db/types'
import { tokens } from '../styles/tokens'
import { ScreenHeader } from '../components/primitives/ScreenHeader'
import { Card } from '../components/primitives/Card'
import { Chip } from '../components/primitives/Chip'
import { Sectionlabel } from '../components/primitives/Sectionlabel'
import { Icon } from '../components/Icon'

const ARCHIVE_ITEMS = [
  { name: '5/3/1 Boring But Big', date: 'Jan 8 – Mar 30',  sessions: '32 / 36', state: 'completed' as const },
  { name: 'Easy Strength',         date: 'Nov 12 – Dec 24', sessions: '18 / 24', state: 'ended'     as const },
  { name: 'Simple & Sinister',     date: 'Aug 1 – Sep 18',  sessions: '40 / 42', state: 'completed' as const },
]

function PhaseTimeline({ program }: { program: ProgramRecord }) {
  const totalWeeksPerPhase = program.phases.map((p) => p.weeks)
  const totalWeeksBefore = totalWeeksPerPhase.reduce((acc, _w, idx) => {
    if (idx < program.phaseIndex) return acc + totalWeeksPerPhase[idx]
    return acc
  }, 0)

  return (
    <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
      {program.phases.map((phase, i) => {
        const isCurrent = i === program.phaseIndex
        const isDone = i < program.phaseIndex

        let doneWeeks: number
        if (isDone) {
          doneWeeks = phase.weeks
        } else if (isCurrent) {
          doneWeeks = program.weekIndex
        } else {
          doneWeeks = 0
        }

        const segs = Array.from({ length: phase.weeks }, (_, k) => k)
        return (
          <div key={phase.id} style={{ flex: phase.weeks, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', gap: 2 }}>
              {segs.map((k) => (
                <div
                  key={k}
                  style={{
                    flex: 1,
                    height: 6,
                    borderRadius: 2,
                    background:
                      k < doneWeeks
                        ? tokens.primary
                        : isCurrent && k === doneWeeks
                        ? tokens.accent
                        : tokens.border,
                  }}
                />
              ))}
            </div>
            <div style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: isCurrent ? tokens.accent : tokens.textMuted,
            }}>
              {phase.name}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function ActiveProgramCard({ program }: { program: ProgramRecord }) {
  const navigate = useNavigate()
  const totalWeeksBefore = program.phases
    .slice(0, program.phaseIndex)
    .reduce((acc, p) => acc + p.weeks, 0)
  const currentWeek = totalWeeksBefore + program.weekIndex + 1
  const totalWeeks = program.phases.reduce((acc, p) => acc + p.weeks, 0)
  const currentPhaseName = program.phases[program.phaseIndex]?.name ?? ''

  return (
    <Card elevated padded={false} onClick={() => navigate(program.programId)} style={{ padding: 16, cursor: 'pointer' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <Chip tone="accent" size="sm">ACTIVE · WK {currentWeek}/{totalWeeks}</Chip>
        <Icon name="chevron-right" size={20} color={tokens.textMuted} />
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em', marginBottom: 4 }}>{program.title}</div>
      <div style={{ fontSize: 13, color: tokens.textMuted, marginBottom: 14 }}>
        {program.author} · {program.phases.length} phases · {currentPhaseName}
      </div>
      <PhaseTimeline program={program} />
    </Card>
  )
}

export function ProgramLibraryScreen() {
  const navigate = useNavigate()

  const activeProgram = useLiveQuery(() =>
    db.programs.where('status').equals('active').first()
  )

  const allPrograms = useLiveQuery(() => db.programs.toArray())

  const libraryPrograms = (allPrograms ?? []).filter(
    (p) => p.status !== 'active' && p.status !== 'archived'
  )

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
      <ScreenHeader title="Programs" subtitle="Pick or build a plan" />
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 16 }}>

        {activeProgram && <ActiveProgramCard program={activeProgram} />}

        <Sectionlabel>Library</Sectionlabel>

        {libraryPrograms.map((p) => (
          <Card
            key={p.programId}
            padded={false}
            onClick={() => navigate(p.programId)}
            style={{ padding: 14, cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: tokens.surface2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: tokens.primary,
              }}>
                <Icon name="kettlebell" size={22} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{p.title}</div>
                <div style={{ fontSize: 12, color: tokens.textMuted }}>
                  {p.author} · {p.phases.reduce((a, ph) => a + ph.weeks, 0)} wk
                </div>
              </div>
              <Icon name="chevron-right" size={18} color={tokens.textMuted} />
            </div>
          </Card>
        ))}

        <button
          style={{
            marginTop: 4,
            height: 52,
            background: 'transparent',
            border: `1px dashed ${tokens.border}`,
            borderRadius: 14,
            color: tokens.textMuted,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
          }}
        >
          <Icon name="plus" size={18} /> Build a custom program
        </button>

        <Sectionlabel>Archive</Sectionlabel>

        {ARCHIVE_ITEMS.map((a) => (
          <Card key={a.name} padded={false} style={{ padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: tokens.surface2,
                color: tokens.textMuted,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Icon name={a.state === 'completed' ? 'check-circle' : 'flag'} size={18} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: tokens.textMuted }}>{a.name}</div>
                <div style={{ fontSize: 11, color: tokens.textDim, marginTop: 2 }}>
                  {a.date} · {a.sessions} sessions
                </div>
              </div>
              <Chip size="sm" tone={a.state === 'completed' ? 'work' : 'default'}>
                {a.state.toUpperCase()}
              </Chip>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
