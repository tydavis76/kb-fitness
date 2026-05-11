import React from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  Timer,
  Dumbbell,
  Flame,
  Flag,
  Check,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Play,
  Pause,
  Search,
  Settings,
  Info,
  Pencil,
  RotateCcw,
  SkipForward,
  Home,
  Calendar,
  ArrowRight,
  X,
  Grip,
  Wand2,
  Zap,
  Star,
  TrendingUp,
  History,
  MoreHorizontal,
} from 'lucide-react'

export interface IconProps {
  name: string
  size?: number
  color?: string
}

// Lucide icon mapping from design-system names
const lucideIconMap: Record<string, LucideIcon> = {
  timer: Timer,
  dumbbell: Dumbbell,
  flame: Flame,
  flag: Flag,
  check: Check,
  'check-circle': CheckCircle,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  plus: Plus,
  'plus-circle': Plus,
  minus: Minus,
  play: Play,
  pause: Pause,
  search: Search,
  settings: Settings,
  info: Info,
  pencil: Pencil,
  rotate: RotateCcw,
  skip: SkipForward,
  home: Home,
  calendar: Calendar,
  'arrow-right': ArrowRight,
  close: X,
  grip: Grip,
  wand: Wand2,
  flash: Zap,
  note: Star,
  swap: RotateCcw,
  trending: TrendingUp,
  history: History,
  more: MoreHorizontal,
}

// Custom SVG equipment icons
const CustomKettlebell: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Handle arc */}
    <path d="M12 4 A 4 4 0 0 1 16 8" />
    <path d="M12 4 A 4 4 0 0 0 8 8" />
    {/* Bell body - circle */}
    <circle cx="12" cy="16" r="6" />
    {/* Base trapezoid */}
    <path d="M 8 22 L 10 18 L 14 18 L 16 22 Z" />
  </svg>
)

const CustomTRX: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Left strap */}
    <line x1="8" y1="2" x2="8" y2="16" />
    {/* Right strap */}
    <line x1="16" y1="2" x2="16" y2="16" />
    {/* Connection circle */}
    <circle cx="12" cy="10" r="3" />
    {/* Crossing straps */}
    <line x1="8" y1="6" x2="16" y2="14" />
    <line x1="16" y1="6" x2="8" y2="14" />
  </svg>
)

const CustomRower: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Base line */}
    <line x1="3" y1="18" x2="21" y2="18" />
    {/* Seat */}
    <circle cx="12" cy="14" r="2" />
    {/* Handle pull */}
    <line x1="6" y1="12" x2="18" y2="12" />
    {/* Legs */}
    <line x1="10" y1="18" x2="8" y2="22" />
    <line x1="14" y1="18" x2="16" y2="22" />
  </svg>
)

const CustomBand: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Resistance band loop */}
    <ellipse cx="12" cy="12" rx="8" ry="10" />
  </svg>
)

const CustomBodyweight: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Head */}
    <circle cx="12" cy="4" r="2" />
    {/* Body */}
    <line x1="12" y1="6" x2="12" y2="12" />
    {/* Left arm */}
    <line x1="12" y1="8" x2="8" y2="6" />
    {/* Right arm */}
    <line x1="12" y1="8" x2="16" y2="6" />
    {/* Left leg */}
    <line x1="12" y1="12" x2="9" y2="18" />
    {/* Right leg */}
    <line x1="12" y1="12" x2="15" y2="18" />
  </svg>
)

const CustomPullBar: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Horizontal bar */}
    <line x1="6" y1="6" x2="18" y2="6" />
    {/* Left arm hanging */}
    <line x1="10" y1="6" x2="10" y2="14" />
    {/* Right arm hanging */}
    <line x1="14" y1="6" x2="14" y2="14" />
    {/* Body indicator */}
    <circle cx="10" cy="16" r="2" />
    <circle cx="14" cy="16" r="2" />
  </svg>
)

export const Icon: React.FC<IconProps> = ({ name, size = 20, color = 'currentColor' }) => {
  // Check for custom equipment icons first
  if (name === 'kettlebell') {
    return <CustomKettlebell size={size} color={color} />
  }
  if (name === 'trx') {
    return <CustomTRX size={size} color={color} />
  }
  if (name === 'rower') {
    return <CustomRower size={size} color={color} />
  }
  if (name === 'band') {
    return <CustomBand size={size} color={color} />
  }
  if (name === 'bodyweight') {
    return <CustomBodyweight size={size} color={color} />
  }
  if (name === 'pull-bar') {
    return <CustomPullBar size={size} color={color} />
  }

  // Look up lucide icon
  const IconComponent = lucideIconMap[name]
  if (IconComponent) {
    return <IconComponent size={size} color={color} />
  }

  // Fallback for unknown icons
  return <span />
}
