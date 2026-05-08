import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ChevronRight } from 'lucide-react'
import { exercises } from '../data/exercises'
import { ScreenHeader, Card } from '../components'
import type { Equipment } from '../data/exercises'

const EQUIPMENT_LABELS: Record<Equipment, string> = {
  kettlebell: 'Kettlebell',
  medicine_ball: 'Med Ball',
  bench_or_box: 'Bench',
  flat_surface: 'Floor',
  balance_support: 'Support',
  bodyweight: 'Bodyweight',
}

const ALL_EQUIPMENT = Object.keys(EQUIPMENT_LABELS) as Equipment[]

export default function Exercises() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [equipFilter, setEquipFilter] = useState<Equipment | null>(null)

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return exercises.filter(ex => {
      const matchesQuery = !q ||
        ex.name.toLowerCase().includes(q) ||
        ex.muscleGroups.some(m => m.toLowerCase().includes(q))
      const matchesEquip = !equipFilter || ex.equipment.includes(equipFilter)
      return matchesQuery && matchesEquip
    })
  }, [query, equipFilter])

  return (
    <div className="screen-content" style={{ paddingBottom: 80 }}>
      <ScreenHeader title="Exercises" />

      {/* Search */}
      <div style={{ padding: '0 16px 12px', position: 'relative' }}>
        <Search size={16} style={{ position: 'absolute', left: 28, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
        <input
          type="search"
          placeholder="Search exercises or muscles…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{
            width: '100%', boxSizing: 'border-box',
            paddingLeft: 38, paddingRight: 12, height: 42,
            background: 'var(--surface-2)', border: '1px solid var(--border)',
            borderRadius: 10, color: 'var(--text)', fontFamily: 'var(--font)',
            fontSize: 14, outline: 'none',
          }}
        />
      </div>

      {/* Equipment filter pills */}
      <div style={{ overflowX: 'auto', padding: '0 16px 16px', display: 'flex', gap: 8, scrollbarWidth: 'none' }}>
        <button
          onClick={() => setEquipFilter(null)}
          style={{
            flexShrink: 0, padding: '6px 14px', borderRadius: 999,
            border: !equipFilter ? '2px solid var(--primary)' : '1px solid var(--border)',
            background: !equipFilter ? 'var(--surface-2)' : 'var(--surface)',
            color: !equipFilter ? 'var(--primary)' : 'var(--text-muted)',
            cursor: 'pointer', fontFamily: 'var(--font)', fontSize: 13, fontWeight: 600,
          }}
        >
          All
        </button>
        {ALL_EQUIPMENT.map(eq => (
          <button
            key={eq}
            onClick={() => setEquipFilter(equipFilter === eq ? null : eq)}
            style={{
              flexShrink: 0, padding: '6px 14px', borderRadius: 999,
              border: equipFilter === eq ? '2px solid var(--primary)' : '1px solid var(--border)',
              background: equipFilter === eq ? 'var(--surface-2)' : 'var(--surface)',
              color: equipFilter === eq ? 'var(--primary)' : 'var(--text-muted)',
              cursor: 'pointer', fontFamily: 'var(--font)', fontSize: 13, fontWeight: 600,
            }}
          >
            {EQUIPMENT_LABELS[eq]}
          </button>
        ))}
      </div>

      {/* Results */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.length === 0 && (
          <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>
            <p className="t-body">No exercises found.</p>
          </div>
        )}
        {filtered.map(ex => (
          <Card
            key={ex.id}
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(`/exercises/${ex.id}`)}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="t-body" style={{ marginBottom: 2 }}>{ex.name}</div>
                <div className="t-label" style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {ex.muscleGroups.join(' · ')}
                </div>
              </div>
              <ChevronRight size={16} color="var(--text-muted)" style={{ flexShrink: 0, marginLeft: 8 }} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
