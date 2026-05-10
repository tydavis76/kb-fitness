import { Routes, Route } from 'react-router-dom'
import { HistoryScreen } from '../screens/HistoryScreen'
import { SessionDetailScreen } from '../screens/SessionDetailScreen'
import { AnalyticsScreen } from '../screens/AnalyticsScreen'

export default function ProgressTab() {
  return (
    <Routes>
      <Route index element={<HistoryScreen />} />
      <Route path="session/:logId" element={<SessionDetailScreen />} />
      <Route path="exercise/:exerciseId" element={<AnalyticsScreen />} />
    </Routes>
  )
}
