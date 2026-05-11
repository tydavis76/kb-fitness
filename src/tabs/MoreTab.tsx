import { Routes, Route, useNavigate } from 'react-router-dom'
import { ScreenHeader } from '../components/primitives'
import { tokens } from '../styles/tokens'
import { Icon } from '../components/Icon'
import { SettingsScreen } from '../screens/SettingsScreen'
import { ExerciseLibraryScreen } from '../screens/ExerciseLibraryScreen'

function MoreHome() {
  const nav = useNavigate()
  const items = [
    { label: 'Exercise Library', icon: 'dumbbell', to: '/more/exercises' },
    { label: 'Settings',         icon: 'settings', to: '/more/settings' },
  ]
  return (
    <div style={{ flex: 1, overflow: 'auto' }}>
      <ScreenHeader title="More" />
      <div style={{ padding: '0 16px' }}>
        {items.map(item => (
          <button
            key={item.to}
            onClick={() => nav(item.to)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12, width: '100%',
              padding: '14px 0', background: 'transparent', border: 'none',
              borderBottom: `1px solid ${tokens.borderSoft}`, color: tokens.text,
              fontFamily: 'inherit', fontSize: 16, fontWeight: 600, cursor: 'pointer',
            }}
          >
            <Icon name={item.icon} size={20} color={tokens.primary}/>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function MoreTab() {
  return (
    <Routes>
      <Route index element={<MoreHome />} />
      <Route path="settings" element={<SettingsScreen />} />
      <Route path="exercises" element={<ExerciseLibraryScreen />} />
    </Routes>
  )
}
