import { tokens } from '../../styles/tokens'
import { Icon } from '../Icon'

interface StepperProps {
  value: number
  onChange: (v: number) => void
  step?: number
  min?: number
  max?: number
  suffix?: string
}

export function Stepper({ value, onChange, step = 1, min = 0, max = 999, suffix }: StepperProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <button
        onClick={() => onChange(Math.max(min, value - step))}
        style={{
          width: 44, height: 44, borderRadius: 12,
          background: tokens.surface2, border: `1px solid ${tokens.border}`,
          color: tokens.text, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Icon name="minus" size={18} />
      </button>
      <div style={{
        flex: 1, textAlign: 'center',
        fontSize: 28, fontWeight: 700,
        fontVariantNumeric: 'tabular-nums',
        color: tokens.text,
      }}>
        {value}
        {suffix && <span style={{ fontSize: 14, fontWeight: 500, color: tokens.textMuted, marginLeft: 4 }}>{suffix}</span>}
      </div>
      <button
        onClick={() => onChange(Math.min(max, value + step))}
        style={{
          width: 44, height: 44, borderRadius: 12,
          background: tokens.primary, border: 'none',
          color: tokens.bg, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Icon name="plus" size={18} />
      </button>
    </div>
  )
}
