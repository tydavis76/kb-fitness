import { useState } from 'react'
import { tokens } from '../../styles/tokens'
import { BottomSheet } from '../primitives/BottomSheet'
import { Btn } from '../primitives/Btn'
import { Stepper } from '../primitives/Stepper'
import type { LoadObject } from '../../db/types'

type BwMode = 'bw' | 'weighted' | 'assisted'

const MODES: { id: BwMode; label: string }[] = [
  { id: 'bw',       label: 'Bodyweight' },
  { id: 'weighted', label: '+ Added' },
  { id: 'assisted', label: '− Assist' },
]

const MODE_DESCRIPTIONS: Record<BwMode, string> = {
  bw:       'Tracks bodyweight progression over time.',
  weighted: 'Vest, dip belt, weighted backpack — add to total volume.',
  assisted: 'Band assist or partner spot — subtracts from total volume.',
}

interface Props {
  open: boolean
  onClose: () => void
  onPick?: (load: LoadObject) => void
}

export function LoadEntryBodyweight({ open, onClose, onPick }: Props) {
  const [mode, setMode] = useState<BwMode>('bw')
  const [val, setVal] = useState(0)

  function handlePick() {
    const label =
      mode === 'bw' ? 'BW' :
      mode === 'weighted' ? `BW +${val} lb` :
      `BW −${val} lb`
    const value = mode === 'bw' ? null : (mode === 'weighted' ? val : -val)
    onPick?.({ value, unit: mode === 'bw' ? null : 'lb', label })
    onClose()
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="Bodyweight">
      <div style={{ display: 'flex', gap: 6, marginBottom: 14, padding: 4, background: tokens.surface2, borderRadius: 10, border: `1px solid ${tokens.border}` }}>
        {MODES.map(o => (
          <button key={o.id} onClick={() => setMode(o.id)} style={{
            flex: 1, height: 36,
            background: mode === o.id ? tokens.surface3 : 'transparent',
            color: mode === o.id ? tokens.text : tokens.textMuted,
            border: 'none', borderRadius: 8,
            fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
          }}>{o.label}</button>
        ))}
      </div>
      {mode !== 'bw' && (
        <div style={{ marginBottom: 14 }}>
          <Stepper value={val} onChange={setVal} step={5} min={0} max={100} suffix={mode === 'weighted' ? '+ lb' : '− lb'} />
        </div>
      )}
      <div style={{ padding: 12, background: tokens.surface2, borderRadius: 10, fontSize: 12, color: tokens.textMuted, marginBottom: 14, textAlign: 'center' }}>
        {MODE_DESCRIPTIONS[mode]}
      </div>
      <Btn variant="primary" size="lg" full onClick={handlePick}>
        {mode === 'bw' ? 'Use bodyweight' : `${mode === 'weighted' ? '+' : '−'}${val} lb`}
      </Btn>
    </BottomSheet>
  )
}
