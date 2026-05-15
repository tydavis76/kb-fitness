import { useState } from 'react'
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
import { useActiveWorkout } from '../context/ActiveWorkoutContext'

const DAY_KEYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
const DAY_2: Record<string, string> = {
  monday: 'Mo', tuesday: 'Tu', wednesday: 'We', thursday: 'Th',
  friday: 'Fr', saturday: 'Sa', sunday: 'Su',
}

function getDayOfWeekKey(date: Date): string {
  return DAY_KEYS[date.getDay() === 0 ? 6 : date.getDay() - 1]
}

function getDateForDayKey(today: Date, dayKey: string): Date {
  const todayIndex    = today.getDay() === 0 ? 6 : today.getDay() - 1
  const targetIndex   = DAY_KEYS.indexOf(dayKey)
  const date          = new Date(today)
  date.setDate(today.getDate() + (targetIndex - todayIndex))
  date.setHours(12, 0, 0, 0)
  return date
}

function formatDate(date: Date): string {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']
  return `${dayNames[date.getDay()]}, ${monthNames[date.getMonth()]} ${date.getDate()}`
}

function calculateEstimatedDuration(blocks: any[]): number {
  let totalSec = 0
  for (const block of blocks) {
    if (block.duration_sec) {
      totalSec += block.duration_sec
    } else {
      const exercisesCount = block.exercises?.length || 1
      totalSec += exercisesCount * 180 + (block.rest_sec || 0) * (block.rounds || 1)
    }
  }
  return Math.round(totalSec / 60)
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

interface WeekStripProps {
  weeklyStructure: Record<string, string>
  phaseId: string
  todayKey: string
  selectedKey: string
  doneSessionIds: Set<string>
  onSelect: (dayKey: string) => void
}

export function WeekStrip({ weeklyStructure, phaseId, todayKey, selectedKey, doneSessionIds, onSelect }: WeekStripProps) {
  return (
    <div style={{ display: 'flex', gap: 4, padding: '10px 16px 6px' }}>
      {DAY_KEYS.map(dayKey => {
        const baseId = weeklyStructure[dayKey]
        const isRest = !baseId || baseId.startsWith('rest')
        const isToday = dayKey === todayKey
        const isSelected = dayKey === selectedKey
        const fullSessionId = baseId && !isRest ? `${baseId}_${phaseId}` : null
        const isDone = fullSessionId ? doneSessionIds.has(fullSessionId) : false

        return (
          <button
            key={dayKey}
            onClick={() => onSelect(dayKey)}
            disabled={isRest}
            style={{
              flex: 1,
              padding: '7px 2px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 5,
              borderRadius: 10,
              border: `1px solid ${isSelected ? tokens.primary : isToday ? tokens.border : 'transparent'}`,
              background: isSelected && !isRest ? tokens.workBg : 'transparent',
              cursor: isRest ? 'default' : 'pointer',
              opacity: isRest ? 0.4 : 1,
            }}
          >
            <div style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.04em',
              color: isSelected ? tokens.primary : isToday ? tokens.accent : tokens.textMuted,
            }}>
              {DAY_2[dayKey]}
            </div>
            <div style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: isDone
                ? tokens.primary
                : isRest
                  ? 'transparent'
                  : isToday || isSelected
                    ? tokens.primary
                    : tokens.surface3,
              border: isDone || isRest ? 'none' : `1.5px solid ${isToday || isSelected ? tokens.primary : tokens.border}`,
            }} />
          </button>
        )
      })}
    </div>
  )
}

