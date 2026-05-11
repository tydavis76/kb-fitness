export const tokens = {
  // Backgrounds
  bg:          '#0F1115',
  surface:     '#171A21',
  surface2:    '#1E222B',
  surface3:    '#252A35',
  // Borders
  border:      '#2A313D',
  borderSoft:  '#222833',
  // Text
  text:        '#F3F5F7',
  textMuted:   '#A6B0BF',
  textDim:     '#6E7785',
  // Brand
  primary:     '#7BD88F',
  primaryActive: '#63C978',
  accent:      '#F59E0B',
  // Semantic
  work:        '#7BD88F',
  rest:        '#60A5FA',
  danger:      '#F87171',
  // Alpha backgrounds
  workBg:      'rgba(123,216,143,0.10)',
  restBg:      'rgba(96,165,250,0.10)',
  accentBg:    'rgba(245,158,11,0.10)',
  dangerBg:    'rgba(248,113,113,0.10)',
} as const

export type TokenKey = keyof typeof tokens
