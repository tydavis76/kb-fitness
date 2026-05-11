import { useState } from 'react'
import { tokens } from '../../styles/tokens'
import { BottomSheet } from '../primitives/BottomSheet'
import { Btn } from '../primitives/Btn'
import { Icon } from '../Icon'
import type { LoadObject } from '../../db/types'

const KB_SIZES_KG = [12, 16, 20, 24, 28, 32, 36, 40, 48]

interface Props {
  open: boolean
  onClose: () => void
  onPick?: (load: LoadObject) => void
}

export function LoadEntryKettlebell({ open, onClose, onPick }: Props) {
  const [picked, setPicked] = useState(24)
  const [unit, setUnit] = useState<'kg' | 'lb'>('kg')

  function handlePick() {
    const displayVal = unit === 'lb' ? Math.round(picked * 2.2) : picked
    onPick?.({ value: displayVal, unit, label: `${displayVal} ${unit}` })
    onClose()
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="Pick a kettlebell">
      <div style={{ display: 'flex', gap: 6, marginBottom: 14, padding: 4, background: tokens.surface2, borderRadius: 10, border: `1px solid ${tokens.border}` }}>
        {(['kg', 'lb'] as const).map(u => (
          <button key={u} onClick={() => setUnit(u)} style={{
            flex: 1, height: 36,
            background: unit === u ? tokens.surface3 : 'transparent',
            color: unit === u ? tokens.text : tokens.textMuted,
            border: 'none', borderRadius: 8,
            fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
            textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>{u}</button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14 }}>
        {KB_SIZES_KG.map(s => {
          const active = s === picked
          const display = unit === 'lb' ? Math.round(s * 2.2) : s
          return (
            <button key={s} onClick={() => setPicked(s)} style={{
              padding: '14px 8px', borderRadius: 12,
              background: active ? tokens.workBg : tokens.surface2,
              border: `1px solid ${active ? tokens.primary : tokens.border}`,
              color: active ? tokens.primary : tokens.text,
              cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            }}>
              <Icon name="kettlebell" size={28} color={active ? tokens.primary : tokens.textMuted} />
              <span style={{ fontSize: 18, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{display}</span>
              <span style={{ fontSize: 10, color: tokens.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{unit}</span>
            </button>
          )
        })}
      </div>
      <Btn variant="primary" size="lg" full onClick={handlePick}>
        Use {unit === 'lb' ? Math.round(picked * 2.2) : picked} {unit}
      </Btn>
    </BottomSheet>
  )
}
