import { useState } from 'react'
import { tokens } from '../styles/tokens'
import { Btn } from './primitives/Btn'

export type ProgramConfirmAction = 'restart' | 'skip' | 'pause' | 'switch' | 'end'

const KB_FONT = 'Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif'

interface ConfirmConfig {
  title: string
  accent: string
  body: string
  cta: string
  destructive: boolean
  picker?: boolean
}

const CONFIG: Record<ProgramConfirmAction, ConfirmConfig> = {
  restart: {
    title: 'Restart Program?',
    accent: tokens.accent,
    body: "You'll go back to phase 1, week 1. Your history stays — completed sessions remain in your records, but progress resets.",
    cta: 'Restart from week 1',
    destructive: false,
  },
  skip: {
    title: 'Skip to week…',
    accent: tokens.accent,
    body: "Pick a week to jump to. Sessions you skip won't be logged.",
    cta: 'Confirm skip',
    destructive: false,
    picker: true,
  },
  pause: {
    title: 'Pause program?',
    accent: tokens.rest,
    body: "Today's screen will show no active session. You can resume from this exact day later.",
    cta: 'Pause program',
    destructive: false,
  },
  switch: {
    title: 'End and switch program?',
    accent: tokens.danger,
    body: "This run gets archived. You'll pick a new program next.",
    cta: 'End and pick new',
    destructive: true,
  },
  end: {
    title: 'End Program?',
    accent: tokens.danger,
    body: "We'll archive this program run and return you to the library.",
    cta: 'End program',
    destructive: true,
  },
}

export interface ProgramConfirmSheetProps {
  action: ProgramConfirmAction | null
  onClose: () => void
  onConfirm?: (action: ProgramConfirmAction, skipWeek?: number) => void
  totalWeeks?: number
}

export function ProgramConfirmSheet({ action, onClose, onConfirm, totalWeeks = 8 }: ProgramConfirmSheetProps) {
  const [selectedWeek, setSelectedWeek] = useState<number>(1)

  if (!action) return null
  const c = CONFIG[action]
  if (!c) return null

  function handleConfirm() {
    if (onConfirm && action) {
      onConfirm(action, action === 'skip' ? selectedWeek : undefined)
    }
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'flex-end',
        zIndex: 30,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          background: tokens.surface,
          borderRadius: '20px 20px 0 0',
          borderTop: `1px solid ${tokens.border}`,
          padding: '20px 18px 24px',
        }}
      >
        <div style={{ width: 36, height: 4, borderRadius: 2, background: tokens.border, margin: '0 auto 18px' }} />
        <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-0.01em', marginBottom: 10 }}>{c.title}</div>
        <div style={{ fontSize: 13, color: tokens.textMuted, lineHeight: 1.5, marginBottom: 16 }}>{c.body}</div>

        {c.picker && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 16 }}>
            {Array.from({ length: totalWeeks }, (_, i) => i + 1).map((w) => (
              <button
                key={w}
                onClick={() => setSelectedWeek(w)}
                style={{
                  height: 40,
                  borderRadius: 9,
                  background: w === selectedWeek ? tokens.accent : tokens.surface2,
                  color: w === selectedWeek ? tokens.bg : tokens.text,
                  border: `1px solid ${w === selectedWeek ? tokens.accent : tokens.border}`,
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                  fontFamily: KB_FONT,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                W{w}
              </button>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: 8 }}>
          <Btn variant="secondary" size="lg" full onClick={onClose}>Cancel</Btn>
          <Btn variant="primary" size="lg" full accent={c.accent} onClick={handleConfirm}>
            {c.cta}
          </Btn>
        </div>
      </div>
    </div>
  )
}
