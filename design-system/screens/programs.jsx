// programs.jsx — Program → Phase → Week → Day browser screens
// Multi-phase structure: phases group repeating week templates

function ProgramLibraryScreen({ onPick }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
      <ScreenHeader title="Programs" subtitle="Pick or build a plan" />
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 16 }}>
        <Card elevated padded={false} onClick={() => onPick?.('hybrid-strength')} style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <Chip tone="accent" size="sm">ACTIVE · WK 6/12</Chip>
            <I name="chevron-right" size={20} color={KB.textMuted}/>
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em', marginBottom: 4 }}>Hybrid Strength</div>
          <div style={{ fontSize: 13, color: KB.textMuted, marginBottom: 14 }}>Kettlebell · Dumbbell · TRX · 4 days/wk</div>
          {/* Phase timeline */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
            {[
              { name: 'Foundation', weeks: 4, done: 4 },
              { name: 'Build',      weeks: 4, done: 2, current: true },
              { name: 'Peak',       weeks: 4, done: 0 },
            ].map((p, i) => {
              const segs = Array.from({ length: p.weeks }, (_, k) => k);
              return (
                <div key={i} style={{ flex: p.weeks, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {segs.map(k => (
                      <div key={k} style={{
                        flex: 1, height: 6, borderRadius: 2,
                        background: k < p.done ? KB.primary : p.current && k === p.done ? KB.accent : KB.border,
                      }}/>
                    ))}
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: p.current ? KB.accent : KB.textMuted }}>{p.name}</div>
                </div>
              );
            })}
          </div>
        </Card>
        <Sectionlabel>Library</Sectionlabel>
        {PROGRAMS.slice(1).map(p => (
          <Card key={p.id} padded={false} style={{ padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: KB.surface2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: KB.primary }}>
                <I name={p.id === 'rower-fortify' ? 'rower' : 'kettlebell'} size={22}/>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: KB.textMuted }}>{p.subtitle} · {p.weeks} wk · {p.days_per_week}/wk</div>
              </div>
              <I name="chevron-right" size={18} color={KB.textMuted}/>
            </div>
          </Card>
        ))}
        <button style={{
          marginTop: 4, height: 52, background: 'transparent', border: `1px dashed ${KB.border}`,
          borderRadius: 14, color: KB.textMuted, fontSize: 14, fontWeight: 600, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: KB_FONT,
        }}>
          <I name="plus" size={18}/> Build a custom program
        </button>
        <Sectionlabel>Archive</Sectionlabel>
        {[
          { name: '5/3/1 Boring But Big', date: 'Jan 8 – Mar 30', sessions: '32 / 36', state: 'completed' },
          { name: 'Easy Strength',         date: 'Nov 12 – Dec 24', sessions: '18 / 24', state: 'ended' },
          { name: 'Simple & Sinister',     date: 'Aug 1 – Sep 18',  sessions: '40 / 42', state: 'completed' },
        ].map(a => (
          <Card key={a.name} padded={false} style={{ padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: KB.surface2, color: KB.textMuted,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}><I name={a.state === 'completed' ? 'check-circle' : 'flag'} size={18}/></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: KB.textMuted }}>{a.name}</div>
                <div style={{ fontSize: 11, color: KB.textDim, marginTop: 2 }}>{a.date} · {a.sessions} sessions</div>
              </div>
              <Chip size="sm" tone={a.state === 'completed' ? 'work' : 'default'}>{a.state.toUpperCase()}</Chip>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Program detail — phase timeline, drill into phase
// ─────────────────────────────────────────────────────────────
function ProgramDetailScreen({ onBack, onPickWeek }) {
  const [menu, setMenu] = React.useState(false);
  const [confirm, setConfirm] = React.useState(null); // 'restart' | 'pause' | 'end' | null
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto', position: 'relative' }}>
      <ScreenHeader title="Hybrid Strength" subtitle="Phase 2 of 3 · Build" leftIcon="chevron-left" leftAction={onBack}
        rightContent={
          <button onClick={() => setMenu(true)} style={{
            width: 36, height: 36, background: 'transparent', border: 'none',
            color: KB.text, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 10,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="5" cy="12" r="1.6" fill="currentColor"/>
              <circle cx="12" cy="12" r="1.6" fill="currentColor"/>
              <circle cx="19" cy="12" r="1.6" fill="currentColor"/>
            </svg>
          </button>
        }
      />
      <div style={{ padding: '0 16px 16px' }}>
        {/* Phase summary card */}
        <Card elevated style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: KB.accent }}>Current phase</div>
              <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>Build</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 28, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>2<span style={{ fontSize: 16, color: KB.textMuted, fontWeight: 500 }}>/4</span></div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: KB.textMuted }}>weeks in</div>
            </div>
          </div>
          <div style={{ fontSize: 13, color: KB.textMuted, lineHeight: 1.5 }}>Progressive load. Same templates as Foundation; add 5–10% load each week.</div>
        </Card>
        {/* All phases — vertical timeline */}
        <Sectionlabel>All phases</Sectionlabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { id: 'p1', name: 'Foundation', weeks: 4, focus: 'Volume + technique', state: 'done' },
            { id: 'p2', name: 'Build',      weeks: 4, focus: 'Progressive load', state: 'current' },
            { id: 'p3', name: 'Peak',       weeks: 4, focus: 'Intensity + density', state: 'upcoming' },
          ].map((p, i, arr) => {
            const dot = p.state === 'done' ? KB.primary : p.state === 'current' ? KB.accent : KB.border;
            return (
              <div key={p.id} style={{ display: 'flex', gap: 14 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 8 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 6, background: dot, border: p.state === 'current' ? `3px solid ${KB.accent}40` : 'none' }}/>
                  {i < arr.length - 1 && <div style={{ width: 2, flex: 1, background: KB.border, marginTop: 4, minHeight: 36 }}/>}
                </div>
                <Card padded={false} style={{ flex: 1, padding: 14, marginBottom: 4, background: p.state === 'current' ? KB.surface2 : KB.surface }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700 }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: KB.textMuted, marginTop: 2 }}>{p.focus}</div>
                    </div>
                    <Chip tone={p.state === 'current' ? 'accent' : p.state === 'done' ? 'work' : 'default'} size="sm">{p.weeks} WK</Chip>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>

        <Sectionlabel right={<span style={{ fontSize: 11, color: KB.textMuted }}>Tap any week</span>}>Week schedule (Build)</Sectionlabel>
        <Card padded={false}>
          {[1,2,3,4].map((w) => (
            <button key={w} onClick={() => onPickWeek?.(w)} style={{
              display: 'flex', alignItems: 'center', width: '100%', gap: 12, padding: '14px 16px',
              background: 'transparent', border: 'none', borderTop: w > 1 ? `1px solid ${KB.borderSoft}` : 'none',
              cursor: 'pointer', color: KB.text, textAlign: 'left', fontFamily: KB_FONT,
            }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: w === 2 ? KB.accentBg : KB.surface2, color: w === 2 ? KB.accent : KB.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>W{w + 4}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>Week {w}{w === 2 ? ' · current' : ''}</div>
                <div style={{ fontSize: 12, color: KB.textMuted }}>4 sessions · {['100%', '105%', '110%', 'deload'][w-1]} intensity</div>
              </div>
              <I name="chevron-right" size={18} color={KB.textMuted}/>
            </button>
          ))}
        </Card>
      </div>
      {menu && <ProgramMenuSheet onClose={() => setMenu(false)} onAction={(a) => { setMenu(false); setConfirm(a); }}/>}
      {confirm && <ProgramConfirmSheet action={confirm} onClose={() => setConfirm(null)}/>}
    </div>
  );
}

