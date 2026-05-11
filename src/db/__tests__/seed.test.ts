import { seedIfNeeded } from '../seed'
import { db } from '../db'

beforeEach(async () => {
  await db.programs.clear()
  await db.sessions.clear()
  await db.settings.clear()
  localStorage.removeItem('kb.seeded')
})

test('seedIfNeeded inserts program and sessions on first run', async () => {
  await seedIfNeeded()
  const programs = await db.programs.toArray()
  const sessions = await db.sessions.toArray()
  expect(programs).toHaveLength(1)
  expect(programs[0].programId).toBe('8wk-kb-healthier-you')
  expect(sessions.length).toBeGreaterThan(0)
})

test('seedIfNeeded is idempotent — second call skips', async () => {
  await seedIfNeeded()
  await seedIfNeeded()
  const programs = await db.programs.toArray()
  expect(programs).toHaveLength(1)
})

test('seeded settings default to lb + 5s lead-in', async () => {
  await seedIfNeeded()
  const settings = await db.settings.get(1)
  expect(settings?.unit).toBe('lb')
  expect(settings?.leadIn).toBe(5)
})
