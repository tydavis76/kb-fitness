import { CSSProperties, ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  elevated?: boolean
  onClick?: () => void
  style?: CSSProperties
  className?: string
}

export function Card({ children, elevated, onClick, style, className }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={className}
      style={{
        background: elevated ? 'var(--surface-2)' : 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-md)',
        padding: '14px 16px',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export function CardElevated(props: Omit<CardProps, 'elevated'>) {
  return <Card {...props} elevated />
}
