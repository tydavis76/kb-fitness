import { useState } from 'react'
import { tokens } from '../../styles/tokens'
import { BottomSheet } from '../primitives/BottomSheet'
import { Btn } from '../primitives/Btn'
import { Icon } from '../Icon'
import type { LoadObject } from '../../db/types'

const BANDS = [
  { name: 'Yellow', tension: 'X-Light', hex: '#F2D640' },
  { name: 'Red',    tension: 'Light',   hex: '#E15B5B' },
  { name: 'Green',  tension: 'Medium',  hex: '#7BD88F' },
  { name: 'Blue',   tension: 'Heavy',   hex: '#60A5FA' },
  { name: 'Black',  tension: 'X-Heavy', hex: '#1E222B' },
  { name: 'Purple', tension: '2× heavy',hex: '#A78BFA' },
]

interface Props {
  open: boolean
  onClose: () => void
  onPick?: (load: LoadObject) => void
}

export function LoadEntryBand({ open, onClose, onPick }: Props) {
  const [picked, setPicked] = useState('Red')

  function handlePick() {
    onPick?.({ value: null, unit: null, label: `${picked} band` })
    onClose()
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="Pick a band">
      <div style={{ fontSize: 12, color: tokens.textMuted, marginBottom: 12 }}>
        Bands have no numeric load — track color and tension over time.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
        {BANDS.map(b => {
          const active = b.name === picked
          return (
            <button key={b.name} onClick={() => setPicked(b.name)} style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px',
              background: active ? tokens.surface2 : tokens.surface,
              border: `1px solid ${active ? b.hex : tokens.border}`,
              borderRadius: 12, cursor: 'pointer', color: tokens.text,
              fontFamily: 'inherit', textAlign: 'left',
            }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: b.hex, border: `1px solid ${tokens.border}`, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{b.name}</div>
                <div style={{ fontSize: 12, color: tokens.textMuted }}>{b.tension}</div>
              </div>
              {active && <Icon name="check" size={18} color={b.hex} />}
            </button>
          )
        })}
      </div>
      <Btn variant="primary" size="lg" full onClick={handlePick}>Use {picked} band</Btn>
    </BottomSheet>
  )
}
