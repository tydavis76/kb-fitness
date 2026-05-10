import { Routes, Route } from 'react-router-dom'
import { ProgramLibraryScreen } from '../screens/ProgramLibraryScreen'
import { ProgramDetailScreen } from '../screens/ProgramDetailScreen'
import { WeekDetailScreen } from '../screens/WeekDetailScreen'

export default function ProgramsTab() {
  return (
    <Routes>
      <Route index element={<ProgramLibraryScreen />} />
      <Route path=":programId" element={<ProgramDetailScreen />} />
      <Route path=":programId/week/:weekNum" element={<WeekDetailScreen />} />
    </Routes>
  )
}