function ProgramMenuSheet({ onClose, onAction }) {
  const items = [
    { id: 'restart', icon: 'rotate', label: 'Restart program',  sub: 'Reset to week 1 · keep history' },
    { id: 'skip',    icon: 'skip',   label: 'Skip to week…',    sub: 'For travel or illness gaps' },
    { id: 'pause',   icon: 'pause',  label: 'Pause program',    sub: 'Stop without ending · resume later' },
    { id: 'switch',  icon: 'swap',   label: 'Switch program',   sub: 'End current and pick a new one' },
    { id: 'end',     icon: 'flag',   label: 'End program',      sub: 'Archive this run', danger: true },
  ];
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'flex-end', zIndex: 20,
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: '100%', background: KB.surface, borderRadius: '20px 20px 0 0',
        borderTop: `1px solid ${KB.border}`, padding: '12px 0 28px',
        boxShadow: '0 -8px 24px rgba(0,0,0,0.4)',
      }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: KB.border, margin: '4px auto 14px' }}/>
        <div style={{ padding: '0 14px 4px', fontSize: 11, fontWeight: 700, color: KB.textMuted, letterSpacing: '0.10em', textTransform: 'uppercase' }}>Hybrid Strength</div>
        {items.map((it, i) => (
          <button key={it.id} onClick={() => onAction(it.id)} style={{
            display: 'flex', alignItems: 'center', gap: 12, width: '100%',
            padding: '14px 16px', background: 'transparent', border: 'none',
            borderTop: i > 0 ? `1px solid ${KB.borderSoft}` : 'none',
            cursor: 'pointer', color: it.danger ? KB.danger : KB.text,
            textAlign: 'left', fontFamily: KB_FONT,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: it.danger ? KB.dangerBg : KB.surface2,
              color: it.danger ? KB.danger : KB.textMuted,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><I name={it.icon} size={18}/></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{it.label}</div>
              <div style={{ fontSize: 12, color: KB.textMuted, marginTop: 1 }}>{it.sub}</div>
            </div>
            <I name="chevron-right" size={16} color={KB.textMuted}/>
          </button>
        ))}
      </div>
    </div>
  );
}

