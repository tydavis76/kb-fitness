interface ToggleProps {
  value: boolean
  onChange: (v: boolean) => void
}

export function Toggle({ value, onChange }: ToggleProps) {
  return (
    <button
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      style={{
        width: 44, height: 26,
        background: value ? 'var(--primary)' : 'var(--surface-2)',
        borderRadius: 13, position: 'relative',
        border: `1px solid ${value ? 'var(--primary)' : 'var(--border)'}`,
        transition: 'background 200ms ease-out',
        flexShrink: 0,
        cursor: 'pointer',
        padding: 0,
      }}
    >
      <div style={{
        width: 20, height: 20, borderRadius: 10,
        background: value ? 'var(--bg)' : 'var(--text-muted)',
        position: 'absolute', top: 2, left: value ? 20 : 2,
        transition: 'left 200ms ease-out',
      }} />
    </button>
  )
}
