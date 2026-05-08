import type { WorkoutSession } from '../db/types'

export const mockSession: WorkoutSession = {
  session_id: 'test-session-1',
  metadata: { title: 'Test Session', environment: 'Home' },
  blocks: [
    {
      type: 'straight',
      label: 'A',
      name: 'Test block',
      rounds: 3,
      rest_sec: 90,
      exercises: [
        {
          exercise_id: 'kb-swing',
          name: 'KB Swing',
          prescription: {
            type: 'reps',
            target: 10,
            load: { value: 24, unit: 'kg', label: '24 kg' },
          },
        },
      ],
    },
  ],
}
