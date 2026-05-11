import { useLiveQuery } from 'dexie-react-hooks'
import { useNavigate } from 'react-router-dom'
import { db } from '../db/db'
import { tokens } from '../styles/tokens'
import { ScreenHeader } from '../components/primitives/ScreenHeader'
import { Card } from '../components/primitives/Card'
import { Btn } from '../components/primitives/Btn'
import { Chip } from '../components/primitives/Chip'
import { BlockPill } from '../components/primitives/BlockPill'
import { Icon } from '../components/Icon'
import { ProgramEmptyToday } from '../components/ProgramEmptyToday'

function getDayOfWeekKey(date: Date): string {
  const dayIndex = date.getDay()
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  return days[dayIndex]
}

function formatDate(date: Date): string {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December']
  const day = dayNames[date.getDay()]
  const month = monthNames[date.getMonth()]
  const dateNum = date.getDate()
  return `${day}, ${month} ${dateNum}`
}

function calculateEstimatedDuration(blocks: any[]): number {
  let totalSec = 0
  for (const block of blocks) {
    if (block.duration_sec) {
      totalSec += block.duration_sec
    } else {
      // Rough estimate: 3 min per exercise + rest time
      const exercisesCount = block.exercises?.length || 1
      totalSec += exercisesCount * 180 + (block.rest_sec || 0) * (block.rounds || 1)
    }
  }
  return Math.round(totalSec / 60) // Return minutes
}

function calculateTotalVolume(blocks: any[]): number {
  let totalLb = 0
  for (const block of blocks) {
    for (const exercise of block.exercises || []) {
      const load = exercise.prescription?.load
      if (load?.value && load?.unit) {
        const weight = load.unit === 'kg' ? load.value * 2.20462 : load.value
        const reps = parseInt(String(exercise.prescription?.target), 10) || 1
        const sets = exercise.prescription?.sets || block.rounds || 1
        totalLb += weight * reps * sets
      }
    }
  }
  return Math.round(totalLb)
}

export function TodayScreen() {
  const navigate = useNavigate()
  const today = new Date()
  const dayOfWeekKey = getDayOfWeekKey(today)

  // Query active program
  const program = useLiveQuery(() =>
    db.programs.where('status').equals('active').first()
  )

  // Determine today's session ID from weekly structure
  const sessionId = program?.weeklyStructure?.[dayOfWeekKey]

  // Query today's session
  const session = useLiveQuery(() =>
    sessionId ? db.sessions.where('sessionId').equals(sessionId).first() : undefined
  )

  if (!program) {
    return <ProgramEmptyToday />
  }

  const template = session?.template
  if (!template) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        <ScreenHeader title="Today" subtitle={formatDate(today)} />
        <ProgramEmptyToday />
      </div>
    )
  }

  const blocks = template.blocks
  const estimatedMinutes = calculateEstimatedDuration(blocks)
  const totalVolume = calculateTotalVolume(blocks)

  // Build context string: Phase X · Week Y · Day Z
  const phaseIndex = program.phaseIndex ?? 0
  const weekIndex = program.weekIndex ?? 0
  const dayIndex = program.dayIndex ?? 0
  const contextString = `Phase ${phaseIndex + 1} · Week ${weekIndex + 1} · Day ${dayIndex + 1}`

  // Check for auto-regulation hint
  const loadMultiplier = session?.loadMultiplier
  const showAutoRegulation = loadMultiplier !== undefined && loadMultiplier !== 1.0

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
      <ScreenHeader
        title="Today"
        subtitle={formatDate(today)}
      />
      <div style={{ padding: '0 16px 16px' }}>
        {/* Auto-regulation banner */}
        {showAutoRegulation && (
          <div style={{
            padding: '12px 14px',
            marginBottom: 12,
            background: tokens.accentBg,
            border: `1px solid ${tokens.accentBg}`,
            borderLeft: `3px solid ${tokens.accent}`,
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}>
            <Icon name="wand" size={16} color={tokens.accent} />
            <div style={{
              fontSize: 13,
              fontWeight: 500,
              color: tokens.text,
              flex: 1,
            }}>
              {loadMultiplier > 1
                ? '↑5% loads today — based on your last Easy session'
                : '↓5% loads today — based on your last Hard session'}
            </div>
          </div>
        )}

        {/* Hero session card */}
        <Card elevated style={{ padding: 0, overflow: 'hidden', marginBottom: 12 }}>
          <div style={{ padding: 18, borderBottom: `1px solid ${tokens.borderSoft}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Chip tone="accent" size="sm">{contextString}</Chip>
              {template.metadata?.environment && (
                <Chip size="sm">{template.metadata.environment}</Chip>
              )}
            </div>
            <div style={{
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              marginBottom: 6,
              color: tokens.text,
            }}>
              {template.metadata?.title}
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              color: tokens.textMuted,
              fontSize: 13,
            }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <Icon name="timer" size={14} />
                {estimatedMinutes} min
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <Icon name="dumbbell" size={14} />
                {blocks.length} blocks
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <Icon name="flame" size={14} />
                ~{totalVolume.toLocaleString()} lb
              </span>
            </div>
          </div>

          {/* Block preview rail */}
          <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {blocks.map((block, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 26,
                  height: 26,
                  borderRadius: 7,
                  background: tokens.surface3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 700,
                  color: tokens.text,
                }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: tokens.text }}>
                    {block.name || `Block ${i + 1}`}
                  </div>
                  <div style={{ fontSize: 12, color: tokens.textMuted }}>
                    {block.exercises.length} exercises
                  </div>
                </div>
                <BlockPill type={block.type} />
              </div>
            ))}
          </div>

          {/* Start button */}
          <div style={{ padding: 16, paddingTop: 4, display: 'flex', gap: 8 }}>
            <Btn
              variant="primary"
              size="lg"
              full
              icon="play"
              onClick={() => navigate('preview', { state: { sessionId, session } })}
            >
              Start Workout
            </Btn>
          </div>
        </Card>
      </div>
    </div>
  )
}
