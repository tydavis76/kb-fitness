import { useState } from 'react'
import { ScreenHeader, Card, Toggle } from '../components'

const WEIGHT_UNIT_KEY = 'kb_weight_unit'

export function getWeightUnit(): 'kg' | 'lb' {
  return (localStorage.getItem(WEIGHT_UNIT_KEY) as 'kg' | 'lb') ?? 'kg'
}

export default function Settings() {
  const [useLbs, setUseLbs] = useState(() => getWeightUnit() === 'lb')

  function toggleUnit(val: boolean) {
    setUseLbs(val)
    localStorage.setItem(WEIGHT_UNIT_KEY, val ? 'lb' : 'kg')
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

        <div style={{ padding: '8px 4px' }}>
          <div className="t-label" style={{ color: 'var(--text-muted)' }}>
            KB Fitness — 8 Weeks to a Healthier You
          </div>
        </div>
      </div>
    </div>
  )
}
