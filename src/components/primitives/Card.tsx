import type { CSSProperties, ReactNode, HTMLAttributes } from 'react'
import { tokens } from '../../styles/tokens'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  elevated?: boolean
  padded?: boolean
  style?: CSSProperties
}

export function Card({
  children,
  elevated = false,
  padded = true,
  style,
  ...rest
}: CardProps) {
  return (
    <div
      style={{
        background: elevated ? tokens.surface2 : tokens.surface,
        border: `1px solid ${tokens.border}`,
        borderRadius: 14,
        padding: padded ? 16 : 0,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  )
}
