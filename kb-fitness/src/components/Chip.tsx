import { CSSProperties } from 'react'

export type ChipColor = 'work' | 'rest' | 'accent' | 'danger' | 'default'

const chipStyles: Record<ChipColor, { bg: string; fg: string; border: string }> = {
  work:    { bg: 'var(--work-bg)',   fg: 'var(--work)',   border: 'rgba(123,216,143,0.4)' },
  rest:    { bg: 'var(--rest-bg)',   fg: 'var(--rest)',   border: 'rgba(96,165,250,0.4)' },
  accent:  { bg: 'var(--accent-bg)', fg: 'var(--accent)', border: 'rgba(245,158,11,0.4)' },
  danger:  { bg: 'var(--danger-bg)', fg: 'var(--danger)', border: 'rgba(248,113,113,0.4)' },
  default: { bg: 'var(--surface-2)', fg: 'var(--text-muted)', border: 'var(--border)' },
}

interface ChipProps {
  label: string
  color?: ChipColor
  style?: CSSProperties
}

export function Chip({ label, color = 'default', style }: ChipProps) {
  const s = chipStyles[color]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      height: 24, padding: '0 10px', borderRadius: 'var(--r-pill)',
      fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
      background: s.bg, color: s.fg, border: `1px solid ${s.border}`,
      flexShrink: 0,
      ...style,
    }}>
      {label}
    </span>
  )
}
