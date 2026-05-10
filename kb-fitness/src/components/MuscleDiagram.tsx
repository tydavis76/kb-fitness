import { tokens } from '../styles/tokens'

interface MuscleDiagramProps {
  primary?: string[]
  size?: number
}

export function MuscleDiagram({ primary = [], size = 88 }: MuscleDiagramProps) {
  const has = (m: string) => primary.some(p => p.toLowerCase().includes(m))
  const on = tokens.accent
  const off = tokens.surface3
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 100 140" style={{ flexShrink: 0 }}>
      {/* Head */}
      <circle cx="50" cy="14" r="9" fill={off} stroke={tokens.border}/>
      {/* Torso */}
      <path d="M30 26 Q30 24 32 24 L68 24 Q70 24 70 26 L72 60 Q72 64 68 64 L32 64 Q28 64 28 60 Z"
        fill={off} stroke={tokens.border}/>
      {/* Chest */}
      <path d="M34 28 Q50 30 66 28 L66 42 Q50 46 34 42 Z"
        fill={has('chest') ? on : 'transparent'} opacity="0.85"/>
      {/* Abs */}
      <rect x="44" y="42" width="12" height="22" rx="2"
        fill={has('core') || has('abs') ? on : 'transparent'} opacity="0.85"/>
      {/* Shoulders */}
      <circle cx="28" cy="30" r="6" fill={has('shoulder') || has('delt') ? on : off} stroke={tokens.border}/>
      <circle cx="72" cy="30" r="6" fill={has('shoulder') || has('delt') ? on : off} stroke={tokens.border}/>
      {/* Arms */}
      <path d="M22 34 Q18 50 20 64 L26 64 Q26 48 28 36 Z"
        fill={has('biceps') || has('arm') ? on : off} stroke={tokens.border}/>
      <path d="M78 34 Q82 50 80 64 L74 64 Q74 48 72 36 Z"
        fill={has('biceps') || has('arm') ? on : off} stroke={tokens.border}/>
      {/* Forearms */}
      <rect x="18" y="64" width="8" height="16" rx="3"
        fill={has('forearm') || has('grip') ? on : off} stroke={tokens.border}/>
      <rect x="74" y="64" width="8" height="16" rx="3"
        fill={has('forearm') || has('grip') ? on : off} stroke={tokens.border}/>
      {/* Hips/glutes */}
      <path d="M32 64 L68 64 L66 78 L34 78 Z"
        fill={has('glute') || has('hip') ? on : off} stroke={tokens.border}/>
      {/* Quads */}
      <rect x="34" y="78" width="13" height="32" rx="4"
        fill={has('quad') || has('leg') ? on : off} stroke={tokens.border}/>
      <rect x="53" y="78" width="13" height="32" rx="4"
        fill={has('quad') || has('leg') ? on : off} stroke={tokens.border}/>
      {/* Calves / hamstrings */}
      <rect x="35" y="112" width="11" height="22" rx="3"
        fill={has('hamstring') || has('calf') || has('posterior') ? on : off} stroke={tokens.border}/>
      <rect x="54" y="112" width="11" height="22" rx="3"
        fill={has('hamstring') || has('calf') || has('posterior') ? on : off} stroke={tokens.border}/>
    </svg>
  )
}
