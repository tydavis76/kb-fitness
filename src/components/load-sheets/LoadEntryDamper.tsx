import { useState } from 'react'
import { tokens } from '../../styles/tokens'
import { BottomSheet } from '../primitives/BottomSheet'
import { Btn } from '../primitives/Btn'
import type { LoadObject } from '../../db/types'

interface Props {
  open: boolean
  onClose: () => void
  onPick?: (load: LoadObject) => void
}

export function LoadEntryDamper({ open, onClose, onPick }: Props) {
  const [val, setVal] = useState(5)

  function handlePick() {
    onPick?.({ value: val, unit: null, label: `Damper ${val}` })
    onClose()
  }

  const pct = val / 10
  const arc = pct * 282

  return (
    <BottomSheet open={open} onClose={onClose} title="Damper setting">
      <div style={{ fontSize: 12, color: tokens.textMuted, marginBottom: 14 }}>
        Rowing machine drag factor. 3–5 typical for steady; 6–9 for power.
      </div>
      <div style={{ position: 'relative', height: 120, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="220" height="120" viewBox="0 0 220 120">
          <path d="M 20 110 A 90 90 0 0 1 200 110" fill="none" stroke={tokens.border} strokeWidth="10" strokeLinecap="round" />
          <path d="M 20 110 A 90 90 0 0 1 200 110" fill="none" stroke={tokens.accent} strokeWidth="10" strokeLinecap="round" strokeDasharray={`${arc} 282`} />
        </svg>
        <div style={{ position: 'absolute', textAlign: 'center' }}>
          <div style={{ fontSize: 56, fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: tokens.accent, letterSpacing: '-0.03em', lineHeight: 1 }}>{val}</div>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: tokens.textMuted, marginTop: 2 }}>Damper</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
        {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
          <button key={n} onClick={() => setVal(n)} style={{
            flex: 1, height: 44, borderRadius: 10,
            background: val === n ? tokens.accent : tokens.surface2,
            color: val === n ? tokens.bg : tokens.text,
            border: `1px solid ${val === n ? tokens.accent : tokens.border}`,
            cursor: 'pointer', fontWeight: 700, fontSize: 13,
            fontFamily: 'inherit', fontVariantNumeric: 'tabular-nums',
          }}>{n}</button>
        ))}
      </div>
      <Btn variant="primary" size="lg" full onClick={handlePick}>Use damper {val}</Btn>
    </BottomSheet>
  )
}
