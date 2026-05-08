import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ScreenHeader, Card, Toggle, BottomSheet } from '../components'
import { DangerBtn, SecondaryBtn } from '../components/Buttons'
import { db } from '../db/schema'

const WEIGHT_UNIT_KEY = 'kb_weight_unit'

export function getWeightUnit(): 'kg' | 'lb' {
  return (localStorage.getItem(WEIGHT_UNIT_KEY) as 'kg' | 'lb') ?? 'kg'
}

export default function Settings() {
  const navigate = useNavigate()
  const [useLbs, setUseLbs] = useState(() => getWeightUnit() === 'lb')
  const [confirming, setConfirming] = useState(false)

  function toggleUnit(val: boolean) {
    setUseLbs(val)
    localStorage.setItem(WEIGHT_UNIT_KEY, val ? 'lb' : 'kg')
  }

  async function resetAllData() {
    await Promise.all([db.setLogs.clear(), db.sessionLogs.clear()])
    localStorage.removeItem(WEIGHT_UNIT_KEY)
    setUseLbs(false)
    setConfirming(false)
    navigate('/')
  }

  return (
    <div className="screen-content" style={{ paddingBottom: 80 }}>
      <ScreenHeader title="Settings" />

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="t-body">Weight unit</div>
              <div className="t-label" style={{ color: 'var(--text-muted)' }}>
                Display weights in {useLbs ? 'pounds' : 'kilograms'}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="t-label" style={{ color: useLbs ? 'var(--text-muted)' : 'var(--primary)' }}>kg</span>
              <Toggle value={useLbs} onChange={toggleUnit} />
              <span className="t-label" style={{ color: useLbs ? 'var(--primary)' : 'var(--text-muted)' }}>lb</span>
            </div>
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="t-body">Reset program</div>
              <div className="t-label" style={{ color: 'var(--text-muted)' }}>
                Erase all workouts and history
              </div>
            </div>
            <DangerBtn onClick={() => setConfirming(true)}>Reset</DangerBtn>
          </div>
        </Card>

        <div style={{ padding: '8px 4px' }}>
          <div className="t-label" style={{ color: 'var(--text-muted)' }}>
            KB Fitness — 8 Weeks to a Healthier You
          </div>
        </div>
      </div>

      {confirming && (
        <BottomSheet title="Reset all data?" onClose={() => setConfirming(false)}>
          <div className="t-label" style={{ color: 'var(--text-muted)', marginBottom: 24 }}>
            This will permanently delete all workout logs and history. This cannot be undone.
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <SecondaryBtn onClick={() => setConfirming(false)} style={{ flex: 1 }}>Cancel</SecondaryBtn>
            <DangerBtn onClick={resetAllData} style={{ flex: 1 }}>Reset</DangerBtn>
          </div>
        </BottomSheet>
      )}
    </div>
  )
}
