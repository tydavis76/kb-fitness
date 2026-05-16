import { useEffect, useRef, useState } from 'react'
import { CircularTimer } from './CircularTimer'
import { useCountdown } from '@/hooks/useCountdown'
import { tokens } from '@/styles/tokens'

interface RestTimerProps {
  durationSec: number
  onDone: () => void
}

export const RestTimer: React.FC<RestTimerProps> = ({
  durationSec,
  onDone,
}) => {
  const timer = useCountdown({
    duration: durationSec,
    leadIn: 0,
    onComplete: onDone,
  })
  // Block tap-to-skip for 600ms after mount to prevent tap-through from previous screen
  const [tappable, setTappable] = useState(false)
  const tappableRef = useRef(false)
  useEffect(() => {
    timer.start()
    const t = setTimeout(() => { setTappable(true); tappableRef.current = true }, 600)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      onClick={() => { if (tappableRef.current) onDone() }}
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: tokens.restBg,
        zIndex: 9999,
        cursor: 'pointer',
        gap: '40px',
      }}
    >
      <CircularTimer
        remaining={timer.remaining}
        total={timer.total}
        leadCount={timer.leadCount}
        phase={timer.phase}
        size={220}
        accent={tokens.rest}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
        }}
      >
        <div
          style={{
            fontSize: '14px',
            color: tokens.textMuted,
            textAlign: 'center',
            opacity: tappable ? 1 : 0,
            transition: 'opacity 0.3s',
          }}
        >
          Tap anywhere to skip rest
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation()
            onDone()
          }}
          style={{
            padding: '12px 24px',
            backgroundColor: tokens.rest,
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Skip rest
        </button>
      </div>
    </div>
  )
}
