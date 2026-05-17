import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useActiveWorkout } from '@/context/ActiveWorkoutContext'
import { RestTimer } from '@/components/RestTimer'
import { ActiveStraight } from './ActiveStraight'
import { ActiveSuperset } from './ActiveSuperset'
import { ActiveCircuit } from './ActiveCircuit'
import { ActiveAmrap } from './ActiveAmrap'
import { ActiveLadder } from './ActiveLadder'
import { ActiveInterval } from './ActiveInterval'
import { ActiveCarry } from './ActiveCarry'
import { ActiveTempo } from './ActiveTempo'
import { ActiveComplex } from './ActiveComplex'

const SCREEN_MAP = {
  straight: ActiveStraight,
  superset: ActiveSuperset,
  circuit: ActiveCircuit,
  complex: ActiveComplex,
  amrap: ActiveAmrap,
  ladder: ActiveLadder,
  interval: ActiveInterval,
  carry: ActiveCarry,
  tempo: ActiveTempo,
} as const

export function ActiveWorkoutRouter() {
  const nav = useNavigate()
  const { state, nextBlock } = useActiveWorkout()
  const [interBlockRestSec, setInterBlockRestSec] = useState<number | null>(null)

  if (!state.session) {
    return <div style={{ padding: 16, color: '#fff' }}>No active workout</div>
  }

  const block = state.session.blocks[state.currentBlockIndex]
  const isLastBlock = state.currentBlockIndex === state.session.blocks.length - 1

  if (interBlockRestSec !== null) {
    return (
      <RestTimer
        durationSec={interBlockRestSec}
        onDone={() => {
          setInterBlockRestSec(null)
          nextBlock()
        }}
      />
    )
  }

  const Screen = SCREEN_MAP[block.type as keyof typeof SCREEN_MAP] ?? ActiveStraight

  return (
    <Screen
      key={state.currentBlockIndex}
      block={block}
      onExit={() => nav('../')}
      onNextBlock={() => {
        if (isLastBlock) {
          nav('../recap')
        } else {
          const restSec = block.rest_sec ?? 0
          if (restSec > 0) {
            setInterBlockRestSec(restSec)
          } else {
            nextBlock()
          }
        }
      }}
    />
  )
}
