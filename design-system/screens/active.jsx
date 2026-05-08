// active.jsx — Active workout screens, one for each block type
// Each block type has its own dedicated execution UI

// Reusable workout chrome: top bar with progress + finish
function ActiveTopBar({ blockLabel, blockName, blockType, current, total, accent, onExit }) {
  return (
    <div style={{ padding: '8px 16px 12px', flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <button onClick={onExit} style={{ width: 32, height: 32, background: 'transparent', border: 'none', color: KB.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: -6 }}>
          <I name="chevron-left" size={22}/>
        </button>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 22, height: 22, borderRadius: 6, background: KB.surface3, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{blockLabel}</div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{blockName}</div>
          <BlockPill type={blockType}/>
        </div>
        <div style={{ fontSize: 12, color: KB.textMuted, fontVariantNumeric: 'tabular-nums' }}>Block {current}/{total}</div>
      </div>
      {/* Block dot progress */}
      <div style={{ display: 'flex', gap: 4 }}>
        {Array.from({ length: total }, (_, i) => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i < current - 1 ? KB.primary : i === current - 1 ? (accent || KB.primary) : KB.border }}/>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// STRAIGHT SETS — classic stack of sets
// ─────────────────────────────────────────────────────────────
function ActiveStraight({ onExit, accent }) {
  const [unit] = (typeof useUnit === 'function') ? useUnit() : ['lb'];
  const [completed, setCompleted] = React.useState(2);
  const [editingSet, setEditingSet] = React.useState(null);
  const [showInfo, setShowInfo] = React.useState(false);
  const block = { label: 'B', name: 'Pull strength', type: 'straight' };
  const ex = { name: 'Pull-up', target: 6, sets: 5, load: 'Bodyweight', note: '+10 lb optional' };
  const exData = (typeof EXERCISES !== 'undefined') ? EXERCISES.find(e => e.id === 'pullup') : null;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <ActiveTopBar blockLabel="B" blockName="Pull strength" blockType="straight" current={2} total={4} accent={accent} onExit={onExit}/>
      <div style={{ flex: 1, overflow: 'auto', padding: '8px 16px 120px' }}>
        {/* Big exercise card */}
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1 }}>{ex.name}</div>
            <div style={{ fontSize: 14, color: KB.textMuted, marginTop: 4 }}>{ex.note}</div>
          </div>
          {exData && (
            <button onClick={() => setShowInfo(true)} title="Exercise info" style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: KB.surface, border: `1px solid ${KB.border}`, color: KB.textMuted,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><I name="info" size={18}/></button>
          )}
        </div>
        {/* Prescription bar */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <div style={{ flex: 1, padding: 14, background: KB.surface, border: `1px solid ${KB.border}`, borderRadius: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: KB.textMuted }}>Target</div>
            <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>{ex.target} <span style={{ fontSize: 12, color: KB.textMuted, fontWeight: 500 }}>reps</span></div>
          </div>
          <div style={{ flex: 1, padding: 14, background: KB.surface, border: `1px solid ${KB.border}`, borderRadius: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: KB.textMuted }}>Load</div>
            <div style={{ fontSize: 16, fontWeight: 700, marginTop: 4 }}>{ex.load}</div>
          </div>
        </div>
        {/* Set list */}
        {Array.from({ length: ex.sets }, (_, i) => {
          const done = i < completed;
          const active = i === completed;
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              width: '100%', padding: '12px 14px', marginBottom: 8,
              background: active ? KB.workBg : KB.surface,
              border: `1px solid ${active ? KB.primary : KB.border}`,
              borderRadius: 14, color: KB.text,
            }}>
              <button onClick={() => active && setCompleted(c => c + 1)} disabled={!active && !done} style={{
                width: 36, height: 36, borderRadius: 10,
                background: done ? KB.primary : KB.surface2,
                color: done ? KB.bg : active ? KB.primary : KB.textMuted,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 14, border: 'none', cursor: active ? 'pointer' : 'default', flexShrink: 0,
              }}>{done ? <I name="check" size={18}/> : i + 1}</button>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: done ? KB.textMuted : KB.text }}>Set {i + 1}</div>
                <div style={{ fontSize: 12, color: KB.textMuted }}>{ex.target} reps · {ex.load}</div>
              </div>
              <button onClick={() => setEditingSet(i)} title="Edit load" style={{
                display: 'flex', alignItems: 'center', gap: 4,
                height: 30, padding: '0 10px', borderRadius: 8,
                background: KB.surface2, border: `1px solid ${KB.border}`, color: KB.textMuted,
                cursor: 'pointer', fontFamily: KB_FONT, fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
              }}>
                <I name="pencil" size={12}/>EDIT
              </button>
            </div>
          );
        })}
      </div>
      {/* Sticky bottom — log set CTA */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 16, background: KB.bg, borderTop: `1px solid ${KB.border}` }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn variant="secondary" size="lg" icon="skip" style={{ width: 56, padding: 0 }}>{''}</Btn>
          <Btn variant="primary" size="lg" full icon="check" accent={accent}>Log Set {completed + 1}</Btn>
        </div>
      </div>
      {editingSet != null && <PrescriptionEditor open onClose={() => setEditingSet(null)} exerciseName={ex.name} equipment="bodyweight"/>}
      {showInfo && exData && <ExerciseDetailSheet open exercise={exData} onClose={() => setShowInfo(false)}/>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SUPERSET — A1/A2 paired card stack
// ─────────────────────────────────────────────────────────────
function ActiveSuperset({ onExit, accent }) {
  const [round, setRound] = React.useState(2);
  const ex1 = { sub: 'B1', name: 'Pull-up', target: 6, load: 'Bodyweight' };
  const ex2 = { sub: 'B2', name: 'Dumbbell row', target: 10, load: '50 lb', tempo: '2-1-2-0' };
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <ActiveTopBar blockLabel="B" blockName="Pull strength" blockType="superset" current={2} total={4} accent={accent} onExit={onExit}/>
      <div style={{ flex: 1, overflow: 'auto', padding: '8px 16px 120px' }}>
        {/* Round counter */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: KB.textMuted }}>Round</div>
            <div style={{ fontSize: 36, fontWeight: 700, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>{round}<span style={{ fontSize: 18, color: KB.textMuted, fontWeight: 500 }}> / 4</span></div>
          </div>
          {/* Round dots */}
          <div style={{ display: 'flex', gap: 4 }}>
            {[1,2,3,4].map(r => (
              <div key={r} style={{
                width: 28, height: 28, borderRadius: 8,
                background: r < round ? KB.primary : r === round ? KB.workBg : KB.surface2,
                border: `1px solid ${r === round ? KB.primary : KB.border}`,
                color: r < round ? KB.bg : r === round ? KB.primary : KB.textMuted,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700,
              }}>{r}</div>
            ))}
          </div>
        </div>
        {/* Pair card: B1 active, B2 next */}
        {[
          { ...ex1, state: 'active' },
          { ...ex2, state: 'queued' },
        ].map((ex, i) => (
          <Card key={i} elevated={ex.state === 'active'} style={{
            marginBottom: 10, padding: 0, overflow: 'hidden',
            background: ex.state === 'active' ? KB.surface2 : KB.surface,
            borderColor: ex.state === 'active' ? KB.primary : KB.border,
          }}>
            <div style={{ padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.10em', color: ex.state === 'active' ? KB.primary : KB.textMuted, fontFamily: KB_MONO }}>{ex.sub}</span>
                {ex.state === 'active' && <Chip tone="work" size="sm">NOW</Chip>}
                {ex.state === 'queued' && <Chip size="sm">NEXT</Chip>}
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em', marginBottom: 6 }}>{ex.name}</div>
              <div style={{ display: 'flex', gap: 14, fontSize: 13, color: KB.textMuted }}>
                <span><span style={{ color: KB.text, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{ex.target}</span> reps</span>
                <span>·</span>
                <span style={{ color: KB.text, fontWeight: 600 }}>{ex.load}</span>
                {ex.tempo && <><span>·</span><span style={{ fontFamily: KB_MONO, color: KB.accent, fontWeight: 700 }}>{ex.tempo}</span></>}
              </div>
            </div>
            {ex.state === 'active' && (
              <div style={{ padding: '10px 16px', background: KB.bg, borderTop: `1px solid ${KB.borderSoft}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[4,5,6,7,8].map(n => (
                    <button key={n} style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: n === 6 ? KB.primary : 'transparent',
                      color: n === 6 ? KB.bg : KB.text,
                      border: `1px solid ${n === 6 ? KB.primary : KB.border}`,
                      fontSize: 13, fontWeight: 700, cursor: 'pointer', fontVariantNumeric: 'tabular-nums', fontFamily: KB_FONT,
                    }}>{n}</button>
                  ))}
                </div>
                <div style={{ fontSize: 11, color: KB.textMuted }}>actual reps</div>
              </div>
            )}
          </Card>
        ))}
        {/* Rest hint */}
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: KB.restBg, borderRadius: 10, border: `1px solid ${KB.rest}33` }}>
          <I name="timer" size={16} color={KB.rest}/>
          <span style={{ fontSize: 13, color: KB.rest, fontWeight: 600 }}>Rest 90s after both</span>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 16, background: KB.bg, borderTop: `1px solid ${KB.border}` }}>
        <Btn variant="primary" size="lg" full icon="arrow-right" accent={accent}>Done · Move to B2</Btn>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CIRCUIT — rotating list with round counter
// ─────────────────────────────────────────────────────────────
function ActiveCircuit({ onExit, accent }) {
  const ex = CIRCUIT_BLOCK.exercises;
  const round = 2;
  const idx = 1;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <ActiveTopBar blockLabel="A" blockName="Full-body circuit" blockType="circuit" current={1} total={3} accent={accent} onExit={onExit}/>
      <div style={{ flex: 1, overflow: 'auto', padding: '8px 16px 120px' }}>
        {/* Round meter — circular */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18, padding: 16, background: KB.surface, borderRadius: 14, border: `1px solid ${KB.border}` }}>
          <svg width="64" height="64" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="26" fill="none" stroke={KB.border} strokeWidth="6"/>
            <circle cx="32" cy="32" r="26" fill="none" stroke={KB.primary} strokeWidth="6" strokeDasharray={`${(round/3) * 163} 163`} strokeLinecap="round" transform="rotate(-90 32 32)"/>
            <text x="32" y="38" textAnchor="middle" fontSize="20" fontWeight="700" fill={KB.text} fontFamily={KB_FONT}>{round}</text>
          </svg>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: KB.textMuted }}>Round</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{round} of 3</div>
            <div style={{ fontSize: 12, color: KB.textMuted, marginTop: 2 }}>60s rest between rounds</div>
          </div>
        </div>
        {/* Circuit station list */}
        {ex.map((e, i) => {
          const state = i < idx ? 'done' : i === idx ? 'active' : 'queued';
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '14px 14px',
              marginBottom: 8,
              background: state === 'active' ? KB.workBg : KB.surface,
              border: `1px solid ${state === 'active' ? KB.primary : KB.border}`,
              borderRadius: 14,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: state === 'done' ? KB.primary : state === 'active' ? KB.surface3 : KB.surface2,
                color: state === 'done' ? KB.bg : state === 'active' ? KB.primary : KB.textMuted,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700,
              }}>{state === 'done' ? <I name="check" size={18}/> : i + 1}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: state === 'done' ? KB.textMuted : KB.text }}>{e.name}</div>
                <div style={{ fontSize: 12, color: KB.textMuted, marginTop: 2 }}>
                  {e.prescription.target}{e.prescription.type === 'time' ? 's' : ' reps'} · {e.prescription.load.label}
                </div>
              </div>
              {state === 'active' && <Chip tone="work" size="sm">NOW</Chip>}
            </div>
          );
        })}
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 16, background: KB.bg, borderTop: `1px solid ${KB.border}` }}>
        <Btn variant="primary" size="lg" full icon="check" accent={accent}>Done · Next station</Btn>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// AMRAP — large clock + tap-to-add round
// ─────────────────────────────────────────────────────────────
function ActiveAmrap({ onExit, accent }) {
  const [leadIn] = useLeadIn();
  const [rounds, setRounds] = React.useState(0);
  const [partial, setPartial] = React.useState(0);
  const total = 8 * 60;
  const t = useCountdown({ duration: total, leadIn });
  const ex = TODAY_SESSION.blocks[3].exercises;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <ActiveTopBar blockLabel="D" blockName="Finisher" blockType="amrap" current={4} total={4} accent={accent} onExit={onExit}/>
      <div style={{ flex: 1, overflow: 'auto', padding: '8px 16px 140px' }}>
        {/* Big timer + ring */}
        <div style={{ padding: '12px 0 6px' }}>
          <CircularTimer remaining={t.remaining} total={t.total} leadCount={t.leadCount} phase={t.phase} size={240} accent={KB.accent}/>
        </div>
        {/* Round counter */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, margin: '14px 0' }}>
          <button onClick={() => setRounds(r => Math.max(0, r - 1))} style={{ width: 44, height: 44, borderRadius: 999, background: KB.surface2, border: `1px solid ${KB.border}`, color: KB.text, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <I name="minus" size={18}/>
          </button>
          <div style={{ textAlign: 'center', minWidth: 100 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: KB.textMuted }}>Rounds</div>
            <div style={{ fontSize: 36, fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: KB.accent, lineHeight: 1, marginTop: 2 }}>{rounds}<span style={{ fontSize: 14, color: KB.textMuted, fontWeight: 500 }}>+{partial}</span></div>
          </div>
          <button onClick={() => setRounds(r => r + 1)} style={{ width: 44, height: 44, borderRadius: 999, background: KB.accent, border: 'none', color: KB.bg, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <I name="plus" size={18}/>
          </button>
        </div>
        {/* Exercise rotation reminder */}
        <Card padded={false} style={{ overflow: 'hidden' }}>
          <div style={{ padding: '10px 14px', borderBottom: `1px solid ${KB.borderSoft}`, display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: KB.textMuted }}>1 round</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: KB.textMuted }}>tap to mark complete</div>
          </div>
          {ex.map((e, i) => {
            const done = i < partial;
            return (
              <button key={i} onClick={() => setPartial(p => i === p ? p + 1 : p)} style={{
                width: '100%', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12,
                background: 'transparent', border: 'none', borderTop: i > 0 ? `1px solid ${KB.borderSoft}` : 'none',
                cursor: 'pointer', color: KB.text, fontFamily: KB_FONT, textAlign: 'left',
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8, background: done ? KB.primary : KB.surface2,
                  color: done ? KB.bg : KB.textMuted,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700,
                }}>{done ? <I name="check" size={16}/> : i + 1}</div>
                <div style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>{e.name}</div>
                <div style={{ fontSize: 13, color: KB.textMuted, fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{e.prescription.target}</div>
              </button>
            );
          })}
        </Card>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 16, background: KB.bg, borderTop: `1px solid ${KB.border}` }}>
        {t.phase === 'idle' || t.phase === 'done' ? (
          <Btn variant="primary" size="lg" full icon="play" accent={KB.accent} onClick={t.start}>{t.phase === 'done' ? 'Restart timer' : 'Start AMRAP'}</Btn>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn variant="secondary" size="lg" icon={t.phase === 'paused' ? 'play' : 'pause'} style={{ width: 56, padding: 0 }} onClick={() => t.phase === 'paused' ? t.start() : t.pause()}>{''}</Btn>
            <Btn variant="primary" size="lg" full icon="flag" accent={KB.accent} onClick={() => t.reset()}>End AMRAP early</Btn>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// LADDER — visual rungs ascending load
// ─────────────────────────────────────────────────────────────
function ActiveLadder({ onExit, accent }) {
  const block = TODAY_SESSION.blocks[2];
  const rungs = block.exercises[0].ladder.rungs;
  const [step, setStep] = React.useState(2); // current rung 0-indexed
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <ActiveTopBar blockLabel="C" blockName="Hinge ladder" blockType="ladder" current={3} total={4} accent={accent} onExit={onExit}/>
      <div style={{ flex: 1, overflow: 'auto', padding: '8px 16px 120px' }}>
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em' }}>KB Romanian deadlift</div>
          <div style={{ fontSize: 12, color: KB.textMuted, marginTop: 2 }}>Ascending load · 5 rungs · 75s rest</div>
        </div>
        {/* Rung visualization */}
        <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: 6, padding: 14, background: KB.surface, borderRadius: 14, border: `1px solid ${KB.border}`, marginBottom: 14 }}>
          {rungs.map((r, i) => {
            const state = i < step ? 'done' : i === step ? 'active' : 'queued';
            const w = 50 + (i * 10); // visual ascending weight bar
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: 7,
                  background: state === 'done' ? KB.primary : state === 'active' ? KB.accentBg : KB.surface2,
                  color: state === 'done' ? KB.bg : state === 'active' ? KB.accent : KB.textMuted,
                  border: `1px solid ${state === 'active' ? KB.accent : 'transparent'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, flexShrink: 0,
                }}>{i + 1}</div>
                <div style={{ flex: 1, height: 36, position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    width: `${w}%`, height: 28, borderRadius: 8,
                    background: state === 'done' ? KB.workBg : state === 'active' ? KB.accentBg : KB.surface2,
                    border: `1px solid ${state === 'done' ? KB.primary : state === 'active' ? KB.accent : KB.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0 10px',
                  }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: state === 'active' ? KB.accent : state === 'done' ? KB.primary : KB.textMuted, fontVariantNumeric: 'tabular-nums' }}>{r.reps} reps</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: state === 'active' ? KB.accent : state === 'done' ? KB.primary : KB.textMuted, fontVariantNumeric: 'tabular-nums' }}>{r.load.label}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {/* Current rung — big card */}
        <Card elevated style={{ padding: 18, borderColor: KB.accent }}>
          <Chip tone="accent" size="sm" style={{ marginBottom: 12 }}>RUNG {step + 1} OF {rungs.length}</Chip>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: KB.textMuted }}>Reps</div>
              <div style={{ fontSize: 44, fontWeight: 800, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em', lineHeight: 1, marginTop: 4 }}>{rungs[step].reps}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: KB.textMuted }}>Load</div>
              <div style={{ fontSize: 30, fontWeight: 800, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em', color: KB.accent, marginTop: 4 }}>{rungs[step].load.label}</div>
            </div>
          </div>
        </Card>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 16, background: KB.bg, borderTop: `1px solid ${KB.border}` }}>
        <Btn variant="primary" size="lg" full icon="check" accent={accent} onClick={() => setStep(s => Math.min(rungs.length - 1, s + 1))}>Climb to rung {step + 2}</Btn>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// INTERVAL — work/rest big timer
// ─────────────────────────────────────────────────────────────
function ActiveInterval({ onExit, accent }) {
  const [leadIn] = useLeadIn();
  const WORK = 60, REST = 60, TOTAL_ROUNDS = 6;
  const [intervalPhase, setIntervalPhase] = React.useState('work'); // work | rest
  const [round, setRound] = React.useState(1);
  const advance = React.useCallback(() => {
    setIntervalPhase(p => {
      if (p === 'work') return 'rest';
      setRound(r => Math.min(TOTAL_ROUNDS, r + 1));
      return 'work';
    });
  }, []);
  const t = useCountdown({
    duration: intervalPhase === 'work' ? WORK : REST,
    leadIn: intervalPhase === 'work' && round === 1 ? leadIn : 0,
    onComplete: () => setTimeout(advance, 100),
  });
  // Reset countdown when phase or round changes
  React.useEffect(() => { t.reset(); t.start(); /* eslint-disable-next-line */ }, [intervalPhase, round]);
  const c = intervalPhase === 'work' ? KB.work : KB.rest;
  const cBg = intervalPhase === 'work' ? KB.workBg : KB.restBg;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: cBg }}>
      <ActiveTopBar blockLabel="A" blockName="Row intervals" blockType="interval" current={1} total={2} accent={accent} onExit={onExit}/>
      <div style={{ flex: 1, overflow: 'auto', padding: '8px 16px 120px', display: 'flex', flexDirection: 'column' }}>
        {/* Phase indicator */}
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: c }}>{intervalPhase}</div>
          <div style={{ fontSize: 12, color: KB.textMuted, marginTop: 4 }}>Round {round} of {TOTAL_ROUNDS}</div>
        </div>
        {/* Massive timer */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 280 }}>
          <CircularTimer remaining={t.remaining} total={t.total} leadCount={t.leadCount} phase={t.phase} size={260} accent={c}/>
        </div>
        {/* Target callout */}
        <Card style={{ marginTop: 16, padding: 14, borderColor: c, background: KB.surface }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: KB.textMuted }}>Target</div>
              <div style={{ fontSize: 17, fontWeight: 700, marginTop: 3 }}>250 m / 60 s</div>
            </div>
            <Chip size="sm">DAMPER 5</Chip>
          </div>
        </Card>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 16, background: KB.bg, borderTop: `1px solid ${KB.border}` }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn variant="secondary" size="lg" icon={t.phase === 'paused' ? 'play' : t.phase === 'idle' ? 'play' : 'pause'} style={{ width: 56, padding: 0 }} onClick={() => t.isRunning ? t.pause() : t.start()}>{''}</Btn>
          <Btn variant="primary" size="lg" full icon="skip" accent={c} onClick={advance}>Skip {intervalPhase === 'work' ? 'to rest' : 'rest'}</Btn>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CARRY/HOLD — duration with distance
// ─────────────────────────────────────────────────────────────
function ActiveCarry({ onExit, accent }) {
  const [leadIn] = useLeadIn();
  const t = useCountdown({ duration: 40, leadIn });
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <ActiveTopBar blockLabel="B" blockName="Heavy carry" blockType="carry" current={2} total={3} accent={accent} onExit={onExit}/>
      <div style={{ flex: 1, overflow: 'auto', padding: '8px 16px 120px' }}>
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em' }}>Farmer carry</div>
          <div style={{ fontSize: 14, color: KB.textMuted, marginTop: 4 }}>Round 2 of 3 · 90s rest</div>
        </div>
        {/* Live time-under-load timer */}
        <Card style={{ padding: 16, marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: KB.textMuted, marginBottom: 12, textAlign: 'center' }}>Time under load</div>
          <CircularTimer remaining={t.remaining} total={t.total} leadCount={t.leadCount} phase={t.phase} size={180} accent={KB.primary}/>
          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center' }}>
            <Btn variant={t.isRunning ? 'secondary' : 'primary'} size="md" icon={t.isRunning ? 'pause' : 'play'} accent={accent} onClick={() => t.isRunning ? t.pause() : t.start()}>
              {t.phase === 'idle' ? 'Start' : t.isRunning ? 'Pause' : t.phase === 'done' ? 'Restart' : 'Resume'}
            </Btn>
          </div>
        </Card>
        {/* Massive load */}
        <Card elevated style={{ padding: 24, marginBottom: 14, textAlign: 'center', borderColor: KB.accent }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: KB.textMuted, marginBottom: 8 }}>Load</div>
          <div style={{ fontSize: 60, fontWeight: 800, color: KB.accent, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.03em', lineHeight: 1 }}>32 kg</div>
          <div style={{ fontSize: 14, color: KB.textMuted, marginTop: 4 }}>×2 kettlebells</div>
        </Card>
        {/* Distance counter */}
        <Card style={{ padding: 18, marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: KB.textMuted }}>Distance</div>
              <div style={{ fontSize: 36, fontWeight: 700, fontVariantNumeric: 'tabular-nums', marginTop: 4 }}>22<span style={{ fontSize: 14, color: KB.textMuted, fontWeight: 500 }}> / 40 m</span></div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{ width: 44, height: 44, borderRadius: 12, background: KB.surface2, border: `1px solid ${KB.border}`, color: KB.text, cursor: 'pointer' }}>−5</button>
              <button style={{ width: 44, height: 44, borderRadius: 12, background: KB.primary, border: 'none', color: KB.bg, cursor: 'pointer', fontWeight: 700 }}>+5</button>
            </div>
          </div>
          {/* Progress bar */}
          <div style={{ marginTop: 12, height: 6, borderRadius: 3, background: KB.border, overflow: 'hidden' }}>
            <div style={{ width: '55%', height: '100%', background: KB.primary }}/>
          </div>
        </Card>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 16, background: KB.bg, borderTop: `1px solid ${KB.border}` }}>
        <Btn variant="primary" size="lg" full icon="check" accent={accent}>Drop · End round</Btn>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MSTF Tempo Timer — 4-phase cadence
// ─────────────────────────────────────────────────────────────
function ActiveTempo({ onExit, accent }) {
  const phases = [
    { name: 'Eccentric', secs: 10, color: KB.accent },
    { name: 'Bottom',    secs: 2,  color: KB.danger },
    { name: 'Concentric',secs: 10, color: KB.primary },
    { name: 'Top',       secs: 0,  color: KB.rest },
  ];
  const [activePhase, setActivePhase] = React.useState(0);
  const [tick, setTick] = React.useState(6); // 6/10 through current phase
  const cur = phases[activePhase];
  const pct = cur.secs ? tick / cur.secs : 1;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <ActiveTopBar blockLabel="A" blockName="MSTF chest" blockType="straight" current={1} total={1} accent={accent} onExit={onExit}/>
      <div style={{ flex: 1, overflow: 'auto', padding: '8px 16px 120px' }}>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em' }}>Dumbbell bench press</div>
          <div style={{ fontSize: 13, color: KB.textMuted, marginTop: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Chip tone="accent" size="sm">MSTF · TEMPO</Chip>
            <span style={{ fontFamily: KB_MONO, fontSize: 14, color: KB.text, fontWeight: 700 }}>10-2-10-0</span>
          </div>
        </div>
        {/* Phase ring */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px 0' }}>
          <svg width="240" height="240" viewBox="0 0 240 240">
            <circle cx="120" cy="120" r="100" fill="none" stroke={KB.border} strokeWidth="10"/>
            <circle cx="120" cy="120" r="100" fill="none" stroke={cur.color} strokeWidth="10" strokeDasharray={`${pct * 628} 628`} strokeLinecap="round" transform="rotate(-90 120 120)"/>
          </svg>
          <div style={{ position: 'absolute', textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: cur.color }}>{cur.name}</div>
            <div style={{ fontSize: 80, fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: KB.text, letterSpacing: '-0.04em', lineHeight: 1, marginTop: 4 }}>{tick}</div>
            <div style={{ fontSize: 12, color: KB.textMuted, marginTop: 4 }}>of {cur.secs}s</div>
          </div>
        </div>
        {/* Phase row */}
        <div style={{ display: 'flex', gap: 6, marginTop: 14 }}>
          {phases.map((p, i) => (
            <div key={i} onClick={() => setActivePhase(i)} style={{
              flex: p.secs || 0.4, padding: '10px 8px', borderRadius: 10, cursor: 'pointer',
              background: i === activePhase ? `${p.color}22` : KB.surface,
              border: `1px solid ${i === activePhase ? p.color : KB.border}`,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: i === activePhase ? p.color : KB.textMuted }}>{p.name}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: i === activePhase ? p.color : KB.text, fontVariantNumeric: 'tabular-nums', marginTop: 2 }}>{p.secs}</div>
            </div>
          ))}
        </div>
        {/* Cues */}
        <Card style={{ marginTop: 14, padding: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: KB.textMuted, marginBottom: 8 }}>Cues</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {['Maximal slow tempo', 'No rest at bottom', 'Tension throughout'].map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: KB.text }}>
                <div style={{ width: 4, height: 4, borderRadius: 2, background: KB.accent }}/>{c}
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 16, background: KB.bg, borderTop: `1px solid ${KB.border}` }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn variant="secondary" size="lg" icon="pause" style={{ width: 56, padding: 0 }}>{''}</Btn>
          <Btn variant="primary" size="lg" full icon="check">Complete rep · 1 of 4</Btn>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  ActiveStraight, ActiveSuperset, ActiveCircuit, ActiveAmrap,
  ActiveLadder, ActiveInterval, ActiveCarry, ActiveTempo,
});
