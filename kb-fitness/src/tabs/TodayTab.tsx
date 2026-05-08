import { Routes, Route } from 'react-router-dom'
import { TodayScreen } from '../screens/TodayScreen'
import { SessionPreviewScreen } from '../screens/SessionPreviewScreen'

export default function TodayTab() {
  return (
    <Routes>
      <Route index element={<TodayScreen />} />
      <Route path="preview" element={<SessionPreviewScreen />} />
      <Route path="active/*" element={<div style={{ padding: 16, color: '#fff' }}>Active workout (Task 11)</div>} />
      <Route path="recap" element={<div style={{ padding: 16, color: '#fff' }}>Recap (Task 12)</div>} />
    </Routes>
  )
}