function ProgramConfirmSheet({ action, onClose }) {
  const config = {
    restart: {
      title: 'Restart Hybrid Strength?', accent: KB.accent,
      body: 'You\'ll go back to phase 1, week 1. Your history stays — completed sessions remain in your records, but progress resets.',
      cta: 'Restart from week 1', destructive: false,
    },
    skip: {
      title: 'Skip to week…', accent: KB.accent,
      body: 'Pick a week to jump to. Sessions you skip won\'t be logged.',
      cta: 'Confirm skip', destructive: false,
      picker: true,
    },
    pause: {
      title: 'Pause program?', accent: KB.rest,
      body: 'Today\'s screen will show no active session. You can resume from this exact day later.',
      cta: 'Pause program', destructive: false,
    },
    switch: {
      title: 'End and switch program?', accent: KB.danger,
      body: 'This run gets archived. You\'ll pick a new program next.',
      cta: 'End and pick new', destructive: true,
    },
    end: {
      title: 'End Hybrid Strength?', accent: KB.danger,
      body: '6 of 12 weeks completed. We\'ll archive your results and show a summary.',
      cta: 'End program', destructive: true,
      stats: [
        { label: 'Sessions', val: '23' },
        { label: 'Volume',   val: '184k lb' },
        { label: 'PRs',      val: '3' },
      ],
    },
  };
  const c = config[action];
  if (!c) return null;
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'flex-end', zIndex: 30,
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: '100%', background: KB.surface, borderRadius: '20px 20px 0 0',
        borderTop: `1px solid ${KB.border}`, padding: '20px 18px 24px',
      }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: KB.border, margin: '0 auto 18px' }}/>
        <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-0.01em', marginBottom: 10 }}>{c.title}</div>
        <div style={{ fontSize: 13, color: KB.textMuted, lineHeight: 1.5, marginBottom: 16 }}>{c.body}</div>
        {c.stats && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {c.stats.map(s => (
              <div key={s.label} style={{ flex: 1, padding: 12, background: KB.surface2, borderRadius: 10, border: `1px solid ${KB.border}` }}>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: KB.textMuted }}>{s.label}</div>
                <div style={{ fontSize: 18, fontWeight: 700, fontVariantNumeric: 'tabular-nums', marginTop: 2 }}>{s.val}</div>
              </div>
            ))}
          </div>
        )}
        {c.picker && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 16 }}>
            {[1,2,3,4,5,6,7,8,9,10,11,12].map(w => (
              <button key={w} style={{
                height: 40, borderRadius: 9,
                background: w === 7 ? KB.accent : KB.surface2,
                color: w === 7 ? KB.bg : KB.text,
                border: `1px solid ${w === 7 ? KB.accent : KB.border}`,
                fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: KB_FONT,
                fontVariantNumeric: 'tabular-nums',
              }}>W{w}</button>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn variant="secondary" size="lg" full onClick={onClose}>Cancel</Btn>
          <Btn variant="primary" size="lg" full accent={c.accent} onClick={onClose}>{c.cta}</Btn>
        </div>
      </div>
    </div>
  );
}

// Empty-state today screen — shown when no program is active
function ProgramEmptyToday({ onBrowse }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title="Today" subtitle="No active program" />
      <div style={{ flex: 1, padding: '0 16px 16px', display: 'flex', flexDirection: 'column' }}>
        <Card style={{ padding: 20, marginBottom: 14, textAlign: 'center' }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16, margin: '4px auto 14px',
            background: KB.surface2, color: KB.textMuted,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><I name="calendar" size={28}/></div>
          <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em', marginBottom: 6 }}>Pick a program to get started</div>
          <div style={{ fontSize: 13, color: KB.textMuted, lineHeight: 1.5, marginBottom: 16 }}>
            Programs schedule your week, progress your loads, and track phases automatically. Or run a one-off session.
          </div>
          <Btn variant="primary" size="lg" full icon="arrow-right" onClick={onBrowse}>Browse programs</Btn>
        </Card>
        <Sectionlabel>Or quick-start</Sectionlabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            { label: 'Empty session', sub: 'Build as you go', icon: 'plus-circle' },
            { label: 'Last session',  sub: 'Repeat May 5',    icon: 'rotate' },
            { label: 'Quick row',     sub: '20 min cardio',   icon: 'rower' },
            { label: 'Mobility',      sub: '15 min flow',     icon: 'flame' },
          ].map(q => (
            <Card key={q.label} onClick={() => {}} style={{ padding: 14 }}>
              <I name={q.icon} size={20} color={KB.primary}/>
              <div style={{ fontSize: 14, fontWeight: 600, marginTop: 8 }}>{q.label}</div>
              <div style={{ fontSize: 11, color: KB.textMuted, marginTop: 2 }}>{q.sub}</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Week detail — 7-day strip
// ─────────────────────────────────────────────────────────────
function WeekDetailScreen({ onBack, onPickDay }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
      <ScreenHeader title="Week 6" subtitle="Phase 2 · Build · 105%" leftIcon="chevron-left" leftAction={onBack} />
      <div style={{ padding: '0 16px 16px' }}>
        {/* 7-day grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {WEEK_TEMPLATE.map((d, i) => {
            const isToday = d.status === 'today';
            const isDone = d.status === 'done';
            const isRest = d.status === 'rest';
            return (
              <button key={i} onClick={() => !isRest && onPickDay?.(i)} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: 14,
                background: isToday ? KB.accentBg : KB.surface,
                border: `1px solid ${isToday ? KB.accent : KB.border}`,
                borderRadius: 14, cursor: isRest ? 'default' : 'pointer',
                textAlign: 'left', color: KB.text, fontFamily: KB_FONT,
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: isToday ? KB.accent : isDone ? KB.workBg : KB.surface2,
                  color: isToday ? KB.bg : isDone ? KB.primary : KB.textMuted,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 13, letterSpacing: '0.04em',
                }}>{d.day}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: isRest ? KB.textMuted : KB.text }}>{d.title}</div>
                    {isToday && <Chip tone="accent" size="sm">TODAY</Chip>}
                  </div>
                  {!isRest && <div style={{ fontSize: 12, color: KB.textMuted, marginTop: 2 }}>{d.focus} · {d.duration} min · {d.blocks} blocks</div>}
                </div>
                {isDone && <I name="check-circle" size={22} color={KB.primary}/>}
                {isToday && <I name="play" size={22} color={KB.accent}/>}
                {!isToday && !isDone && !isRest && <I name="chevron-right" size={20} color={KB.textMuted}/>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ProgramLibraryScreen, ProgramDetailScreen, WeekDetailScreen, ProgramMenuSheet, ProgramConfirmSheet, ProgramEmptyToday });
