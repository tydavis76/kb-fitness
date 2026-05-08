import { CSSProperties } from 'react'

export function Divider({ style }: { style?: CSSProperties }) {
  return (
    <div style={{
      height: 1,
      background: 'var(--border)',
      ...style,
    }} />
  )
}
