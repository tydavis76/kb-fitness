// insights.jsx — Analytics + History + Exercise library + Settings

function HistoryScreen() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
      <ScreenHeader title="History" subtitle="Last 30 days" />
      <div style={{ padding: '0 16px 16px' }}>
        {/* Volume sparkline */}
        <Card style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: KB.textMuted }}>Weekly volume</div>
              <div style={{ fontSize: 28, fontWeight: 700, fontVariantNumeric: 'tabular-nums', marginTop: 2 }}>34,560 <span style={{ fontSize: 13, color: KB.textMuted, fontWeight: 500 }}>lb</span></div>
            </div>
            <Chip tone="work" size="sm">+12% WoW</Chip>
          </div>
          <Sparkline data={VOLUME_TREND} width={300} height={56}/>
        </Card>
        {/* Stats grid */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          {[
            { label: 'Sessions', val: '14', sub: 'this month' },
            { label: 'Streak',   val: '9',  sub: 'days' },
            { label: 'PRs',      val: '3',  sub: 'this phase' },
          ].map((s, i) => (
            <Card key={i} style={{ flex: 1, padding: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: KB.textMuted }}>{s.label}</div>
              <div style={{ fontSize: 24, fontWeight: 700, fontVariantNumeric: 'tabular-nums', marginTop: 2 }}>{s.val}</div>
              <div style={{ fontSize: 11, color: KB.textMuted }}>{s.sub}</div>
            </Card>
          ))}
        </div>

        <Sectionlabel>Recent sessions</Sectionlabel>
        <Card padded={false}>
          {HISTORY.map((h, i) => (
            <div key={h.date} style={{
              display: 'flex', alignItems: 'center', padding: '12px 14px', gap: 12,
              borderTop: i > 0 ? `1px solid ${KB.borderSoft}` : 'none',
            }}>
              <div style={{ width: 38, textAlign: 'center' }}>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: KB.textMuted }}>{h.day}</div>
                <div style={{ fontSize: 18, fontWeight: 700, fontVariantNumeric: 'tabular-nums', marginTop: 2 }}>{h.date.slice(8)}</div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{h.title}</div>
                <div style={{ fontSize: 12, color: KB.textMuted, marginTop: 1 }}>
                  {h.duration} min · {h.volume ? `${(h.volume/1000).toFixed(1)}k lb` : `${h.meters} m`}
                </div>
              </div>
              <Chip size="sm" tone={h.note === 'Easy' ? 'work' : h.note === 'Hard' ? 'accent' : 'default'}>{h.note}</Chip>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// Progress / Analytics for a single exercise
function AnalyticsScreen({ onBack }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
      <ScreenHeader title="Kettlebell swing" subtitle="12-week intensity trend" leftIcon="chevron-left" leftAction={onBack}/>
      <div style={{ padding: '0 16px 16px' }}>
        {/* Big chart card */}
        <Card elevated style={{ marginBottom: 12, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: KB.textMuted }}>Top working load</div>
              <div style={{ fontSize: 36, fontWeight: 700, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em', color: KB.primary, marginTop: 2 }}>32 <span style={{ fontSize: 16, color: KB.textMuted, fontWeight: 500 }}>kg</span></div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: KB.textMuted }}>+100% over 12 wk</div>
              <Chip tone="accent" size="sm" style={{ marginTop: 6 }}>NEW PR</Chip>
            </div>
          </div>
          {/* Bar chart */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 120, padding: '0 0 18px', position: 'relative' }}>
            {SWING_TREND.map((v, i) => {
              const h = (v / Math.max(...SWING_TREND)) * 100;
              const isMax = v === Math.max(...SWING_TREND);
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <div style={{
                    width: '100%', height: `${h}%`,
                    background: isMax ? KB.accent : KB.primary,
                    opacity: i === SWING_TREND.length - 1 ? 1 : 0.5 + (i / SWING_TREND.length) * 0.5,
                    borderRadius: '3px 3px 0 0',
                  }}/>
                  <div style={{ fontSize: 9, color: KB.textMuted, fontVariantNumeric: 'tabular-nums' }}>w{i+1}</div>
                </div>
              );
            })}
          </div>
        </Card>
        {/* Volume vs intensity tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 12, padding: 4, background: KB.surface2, borderRadius: 10, border: `1px solid ${KB.border}` }}>
          {['Intensity','Volume','Reps','Sessions'].map((t, i) => (
            <button key={t} style={{
              flex: 1, height: 32, background: i === 0 ? KB.surface3 : 'transparent',
              color: i === 0 ? KB.text : KB.textMuted, border: 'none', borderRadius: 7,
              fontWeight: 600, fontSize: 12, cursor: 'pointer', fontFamily: KB_FONT,
            }}>{t}</button>
          ))}
        </div>
        {/* Recent sets table */}
        <Sectionlabel>Recent sets</Sectionlabel>
        <Card padded={false}>
          {[
            { date: 'May 5', sets: '5×10', load: '32 kg', vol: '1,600' },
            { date: 'May 1', sets: '5×10', load: '28 kg', vol: '1,400' },
            { date: 'Apr 28',sets: '4×12', load: '28 kg', vol: '1,344' },
            { date: 'Apr 24',sets: '4×12', load: '24 kg', vol: '1,152' },
          ].map((r, i) => (
            <div key={i} style={{ display: 'flex', padding: '12px 14px', alignItems: 'center', gap: 10, borderTop: i > 0 ? `1px solid ${KB.borderSoft}` : 'none', fontSize: 13 }}>
              <div style={{ width: 50, color: KB.textMuted, fontSize: 12 }}>{r.date}</div>
              <div style={{ width: 50, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{r.sets}</div>
              <div style={{ flex: 1, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{r.load}</div>
              <div style={{ color: KB.textMuted, fontVariantNumeric: 'tabular-nums' }}>{r.vol} kg</div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// Exercise library
function ExerciseLibraryScreen({ onBack, mode = 'view', onPick }) {
  const [filter, setFilter] = React.useState('all');
  const [detail, setDetail] = React.useState(null);
  const filters = ['all', 'kettlebell', 'dumbbell', 'trx', 'pull-up bar', 'bodyweight', 'band'];
  const list = filter === 'all' ? EXERCISES : EXERCISES.filter(e => e.equipment === filter);
  const isPicker = mode === 'picker';
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <ScreenHeader
        title={isPicker ? 'Pick exercise' : 'Exercises'}
        subtitle={isPicker ? 'Tap to preview, then add' : `${EXERCISES.length} in your library`}
        leftIcon={isPicker ? 'close' : 'chevron-left'} leftAction={onBack}
      />
      {/* Search */}
      <div style={{ padding: '0 16px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: KB.surface, border: `1px solid ${KB.border}`, borderRadius: 12 }}>
          <I name="search" size={16} color={KB.textMuted}/>
          <input placeholder="Search by name, pattern, equipment…" style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none', color: KB.text, fontSize: 14, fontFamily: KB_FONT,
          }}/>
        </div>
      </div>
      {/* Filter chips */}
      <div style={{ padding: '0 16px 12px', display: 'flex', gap: 6, overflow: 'auto', flexShrink: 0 }}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            height: 32, padding: '0 12px', borderRadius: 999,
            background: filter === f ? KB.text : KB.surface2,
            color: filter === f ? KB.bg : KB.textMuted,
            border: `1px solid ${filter === f ? KB.text : KB.border}`,
            cursor: 'pointer', fontWeight: 700, fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase',
            fontFamily: KB_FONT, flexShrink: 0, whiteSpace: 'nowrap',
          }}>{f}</button>
        ))}
      </div>
      {/* List grouped by pattern */}
      <div style={{ flex: 1, overflow: 'auto', padding: '0 16px 16px' }}>
        {['hinge','squat','push','pull','carry','core','cardio','power'].map(pat => {
          const items = list.filter(e => e.pattern === pat);
          if (!items.length) return null;
          return (
            <div key={pat} style={{ marginBottom: 14 }}>
              <Sectionlabel>{pat}</Sectionlabel>
              <Card padded={false}>
                {items.map((e, i) => {
                  const det = getExerciseDetail(e);
                  return (
                    <button key={e.id} onClick={() => setDetail(e)} style={{
                      display: 'flex', alignItems: 'center', padding: '10px 12px', gap: 12, width: '100%',
                      borderTop: i > 0 ? `1px solid ${KB.borderSoft}` : 'none',
                      background: 'transparent', border: 'none', color: KB.text, fontFamily: KB_FONT, textAlign: 'left', cursor: 'pointer',
                    }}>
                      <div style={{ width: 64, height: 48, flexShrink: 0 }}>
                        <VideoCard exercise={e} height={48} compact/>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{e.name}</div>
                        <div style={{ fontSize: 11, color: KB.textMuted, marginTop: 2, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                          {det.category} · {e.primary.join(', ')}
                        </div>
                      </div>
                      {det.youtubeId && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                          <path d="M8 5l11 7-11 7V5z" fill={KB.textMuted}/>
                        </svg>
                      )}
                      <I name="chevron-right" size={16} color={KB.textMuted}/>
                    </button>
                  );
                })}
              </Card>
            </div>
          );
        })}
      </div>
      <ExerciseDetailSheet
        open={!!detail} exercise={detail} onClose={() => setDetail(null)}
        mode={mode}
        onPick={(ex) => { setDetail(null); onPick && onPick(ex); }}
      />
    </div>
  );
}

function LeadInRow() {
  const [leadIn, setLeadInVal] = useLeadIn();
  return (
    <div style={{ padding: '14px 14px', borderTop: `1px solid ${KB.borderSoft}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: KB.surface2, color: KB.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <I name="timer" size={16}/>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Lead-in countdown</div>
          <div style={{ fontSize: 11, color: KB.textMuted, marginTop: 1 }}>Get-ready beats before timed sets</div>
        </div>
        <div style={{ fontSize: 13, color: KB.textMuted, fontVariantNumeric: 'tabular-nums' }}>{leadIn === 0 ? 'Off' : `${leadIn}s`}</div>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {LEAD_OPTS.map(n => (
          <button key={n} onClick={() => setLeadInVal(n)} style={{
            flex: 1, height: 36, borderRadius: 9,
            background: leadIn === n ? KB.text : KB.surface2,
            color: leadIn === n ? KB.bg : KB.textMuted,
            border: `1px solid ${leadIn === n ? KB.text : KB.border}`,
            fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
            fontVariantNumeric: 'tabular-nums',
          }}>{n === 0 ? 'Off' : `${n}s`}</button>
        ))}
      </div>
    </div>
  );
}

// Settings (compact)
function SettingsScreen() {
  const [unit, setUnit] = (typeof useUnit === 'function') ? useUnit() : ['lb', () => {}];
  const otherRows = [
    { label: 'Sound', val: 'On',      icon: 'flame' },
    { label: 'Haptics', val: 'On',    icon: 'flash' },
    { label: 'Theme', val: 'Dark',    icon: 'home' },
    { label: 'Rest defaults', val: '60 / 90 / 120 s', icon: 'timer' },
  ];
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
      <ScreenHeader title="Settings" />
      <div style={{ padding: '0 16px 16px' }}>
        <Card padded={false} style={{ marginBottom: 12 }}>
          {/* Units — interactive segmented */}
          <div style={{ display: 'flex', alignItems: 'center', padding: '14px 14px', gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: KB.surface2, color: KB.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <I name="dumbbell" size={16}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Units</div>
              <div style={{ fontSize: 12, color: KB.textMuted, marginTop: 1 }}>Display loads in {unit === 'lb' ? 'pounds' : 'kilograms'}</div>
            </div>
            <div style={{ display: 'flex', gap: 3, padding: 3, background: KB.surface2, borderRadius: 8, border: `1px solid ${KB.border}` }}>
              {['lb','kg'].map(u => (
                <button key={u} onClick={() => setUnit(u)} style={{
                  height: 28, padding: '0 12px', borderRadius: 6,
                  background: unit === u ? KB.primary : 'transparent',
                  color: unit === u ? KB.bg : KB.textMuted,
                  border: 'none', cursor: 'pointer', fontFamily: KB_FONT,
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                }}>{u}</button>
              ))}
            </div>
          </div>
          {otherRows.map((r) => (
            <div key={r.label} style={{ display: 'flex', alignItems: 'center', padding: '14px 14px', gap: 12, borderTop: `1px solid ${KB.borderSoft}` }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: KB.surface2, color: KB.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <I name={r.icon} size={16}/>
              </div>
              <div style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>{r.label}</div>
              <div style={{ fontSize: 13, color: KB.textMuted }}>{r.val}</div>
              <I name="chevron-right" size={16} color={KB.textMuted}/>
            </div>
          ))}
          <LeadInRow/>
        </Card>
        <div style={{ fontSize: 11, color: KB.textDim, padding: '8px 4px', lineHeight: 1.5 }}>
          Unit changes apply immediately across the app — Today, Active, History, Analytics.
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { HistoryScreen, AnalyticsScreen, ExerciseLibraryScreen, SettingsScreen });
