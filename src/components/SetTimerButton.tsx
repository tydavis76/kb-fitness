import { useState } from 'react'
import { CircularTimer } from './CircularTimer'
import { useCountdown } from '@/hooks/useCountdown'
import { useLeadIn } from '@/hooks/useLeadIn'
import { tokens } from '@/styles/tokens'

interface SetTimerButtonProps {
  durationSec: number
  onComplete?: () => void
}

export const SetTimerButton: React.FC<SetTimerButtonProps> = ({
  durationSec,
  onComplete,
}) => {
  const [isActive, setIsActive] = useState(false)
  const [leadIn] = useLeadIn()
  const timer = useCountdown({
    duration: durationSec,
    leadIn,
    onComplete: () => {
      setIsActive(false)
      onComplete?.()
    },
  })

  if (!isActive) {
    return (
      <button
        onClick={() => {
          setIsActive(true)
          timer.start()
        }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '12px 20px',
          backgroundColor: tokens.primary,
          color: '#000',
          border: 'none',
          borderRadius: '8px',
          fontWeight: '600',
          cursor: 'pointer',
          fontSize: '14px',
        }}
      >
        Start {Math.floor(durationSec / 60)}m{durationSec % 60 ? `:${(durationSec % 60).toString().padStart(2, '0')}` : ''} timer
      </button>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        padding: '20px',
      }}
    >
      <CircularTimer
        remaining={timer.remaining}
        total={timer.total}
        leadCount={timer.leadCount}
        phase={timer.phase}
        size={120}
      />

      <div style={{ display: 'flex', gap: '12px' }}>
        {timer.phase === 'paused' ? (
          <button
            onClick={() => timer.resume()}
            style={{
              padding: '8px 16px',
              backgroundColor: tokens.primary,
              color: '#000',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            Resume
          </button>
        ) : (
          <button
            onClick={() => timer.pause()}
            style={{
              padding: '8px 16px',
              backgroundColor: tokens.surface2,
              color: tokens.text,
              border: `1px solid ${tokens.border}`,
              borderRadius: '6px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            Pause
          </button>
        )}

        <button
          onClick={() => {
            timer.reset()
            setIsActive(false)
          }}
          style={{
            padding: '8px 16px',
            backgroundColor: tokens.surface2,
            color: tokens.text,
            border: `1px solid ${tokens.border}`,
            borderRadius: '6px',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '13px',
          }}
        >
          Reset
        </button>
      </div>
    </div>
  )
}
