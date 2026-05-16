import { db } from '../db/db'
import { tokens } from '../styles/tokens'
import { ScreenHeader } from '../components/primitives/ScreenHeader'
import { Card } from '../components/primitives/Card'
import { Icon } from '../components/Icon'
import { useLeadIn } from '../hooks/useLeadIn'
import { useSettings } from '../hooks/useSettings'

const LEAD_OPTS: (0 | 3 | 5 | 10)[] = [0, 3, 5, 10]
const KB_WEIGHTS = [16, 20, 24, 28, 32]

function iconBox(icon: string) {
  return (
    <div style={{
      width: 32, height: 32, borderRadius: 8,
      background: tokens.surface2, color: tokens.textMuted,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <Icon name={icon} size={16} />
    </div>
  )
}

function Row({ icon, label, right }: { icon: string; label: string; right: React.ReactNode }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', padding: '14px 14px', gap: 12,
      borderTop: `1px solid ${tokens.borderSoft}`,
    }}>
      {iconBox(icon)}
      <div style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>{label}</div>
      {right}
    </div>
  )
}

export function SettingsScreen() {
  const settings = useSettings()
  const [leadIn, setLeadIn] = useLeadIn()
  const unit = settings?.unit ?? 'lb'
  const ownedKettlebells = settings?.ownedKettlebells ?? [16, 20, 24, 32]

  async function toggleKettlebell(kg: number) {
    const current = settings?.ownedKettlebells ?? [16, 20, 24, 32]
    const next = current.includes(kg) ? current.filter(k => k !== kg) : [...current, kg].sort((a, b) => a - b)
    await db.settings.update(1, { ownedKettlebells: next })
  }

  async function setUnit(u: 'lb' | 'kg') {
    await db.settings.update(1, { unit: u })
  }

  const staticRows = [
    { label: 'Sound',         icon: 'flame',   val: 'On' },
    { label: 'Haptics',       icon: 'flash',   val: 'On' },
    { label: 'Theme',         icon: 'home',    val: 'Dark' },
    { label: 'Rest defaults', icon: 'timer',   val: '60 / 90 / 120 s' },
  ]

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
      <ScreenHeader title="Settings" />
      <div style={{ padding: '0 16px 16px' }}>
        <Card padded={false} style={{ marginBottom: 12 }}>
          {/* Units — segmented control */}
          <div style={{ display: 'flex', alignItems: 'center', padding: '14px 14px', gap: 12 }}>
            {iconBox('dumbbell')}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Units</div>
              <div style={{ fontSize: 12, color: tokens.textMuted, marginTop: 1 }}>
                Display loads in {unit === 'lb' ? 'pounds' : 'kilograms'}
              </div>
            </div>
            <div style={{
              display: 'flex', gap: 3, padding: 3,
              background: tokens.surface2, borderRadius: 8, border: `1px solid ${tokens.border}`,
            }}>
              {(['lb', 'kg'] as const).map(u => (
                <button key={u} onClick={() => setUnit(u)} style={{
                  height: 28, padding: '0 12px', borderRadius: 6,
                  background: unit === u ? tokens.primary : 'transparent',
                  color: unit === u ? tokens.bg : tokens.textMuted,
                  border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                }}>{u}</button>
              ))}
            </div>
          </div>

          {staticRows.map(r => (
            <Row key={r.label} icon={r.icon} label={r.label} right={
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 13, color: tokens.textMuted }}>{r.val}</span>
                <Icon name="chevron-right" size={16} color={tokens.textMuted} />
              </div>
            } />
          ))}

          {/* Lead-in row */}
          <div style={{ padding: '14px 14px', borderTop: `1px solid ${tokens.borderSoft}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              {iconBox('timer')}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>Lead-in countdown</div>
                <div style={{ fontSize: 11, color: tokens.textMuted, marginTop: 1 }}>
                  Get-ready beats before timed sets
                </div>
              </div>
              <div style={{ fontSize: 13, color: tokens.textMuted, fontVariantNumeric: 'tabular-nums' }}>
                {leadIn === 0 ? 'Off' : `${leadIn}s`}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {LEAD_OPTS.map(n => (
                <button key={n} onClick={() => setLeadIn(n)} style={{
                  flex: 1, height: 36, borderRadius: 9,
                  background: leadIn === n ? tokens.text : tokens.surface2,
                  color: leadIn === n ? tokens.bg : tokens.textMuted,
                  border: `1px solid ${leadIn === n ? tokens.text : tokens.border}`,
                  fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
                  fontVariantNumeric: 'tabular-nums',
                }}>{n === 0 ? 'Off' : `${n}s`}</button>
              ))}
            </div>
          </div>
        </Card>

        <Card padded={false} style={{ marginBottom: 12 }}>
          <div style={{ padding: '14px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              {iconBox('kettlebell')}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>My kettlebells</div>
                <div style={{ fontSize: 11, color: tokens.textMuted, marginTop: 1 }}>
                  Weights you own — shown as options during workouts
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {KB_WEIGHTS.map(kg => {
                const owned = ownedKettlebells.includes(kg)
                return (
                  <button
                    key={kg}
                    onClick={() => toggleKettlebell(kg)}
                    style={{
                      flex: 1, height: 44, borderRadius: 10,
                      background: owned ? tokens.primary : tokens.surface2,
                      color: owned ? tokens.bg : tokens.textMuted,
                      border: `1px solid ${owned ? tokens.primary : tokens.border}`,
                      fontWeight: 700, fontSize: 13, cursor: 'pointer',
                      fontFamily: 'inherit', fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {kg}
                  </button>
                )
              })}
            </div>
            <div style={{ fontSize: 11, color: tokens.textDim, marginTop: 8 }}>kg</div>
          </div>
        </Card>

        <div style={{ fontSize: 11, color: tokens.textDim, padding: '8px 4px', lineHeight: 1.5 }}>
          Unit changes apply immediately across the app — Today, Active, History, Analytics.
        </div>
      </div>
    </div>
  )
}
