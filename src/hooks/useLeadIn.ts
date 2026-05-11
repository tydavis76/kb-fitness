import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db/db'

export const useLeadIn = (): [0 | 3 | 5 | 10, (value: 0 | 3 | 5 | 10) => Promise<void>] => {
  const settings = useLiveQuery(() => db.settings.get(1))

  const leadIn = (settings?.leadIn ?? 5) as 0 | 3 | 5 | 10

  const setLeadIn = async (value: 0 | 3 | 5 | 10) => {
    if (settings?.id) {
      await db.settings.update(settings.id, { leadIn: value })
    } else {
      await db.settings.add({ id: 1, leadIn: value, unit: 'kg', sound: true, haptics: true, restDefaults: { straight: 90, superset: 60, circuit: 45 } })
    }
  }

  return [leadIn, setLeadIn]
}
