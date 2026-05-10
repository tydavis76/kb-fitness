import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { useNavigate, useParams } from 'react-router-dom'
import { db } from '../db/db'
import { tokens } from '../styles/tokens'
import { ScreenHeader } from '../components/primitives/ScreenHeader'
import { Card } from '../components/primitives/Card'
import { Chip } from '../components/primitives/Chip'
import { Sectionlabel } from '../components/primitives/Sectionlabel'
import { Icon } from '../components/Icon'
import { ProgramMenuSheet } from '../components/ProgramMenuSheet'
import { ProgramConfirmSheet } from '../components/ProgramConfirmSheet'
import type { ProgramMenuAction } from '../components/ProgramMenuSheet'
import type { ProgramConfirmAction } from '../components/ProgramConfirmSheet'

const KB_FONT = 'Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif'

export function ProgramDetailScreen() {
  const { programId } = useParams<{ programId: string }>()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<ProgramConfirmAction | null>(null)

  const program = useLiveQuery(
    () => programId ? db.programs.where('programId').equals(programId).first() : undefined,
    [programId]
  )

  function handleMenuAction(action: ProgramMenuAction) {
    setMenuOpen(false)
    setConfirmAction(action)
  }

  async function handleConfirm(action: ProgramConfirmAction, skipWeek?: number) {
    if (!program?.id) return

    if (action === 'restart') {
      await db.programs.update(program.id, { phaseIndex: 0, weekIndex: 0, dayIndex: 0 })
    } else if (action === 'pause') {
      await db.programs.update(program.id, { status: 'paused' })
    } else if (action === 'end' || action === 'switch') {
      await db.programs.update(program.id, { status: 'archived' })
      navigate('/programs')
    } else if (action === 'skip' && skipWeek !== undefined) {
      // Calculate phase + week from absolute week number
      let remaining = skipWeek - 1
      let phaseIndex = 0
      for (let i = 0; i < program.phases.length; i++) {
        if (remaining < program.phases[i].weeks) {
          phaseIndex = i
          break
        }
        remaining -= program.phases[i].weeks
      }
      await db.programs.update(program.id, {
        phaseIndex,
        weekIndex: remaining,
        dayIndex: 0,
      })
    }
    setConfirmAction(null)
  }

  if (!program) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        <ScreenHeader
          title="Program"
          subtitle="Loading…"
          leftIcon="chevron-left"
          leftAction={() => navigate(-1)}
        />
      </div>
    )
  }

  const currentPhase = program.phases[program.phaseIndex]
  const totalWeeks = program.phases.reduce((a, p) => a + p.weeks, 0)
  const weeksInPhase = program.weekIndex + 1

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto', position: 'relative' }}>
      <ScreenHeader
        title={program.title}
        subtitle={`Phase ${program.phaseIndex + 1} of ${program.phases.length} · ${currentPhase?.name ?? ''}`}
        leftIcon="chevron-left"
        leftAction={() => navigate(-1)}
        rightContent={
          <button
            onClick={() => setMenuOpen(true)}
            style={{
              width: 36,
              height: 36,
              background: 'transparent',
              border: 'none',
              color: tokens.text,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="5" cy="12" r="1.6" fill="currentColor" />
              <circle cx="12" cy="12" r="1.6" fill="currentColor" />
              <circle cx="19" cy="12" r="1.6" fill="currentColor" />
            </svg>
          </button>
        }
      />

      <div style={{ padding: '0 16px 16px' }}>
        {/* Phase summary card */}
        <Card elevated style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <div style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
                color: tokens.accent,
              }}>
                Current phase
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>{currentPhase?.name}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 28, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                {weeksInPhase}
                <span style={{ fontSize: 16, color: tokens.textMuted, fontWeight: 500 }}>
                  /{currentPhase?.weeks ?? 0}
                </span>
              </div>
              <div style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: tokens.textMuted,
              }}>
                weeks in
              </div>
            </div>
          </div>
          <div style={{ fontSize: 13, color: tokens.textMuted, lineHeight: 1.5 }}>
            {currentPhase?.description}
          </div>
        </Card>

        {/* All phases timeline */}
        <Sectionlabel>All phases</Sectionlabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {program.phases.map((phase, i) => {
            const state =
              i < program.phaseIndex ? 'done' : i === program.phaseIndex ? 'current' : 'upcoming'
            const dot =
              state === 'done' ? tokens.primary : state === 'current' ? tokens.accent : tokens.border
            return (
              <div key={phase.id} style={{ display: 'flex', gap: 14 }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  paddingTop: 8,
                }}>
                  <div style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    background: dot,
                    border: state === 'current' ? `3px solid ${tokens.accent}40` : 'none',
                  }} />
                  {i < program.phases.length - 1 && (
                    <div style={{
                      width: 2,
                      flex: 1,
                      background: tokens.border,
                      marginTop: 4,
                      minHeight: 36,
                    }} />
                  )}
                </div>
                <Card
                  padded={false}
                  style={{
                    flex: 1,
                    padding: 14,
                    marginBottom: 4,
                    background: state === 'current' ? tokens.surface2 : tokens.surface,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700 }}>{phase.name}</div>
                      <div style={{ fontSize: 12, color: tokens.textMuted, marginTop: 2 }}>
                        {phase.description}
                      </div>
                    </div>
                    <Chip
                      tone={state === 'current' ? 'accent' : state === 'done' ? 'work' : 'default'}
                      size="sm"
                    >
                      {phase.weeks} WK
                    </Chip>
                  </div>
                </Card>
              </div>
            )
          })}
        </div>

        {/* Week schedule */}
        <Sectionlabel
          right={<span style={{ fontSize: 11, color: tokens.textMuted }}>Tap any week</span>}
        >
          Week schedule ({currentPhase?.name})
        </Sectionlabel>

        <Card padded={false}>
          {Array.from({ length: currentPhase?.weeks ?? 0 }, (_, i) => {
            const weekNum = i + 1
            const isCurrentWeek = i === program.weekIndex
            // Calculate absolute week number for display
            const weeksBefore = program.phases
              .slice(0, program.phaseIndex)
              .reduce((a, p) => a + p.weeks, 0)
            const absoluteWeek = weeksBefore + weekNum

            const intensities = ['100%', '105%', '110%', 'deload']
            const intensity = intensities[i] ?? '100%'

            return (
              <button
                key={weekNum}
                onClick={() => navigate(`week/${absoluteWeek}`)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  gap: 12,
                  padding: '14px 16px',
                  background: 'transparent',
                  border: 'none',
                  borderTop: weekNum > 1 ? `1px solid ${tokens.borderSoft}` : 'none',
                  cursor: 'pointer',
                  color: tokens.text,
                  textAlign: 'left',
                  fontFamily: KB_FONT,
                }}
              >
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: isCurrentWeek ? tokens.accentBg : tokens.surface2,
                  color: isCurrentWeek ? tokens.accent : tokens.textMuted,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 13,
                }}>
                  W{absoluteWeek}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>
                    Week {weekNum}{isCurrentWeek ? ' · current' : ''}
                  </div>
                  <div style={{ fontSize: 12, color: tokens.textMuted }}>
                    {Object.keys(program.weeklyStructure).length} sessions · {intensity} intensity
                  </div>
                </div>
                <Icon name="chevron-right" size={18} color={tokens.textMuted} />
              </button>
            )
          })}
        </Card>
      </div>

      {menuOpen && (
        <ProgramMenuSheet
          programTitle={program.title}
          onClose={() => setMenuOpen(false)}
          onAction={handleMenuAction}
        />
      )}

      {confirmAction && (
        <ProgramConfirmSheet
          action={confirmAction}
          onClose={() => setConfirmAction(null)}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  )
}
