import { tokens } from '../styles/tokens'
import { Btn } from './primitives/Btn'
import { useNavigate } from 'react-router-dom'

export function ProgramEmptyToday() {
  const navigate = useNavigate()

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      textAlign: 'center',
    }}>
      <div style={{
        fontSize: 28,
        fontWeight: 700,
        color: tokens.text,
        marginBottom: 8,
      }}>
        No active program
      </div>
      <div style={{
        fontSize: 14,
        color: tokens.textMuted,
        marginBottom: 24,
        maxWidth: 280,
      }}>
        Start a workout program to see your daily sessions.
      </div>
      <Btn
        variant="primary"
        size="lg"
        onClick={() => navigate('/programs')}
      >
        Browse Programs
      </Btn>
    </div>
  )
}
