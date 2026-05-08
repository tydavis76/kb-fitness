import { CSSProperties, ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'

interface BtnProps {
  children: ReactNode
  onClick?: () => void
  icon?: LucideIcon
  large?: boolean
  disabled?: boolean
  type?: 'button' | 'submit'
  style?: CSSProperties
}

export function PrimaryBtn({ children, onClick, icon: Icon, large, disabled, type = 'button', style }: BtnProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        minHeight: large ? 56 : 48,
        padding: large ? '0 32px' : '0 20px',
        background: disabled ? 'var(--surface-2)' : 'var(--primary)',
        color: disabled ? 'var(--text-muted)' : 'var(--bg)',
        border: 'none',
        borderRadius: 14,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        fontFamily: 'var(--font)',
        fontSize: large ? 17 : 15,
        fontWeight: 700,
        cursor: disabled ? 'default' : 'pointer',
        WebkitTapHighlightColor: 'transparent',
        userSelect: 'none',
        transition: 'opacity 100ms ease-out',
        ...style,
      }}
    >
      {Icon && <Icon size={20} />}
      {children}
    </button>
  )
}

export function SecondaryBtn({ children, onClick, icon: Icon, disabled, type = 'button', style }: BtnProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        minHeight: 44,
        padding: '0 16px',
        background: 'var(--surface-2)',
        color: 'var(--text)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        fontFamily: 'var(--font)',
        fontSize: 14,
        fontWeight: 600,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'default' : 'pointer',
        WebkitTapHighlightColor: 'transparent',
        userSelect: 'none',
        ...style,
      }}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  )
}

interface IconBtnProps {
  icon: LucideIcon
  onClick?: () => void
  color?: string
  size?: number
  label: string
  style?: CSSProperties
}

export function IconBtn({ icon: Icon, onClick, color, size = 44, label, style }: IconBtnProps) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        color: color ?? 'var(--text-muted)',
        WebkitTapHighlightColor: 'transparent',
        ...style,
      }}
    >
      <Icon size={22} strokeWidth={2} />
    </button>
  )
}

export function DangerBtn({ children, onClick, icon: Icon, disabled, type = 'button', style }: BtnProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        minHeight: 44,
        padding: '0 16px',
        background: 'transparent',
        color: 'var(--danger)',
        border: '1px solid var(--danger)',
        borderRadius: 10,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        fontFamily: 'var(--font)',
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer',
        ...style,
      }}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  )
}
