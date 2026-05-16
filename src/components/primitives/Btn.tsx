import type { CSSProperties, ReactNode, ButtonHTMLAttributes } from 'react'
import { tokens } from '../../styles/tokens'
import { Icon } from '../Icon'

export type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
export type BtnSize = 'sm' | 'md' | 'lg'

export interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode
  variant?: BtnVariant
  size?: BtnSize
  icon?: string
  iconRight?: string
  onClick?: () => void
  full?: boolean
  accent?: string
  style?: CSSProperties
}

export function Btn({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  onClick,
  full = false,
  accent,
  style,
  disabled = false,
  ...rest
}: BtnProps) {
  const variants: Record<BtnVariant, { bg: string; color: string; border: string }> = {
    primary: {
      bg: accent || tokens.primary,
      color: tokens.bg,
      border: 'transparent',
    },
    secondary: {
      bg: tokens.surface2,
      color: tokens.text,
      border: tokens.border,
    },
    ghost: {
      bg: 'transparent',
      color: tokens.textMuted,
      border: 'transparent',
    },
    danger: {
      bg: 'transparent',
      color: tokens.danger,
      border: tokens.danger,
    },
    outline: {
      bg: 'transparent',
      color: tokens.text,
      border: tokens.border,
    },
  }

  const v = variants[variant] || variants.primary

  const heights: Record<BtnSize, number> = {
    sm: 36,
    md: 44,
    lg: 56,
  }

  const fontSizes: Record<BtnSize, number> = {
    sm: 12,
    md: 14,
    lg: 15,
  }

  const fontWeights: Record<BtnSize, number> = {
    sm: 600,
    md: 600,
    lg: 700,
  }

  const paddingsX: Record<BtnSize, number> = {
    sm: 18,
    md: 18,
    lg: 24,
  }

  const borderRadius: Record<BtnSize, number> = {
    sm: 12,
    md: 12,
    lg: 16,
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        width: full ? '100%' : 'auto',
        height: heights[size],
        padding: `0 ${paddingsX[size]}px`,
        background: v.bg,
        color: v.color,
        border: `1px solid ${v.border}`,
        borderRadius: borderRadius[size],
        fontSize: fontSizes[size],
        fontWeight: fontWeights[size],
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        letterSpacing: '-0.005em',
        ...style,
      }}
      {...rest}
    >
      {icon && <Icon name={icon} size={fontSizes[size] + 2} color={v.color} />}
      {children}
      {iconRight && <Icon name={iconRight} size={fontSizes[size] + 2} color={v.color} />}
    </button>
  )
}
