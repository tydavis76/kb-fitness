import type { ReactNode, HTMLAttributes } from 'react'
import { tokens } from '../../styles/tokens'
import { Icon } from '../Icon'

export interface ScreenHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string
  subtitle?: string
  leftIcon?: string
  leftAction?: () => void
  rightContent?: ReactNode
  dense?: boolean
}

export function ScreenHeader({
  title,
  subtitle,
  leftIcon,
  leftAction,
  rightContent,
  dense = false,
}: ScreenHeaderProps) {
  return (
    <div
      style={{
        padding: dense ? '8px 16px 12px' : '12px 16px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          minWidth: 0,
          flex: 1,
        }}
      >
        {leftIcon && (
          <button
            onClick={leftAction}
            style={{
              width: 36,
              height: 36,
              background: 'transparent',
              border: 'none',
              color: tokens.text,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: -8,
              borderRadius: 10,
            }}
          >
            <Icon name={leftIcon} size={20} color={tokens.text} />
          </button>
        )}
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
              color: tokens.text,
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                fontSize: 15,
                fontWeight: 500,
                color: tokens.textMuted,
                marginTop: 2,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
      </div>
      {rightContent}
    </div>
  )
}
