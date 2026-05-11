import { tokens } from '../../styles/tokens'
import { BottomSheet } from '../primitives/BottomSheet'
import { Btn } from '../primitives/Btn'
import type { LoadObject } from '../../db/types'

interface Props {
  open: boolean
  onClose: () => void
  onPick?: (load: LoadObject) => void
}

export function LoadEntryTrx({ open, onClose, onPick }: Props) {
  function handlePick() {
    onPick?.({ value: null, unit: null, label: 'TRX' })
    onClose()
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="TRX">
      <div style={{ fontSize: 13, color: tokens.textMuted, marginBottom: 16 }}>
        TRX resistance is adjusted by foot position — no numeric load to log.
      </div>
      <Btn variant="primary" size="lg" full onClick={handlePick}>Confirm</Btn>
    </BottomSheet>
  )
}
