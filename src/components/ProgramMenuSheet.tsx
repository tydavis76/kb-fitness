import { tokens } from '../styles/tokens'
import { Icon } from './Icon'

export type ProgramMenuAction = 'restart' | 'skip' | 'pause' | 'switch' | 'end'

interface MenuItem {
  id: ProgramMenuAction
  icon: string
  label: string
  sub: string
  danger?: boolean
}

const ITEMS: MenuItem[] = [
  { id: 'restart', icon: 'rotate',  label: 'Restart program',  sub: 'Reset to week 1 · keep history' },
  { id: 'skip',    icon: 'skip',    label: 'Skip to week…',    sub: 'For travel or illness gaps' },
  { id: 'pause',   icon: 'pause',   label: 'Pause program',    sub: 'Stop without ending · resume later' },
  { id: 'switch',  icon: 'swap',    label: 'Switch program',   sub: 'End current and pick a new one' },
  { id: 'end',     icon: 'flag',    label: 'End program',      sub: 'Archive this run', danger: true },
]

const KB_FONT = 'Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif'

export interface ProgramMenuSheetProps {
  programTitle: string
  onClose: () => void
  onAction: (action: ProgramMenuAction) => void
}

export function ProgramMenuSheet({ programTitle, onClose, onAction }: ProgramMenuSheetProps) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'flex-end',
        zIndex: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          background: tokens.surface,
          borderRadius: '20px 20px 0 0',
          borderTop: `1px solid ${tokens.border}`,
          padding: '12px 0 28px',
          boxShadow: '0 -8px 24px rgba(0,0,0,0.4)',
        }}
      >
        <div style={{ width: 36, height: 4, borderRadius: 2, background: tokens.border, margin: '4px auto 14px' }} />
        <div style={{
          padding: '0 14px 4px',
          fontSize: 11,
          fontWeight: 700,
          color: tokens.textMuted,
          letterSpacing: '0.10em',
          textTransform: 'uppercase',
        }}>
          {programTitle}
        </div>
        {ITEMS.map((it, i) => (
          <button
            key={it.id}
            onClick={() => onAction(it.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              width: '100%',
              padding: '14px 16px',
              background: 'transparent',
              border: 'none',
              borderTop: i > 0 ? `1px solid ${tokens.borderSoft}` : 'none',
              cursor: 'pointer',
              color: it.danger ? tokens.danger : tokens.text,
              textAlign: 'left',
              fontFamily: KB_FONT,
            }}
          >
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: it.danger ? tokens.dangerBg : tokens.surface2,
              color: it.danger ? tokens.danger : tokens.textMuted,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Icon name={it.icon} size={18} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{it.label}</div>
              <div style={{ fontSize: 12, color: tokens.textMuted, marginTop: 1 }}>{it.sub}</div>
            </div>
            <Icon name="chevron-right" size={16} color={tokens.textMuted} />
          </button>
        ))}
      </div>
    </div>
  )
}
