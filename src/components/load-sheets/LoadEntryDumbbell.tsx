import { useState } from 'react'
import { tokens } from '../../styles/tokens'
import { BottomSheet } from '../primitives/BottomSheet'
import { Btn } from '../primitives/Btn'
import { Stepper } from '../primitives/Stepper'
import type { LoadObject } from '../../db/types'

const QUICK = [25, 35, 45, 50, 60, 75]

interface Props {
  open: boolean
  onClose: () => void
  onPick?: (load: LoadObject) => void
}

export function LoadEntryDumbbell({ open, onClose, onPick }: Props) {
  const [val, setVal] = useState(50)

  function handlePick() {
    onPick?.({ value: val, unit: 'lb', label: `${val} lb` })
    onClose()
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="Dumbbell load">
      <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
        {QUICK.map(q => (
          <button key={q} onClick={() => setVal(q)} style={{
            height: 32, padding: '0 12px', borderRadius: 999,
            background: val === q ? tokens.primary : tokens.surface2,
            color: val === q ? tokens.bg : tokens.textMuted,
            border: `1px solid ${val === q ? tokens.primary : tokens.border}`,
            cursor: 'pointer', fontWeight: 700, fontSize: 12,
            fontFamily: 'inherit', fontVariantNumeric: 'tabular-nums',
          }}>{q} lb</button>
        ))}
      </div>
      <Stepper value={val} onChange={setVal} step={5} min={5} max={200} suffix="lb" />
      <div style={{ marginTop: 8, fontSize: 11, color: tokens.textMuted, textAlign: 'center' }}>
        5 lb increments · max 200 lb
      </div>
      <div style={{ marginTop: 16 }}>
        <Btn variant="primary" size="lg" full onClick={handlePick}>Use {val} lb</Btn>
      </div>
    </BottomSheet>
  )
}
