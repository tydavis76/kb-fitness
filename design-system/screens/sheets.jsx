// sheets.jsx — Load entry sheets per equipment type, plus exercise picker

// Kettlebell — discrete bell sizes
function LoadEntryKettlebell({ open, onClose, onPick }) {
  const sizes = [12, 16, 20, 24, 28, 32, 36, 40, 48];
  const [picked, setPicked] = React.useState(24);
  const [unit, setUnit] = React.useState('kg');
  return (
    <BottomSheet open={open} onClose={onClose} title="Pick a kettlebell">
      <div style={{ display: 'flex', gap: 6, marginBottom: 14, padding: 4, background: KB.surface2, borderRadius: 10, border: `1px solid ${KB.border}` }}>
        {['kg', 'lb'].map(u => (
          <button key={u} onClick={() => setUnit(u)} style={{
            flex: 1, height: 36, background: unit === u ? KB.surface3 : 'transparent',
            color: unit === u ? KB.text : KB.textMuted, border: 'none', borderRadius: 8,
            fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: KB_FONT, textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>{u}</button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14 }}>
        {sizes.map(s => {
          const active = s === picked;
          return (
            <button key={s} onClick={() => setPicked(s)} style={{
              padding: '14px 8px', borderRadius: 12,
              background: active ? KB.workBg : KB.surface2,
              border: `1px solid ${active ? KB.primary : KB.border}`,
              color: active ? KB.primary : KB.text, cursor: 'pointer', fontFamily: KB_FONT,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            }}>
              <I name="kettlebell" size={28}/>
              <span style={{ fontSize: 18, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{unit === 'lb' ? Math.round(s * 2.2) : s}</span>
              <span style={{ fontSize: 10, color: KB.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{unit}</span>
            </button>
          );
        })}
      </div>
      <Btn variant="primary" size="lg" full onClick={() => onPick?.(picked)}>Use {unit === 'lb' ? Math.round(picked * 2.2) : picked} {unit}</Btn>
    </BottomSheet>
  );
}

// Dumbbell — 5lb increments up to 100lb
function LoadEntryDumbbell({ open, onClose, onPick }) {
  const [val, setVal] = React.useState(50);
  const quick = [25, 35, 45, 50, 60, 75];
  return (
    <BottomSheet open={open} onClose={onClose} title="Dumbbell load">
      <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
        {quick.map(q => (
          <button key={q} onClick={() => setVal(q)} style={{
            height: 32, padding: '0 12px', borderRadius: 999,
            background: val === q ? KB.primary : KB.surface2,
            color: val === q ? KB.bg : KB.textMuted,
            border: `1px solid ${val === q ? KB.primary : KB.border}`,
            cursor: 'pointer', fontWeight: 700, fontSize: 12, fontFamily: KB_FONT, fontVariantNumeric: 'tabular-nums',
          }}>{q} lb</button>
        ))}
      </div>
      <Stepper value={val} onChange={setVal} step={5} min={5} max={100} suffix="lb"/>
      <div style={{ marginTop: 8, fontSize: 11, color: KB.textMuted, textAlign: 'center' }}>5 lb increments · max 100 lb home rack</div>
      <div style={{ marginTop: 16 }}>
        <Btn variant="primary" size="lg" full onClick={() => onPick?.(val)}>Use {val} lb</Btn>
      </div>
    </BottomSheet>
  );
}

// Band — color picker, no number
function LoadEntryBand({ open, onClose, onPick }) {
  const bands = [
    { name: 'Yellow', tension: 'X-Light', hex: '#F2D640' },
    { name: 'Red',    tension: 'Light',   hex: '#E15B5B' },
    { name: 'Green',  tension: 'Medium',  hex: '#7BD88F' },
    { name: 'Blue',   tension: 'Heavy',   hex: '#60A5FA' },
    { name: 'Black',  tension: 'X-Heavy', hex: '#1E222B' },
    { name: 'Purple', tension: '2× heavy',hex: '#A78BFA' },
  ];
  const [picked, setPicked] = React.useState('Red');
  return (
    <BottomSheet open={open} onClose={onClose} title="Pick a band">
      <div style={{ fontSize: 12, color: KB.textMuted, marginBottom: 12 }}>Bands have no numeric load — track color and tension over time.</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
        {bands.map(b => {
          const active = b.name === picked;
          return (
            <button key={b.name} onClick={() => setPicked(b.name)} style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px',
              background: active ? KB.surface2 : KB.surface,
              border: `1px solid ${active ? b.hex : KB.border}`,
              borderRadius: 12, cursor: 'pointer', color: KB.text, fontFamily: KB_FONT, textAlign: 'left',
            }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: b.hex, border: `1px solid ${KB.border}` }}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{b.name}</div>
                <div style={{ fontSize: 12, color: KB.textMuted }}>{b.tension}</div>
              </div>
              {active && <I name="check" size={18} color={b.hex}/>}
            </button>
          );
        })}
      </div>
      <Btn variant="primary" size="lg" full onClick={() => onPick?.(picked)}>Use {picked} band</Btn>
    </BottomSheet>
  );
}

// Damper — rower setting
function LoadEntryDamper({ open, onClose, onPick }) {
  const [val, setVal] = React.useState(5);
  return (
    <BottomSheet open={open} onClose={onClose} title="Damper setting">
      <div style={{ fontSize: 12, color: KB.textMuted, marginBottom: 14 }}>Rowing machine drag factor. 3–5 typical for steady; 6–9 for power.</div>
      {/* Big arc */}
      <div style={{ position: 'relative', height: 120, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="220" height="120" viewBox="0 0 220 120">
          <path d="M 20 110 A 90 90 0 0 1 200 110" fill="none" stroke={KB.border} strokeWidth="10" strokeLinecap="round"/>
          <path d="M 20 110 A 90 90 0 0 1 200 110" fill="none" stroke={KB.accent} strokeWidth="10" strokeLinecap="round" strokeDasharray={`${(val/10) * 282} 282`}/>
        </svg>
        <div style={{ position: 'absolute', textAlign: 'center' }}>
          <div style={{ fontSize: 56, fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: KB.accent, letterSpacing: '-0.03em', lineHeight: 1 }}>{val}</div>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: KB.textMuted, marginTop: 2 }}>Damper</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
        {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
          <button key={n} onClick={() => setVal(n)} style={{
            flex: 1, height: 44, borderRadius: 10,
            background: val === n ? KB.accent : KB.surface2, color: val === n ? KB.bg : KB.text,
            border: `1px solid ${val === n ? KB.accent : KB.border}`, cursor: 'pointer',
            fontWeight: 700, fontSize: 13, fontFamily: KB_FONT, fontVariantNumeric: 'tabular-nums',
          }}>{n}</button>
        ))}
      </div>
      <Btn variant="primary" size="lg" full onClick={() => onPick?.(val)}>Use damper {val}</Btn>
    </BottomSheet>
  );
}

// Bodyweight + assistance
function LoadEntryBodyweight({ open, onClose, onPick }) {
  const [mode, setMode] = React.useState('bw'); // bw | weighted | assisted
  const [val, setVal] = React.useState(0);
  return (
    <BottomSheet open={open} onClose={onClose} title="Bodyweight">
      <div style={{ display: 'flex', gap: 6, marginBottom: 14, padding: 4, background: KB.surface2, borderRadius: 10, border: `1px solid ${KB.border}` }}>
        {[
          { id: 'bw', label: 'Bodyweight' },
          { id: 'weighted', label: '+ Added' },
          { id: 'assisted', label: '− Assist' },
        ].map(o => (
          <button key={o.id} onClick={() => setMode(o.id)} style={{
            flex: 1, height: 36, background: mode === o.id ? KB.surface3 : 'transparent',
            color: mode === o.id ? KB.text : KB.textMuted, border: 'none', borderRadius: 8,
            fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: KB_FONT,
          }}>{o.label}</button>
        ))}
      </div>
      {mode !== 'bw' && (
        <div style={{ marginBottom: 14 }}>
          <Stepper value={val} onChange={setVal} step={5} min={0} max={100} suffix={mode === 'weighted' ? '+ lb' : '− lb'}/>
        </div>
      )}
      <div style={{ padding: 12, background: KB.surface2, borderRadius: 10, fontSize: 12, color: KB.textMuted, marginBottom: 14, textAlign: 'center' }}>
        {mode === 'bw' && 'Tracks bodyweight progression over time.'}
        {mode === 'weighted' && 'Vest, dip belt, weighted backpack — add to total volume.'}
        {mode === 'assisted' && 'Band assist or partner spot — subtracts from total volume.'}
      </div>
      <Btn variant="primary" size="lg" full onClick={() => onPick?.({ mode, val })}>
        {mode === 'bw' ? 'Use bodyweight' : `${mode === 'weighted' ? '+' : '−'}${val} lb`}
      </Btn>
    </BottomSheet>
  );
}

// Exercise picker / substitution sheet
function ExercisePickerSheet({ open, onClose, current = 'Pull-up' }) {
  const [q, setQ] = React.useState('');
  const list = EXERCISES;
  const subs = ['Chin-up', 'TRX row', 'Dumbbell row'];
  return (
    <BottomSheet open={open} onClose={onClose} title="Swap exercise">
      <div style={{ marginBottom: 12, fontSize: 13, color: KB.textMuted }}>Replace <span style={{ color: KB.text, fontWeight: 600 }}>{current}</span> in this block.</div>
      {/* Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: KB.surface2, border: `1px solid ${KB.border}`, borderRadius: 12, marginBottom: 12 }}>
        <I name="search" size={16} color={KB.textMuted}/>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search exercises…" style={{
          flex: 1, background: 'transparent', border: 'none', outline: 'none', color: KB.text, fontSize: 14, fontFamily: KB_FONT,
        }}/>
      </div>
      {/* Smart substitutions */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: KB.accent, marginBottom: 6 }}>Smart substitutions</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {subs.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: KB.accentBg, border: `1px solid ${KB.accent}`, borderRadius: 10 }}>
              <I name="swap" size={16} color={KB.accent}/>
              <span style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>{s}</span>
              <span style={{ fontSize: 11, color: KB.textMuted, letterSpacing: '0.04em', textTransform: 'uppercase' }}>same pattern</span>
            </div>
          ))}
        </div>
      </div>
      {/* Browse */}
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: KB.textMuted, marginBottom: 6 }}>All pull pattern</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 200, overflow: 'auto' }}>
        {list.filter(e => e.pattern === 'pull').map(e => (
          <button key={e.id} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
            background: 'transparent', border: 'none', borderRadius: 10, cursor: 'pointer',
            color: KB.text, fontFamily: KB_FONT, textAlign: 'left',
          }}>
            <span style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>{e.name}</span>
            <Chip size="sm">{e.equipment}</Chip>
          </button>
        ))}
      </div>
    </BottomSheet>
  );
}

