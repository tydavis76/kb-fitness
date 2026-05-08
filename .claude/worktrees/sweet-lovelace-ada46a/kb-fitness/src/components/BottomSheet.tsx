import { ReactNode } from 'react'

interface BottomSheetProps {
  onClose: () => void
  children: ReactNode
  title?: string
}

export function BottomSheet({ onClose, children, title }: BottomSheetProps) {
  return (
    <div
      onClick={onClose}
      onKeyDown={(e) => { if (e.key === 'Escape') onClose() }}
      style={{
        position: 'fixed', inset: 0,
        background: 'var(--scrim)',
        display: 'flex', alignItems: 'flex-end',
        zIndex: 100,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          background: 'var(--surface)',
          borderRadius: '20px 20px 0 0',
          padding: '20px var(--page-x)',
          paddingBottom: 'calc(20px + var(--safe-bottom))',
          border: '1px solid var(--border)',
          borderBottom: 'none',
          maxHeight: '85vh',
          overflowY: 'auto',
        }}
      >
        {title && <h2 style={{ marginBottom: 16, fontSize: 18 }}>{title}</h2>}
        {children}
      </div>
    </div>
  )
}
