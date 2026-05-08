import { NavLink } from 'react-router-dom'
import { Icon } from './Icon'
import { tokens } from '../styles/tokens'

interface NavTab {
  label: string
  path: string
  icon: string
}

const tabs: NavTab[] = [
  { label: 'Today', path: '/', icon: 'calendar' },
  { label: 'Programs', path: '/programs', icon: 'flag' },
  { label: 'Progress', path: '/progress', icon: 'trending' },
  { label: 'More', path: '/more', icon: 'more' },
]

export function BottomNav() {
  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        maxWidth: 430,
        margin: '0 auto',
        height: 64,
        background: tokens.surface,
        borderTop: `1px solid ${tokens.border}`,
        zIndex: 50,
        display: 'flex',
        width: '100%',
      }}
    >
      {tabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          end={tab.path === '/'}
          style={({ isActive }) => ({
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
            textDecoration: 'none',
            cursor: 'pointer',
            color: isActive ? tokens.primary : tokens.textMuted,
          })}
        >
          <Icon name={tab.icon} size={20} color="currentColor" />
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.06em',
              color: 'currentColor',
            }}
          >
            {tab.label}
          </span>
        </NavLink>
      ))}
    </nav>
  )
}
