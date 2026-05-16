import { useState } from 'react'
import { tokens } from '../styles/tokens'
import { BottomSheet } from './primitives/BottomSheet'
import { Card } from './primitives/Card'
import { Btn } from './primitives/Btn'
import { Stepper } from './primitives/Stepper'
import { Icon } from './Icon'

interface PrescriptionEditorProps {
  open: boolean
  onClose: () => void
  exerciseName?: string
  equipment?: string
  initialLoad?: number
  initialUnit?: 'lb' | 'kg'
  onSave?: (load: import('../db/types').LoadObject) => void
}

function StepperRow({ label, value, onChange, step = 1, min = 1, max = 99, suffix }: {
  label: string; value: number; onChange: (v: number) => void;
  step?: number; min?: number; max?: number; suffix?: string
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderTop: `1px solid ${tokens.borderSoft}` }}>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: tokens.textMuted }}>{label}</div>
        <div style={{ fontSize: 20, fontWeight: 700, fontVariantNumeric: 'tabular-nums', marginTop: 2 }}>
          {value}
          {suffix && <span style={{ fontSize: 12, color: tokens.textMuted, fontWeight: 500, marginLeft: 4 }}>{suffix}</span>}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <button onClick={() => onChange(Math.max(min, value - step))} style={{ width: 36, height: 36, borderRadius: 10, background: tokens.surface2, border: `1px solid ${tokens.border}`, color: tokens.text, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="minus" size={16} />
        </button>
        <button onClick={() => onChange(Math.min(max, value + step))} style={{ width: 36, height: 36, borderRadius: 10, background: tokens.primary, border: 'none', color: tokens.bg, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="plus" size={16} />
        </button>
      </div>
    </div>
  )
}

export function PrescriptionEditor({ open, onClose, exerciseName = 'Exercise', equipment = 'bodyweight', initialLoad, initialUnit, onSave }: PrescriptionEditorProps) {
  const [sets, setSets] = useState(4)
  const [reps, setReps] = useState(10)
  const [load, setLoad] = useState(initialLoad ?? 50)
  const [unit, setUnit] = useState<'lb' | 'kg'>(initialUnit ?? 'lb')
  const [tempo, setTempo] = useState('2-1-2-0')
  const [tempoOn, setTempoOn] = useState(true)
  const [restSec, setRestSec] = useState(90)

  const isNumericLoad = ['dumbbell', 'kettlebell', 'bodyweight'].includes(equipment)

  const footer = (
    <div style={{ display: 'flex', gap: 8 }}>
      <Btn variant="secondary" size="lg" full onClick={onClose}>Cancel</Btn>
      <Btn variant="primary" size="lg" full icon="check" onClick={() => {
        onSave?.({ value: load, unit, label: `${load} ${unit}` })
        onClose()
      }}>Save</Btn>
    </div>
  )

  return (
    <BottomSheet open={open} onClose={onClose} title="Edit prescription" footer={footer}>
      <div style={{ fontSize: 13, color: tokens.textMuted, marginBottom: 12 }}>
        {exerciseName}
        <span style={{ marginLeft: 6 }}>·</span>
        <span style={{ color: tokens.text, fontWeight: 600, marginLeft: 6 }}>{equipment}</span>
      </div>

      <Card padded={false} style={{ marginBottom: 4 }}>
        <StepperRow label="Sets" value={sets} onChange={setSets} max={10} />
        <StepperRow label="Reps" value={reps} onChange={setReps} max={50} />

        {isNumericLoad ? (
          <div style={{ padding: '12px 14px', borderTop: `1px solid ${tokens.borderSoft}` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: tokens.textMuted }}>Load</div>
              <div style={{ display: 'flex', gap: 4, padding: 3, background: tokens.surface2, borderRadius: 8, border: `1px solid ${tokens.border}` }}>
                {(['lb', 'kg'] as const).map(u => (
                  <button key={u} onClick={() => setUnit(u)} style={{ height: 24, padding: '0 10px', borderRadius: 6, background: unit === u ? tokens.surface3 : 'transparent', color: unit === u ? tokens.text : tokens.textMuted, border: 'none', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}>{u}</button>
                ))}
              </div>
            </div>
            <Stepper value={load} onChange={setLoad} step={equipment === 'dumbbell' ? 5 : (unit === 'kg' ? 4 : 5)} min={0} max={200} suffix={unit} />
          </div>
        ) : (
          <div style={{ padding: '12px 14px', borderTop: `1px solid ${tokens.borderSoft}`, fontSize: 12, color: tokens.textMuted }}>
            Non-numeric load — edit on the equipment sheet.
          </div>
        )}

        <StepperRow label="Rest" value={restSec} onChange={setRestSec} step={15} min={0} max={300} suffix="s" />

        <div style={{ padding: '12px 14px', borderTop: `1px solid ${tokens.borderSoft}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: tokens.textMuted }}>Tempo</div>
              <div style={{ fontSize: 12, color: tokens.textMuted, marginTop: 2 }}>Eccentric · Bottom · Concentric · Top</div>
            </div>
            <button onClick={() => setTempoOn(v => !v)} style={{ width: 44, height: 26, borderRadius: 999, background: tempoOn ? tokens.accent : tokens.surface3, border: 'none', cursor: 'pointer', position: 'relative', padding: 0 }}>
              <div style={{ position: 'absolute', top: 3, left: tempoOn ? 22 : 3, width: 20, height: 20, borderRadius: 10, background: '#fff', transition: 'left 0.15s' }} />
            </button>
          </div>
          {tempoOn && (
            <input
              value={tempo}
              onChange={e => setTempo(e.target.value)}
              placeholder="2-1-2-0"
              style={{
                width: '100%', padding: '10px 12px', borderRadius: 10,
                background: tokens.surface2, border: `1px solid ${tokens.border}`,
                color: tokens.accent, fontFamily: 'monospace', fontSize: 16,
                fontWeight: 700, letterSpacing: '0.05em', textAlign: 'center', outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          )}
        </div>
      </Card>
    </BottomSheet>
  )
}
