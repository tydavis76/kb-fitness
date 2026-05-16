import React, { useEffect, Component } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { BottomNav } from './components/BottomNav'
import { seedIfNeeded } from './db/seed'
import { ActiveWorkoutProvider } from './context/ActiveWorkoutContext'
import { tokens } from './styles/tokens'

class ErrorBoundary extends Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  state = { error: null }
  static getDerivedStateFromError(error: Error) { return { error } }
  render() {
    const { error } = this.state
    if (error) {
      return (
        <div style={{ padding: 24, color: tokens.text, fontFamily: 'monospace', fontSize: 13 }}>
          <div style={{ color: 'red', fontWeight: 700, marginBottom: 8 }}>Something went wrong</div>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', color: tokens.textMuted }}>
            {(error as Error).message}
            {'\n\n'}
            {(error as Error).stack}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}

const TodayTab    = React.lazy(() => import('./tabs/TodayTab'))
const ProgramsTab = React.lazy(() => import('./tabs/ProgramsTab'))
const ProgressTab = React.lazy(() => import('./tabs/ProgressTab'))
const MoreTab     = React.lazy(() => import('./tabs/MoreTab'))

export function App() {
  useEffect(() => { seedIfNeeded() }, [])
  return (
    <ErrorBoundary>
      <ActiveWorkoutProvider>
        <HashRouter>
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            paddingBottom: 64, overflow: 'hidden', height: '100%',
          }}>
            <React.Suspense fallback={null}>
              <Routes>
                <Route path="/*"          element={<TodayTab />} />
                <Route path="/programs/*" element={<ProgramsTab />} />
                <Route path="/progress/*" element={<ProgressTab />} />
                <Route path="/more/*"     element={<MoreTab />} />
              </Routes>
            </React.Suspense>
          </div>
          <BottomNav />
        </HashRouter>
      </ActiveWorkoutProvider>
    </ErrorBoundary>
  )
}
