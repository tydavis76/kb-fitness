// sessions.jsx — Today, Session preview, Post-workout recap

function TodayScreen({ onStart, onOpenPreview }) {
  const blocks = TODAY_SESSION.blocks;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
      <ScreenHeader title="Today" subtitle="Thu · May 8 · Hybrid Strength" />
      <div style={{ padding: '0 16px 16px' }}>
        {/* Hero session card */}
        <Card elevated style={{ padding: 0, overflow: 'hidden', marginBottom: 12 }}>
          <div style={{ padding: 18, borderBottom: `1px solid ${KB.borderSoft}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Chip tone="accent" size="sm">PHASE 2 · WK 6 · DAY 3</Chip>
              <Chip size="sm">HOME</Chip>
            </div>
            <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 6 }}>Pull + Hinge</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: KB.textMuted, fontSize: 13 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><I name="timer" size={14}/> 48 min</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><I name="dumbbell" size={14}/> 4 blocks</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><I name="flame" size={14}/> ~9,800 lb</span>
            </div>
          </div>
          {/* Block preview rail */}
          <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {blocks.map((b, i) => (
              <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: 7, background: KB.surface3,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, color: KB.text,
                }}>{b.label}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{b.name}</div>
                  <div style={{ fontSize: 12, color: KB.textMuted }}>{b.exercises.length} exercises</div>
                </div>
                <BlockPill type={b.type}/>
              </div>
            ))}
          </div>
          <div style={{ padding: 16, paddingTop: 4, display: 'flex', gap: 8 }}>
            <Btn variant="primary" size="lg" full icon="play" onClick={onStart}>Start Workout</Btn>
          </div>
          <div style={{ padding: '0 16px 16px', display: 'flex', gap: 8 }}>
            <Btn variant="secondary" size="sm" icon="note" onClick={onOpenPreview} style={{ flex: 1 }}>Preview</Btn>
            <Btn variant="secondary" size="sm" icon="swap" style={{ flex: 1 }}>Swap day</Btn>
          </div>
        </Card>
        {/* Streak + last session */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <Card style={{ flex: 1, padding: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: KB.textMuted, marginBottom: 6 }}>Streak</div>
            <div style={{ fontSize: 24, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>9 <span style={{ fontSize: 13, color: KB.textMuted, fontWeight: 500 }}>days</span></div>
          </Card>
          <Card style={{ flex: 1, padding: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: KB.textMuted, marginBottom: 6 }}>Last session</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Tue · Row</div>
            <div style={{ fontSize: 12, color: KB.textMuted, marginTop: 1 }}>1,500 m · 28 min</div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Session preview — full block-by-block walkthrough before starting
// ─────────────────────────────────────────────────────────────
function SessionPreviewScreen({ onBack, onStart }) {
  const s = TODAY_SESSION;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title="Pull + Hinge" subtitle="Phase 2 · Wk 6 · Day 3" leftIcon="chevron-left" leftAction={onBack} />
      <div style={{ flex: 1, overflow: 'auto', padding: '0 16px 100px' }}>
        {s.blocks.map((b) => (
          <div key={b.id} style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: KB.surface3, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{b.label}</div>
              <div style={{ fontSize: 16, fontWeight: 700, flex: 1 }}>{b.name}</div>
              <BlockPill type={b.type}/>
            </div>
            <Card padded={false}>
              {b.exercises.map((ex, j) => (
                <div key={j} style={{
                  padding: '12px 14px',
                  borderTop: j > 0 ? `1px solid ${KB.borderSoft}` : 'none',
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {ex.sub_label && <span style={{ fontSize: 10, fontWeight: 700, color: KB.accent, letterSpacing: '0.08em' }}>{ex.sub_label}</span>}
                      <span style={{ fontSize: 14, fontWeight: 600 }}>{ex.name}</span>
                    </div>
                    <div style={{ fontSize: 12, color: KB.textMuted, marginTop: 2, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <span>{ex.prescription.sets || b.rounds || 1}×{ex.prescription.target}{ex.prescription.type === 'time' ? 's' : ''}</span>
                      <span>·</span>
                      <span>{ex.prescription.load.label}</span>
                      {ex.protocol_constraints?.tempo && <><span>·</span><span style={{ fontFamily: KB_MONO, color: KB.accent }}>{ex.protocol_constraints.tempo}</span></>}
                    </div>
                  </div>
                </div>
              ))}
              {(b.rest_sec || b.rounds > 1 || b.duration_sec) && (
                <div style={{ padding: '10px 14px', borderTop: `1px solid ${KB.borderSoft}`, display: 'flex', gap: 14, fontSize: 12, color: KB.textMuted }}>
                  {b.rounds && <span>Rounds: <span style={{ color: KB.text, fontWeight: 600 }}>{b.rounds}</span></span>}
                  {b.rest_sec && <span>Rest: <span style={{ color: KB.text, fontWeight: 600 }}>{b.rest_sec}s</span></span>}
                  {b.duration_sec && <span>Duration: <span style={{ color: KB.accent, fontWeight: 700 }}>{Math.floor(b.duration_sec/60)} min</span></span>}
                </div>
              )}
            </Card>
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 16, background: `linear-gradient(180deg, transparent, ${KB.bg} 30%)` }}>
        <Btn variant="primary" size="lg" full icon="play" onClick={onStart}>Start Workout</Btn>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Post-workout recap — auto-regulation feedback
// ─────────────────────────────────────────────────────────────
function RecapScreen({ onDone }) {
  const [mood, setMood] = React.useState(null);
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
      <ScreenHeader title="Workout complete" subtitle="Pull + Hinge · 47:12" />
      <div style={{ padding: '0 16px 16px', flex: 1 }}>
        {/* Big number — total volume */}
        <Card elevated style={{ padding: 20, marginBottom: 12, textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: KB.textMuted, marginBottom: 8 }}>Total volume</div>
          <div style={{ fontSize: 48, fontWeight: 700, color: KB.primary, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>11,840</div>
          <div style={{ fontSize: 14, color: KB.textMuted, marginTop: 4 }}>lb moved · +6% vs. last week</div>
          <div style={{ marginTop: 14, display: 'flex', gap: 8, justifyContent: 'center' }}>
            <Chip tone="work" size="sm"><I name="check" size={11}/> &nbsp;ALL SETS</Chip>
            <Chip tone="accent" size="sm"><I name="flash" size={11}/> &nbsp;NEW PR · KB RDL</Chip>
          </div>
        </Card>
        {/* Block breakdown */}
        <Sectionlabel>Breakdown</Sectionlabel>
        <Card padded={false} style={{ marginBottom: 12 }}>
          {TODAY_SESSION.blocks.map((b, i) => (
            <div key={b.id} style={{
              display: 'flex', alignItems: 'center', padding: '12px 14px', gap: 10,
              borderTop: i > 0 ? `1px solid ${KB.borderSoft}` : 'none',
            }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, background: KB.surface3, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{b.label}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{b.name}</div>
                <div style={{ fontSize: 12, color: KB.textMuted }}>{b.exercises.length} ex · {b.type}</div>
              </div>
              <I name="check-circle" size={20} color={KB.primary}/>
            </div>
          ))}
        </Card>
        {/* Auto-regulation */}
        <Sectionlabel>How did that feel?</Sectionlabel>
        <Card padded={false} style={{ marginBottom: 12 }}>
          <div style={{ padding: 14, display: 'flex', gap: 8 }}>
            {[
              { id: 'easy',  label: 'Easy',       sub: 'Add 5 lb',   tone: KB.primary },
              { id: 'right', label: 'Just right', sub: 'Hold load',  tone: KB.text },
              { id: 'hard',  label: 'Hard',       sub: '−5 lb',      tone: KB.accent },
              { id: 'fail',  label: 'Failed',     sub: 'Repeat day', tone: KB.danger },
            ].map(o => (
              <button key={o.id} onClick={() => setMood(o.id)} style={{
                flex: 1, padding: '12px 6px',
                background: mood === o.id ? KB.surface2 : 'transparent',
                border: `1px solid ${mood === o.id ? o.tone : KB.border}`, borderRadius: 12,
                cursor: 'pointer', color: KB.text, fontFamily: KB_FONT, textAlign: 'center',
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: mood === o.id ? o.tone : KB.text }}>{o.label}</div>
                <div style={{ fontSize: 10, color: KB.textMuted, marginTop: 3, fontVariantNumeric: 'tabular-nums' }}>{o.sub}</div>
              </button>
            ))}
          </div>
          {mood && (
            <div style={{
              padding: '12px 14px', borderTop: `1px solid ${KB.borderSoft}`,
              fontSize: 12, color: KB.textMuted, display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <I name="wand" size={14} color={KB.accent}/>
              <span>Next {TODAY_SESSION.metadata.title} will auto-adjust loads.</span>
            </div>
          )}
        </Card>
        <Btn variant="primary" size="lg" full icon="check" onClick={onDone}>Save & Finish</Btn>
        <button style={{
          width: '100%', marginTop: 8, height: 40, background: 'transparent', border: 'none',
          color: KB.textMuted, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: KB_FONT,
        }}>Add notes</button>
      </div>
    </div>
  );
}

Object.assign(window, { TodayScreen, SessionPreviewScreen, RecapScreen });
