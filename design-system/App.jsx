// App.jsx — Main interactive prototype + design canvas overview
// Wires every screen together and exposes tweaks panel

const { useState, useEffect } = React;

// ─────────────────────────────────────────────────────────────
// Phone app: wired-together stateful prototype
// ─────────────────────────────────────────────────────────────
function PhoneApp({ initial = 'today', accent = KB.primary, onScreenChange }) {
  const [screen, setScreen] = useState(initial);
  const [activeBlock, setActiveBlock] = useState('superset');
  const [loadSheet, setLoadSheet] = useState(null);

  useEffect(() => { setScreen(initial); }, [initial]);
  useEffect(() => { onScreenChange?.(screen); }, [screen]);

  const tabFor = (s) => {
    if (['today','preview','active','recap'].includes(s)) return 'today';
    if (['programs','program','week','authoring'].includes(s)) return 'programs';
    if (['history','analytics','library'].includes(s)) return 'history';
    if (s === 'settings') return 'settings';
    return 'today';
  };
  const navTo = (id) => {
    if (id === 'today') setScreen('today');
    if (id === 'programs') setScreen('programs');
    if (id === 'history') setScreen('history');
    if (id === 'settings') setScreen('settings');
  };

  const showNav = !['active','preview','authoring','analytics','library'].includes(screen);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
      {screen === 'today' && (
        <TodayScreen
          onStart={() => { setActiveBlock('superset'); setScreen('active'); }}
          onOpenPreview={() => setScreen('preview')}
        />
      )}
      {screen === 'preview' && (
        <SessionPreviewScreen onBack={() => setScreen('today')} onStart={() => { setActiveBlock('superset'); setScreen('active'); }}/>
      )}
      {screen === 'active' && (
        <>
          {activeBlock === 'straight' && <ActiveStraight accent={accent} onExit={() => setScreen('today')}/>}
          {activeBlock === 'superset' && <ActiveSuperset accent={accent} onExit={() => setScreen('today')}/>}
          {activeBlock === 'circuit'  && <ActiveCircuit  accent={accent} onExit={() => setScreen('today')}/>}
          {activeBlock === 'amrap'    && <ActiveAmrap    accent={accent} onExit={() => setScreen('today')}/>}
          {activeBlock === 'ladder'   && <ActiveLadder   accent={accent} onExit={() => setScreen('today')}/>}
          {activeBlock === 'interval' && <ActiveInterval accent={accent} onExit={() => setScreen('today')}/>}
          {activeBlock === 'carry'    && <ActiveCarry    accent={accent} onExit={() => setScreen('today')}/>}
          {activeBlock === 'tempo'    && <ActiveTempo    accent={accent} onExit={() => setScreen('today')}/>}
          {/* Quick block switcher (in-prototype affordance) */}
          <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 20, display: 'flex', gap: 4 }}>
            <select value={activeBlock} onChange={(e) => setActiveBlock(e.target.value)} style={{
              background: KB.surface3, color: KB.text, border: `1px solid ${KB.border}`,
              padding: '4px 8px', borderRadius: 8, fontSize: 11, fontWeight: 600,
              fontFamily: KB_FONT, letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>
              <option value="straight">Straight</option>
              <option value="superset">Superset</option>
              <option value="circuit">Circuit</option>
              <option value="amrap">AMRAP</option>
              <option value="ladder">Ladder</option>
              <option value="interval">Interval</option>
              <option value="carry">Carry</option>
              <option value="tempo">Tempo (MSTF)</option>
            </select>
          </div>
          <div style={{ position: 'absolute', bottom: 88, right: 12, zIndex: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {['kettlebell','dumbbell','band','damper','bodyweight','swap'].map(k => (
              <button key={k} onClick={() => setLoadSheet(k)} title={`Load entry: ${k}`} style={{
                width: 38, height: 38, borderRadius: 12, background: KB.surface3, border: `1px solid ${KB.border}`,
                color: KB.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <I name={
                  k === 'kettlebell' ? 'kettlebell' : k === 'dumbbell' ? 'dumbbell' :
                  k === 'band' ? 'band' : k === 'damper' ? 'rower' :
                  k === 'bodyweight' ? 'bodyweight' : 'swap'
                } size={18}/>
              </button>
            ))}
          </div>
        </>
      )}
      {screen === 'recap'    && <RecapScreen onDone={() => setScreen('today')}/>}
      {screen === 'programs' && <ProgramLibraryScreen onPick={() => setScreen('program')}/>}
      {screen === 'program'  && <ProgramDetailScreen onBack={() => setScreen('programs')} onPickWeek={() => setScreen('week')}/>}
      {screen === 'week'     && <WeekDetailScreen onBack={() => setScreen('program')} onPickDay={() => setScreen('today')}/>}
      {screen === 'authoring'&& <AuthoringScreen onBack={() => setScreen('program')}/>}
      {screen === 'history'  && <HistoryScreen/>}
      {screen === 'analytics'&& <AnalyticsScreen onBack={() => setScreen('history')}/>}
      {screen === 'library'  && <ExerciseLibraryScreen onBack={() => setScreen('settings')}/>}
      {screen === 'settings' && <SettingsScreen/>}

      {/* Bottom sheets */}
      {loadSheet === 'kettlebell' && <LoadEntryKettlebell open onClose={() => setLoadSheet(null)} onPick={() => setLoadSheet(null)}/>}
      {loadSheet === 'dumbbell'   && <LoadEntryDumbbell   open onClose={() => setLoadSheet(null)} onPick={() => setLoadSheet(null)}/>}
      {loadSheet === 'band'       && <LoadEntryBand       open onClose={() => setLoadSheet(null)} onPick={() => setLoadSheet(null)}/>}
      {loadSheet === 'damper'     && <LoadEntryDamper     open onClose={() => setLoadSheet(null)} onPick={() => setLoadSheet(null)}/>}
      {loadSheet === 'bodyweight' && <LoadEntryBodyweight open onClose={() => setLoadSheet(null)} onPick={() => setLoadSheet(null)}/>}
      {loadSheet === 'swap'       && <ExercisePickerSheet open onClose={() => setLoadSheet(null)}/>}

      {showNav && <BottomNav active={tabFor(screen)} onNavigate={navTo} accent={accent}/>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Tweaks defaults + protocol
// ─────────────────────────────────────────────────────────────
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#7BD88F",
  "scheme": "dark",
  "density": "comfortable",
  "blockType": "superset",
  "showFrames": true
}/*EDITMODE-END*/;

function PrototypeView() {
  const t = useTweaks(TWEAK_DEFAULTS);
  const accent = t.accent;
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection title="Look">
        <TweakColor label="Accent (success)" value={t.accent} onChange={v => t.set('accent', v)} options={['#7BD88F', '#34D399', '#F59E0B', '#60A5FA', '#F87171']}/>
        <TweakRadio label="Scheme" value={t.scheme} onChange={v => t.set('scheme', v)} options={['dark', 'light']}/>
        <TweakRadio label="Density" value={t.density} onChange={v => t.set('density', v)} options={['compact', 'comfortable']}/>
      </TweakSection>
      <TweakSection title="Active workout">
        <TweakSelect label="Block type" value={t.blockType} onChange={v => t.set('blockType', v)} options={[
          { value: 'straight', label: 'Straight sets' },
          { value: 'superset', label: 'Superset' },
          { value: 'circuit',  label: 'Circuit' },
          { value: 'amrap',    label: 'AMRAP' },
          { value: 'ladder',   label: 'Ladder' },
          { value: 'interval', label: 'Interval' },
          { value: 'carry',    label: 'Carry / Hold' },
          { value: 'tempo',    label: 'MSTF Tempo' },
        ]}/>
      </TweakSection>
    </TweaksPanel>
  );
}

// ─────────────────────────────────────────────────────────────
// Design canvas: every screen, side by side
// ─────────────────────────────────────────────────────────────
function FrameScreen({ screen, label, accent = KB.primary, blockType }) {
  const wrap = (children) => (
    <PhoneShell>{children}</PhoneShell>
  );
  // Render an isolated screen in a phone shell
  if (screen === 'today')      return wrap(<><TodayScreen/><BottomNav active="today" accent={accent}/></>);
  if (screen === 'preview')    return wrap(<SessionPreviewScreen/>);
  if (screen === 'active')     {
    const Comp = {
      straight: ActiveStraight, superset: ActiveSuperset, circuit: ActiveCircuit,
      amrap: ActiveAmrap, ladder: ActiveLadder, interval: ActiveInterval,
      carry: ActiveCarry, tempo: ActiveTempo,
    }[blockType || 'superset'];
    return wrap(<Comp accent={accent}/>);
  }
  if (screen === 'recap')      return wrap(<><RecapScreen/><BottomNav active="today" accent={accent}/></>);
  if (screen === 'programs')   return wrap(<><ProgramLibraryScreen/><BottomNav active="programs" accent={accent}/></>);
  if (screen === 'program')    return wrap(<><ProgramDetailScreen/><BottomNav active="programs" accent={accent}/></>);
  if (screen === 'week')       return wrap(<><WeekDetailScreen/><BottomNav active="programs" accent={accent}/></>);
  if (screen === 'authoring')  return wrap(<AuthoringScreen/>);
  if (screen === 'history')    return wrap(<><HistoryScreen/><BottomNav active="history" accent={accent}/></>);
  if (screen === 'analytics')  return wrap(<AnalyticsScreen/>);
  if (screen === 'library')    return wrap(<ExerciseLibraryScreen/>);
  if (screen === 'settings')   return wrap(<><SettingsScreen/><BottomNav active="settings" accent={accent}/></>);
  // Load sheets
  if (screen.startsWith('load-')) {
    const which = screen.replace('load-', '');
    const Sheet = {
      kettlebell: LoadEntryKettlebell, dumbbell: LoadEntryDumbbell,
      band: LoadEntryBand, damper: LoadEntryDamper, bodyweight: LoadEntryBodyweight,
      swap: ExercisePickerSheet,
    }[which];
    return wrap(
      <div style={{ flex: 1, position: 'relative' }}>
        <div style={{ padding: 16, opacity: 0.4 }}>
          <div style={{ fontSize: 24, fontWeight: 700 }}>Pull-up</div>
          <div style={{ fontSize: 13, color: KB.textMuted, marginTop: 4 }}>Set 3 of 5</div>
        </div>
        <Sheet open={true} onClose={() => {}}/>
      </div>
    );
  }
  return wrap(<div style={{ padding: 24, color: KB.textMuted }}>{label}</div>);
}

function CanvasView({ accent = KB.primary }) {
  return (
    <DesignCanvas
      title="K&B — Workout app"
      subtitle="Hi-fi prototype · One screen per workflow · Open Prototype tab to interact"
      bg="#0B0D11"
    >
      <DCSection id="sec-flow" title="Daily flow" subtitle="Today → Preview → Active → Recap">
        <DCArtboard id="ab-today"   label="Today"            width={390} height={844}><FrameScreen screen="today" accent={accent}/></DCArtboard>
        <DCArtboard id="ab-preview" label="Session preview"  width={390} height={844}><FrameScreen screen="preview" accent={accent}/></DCArtboard>
        <DCArtboard id="ab-active"  label="Active · Superset"width={390} height={844}><FrameScreen screen="active" blockType="superset" accent={accent}/></DCArtboard>
        <DCArtboard id="ab-recap"   label="Recap + auto-reg" width={390} height={844}><FrameScreen screen="recap" accent={accent}/></DCArtboard>
      </DCSection>

      <DCSection id="sec-blocks" title="Block-type screens" subtitle="One execution UI per block type — same skeleton, different mechanics">
        <DCArtboard id="ab-straight" label="Straight sets"   width={390} height={844}><FrameScreen screen="active" blockType="straight" accent={accent}/></DCArtboard>
        <DCArtboard id="ab-circuit"  label="Circuit · 3+ stations" width={390} height={844}><FrameScreen screen="active" blockType="circuit" accent={accent}/></DCArtboard>
        <DCArtboard id="ab-amrap"    label="AMRAP · timer + rounds" width={390} height={844}><FrameScreen screen="active" blockType="amrap" accent={accent}/></DCArtboard>
        <DCArtboard id="ab-ladder"   label="Ladder · ascending load" width={390} height={844}><FrameScreen screen="active" blockType="ladder" accent={accent}/></DCArtboard>
        <DCArtboard id="ab-interval" label="Interval · work/rest"   width={390} height={844}><FrameScreen screen="active" blockType="interval" accent={accent}/></DCArtboard>
        <DCArtboard id="ab-carry"    label="Carry · distance + load" width={390} height={844}><FrameScreen screen="active" blockType="carry" accent={accent}/></DCArtboard>
        <DCArtboard id="ab-tempo"    label="MSTF Tempo · 4-phase" width={390} height={844}><FrameScreen screen="active" blockType="tempo" accent={accent}/></DCArtboard>
      </DCSection>

      <DCSection id="sec-loads" title="Load entry — one sheet per equipment" subtitle="Kettlebells (discrete), DBs (numeric), bands (color), damper (1–10), bodyweight ± assistance">
        <DCArtboard id="ab-load-kb"  label="Kettlebell sizes"  width={390} height={844}><FrameScreen screen="load-kettlebell" accent={accent}/></DCArtboard>
        <DCArtboard id="ab-load-db"  label="Dumbbell stepper"  width={390} height={844}><FrameScreen screen="load-dumbbell" accent={accent}/></DCArtboard>
        <DCArtboard id="ab-load-band"label="Band color"        width={390} height={844}><FrameScreen screen="load-band" accent={accent}/></DCArtboard>
        <DCArtboard id="ab-load-damp"label="Damper"            width={390} height={844}><FrameScreen screen="load-damper" accent={accent}/></DCArtboard>
        <DCArtboard id="ab-load-bw"  label="Bodyweight ± assist" width={390} height={844}><FrameScreen screen="load-bodyweight" accent={accent}/></DCArtboard>
        <DCArtboard id="ab-load-swap" label="Swap exercise"    width={390} height={844}><FrameScreen screen="load-swap" accent={accent}/></DCArtboard>
      </DCSection>

      <DCSection id="sec-program" title="Program browser & authoring" subtitle="Library → Program → Phase → Week → Day, plus the programmer view">
        <DCArtboard id="ab-programs" label="Program library"  width={390} height={844}><FrameScreen screen="programs" accent={accent}/></DCArtboard>
        <DCArtboard id="ab-program"  label="Phase timeline"   width={390} height={844}><FrameScreen screen="program" accent={accent}/></DCArtboard>
        <DCArtboard id="ab-week"     label="Week strip"       width={390} height={844}><FrameScreen screen="week" accent={accent}/></DCArtboard>
        <DCArtboard id="ab-author"   label="Authoring"        width={390} height={844}><FrameScreen screen="authoring" accent={accent}/></DCArtboard>
      </DCSection>

      <DCSection id="sec-data" title="Progress, history & library" subtitle="Volume, intensity, exercise catalog">
        <DCArtboard id="ab-history"  label="History"          width={390} height={844}><FrameScreen screen="history" accent={accent}/></DCArtboard>
        <DCArtboard id="ab-analytics"label="Analytics · KB swing" width={390} height={844}><FrameScreen screen="analytics" accent={accent}/></DCArtboard>
        <DCArtboard id="ab-library"  label="Exercise library" width={390} height={844}><FrameScreen screen="library" accent={accent}/></DCArtboard>
        <DCArtboard id="ab-settings" label="Settings"         width={390} height={844}><FrameScreen screen="settings" accent={accent}/></DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

// ─────────────────────────────────────────────────────────────
// Top-level App: tab between Canvas overview and Prototype
// ─────────────────────────────────────────────────────────────
function App() {
  const [view, setView] = useState('canvas'); // canvas | proto
  const [protoStart, setProtoStart] = useState('today');
  const t = useTweaks(TWEAK_DEFAULTS);
  const accent = t.accent;

  // Map blockType tweak into prototype start state
  const protoInitial = view === 'proto' ? protoStart : 'today';

  return (
    <div style={{
      minHeight: '100vh', background: '#0B0D11', color: KB.text,
      fontFamily: KB_FONT, display: 'flex', flexDirection: 'column',
    }}>
      {/* Top toolbar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 18px', background: 'rgba(11,13,17,0.85)',
        backdropFilter: 'blur(12px)', borderBottom: `1px solid ${KB.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0F1115' }}>
            <I name="kettlebell" size={18}/>
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em' }}>K&B Fitness</div>
          <Chip size="sm" tone="ghost" style={{ marginLeft: 4 }}>HI-FI v1</Chip>
        </div>
        <div style={{ flex: 1 }}/>
        <div style={{ display: 'flex', gap: 4, padding: 4, background: KB.surface, border: `1px solid ${KB.border}`, borderRadius: 12 }}>
          {[
            { id: 'canvas', label: 'Canvas overview', icon: 'list' },
            { id: 'proto',  label: 'Prototype',       icon: 'play' },
          ].map(o => (
            <button key={o.id} onClick={() => setView(o.id)} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              height: 32, padding: '0 12px', borderRadius: 8,
              background: view === o.id ? KB.surface3 : 'transparent',
              color: view === o.id ? KB.text : KB.textMuted,
              border: 'none', cursor: 'pointer', fontFamily: KB_FONT,
              fontWeight: 600, fontSize: 12, letterSpacing: '0.04em', textTransform: 'uppercase',
            }}>
              <I name={o.icon} size={14}/>{o.label}
            </button>
          ))}
        </div>
      </div>

      {/* View body */}
      {view === 'canvas' ? (
        <CanvasView accent={accent}/>
      ) : (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 18px 40px', gap: 20 }}>
          {/* Quick screen jumper */}
          <div style={{ width: 200, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: KB.textMuted, letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: 4 }}>Jump to</div>
            {[
              { id: 'today',     label: 'Today' },
              { id: 'preview',   label: 'Session preview' },
              { id: 'active',    label: 'Active workout' },
              { id: 'recap',     label: 'Post-workout recap' },
              { id: 'programs',  label: 'Programs' },
              { id: 'program',   label: 'Program detail' },
              { id: 'week',      label: 'Week' },
              { id: 'authoring', label: 'Authoring' },
              { id: 'history',   label: 'History' },
              { id: 'analytics', label: 'Analytics' },
              { id: 'library',   label: 'Exercise library' },
              { id: 'settings',  label: 'Settings' },
            ].map(s => (
              <button key={s.id} onClick={() => setProtoStart(s.id)} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 10px', borderRadius: 8,
                background: protoStart === s.id ? KB.surface2 : 'transparent',
                color: protoStart === s.id ? KB.text : KB.textMuted,
                border: `1px solid ${protoStart === s.id ? KB.border : 'transparent'}`,
                cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: KB_FONT, textAlign: 'left',
              }}>
                {s.label}
                {protoStart === s.id && <I name="chevron-right" size={14}/>}
              </button>
            ))}
          </div>
          <PhoneShell key={protoInitial}>
            <PhoneApp initial={protoInitial} accent={accent}/>
          </PhoneShell>
          <div style={{ width: 200, fontSize: 12, color: KB.textMuted, lineHeight: 1.6 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: KB.textMuted, letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: 8 }}>Try this</div>
            <ol style={{ paddingLeft: 16, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li>Tap <b style={{ color: KB.text }}>Start Workout</b> on Today.</li>
              <li>In the active screen, use the <b style={{ color: KB.text }}>top-right dropdown</b> to swap block types.</li>
              <li>Use the <b style={{ color: KB.text }}>side rail</b> to open load sheets — kettlebell, band, damper, etc.</li>
              <li>Toggle <b style={{ color: KB.text }}>Tweaks</b> in the toolbar to change accent + scheme.</li>
            </ol>
          </div>
        </div>
      )}

      <PrototypeView/>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
