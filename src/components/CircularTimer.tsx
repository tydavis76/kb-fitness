import { tokens } from '@/styles/tokens'

interface CircularTimerProps {
  remaining: number
  total: number
  leadCount: number
  phase: 'idle' | 'lead' | 'run' | 'paused' | 'done'
  size?: number
  accent?: string
}

export const CircularTimer: React.FC<CircularTimerProps> = ({
  remaining,
  total,
  leadCount,
  phase,
  size = 200,
  accent = tokens.primary,
}) => {
  // Calculate progress percentage
  let progressPercent = 0
  if (phase === 'lead') {
    progressPercent = 100
  } else if (phase === 'run' || phase === 'paused') {
    progressPercent = (remaining / total) * 100
  } else if (phase === 'done') {
    progressPercent = 100
  }

  // Circle SVG parameters
  const radius = size / 2 - 8
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference

  // Ring color based on phase
  let ringColor = accent
  if (phase === 'lead') {
    ringColor = tokens.accent
  } else if (phase === 'done') {
    ringColor = tokens.primary
  }

  // Format time display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: `rotate(-90deg)` }}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={tokens.surface2}
          strokeWidth="6"
        />
        {/* Progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.3s ease' }}
        />
      </svg>

      {/* Center display */}
      <div
        style={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        {phase === 'lead' ? (
          <>
            <div
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: tokens.accent,
              }}
            >
              {leadCount}
            </div>
            <div
              style={{
                fontSize: '12px',
                color: tokens.textMuted,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              GET READY
            </div>
          </>
        ) : (
          <div
            style={{
              fontSize: '32px',
              fontWeight: '500',
              fontFamily: 'monospace',
              color: tokens.text,
            }}
          >
            {formatTime(remaining)}
          </div>
        )}
      </div>
    </div>
  )
}
