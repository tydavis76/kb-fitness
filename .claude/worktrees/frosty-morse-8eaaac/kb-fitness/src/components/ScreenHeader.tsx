import { ReactNode } from 'react'
import { ChevronLeft } from 'lucide-react'

interface ScreenHeaderProps {
  title: string
  subtitle?: string
  right?: ReactNode
  onBack?: () => void
}

export function ScreenHeader({ title, subtitle, right, onBack }: ScreenHeaderProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: '16px var(--page-x) 12px',
      gap: 8,
      flexShrink: 0,
      paddingTop: 'calc(16px + var(--safe-top))',
    }}>
      {onBack && (
        <button
          onClick={onBack}
          aria-label="Back"
          style={{
            background: 'none', border: 'none', color: 'var(--text)',
            cursor: 'pointer', padding: 0, display: 'flex',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <ChevronLeft size={24} />
        </button>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        {subtitle && (
          <div className="t-label-caps" style={{ marginBottom: 2 }}>{subtitle}</div>
        )}
        <h1 style={{ fontSize: 'var(--title-size)', fontWeight: 'var(--title-weight)', lineHeight: 'var(--title-leading)' }}>
          {title}
        </h1>
      </div>
      {right && <div style={{ flexShrink: 0 }}>{right}</div>}
    </div>
  )
}
