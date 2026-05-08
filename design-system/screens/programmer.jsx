// programmer.jsx — Workout authoring (programmer view)

function AuthoringScreen({ onBack }) {
  const [editingEx, setEditingEx] = React.useState(null);
  const [exPicker, setExPicker] = React.useState(false);
  const [exercises, setExercises] = React.useState([
    { sub: 'B1', name: 'Pull-up', target: '6 reps', load: 'Bodyweight', exId: 'pullup' },
    { sub: 'B2', name: 'Dumbbell row', target: '10 reps', load: '50 lb', tempo: '2-1-2-0', exId: 'db-row' },
  ]);
  const [blocks, setBlocks] = React.useState([
    { id: 'b1', label: 'A', type: 'straight', name: 'Warm-up', exCount: 2, rounds: 1 },
    { id: 'b2', label: 'B', type: 'superset', name: 'Pull strength', exCount: 2, rounds: 4 },
    { id: 'b3', label: 'C', type: 'ladder',   name: 'Hinge ladder', exCount: 1, rounds: 5 },
    { id: 'b4', label: 'D', type: 'amrap',    name: 'Finisher',     exCount: 3, rounds: 1 },
  ]);
  const [picker, setPicker] = React.useState(false);
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', borderBottom: `1px solid ${KB.border}`, gap: 8, flexShrink: 0 }}>
        <button onClick={onBack} style={{ width: 36, height: 36, background: 'transparent', border: 'none', color: KB.text, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <I name="chevron-left" size={22}/>
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: KB.textMuted }}>Editing · Phase 2 · Day 3</div>
          <input defaultValue="Pull + Hinge" style={{
            background: 'transparent', border: 'none', outline: 'none', color: KB.text,
            fontSize: 18, fontWeight: 700, fontFamily: KB_FONT, padding: 0, width: '100%',
          }}/>
        </div>
        <Btn variant="primary" size="sm" icon="check">Save</Btn>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: 12 }}>
        {/* Session settings */}
        <Card padded={false} style={{ marginBottom: 14 }}>
          <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${KB.borderSoft}` }}>
            <div>
              <div style={{ fontSize: 12, color: KB.textMuted }}>Environment</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>Home</div>
            </div>
            <I name="chevron-right" size={18} color={KB.textMuted}/>
          </div>
          <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${KB.borderSoft}` }}>
            <div>
              <div style={{ fontSize: 12, color: KB.textMuted }}>Tags</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                {['phase-2','build','wk-6','pull','hinge'].map(t => <Chip key={t} size="sm">{t}</Chip>)}
              </div>
            </div>
          </div>
          <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 12, color: KB.textMuted }}>Estimated duration</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>48 min</div>
            </div>
          </div>
        </Card>

        <Sectionlabel right={<button onClick={() => setPicker(true)} style={{ background: 'transparent', border: 'none', color: KB.primary, fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontFamily: KB_FONT }}><I name="plus" size={14}/> Add block</button>}>Blocks</Sectionlabel>
        {blocks.map((b, i) => (
          <Card key={b.id} padded={false} style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: 12, gap: 10 }}>
              <I name="grip" size={18} color={KB.textDim}/>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: KB.surface3, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>{b.label}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{b.name}</div>
                <div style={{ fontSize: 12, color: KB.textMuted, marginTop: 1 }}>{b.exCount} ex · {b.rounds} {b.rounds > 1 ? 'rounds' : 'round'}</div>
              </div>
              <BlockPill type={b.type}/>
              <button style={{ width: 32, height: 32, background: 'transparent', border: 'none', color: KB.textMuted, cursor: 'pointer' }}><I name="pencil" size={16}/></button>
            </div>
          </Card>
        ))}
        {/* Add a block — inline picker */}
        {picker && (
          <Card style={{ marginBottom: 12, padding: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Block type</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {['straight','superset','circuit','amrap','ladder','interval','carry'].map(t => (
                <button key={t} onClick={() => setPicker(false)} style={{
                  padding: 12, background: KB.surface2, border: `1px solid ${KB.border}`, borderRadius: 10,
                  cursor: 'pointer', color: KB.text, fontFamily: KB_FONT, textAlign: 'left',
                }}>
                  <BlockPill type={t}/>
                  <div style={{ fontSize: 11, color: KB.textMuted, marginTop: 6 }}>
                    {{
                      straight: 'Fixed sets × reps',
                      superset: 'A1/A2 alternated',
                      circuit:  '3+ rotating exercises',
                      amrap:    'As many rounds as possible',
                      ladder:   'Asc/desc reps or load',
                      interval: 'Work/rest cadence',
                      carry:    'Distance or duration',
                    }[t]}
                  </div>
                </button>
              ))}
            </div>
          </Card>
        )}

        {/* Block detail editor — for B (superset) */}
        <Sectionlabel>Block B · Pull strength</Sectionlabel>
        <Card padded={false} style={{ marginBottom: 12 }}>
          <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${KB.borderSoft}` }}>
            <div style={{ fontSize: 12, color: KB.textMuted }}>Type</div>
            <BlockPill type="superset"/>
          </div>
          <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${KB.borderSoft}` }}>
            <div style={{ fontSize: 12, color: KB.textMuted }}>Rounds</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button style={{ width: 28, height: 28, borderRadius: 7, background: KB.surface2, border: `1px solid ${KB.border}`, color: KB.text, cursor: 'pointer' }}>−</button>
              <span style={{ fontSize: 16, fontWeight: 700, fontVariantNumeric: 'tabular-nums', minWidth: 20, textAlign: 'center' }}>4</span>
              <button style={{ width: 28, height: 28, borderRadius: 7, background: KB.surface2, border: `1px solid ${KB.border}`, color: KB.text, cursor: 'pointer' }}>+</button>
            </div>
          </div>
          <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 12, color: KB.textMuted }}>Rest between rounds</div>
            <div style={{ fontSize: 14, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>90s</div>
          </div>
        </Card>

        <Sectionlabel>Exercises</Sectionlabel>
        {exercises.map((ex, i) => (
          <Card key={i} padded={false} style={{ marginBottom: 8 }}>
            <div style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
              <I name="grip" size={16} color={KB.textDim}/>
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.10em', color: KB.accent, fontFamily: KB_MONO }}>{ex.sub}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{ex.name}</div>
                <div style={{ fontSize: 12, color: KB.textMuted, marginTop: 1, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span>{ex.target}</span>·<span>{ex.load}</span>
                  {ex.tempo && <><span>·</span><span style={{ fontFamily: KB_MONO, color: KB.accent }}>{ex.tempo}</span></>}
                </div>
              </div>
              <button onClick={() => setEditingEx(ex)} style={{ width: 32, height: 32, background: 'transparent', border: 'none', color: KB.textMuted, cursor: 'pointer' }}><I name="pencil" size={16}/></button>
            </div>
          </Card>
        ))}
        <button onClick={() => setExPicker(true)} style={{
          width: '100%', height: 44, background: 'transparent', border: `1px dashed ${KB.border}`,
          borderRadius: 12, color: KB.textMuted, fontSize: 13, fontWeight: 600, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: KB_FONT,
        }}><I name="plus" size={16}/> Add exercise from library</button>
      </div>
      {editingEx && <PrescriptionEditor open onClose={() => setEditingEx(null)} exerciseName={editingEx.name} equipment={editingEx.name.toLowerCase().includes('dumbbell') ? 'dumbbell' : editingEx.name.toLowerCase().includes('pull') ? 'bodyweight' : 'dumbbell'}/>}
      {exPicker && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 40, background: KB.bg, display: 'flex', flexDirection: 'column' }}>
          <ExerciseLibraryScreen
            mode="picker"
            onBack={() => setExPicker(false)}
            onPick={(ex) => {
              const nextSub = `B${exercises.length + 1}`;
              setExercises([...exercises, {
                sub: nextSub, name: ex.name, exId: ex.id,
                target: '8-10 reps',
                load: ex.equipment === 'bodyweight' ? 'Bodyweight' :
                      ex.equipment === 'kettlebell' ? '24 kg' :
                      ex.equipment === 'dumbbell' ? '40 lb' :
                      ex.equipment === 'band' ? 'Red band' : '—',
              }]);
              setExPicker(false);
            }}
          />
        </div>
      )}
    </div>
  );
}

Object.assign(window, { AuthoringScreen });