// ─────────────────────────────────────────────────────────────
// Prescription editor — full sets/reps/load/tempo edit (used in authoring)
// ─────────────────────────────────────────────────────────────
function PrescriptionEditor({ open, onClose, exerciseName = 'Dumbbell row', equipment = 'dumbbell' }) {
  const [sets, setSets] = React.useState(4);
  const [reps, setReps] = React.useState(10);
  const [load, setLoad] = React.useState(50);
  const [unit, setUnit] = React.useState('lb');
  const [tempo, setTempo] = React.useState('2-1-2-0');
  const [tempoOn, setTempoOn] = React.useState(true);
  const [restSec, setRestSec] = React.useState(90);
  const isNumericLoad = ['dumbbell', 'kettlebell', 'bodyweight'].includes(equipment);

  const Stepperish = ({ label, value, set, step = 1, min = 1, max = 99, suffix }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderTop: `1px solid ${KB.borderSoft}` }}>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: KB.textMuted }}>{label}</div>
        <div style={{ fontSize: 20, fontWeight: 700, fontVariantNumeric: 'tabular-nums', marginTop: 2 }}>{value}{suffix && <span style={{ fontSize: 12, color: KB.textMuted, fontWeight: 500, marginLeft: 4 }}>{suffix}</span>}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <button onClick={() => set(Math.max(min, value - step))} style={{ width: 36, height: 36, borderRadius: 10, background: KB.surface2, border: `1px solid ${KB.border}`, color: KB.text, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><I name="minus" size={16}/></button>
        <button onClick={() => set(Math.min(max, value + step))} style={{ width: 36, height: 36, borderRadius: 10, background: KB.primary, border: 'none', color: KB.bg, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><I name="plus" size={16}/></button>
      </div>
    </div>
  );

  return (
    <BottomSheet open={open} onClose={onClose} title="Edit prescription">
      <div style={{ fontSize: 13, color: KB.textMuted, marginBottom: 12 }}>{exerciseName}<span style={{ marginLeft: 6 }}> · </span><span style={{ color: KB.text, fontWeight: 600 }}>{equipment}</span></div>
      <Card padded={false}>
        <Stepperish label="Sets"  value={sets} set={setSets} max={10}/>
        <Stepperish label="Reps"  value={reps} set={setReps} max={50}/>
        {isNumericLoad ? (
          <div style={{ padding: '12px 14px', borderTop: `1px solid ${KB.borderSoft}` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: KB.textMuted }}>Load</div>
              <div style={{ display: 'flex', gap: 4, padding: 3, background: KB.surface2, borderRadius: 8, border: `1px solid ${KB.border}` }}>
                {['lb','kg'].map(u => (
                  <button key={u} onClick={() => setUnit(u)} style={{ height: 24, padding: '0 10px', borderRadius: 6, background: unit === u ? KB.surface3 : 'transparent', color: unit === u ? KB.text : KB.textMuted, border: 'none', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: KB_FONT }}>{u}</button>
                ))}
              </div>
            </div>
            <Stepper value={load} onChange={setLoad} step={equipment === 'dumbbell' ? 5 : (unit === 'kg' ? 4 : 5)} min={0} max={200} suffix={unit}/>
          </div>
        ) : (
          <div style={{ padding: '12px 14px', borderTop: `1px solid ${KB.borderSoft}`, fontSize: 12, color: KB.textMuted }}>
            Non-numeric load — edit on the equipment sheet.
          </div>
        )}
        <Stepperish label="Rest" value={restSec} set={setRestSec} step={15} min={0} max={300} suffix="s"/>
        <div style={{ padding: '12px 14px', borderTop: `1px solid ${KB.borderSoft}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: KB.textMuted }}>Tempo</div>
              <div style={{ fontSize: 12, color: KB.textMuted, marginTop: 2 }}>Eccentric · Bottom · Concentric · Top</div>
            </div>
            <button onClick={() => setTempoOn(v => !v)} style={{ width: 44, height: 26, borderRadius: 999, background: tempoOn ? KB.accent : KB.surface3, border: 'none', cursor: 'pointer', position: 'relative', padding: 0 }}>
              <div style={{ position: 'absolute', top: 3, left: tempoOn ? 22 : 3, width: 20, height: 20, borderRadius: 10, background: '#fff', transition: 'left 0.15s' }}/>
            </button>
          </div>
          {tempoOn && (
            <input value={tempo} onChange={e => setTempo(e.target.value)} placeholder="2-1-2-0" style={{
              width: '100%', padding: '10px 12px', borderRadius: 10,
              background: KB.surface2, border: `1px solid ${KB.border}`,
              color: KB.accent, fontFamily: KB_MONO, fontSize: 16, fontWeight: 700, letterSpacing: '0.05em',
              textAlign: 'center', outline: 'none',
            }}/>
          )}
        </div>
      </Card>
      <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
        <Btn variant="secondary" size="lg" full onClick={onClose}>Cancel</Btn>
        <Btn variant="primary" size="lg" full icon="check" onClick={onClose}>Save</Btn>
      </div>
    </BottomSheet>
  );
}

// Dispatcher: shows all 5 load sheets opened in sequence on a frame demo
function LoadEntryDemo({ which = 'kettlebell' }) {
  const Sheet = {
    kettlebell: LoadEntryKettlebell,
    dumbbell: LoadEntryDumbbell,
    band: LoadEntryBand,
    damper: LoadEntryDamper,
    bodyweight: LoadEntryBodyweight,
    swap: ExercisePickerSheet,
  }[which];
  // background screen
  return (
    <div style={{ flex: 1, position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, padding: 16, opacity: 0.4 }}>
        <div style={{ fontSize: 24, fontWeight: 700 }}>Pull-up</div>
        <div style={{ fontSize: 13, color: KB.textMuted, marginTop: 4 }}>Set 3 of 5</div>
      </div>
      <Sheet open={true} onClose={() => {}}/>
    </div>
  );
}

Object.assign(window, {
  LoadEntryKettlebell, LoadEntryDumbbell, LoadEntryBand, LoadEntryDamper,
  LoadEntryBodyweight, ExercisePickerSheet, LoadEntryDemo, PrescriptionEditor,
});
