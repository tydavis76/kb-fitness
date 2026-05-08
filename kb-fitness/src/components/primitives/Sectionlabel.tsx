import type { ReactNode, HTMLAttributes } from 'react'
import { tokens } from '../../styles/tokens'

export interface SectionlabelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  right?: ReactNode
}

export function Sectionlabel({ children, right }: SectionlabelProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        marginBottom: 8,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: tokens.textMuted,
          letterSpacing: '0.09em',
          textTransform: 'uppercase',
        }}
      >
        {children}
      </div>
      {right}
    </div>
  )
}
