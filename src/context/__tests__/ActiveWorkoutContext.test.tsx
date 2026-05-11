import { renderHook, act } from '@testing-library/react'
import React from 'react'
import { ActiveWorkoutProvider, useActiveWorkout } from '../ActiveWorkoutContext'
import { mockSession } from '../../test/fixtures'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ActiveWorkoutProvider>{children}</ActiveWorkoutProvider>
)

test('starts in idle state', () => {
  const { result } = renderHook(() => useActiveWorkout(), { wrapper })
  expect(result.current.state.status).toBe('idle')
})

test('startWorkout transitions to active', async () => {
  const { result } = renderHook(() => useActiveWorkout(), { wrapper })
  await act(async () => { await result.current.startWorkout(mockSession) })
  expect(result.current.state.status).toBe('active')
  expect(result.current.state.currentBlockIndex).toBe(0)
})

test('logSet captures actualReps and actualLoad', async () => {
  const { result } = renderHook(() => useActiveWorkout(), { wrapper })
  await act(async () => { await result.current.startWorkout(mockSession) })
  act(() => {
    result.current.logSet({
      exerciseId: 'kb-swing',
      setIndex: 0,
      actualReps: 10,
      actualLoad: { value: 24, unit: 'kg', label: '24 kg' },
      completedAt: Date.now(),
    })
  })
  const blockState = result.current.state.blockStates[0]
  expect(blockState.setData[0].actualReps).toBe(10)
  expect(blockState.completedSets).toBe(1)
})

test('nextBlock increments currentBlockIndex', async () => {
  const session: typeof mockSession = {
    ...mockSession,
    blocks: [...mockSession.blocks, { ...mockSession.blocks[0], label: 'B' }],
  }
  const { result } = renderHook(() => useActiveWorkout(), { wrapper })
  await act(async () => { await result.current.startWorkout(session) })
  act(() => { result.current.nextBlock() })
  expect(result.current.state.currentBlockIndex).toBe(1)
})
