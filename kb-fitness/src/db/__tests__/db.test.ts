import { db } from '../db'

test('db has required tables', () => {
  expect(db.programs).toBeDefined()
  expect(db.sessions).toBeDefined()
  expect(db.workoutLogs).toBeDefined()
  expect(db.activeWorkout).toBeDefined()
  expect(db.settings).toBeDefined()
})

test('db version is 1', () => {
  expect(db.verno).toBe(1)
})
