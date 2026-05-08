import { useNavigate } from 'react-router-dom'
import { useActiveWorkout } from '@/context/ActiveWorkoutContext'
import { ActiveStraight } from './ActiveStraight'
import { ActiveSuperset } from './ActiveSuperset'
import { ActiveCircuit } from './ActiveCircuit'
import { ActiveAmrap } from './ActiveAmrap'
import { ActiveLadder } from './ActiveLadder'
import { ActiveInterval } from './ActiveInterval'
import { ActiveCarry } from './ActiveCarry'
import { ActiveTempo } from './ActiveTempo'

const SCREEN_MAP = {
  straight: ActiveStraight,
  superset: ActiveSuperset,
  circuit: ActiveCircuit,
  amrap: ActiveAmrap,
  ladder: ActiveLadder,
  interval: ActiveInterval,
  carry: ActiveCarry,
  tempo: ActiveTempo,
} as const

export function ActiveWorkoutRouter() {
  const nav = useNavigate()
  const { state, nextBlock } = useActiveWorkout()

  if (!state.session) {
    return <div style={{ padding: 16, color: '#fff' }}>No active workout</div>
  }

  const block = state.session.blocks[state.currentBlockIndex]
  const isLastBlock = state.currentBlockIndex === state.session.blocks.length - 1

  const Screen = SCREEN_MAP[block.type as keyof typeof SCREEN_MAP] ?? ActiveStraight

  return (
    <Screen
      block={block}
      onExit={() => nav('../')}
      onNextBlock={() => {
        if (isLastBlock) {
          nav('../recap')
        } else {
          nextBlock()
        }
      }}
    />
  )
}
