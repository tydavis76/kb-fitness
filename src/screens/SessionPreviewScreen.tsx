import { useLiveQuery } from 'dexie-react-hooks'
import { useNavigate, useLocation } from 'react-router-dom'
import { db } from '../db/db'
import { tokens } from '../styles/tokens'
import { ScreenHeader } from '../components/primitives/ScreenHeader'
import { Card } from '../components/primitives/Card'
import { Btn } from '../components/primitives/Btn'
import { BlockPill } from '../components/primitives/BlockPill'
import { useActiveWorkout } from '../context/ActiveWorkoutContext'

export function SessionPreviewScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const { startWorkout } = useActiveWorkout()

  // Get sessionId from route state or params
  const stateSessionId = (location.state as any)?.sessionId
  const sessionId = stateSessionId || (new URLSearchParams(location.search).get('sessionId') || '')

  // Query the session
  const session = useLiveQuery(() =>
    sessionId ? db.sessions.where('sessionId').equals(sessionId).first() : undefined
  )

  const template = session?.template
  if (!template) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 16 }}>
        <ScreenHeader title="Session Preview" leftIcon="chevron-left" leftAction={() => navigate(-1)} />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ color: tokens.textMuted }}>Loading session...</div>
        </div>
      </div>
    )
  }

  const blocks = template.blocks

  const handleBeginWorkout = async () => {
    await startWorkout(template)
    navigate('../active')
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader
        title={template.metadata?.title || 'Session'}
        subtitle={template.metadata?.environment}
        leftIcon="chevron-left"
        leftAction={() => navigate(-1)}
      />
      <div style={{ flex: 1, overflow: 'auto', padding: '0 16px 100px' }}>
        {blocks.map((block, blockIndex) => (
          <div key={blockIndex} style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                background: tokens.surface3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                fontWeight: 700,
                color: tokens.text,
              }}>
                {blockIndex + 1}
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, flex: 1, color: tokens.text }}>
                {block.name || `Block ${blockIndex + 1}`}
              </div>
              <BlockPill type={block.type} />
            </div>
            <Card padded={false}>
              {block.exercises.map((ex, j) => (
                <div
                  key={j}
                  style={{
                    padding: '12px 14px',
                    borderTop: j > 0 ? `1px solid ${tokens.borderSoft}` : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {ex.sub_label && (
                        <span style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: tokens.accent,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                        }}>
                          {ex.sub_label}
                        </span>
                      )}
                      <span style={{ fontSize: 14, fontWeight: 600, color: tokens.text }}>
                        {ex.name}
                      </span>
                    </div>
                    <div style={{
                      fontSize: 12,
                      color: tokens.textMuted,
                      marginTop: 2,
                      display: 'flex',
                      gap: 8,
                      flexWrap: 'wrap',
                    }}>
                      <span>
                        {(block.rounds && block.rounds > 1) ? block.rounds : 1}×{ex.prescription.target}
                        {ex.prescription.type === 'time' ? 's' : ''}
                      </span>
                      <span>·</span>
                      <span>{ex.prescription.load.label}</span>
                      {ex.protocol_constraints?.tempo && (
                        <>
                          <span>·</span>
                          <span style={{ fontFamily: 'monospace', color: tokens.accent }}>
                            {ex.protocol_constraints.tempo}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {(block.rest_sec || (block.rounds && block.rounds > 1) || block.duration_sec) && (
                <div style={{
                  padding: '10px 14px',
                  borderTop: `1px solid ${tokens.borderSoft}`,
                  display: 'flex',
                  gap: 14,
                  fontSize: 12,
                  color: tokens.textMuted,
                }}>
                  {block.rounds && block.rounds > 1 && (
                    <span>
                      Rounds: <span style={{ color: tokens.text, fontWeight: 600 }}>
                        {block.rounds}
                      </span>
                    </span>
                  )}
                  {block.rest_sec && (
                    <span>
                      Rest: <span style={{ color: tokens.text, fontWeight: 600 }}>
                        {block.rest_sec}s
                      </span>
                    </span>
                  )}
                  {block.duration_sec && (
                    <span>
                      Duration: <span style={{ color: tokens.accent, fontWeight: 700 }}>
                        {Math.floor(block.duration_sec / 60)} min
                      </span>
                    </span>
                  )}
                </div>
              )}
            </Card>
          </div>
        ))}
      </div>
      <div style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        padding: 16,
        background: `linear-gradient(180deg, transparent, ${tokens.bg} 30%)`,
      }}>
        <Btn
          variant="primary"
          size="lg"
          full
          icon="play"
          onClick={handleBeginWorkout}
        >
          Begin Workout
        </Btn>
      </div>
    </div>
  )
}
