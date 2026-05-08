import { Routes, Route } from 'react-router-dom'
import { TodayScreen } from '../screens/TodayScreen'
import { SessionPreviewScreen } from '../screens/SessionPreviewScreen'
import { ActiveWorkoutRouter } from '../screens/active/ActiveWorkoutRouter'
import { RecapScreen } from '../screens/RecapScreen'

export default function TodayTab() {
  return (
    <Routes>
      <Route index element={<TodayScreen />} />
      <Route path="preview" element={<SessionPreviewScreen />} />
      <Route path="active/*" element={<ActiveWorkoutRouter />} />
      <Route path="recap" element={<RecapScreen />} />
    </Routes>
  )
}
