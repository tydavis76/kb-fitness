import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/db'
import type { SettingsRecord } from '../db/types'

export function useSettings(): SettingsRecord | undefined {
  return useLiveQuery(() => db.settings.get(1))
}
