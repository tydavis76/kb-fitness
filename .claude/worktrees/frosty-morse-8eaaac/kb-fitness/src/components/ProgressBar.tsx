import { CSSProperties } from 'react'

interface ProgressBarProps {
  value: number
  color?: string
  height?: number
  style?: CSSProperties
}

export function ProgressBar({ value, color, height = 4, style }: ProgressBarProps) {
  return (
    <div style={{
      width: '100%', height, background: 'var(--surface-2)',
      borderRadius: height / 2, overflow: 'hidden', ...style,
    }}>
      <div style={{
        width: `${Math.min(100, Math.max(0, value))}%`,
        height: '100%',
        background: color ?? 'var(--primary)',
        borderRadius: height / 2,
        transition: 'width 300ms ease-out',
      }} />
    </div>
  )
}
