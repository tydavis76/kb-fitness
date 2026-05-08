import { CSSProperties, HTMLAttributes } from 'react'
import { tokens } from '../../styles/tokens'

export type BlockType = 'straight' | 'superset' | 'circuit' | 'amrap' | 'ladder' | 'interval' | 'carry' | 'tempo'

export interface BlockPillProps extends HTMLAttributes<HTMLDivElement> {
  type: BlockType
  style?: CSSProperties
}

const blockLabels: Record<BlockType, string> = {
  straight: 'SETS',
  superset: 'SUPERSET',
  circuit: 'CIRCUIT',
  amrap: 'AMRAP',
  ladder: 'LADDER',
  interval: 'INTERVAL',
  carry: 'CARRY',
  tempo: 'TEMPO',
}

// Color map for each block type
const blockColors: Record<BlockType, { bg: string; color: string; border: string }> = {
  straight: { bg: tokens.surface2, color: tokens.textMuted, border: tokens.border },
  superset: { bg: tokens.accentBg, color: tokens.accent, border: tokens.accent },
  circuit: { bg: tokens.workBg, color: tokens.work, border: tokens.work },
  amrap: { bg: tokens.dangerBg, color: tokens.danger, border: tokens.danger },
  ladder: { bg: tokens.restBg, color: tokens.rest, border: tokens.rest },
  interval: { bg: tokens.accentBg, color: tokens.accent, border: tokens.accent },
  carry: { bg: tokens.workBg, color: tokens.work, border: tokens.work },
  tempo: { bg: tokens.restBg, color: tokens.rest, border: tokens.rest },
}

export function BlockPill({ type, style, ...rest }: BlockPillProps) {
  const label = blockLabels[type]
  const colors = blockColors[type]

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 26,
        padding: '5px 12px',
        borderRadius: 999,
        background: colors.bg,
        color: colors.color,
        border: `1px solid ${colors.border}`,
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: '0.07em',
        textTransform: 'uppercase',
        ...style,
      }}
      {...rest}
    >
      {label}
    </div>
  )
}
