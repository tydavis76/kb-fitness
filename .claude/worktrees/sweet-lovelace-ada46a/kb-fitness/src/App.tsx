import { HashRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { WorkoutProvider } from './store/WorkoutContext'
import { BottomNav } from './components'
import type { TabId } from './components/BottomNav'
import Today from './screens/Today'
import Program from './screens/Program'
import ActiveWorkout from './screens/ActiveWorkout'
import History from './screens/History'
import Exercises from './screens/Exercises'
import ExerciseDetail from './screens/ExerciseDetail'
import Settings from './screens/Settings'

const TAB_ROUTES: Record<TabId, string> = {
  today: '/',
  program: '/program',
  history: '/history',
  exercises: '/exercises',
}

function Shell() {
  const navigate = useNavigate()
  const location = useLocation()
  const isWorkout = location.pathname === '/workout' || location.pathname === '/settings'
  const activeTab = (Object.entries(TAB_ROUTES).find(([, path]) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)
  )?.[0] ?? 'today') as TabId

  return (
    <>
      <Routes>
        <Route path="/" element={<Today />} />
        <Route path="/program" element={<Program />} />
        <Route path="/workout" element={<ActiveWorkout />} />
        <Route path="/history" element={<History />} />
        <Route path="/exercises" element={<Exercises />} />
        <Route path="/exercises/:id" element={<ExerciseDetail />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      {!isWorkout && (
        <BottomNav
          activeTab={activeTab}
          onTabChange={tab => navigate(TAB_ROUTES[tab])}
        />
      )}
    </>
  )
}

export default function App() {
  return (
    <HashRouter>
      <WorkoutProvider>
        <Shell />
      </WorkoutProvider>
    </HashRouter>
  )
}
