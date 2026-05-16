import type { ReactNode, HTMLAttributes, MouseEvent } from 'react'
import { tokens } from '../../styles/tokens'

export interface BottomSheetProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  open: boolean
  onClose: () => void
  title?: string
  footer?: ReactNode
}

export function BottomSheet({
  children,
  open,
  onClose,
  title,
  footer,
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
        paddingBottom: 64,
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
          maxHeight: '82%',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={handleSheetClick}
        {...rest}
      >
        {/* Drag handle + header — does not scroll */}
        <div style={{ padding: '12px 16px 0', flexShrink: 0 }}>
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
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '0 16px' }}>
          {children}
        </div>

        {/* Sticky footer — does not scroll */}
        {footer && (
          <div style={{ padding: '12px 16px 24px', flexShrink: 0, borderTop: `1px solid ${tokens.borderSoft}` }}>
            {footer}
          </div>
        )}

        {/* Bottom padding when no footer */}
        {!footer && <div style={{ height: 24, flexShrink: 0 }} />}
      </div>
    </div>
  )
}
