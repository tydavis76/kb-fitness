import { CSSProperties, ReactNode, HTMLAttributes } from 'react'
import { tokens } from '../../styles/tokens'

export type ChipTone = 'default' | 'accent' | 'work' | 'rest' | 'danger' | 'solid' | 'ghost'
export type ChipSize = 'sm' | 'md'

export interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode
  tone?: ChipTone
  size?: ChipSize
  style?: CSSProperties
}

export function Chip({
  children,
  tone = 'default',
  size = 'md',
  style,
  className = '',
  ...rest
}: ChipProps) {
  const tones: Record<ChipTone, { bg: string; color: string; border: string }> = {
    default: { bg: tokens.surface2, color: tokens.textMuted, border: tokens.border },
    work: { bg: tokens.workBg, color: tokens.work, border: tokens.work },
    rest: { bg: tokens.restBg, color: tokens.rest, border: tokens.rest },
    accent: { bg: tokens.accentBg, color: tokens.accent, border: tokens.accent },
    danger: { bg: tokens.dangerBg, color: tokens.danger, border: tokens.danger },
    solid: { bg: tokens.text, color: tokens.bg, border: tokens.text },
    ghost: { bg: 'transparent', color: tokens.textMuted, border: tokens.border },
  }

  const t = tones[tone] || tones.default

  const heights: Record<ChipSize, number> = {
    sm: 22,
    md: 26,
  }

  const fontSizes: Record<ChipSize, number> = {
    sm: 10,
    md: 12,
  }

  const paddings: Record<ChipSize, string> = {
    sm: '3px 8px',
    md: '5px 12px',
  }

  return (
    <span
      className={`chip chip--${tone} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        height: heights[size],
        padding: paddings[size],
        borderRadius: 999,
        background: t.bg,
        color: t.color,
        border: `1px solid ${t.border}`,
        fontSize: fontSizes[size],
        fontWeight: 700,
        letterSpacing: '0.07em',
        textTransform: 'uppercase',
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  )
}
