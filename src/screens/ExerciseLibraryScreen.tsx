import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { tokens } from '../styles/tokens'
import { ScreenHeader } from '../components/primitives/ScreenHeader'
import { Card } from '../components/primitives/Card'
import { Sectionlabel } from '../components/primitives/Sectionlabel'
import { Icon } from '../components/Icon'
import { ExerciseDetailSheet } from '../components/ExerciseDetailSheet'
import { EXERCISES, getExerciseDetail, type Exercise } from '../data/exercises'

const FILTERS = ['all', 'kettlebell', 'dumbbell', 'trx', 'pull-up bar', 'bodyweight', 'band']
const PATTERNS = ['hinge', 'squat', 'push', 'pull', 'carry', 'core', 'cardio', 'power']

export function ExerciseLibraryScreen() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [detail, setDetail] = useState<Exercise | null>(null)

  const filtered = EXERCISES
    .filter((e, i, arr) => arr.findIndex(x => x.name === e.name) === i)
    .filter(e => {
      if (filter !== 'all' && e.equipment !== filter) return false
      if (query) {
        const q = query.toLowerCase()
        return e.name.toLowerCase().includes(q) || e.pattern.includes(q) || e.equipment.includes(q)
      }
      return true
    })

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto', position: 'relative' }}>
      <ScreenHeader
        title="Exercises"
        subtitle={`${EXERCISES.length} in your library`}
        leftIcon="chevron-left"
        leftAction={() => navigate(-1)}
      />

      <div style={{ padding: '0 16px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: 12 }}>
          <Icon name="search" size={16} color={tokens.textMuted} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by name, pattern, equipment…"
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: tokens.text, fontSize: 14, fontFamily: 'inherit' }}
          />
        </div>
      </div>

      <div style={{ padding: '0 16px 12px', display: 'flex', gap: 6, overflow: 'auto', flexShrink: 0 }}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            height: 32, padding: '0 12px', borderRadius: 999,
            background: filter === f ? tokens.text : tokens.surface2,
            color: filter === f ? tokens.bg : tokens.textMuted,
            border: `1px solid ${filter === f ? tokens.text : tokens.border}`,
            cursor: 'pointer', fontWeight: 700, fontSize: 11, letterSpacing: '0.06em',
            textTransform: 'uppercase', fontFamily: 'inherit', flexShrink: 0, whiteSpace: 'nowrap',
          }}>{f}</button>
        ))}
      </div>

      <div style={{ padding: '0 16px 16px' }}>
        {PATTERNS.map(pat => {
          const items = filtered.filter(e => e.pattern === pat)
          if (!items.length) return null
          return (
            <div key={pat} style={{ marginBottom: 14 }}>
              <Sectionlabel>{pat}</Sectionlabel>
              <Card padded={false}>
                {items.map((e, i) => {
                  const det = getExerciseDetail(e)
                  return (
                    <button key={e.id} onClick={() => setDetail(e)} style={{
                      display: 'flex', alignItems: 'center', padding: '10px 12px', gap: 12, width: '100%',
                      borderTop: i > 0 ? `1px solid ${tokens.borderSoft}` : 'none',
                      background: 'transparent', border: 'none', color: tokens.text,
                      fontFamily: 'inherit', textAlign: 'left', cursor: 'pointer',
                    }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{e.name}</div>
                        <div style={{ fontSize: 11, color: tokens.textMuted, marginTop: 2, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                          {det?.category} · {e.primary.join(', ')}
                        </div>
                      </div>
                      <Icon name="chevron-right" size={16} color={tokens.textMuted} />
                    </button>
                  )
                })}
              </Card>
            </div>
          )
        })}
      </div>

      <ExerciseDetailSheet
        open={!!detail}
        exercise={detail}
        onClose={() => setDetail(null)}
      />
    </div>
  )
}
