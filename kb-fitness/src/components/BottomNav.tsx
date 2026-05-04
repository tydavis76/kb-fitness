import { Calendar, LayoutList, BarChart2, Dumbbell, type LucideIcon } from 'lucide-react'

export type TabId = 'today' | 'program' | 'history' | 'exercises'

interface BottomNavProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

const tabs: { id: TabId; label: string; Icon: LucideIcon }[] = [
  { id: 'today',     label: 'Today',     Icon: Calendar },
  { id: 'program',   label: 'Program',   Icon: LayoutList },
  { id: 'history',   label: 'History',   Icon: BarChart2 },
  { id: 'exercises', label: 'Exercises', Icon: Dumbbell },
]

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav style={{
      height: 'calc(var(--nav-height) + var(--safe-bottom))',
      background: 'var(--surface)',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'stretch',
      flexShrink: 0,
      paddingBottom: 'var(--safe-bottom)',
    }}>
      {tabs.map(({ id, label, Icon }) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          aria-label={label}
          aria-current={activeTab === id ? ('page' as const) : undefined}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: activeTab === id ? 'var(--primary)' : 'var(--text-muted)',
            fontFamily: 'var(--font)',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <Icon size={22} strokeWidth={2} />
          <span style={{ fontSize: 10, fontWeight: 500 }}>{label}</span>
        </button>
      ))}
    </nav>
  )
}