export function TodayScreen() {
  const navigate = useNavigate()
  const { startWorkout } = useActiveWorkout()
  const today = new Date()
  const dayOfWeekKey = getDayOfWeekKey(today)

  const program = useLiveQuery(() => db.programs.where('status').equals('active').first())
  const workoutLogs = useLiveQuery(() => db.workoutLogs.toArray(), [])

  const [selectedDayKey, setSelectedDayKey] = useState(dayOfWeekKey)
  const [isSkipping, setIsSkipping] = useState(false)

  const todayIndex     = DAY_KEYS.indexOf(dayOfWeekKey)
  const selectedIndex  = DAY_KEYS.indexOf(selectedDayKey)
  const isToday        = selectedDayKey === dayOfWeekKey
  const isPast         = selectedIndex < todayIndex
  const isFuture       = selectedIndex > todayIndex

  const currentPhaseId = program?.phases[program?.phaseIndex ?? 0]?.id ?? ''

  const selectedBaseId = program?.weeklyStructure?.[selectedDayKey]
  const isRestDay = !selectedBaseId || selectedBaseId.startsWith('rest')
  const selectedSessionId = selectedBaseId && currentPhaseId && !isRestDay
    ? `${selectedBaseId}_${currentPhaseId}`
    : undefined

  const session = useLiveQuery(() =>
    selectedSessionId ? db.sessions.where('sessionId').equals(selectedSessionId).first() : undefined,
    [selectedSessionId]
  )

  if (!program) return <ProgramEmptyToday />

  const doneSessionIds = new Set(workoutLogs?.map(l => l.sessionId) ?? [])
  const isSelectedDone = selectedSessionId ? doneSessionIds.has(selectedSessionId) : false

  const handleStart = async () => {
    if (!session?.template) return
    await startWorkout(session.template)
    navigate('active')
  }

  const handleSkip = async () => {
    if (!selectedSessionId || !program?.programId || isSkipping) return
    setIsSkipping(true)
    try {
      const skippedDate = getDateForDayKey(today, selectedDayKey)
      await db.workoutLogs.add({
        sessionId:     selectedSessionId,
        programId:     program.programId,
        completedAt:   skippedDate.getTime(),
        durationSec:   0,
        rating:        'on_point',
        notes:         '',
        totalVolumeKg: null,
        sets:          [],
      })
    } finally {
      setIsSkipping(false)
    }
  }

  const weekStrip = (
    <WeekStrip
      weeklyStructure={program.weeklyStructure}
      phaseId={currentPhaseId}
      todayKey={dayOfWeekKey}
      selectedKey={selectedDayKey}
      doneSessionIds={doneSessionIds}
      onSelect={(dayKey) => setSelectedDayKey(dayKey)}
    />
  )

  const template = session?.template

  if (!template) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        <ScreenHeader title="Today" subtitle={formatDate(today)} />
        {weekStrip}
        {isRestDay ? (
          <div style={{ padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <Icon name="moon" size={40} color={tokens.textMuted} />
            <div style={{ fontSize: 20, fontWeight: 700, color: tokens.text }}>Recovery Day</div>
            <div style={{ fontSize: 14, color: tokens.textMuted, textAlign: 'center', lineHeight: 1.5 }}>
              The schedule is a guide — tap any workout above to start it whenever you're ready.
            </div>
          </div>
        ) : (
          <ProgramEmptyToday />
        )}
      </div>
    )
  }

  const blocks = template.blocks
  const estimatedMinutes = calculateEstimatedDuration(blocks)
  const totalVolume = calculateTotalVolume(blocks)

  const phaseIndex = program.phaseIndex ?? 0
  const weekIndex = program.weekIndex ?? 0
  const dayIndex = program.dayIndex ?? 0
  const contextString = `Phase ${phaseIndex + 1} · Week ${weekIndex + 1} · Day ${dayIndex + 1}`

  const loadMultiplier = session?.loadMultiplier
  const showAutoRegulation = loadMultiplier !== undefined && loadMultiplier !== 1.0

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
      <ScreenHeader title="Today" subtitle={formatDate(today)} />
      {weekStrip}
      <div style={{ padding: '8px 16px 16px' }}>
        {showAutoRegulation && (
          <div style={{
            padding: '12px 14px', marginBottom: 12,
            background: tokens.accentBg, borderLeft: `3px solid ${tokens.accent}`,
            borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <Icon name="wand" size={16} color={tokens.accent} />
            <div style={{ fontSize: 13, fontWeight: 500, color: tokens.text, flex: 1 }}>
              {loadMultiplier! > 1
                ? '↑5% loads today — based on your last Easy session'
                : '↓5% loads today — based on your last Hard session'}
            </div>
          </div>
        )}

        <Card elevated style={{ padding: 0, overflow: 'hidden', marginBottom: 12 }}>
          <div style={{ padding: 18, borderBottom: `1px solid ${tokens.borderSoft}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Chip tone="accent" size="sm">{contextString}</Chip>
              {template.metadata?.environment && <Chip size="sm">{template.metadata.environment}</Chip>}
            </div>
            <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 6, color: tokens.text }}>
              {template.metadata?.title}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: tokens.textMuted, fontSize: 13 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <Icon name="timer" size={14} />{estimatedMinutes} min
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <Icon name="dumbbell" size={14} />{blocks.length} blocks
              </span>
              {totalVolume > 0 && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <Icon name="flame" size={14} />~{totalVolume.toLocaleString()} lb
                </span>
              )}
            </div>
          </div>

          <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {blocks.map((block: any, i: number) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: 7, background: tokens.surface3,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, color: tokens.text,
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

          <div style={{ padding: 16, paddingTop: 4, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {!isSelectedDone && !isRestDay && (
              <Btn variant="primary" size="lg" full icon="play" onClick={handleStart}>
                {isToday ? 'Start Workout' : isFuture ? 'Start Early' : 'Start Anyway'}
              </Btn>
            )}
            {isPast && !isSelectedDone && !isRestDay && (
              <Btn variant="ghost" size="lg" full onClick={handleSkip} disabled={isSkipping}>
                Mark Skipped
              </Btn>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
