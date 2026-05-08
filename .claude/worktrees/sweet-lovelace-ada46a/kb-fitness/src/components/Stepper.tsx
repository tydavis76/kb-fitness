import { CSSProperties } from 'react'

interface StepperProps {
  value: number
  onDecrement: () => void
  onIncrement: () => void
  unit?: string
  style?: CSSProperties
}

export function Stepper({ value, onDecrement, onIncrement, unit, style }: StepperProps) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center',
      background: 'var(--surface-2)', border: '1px solid var(--border)',
      borderRadius: 'var(--r-md)', overflow: 'hidden',
      ...style,
    }}>
      <button
        aria-label="−"
        onClick={onDecrement}
        style={{
          width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'transparent', border: 'none', color: 'var(--primary)',
          fontSize: 22, cursor: 'pointer', fontFamily: 'var(--font)',
          WebkitTapHighlightColor: 'transparent',
        }}
      >−</button>
      <div style={{ width: 1, height: 28, background: 'var(--border)', flexShrink: 0 }} />
      <div style={{
        minWidth: 52, textAlign: 'center', fontSize: 18, fontWeight: 700,
        color: 'var(--text)', fontVariantNumeric: 'tabular-nums', padding: '0 4px',
      }}>
        {value}
      </div>
      <div style={{ width: 1, height: 28, background: 'var(--border)', flexShrink: 0 }} />
      <button
        aria-label="+"
        onClick={onIncrement}
        style={{
          width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'transparent', border: 'none', color: 'var(--primary)',
          fontSize: 22, cursor: 'pointer', fontFamily: 'var(--font)',
          WebkitTapHighlightColor: 'transparent',
        }}
      >+</button>
      {unit && (
        <div style={{ paddingRight: 12, fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>
          {unit}
        </div>
      )}
    </div>
  )
}
