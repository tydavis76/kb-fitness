import { ReactNode, HTMLAttributes, MouseEvent } from 'react'
import { tokens } from '../../styles/tokens'

export interface BottomSheetProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  open: boolean
  onClose: () => void
  title?: string
}

export function BottomSheet({
  children,
  open,
  onClose,
  title,
  ...rest
}: BottomSheetProps) {
  if (!open) return null

  const handleBackdropClick = () => {
    onClose()
  }

  const handleSheetClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
      onClick={handleBackdropClick}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
        }}
      />
      <div
        style={{
          position: 'relative',
          background: tokens.surface,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderTop: `1px solid ${tokens.border}`,
          padding: '12px 16px 24px',
          maxHeight: '82%',
          overflow: 'auto',
        }}
        onClick={handleSheetClick}
        {...rest}
      >
        <div
          style={{
            width: 40,
            height: 4,
            background: tokens.border,
            borderRadius: 2,
            margin: '0 auto 12px',
          }}
        />
        {title && (
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: tokens.text,
              marginBottom: 12,
            }}
          >
            {title}
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
