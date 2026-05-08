import React, { useEffect } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { BottomNav } from './components/BottomNav'
import { seedIfNeeded } from './db/seed'

const TodayTab    = React.lazy(() => import('./tabs/TodayTab'))
const ProgramsTab = React.lazy(() => import('./tabs/ProgramsTab'))
const ProgressTab = React.lazy(() => import('./tabs/ProgressTab'))
const MoreTab     = React.lazy(() => import('./tabs/MoreTab'))

export function App() {
  useEffect(() => { seedIfNeeded() }, [])
  return (
    <HashRouter>
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        paddingBottom: 64, overflow: 'hidden', height: '100%',
      }}>
        <React.Suspense fallback={null}>
          <Routes>
            <Route path="/"           element={<TodayTab />} />
            <Route path="/programs/*" element={<ProgramsTab />} />
            <Route path="/progress/*" element={<ProgressTab />} />
            <Route path="/more/*"     element={<MoreTab />} />
          </Routes>
        </React.Suspense>
      </div>
      <BottomNav />
    </HashRouter>
  )
}
