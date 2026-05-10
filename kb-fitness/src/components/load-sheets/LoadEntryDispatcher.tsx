import { LoadEntryKettlebell } from './LoadEntryKettlebell'
import { LoadEntryDumbbell } from './LoadEntryDumbbell'
import { LoadEntryBand } from './LoadEntryBand'
import { LoadEntryDamper } from './LoadEntryDamper'
import { LoadEntryBodyweight } from './LoadEntryBodyweight'
import { LoadEntryTrx } from './LoadEntryTrx'
import type { LoadObject } from '../../db/types'

interface Props {
  open: boolean
  equipment: string
  onClose: () => void
  onPick?: (load: LoadObject) => void
}

export function LoadEntryDispatcher({ open, equipment, onClose, onPick }: Props) {
  const props = { open, onClose, onPick }
  switch (equipment) {
    case 'kettlebell':  return <LoadEntryKettlebell {...props} />
    case 'dumbbell':    return <LoadEntryDumbbell {...props} />
    case 'band':        return <LoadEntryBand {...props} />
    case 'rower':       return <LoadEntryDamper {...props} />
    case 'trx':         return <LoadEntryTrx {...props} />
    default:            return <LoadEntryBodyweight {...props} />
  }
}
