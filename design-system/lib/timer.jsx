// timer.jsx — Countdown timer hook + circular display, with configurable lead-in.

const LEAD_OPTS = [0, 3, 5, 10];
const LEAD_KEY = 'kb.leadIn';

function useLeadIn() {
  const [val, setVal] = React.useState(() => {
    const raw = (typeof localStorage !== 'undefined') && localStorage.getItem(LEAD_KEY);
    const n = parseInt(raw, 10);
    return LEAD_OPTS.includes(n) ? n : 5;
  });
  const set = (n) => {
    setVal(n);
    if (typeof localStorage !== 'undefined') localStorage.setItem(LEAD_KEY, String(n));
  };
  return [val, set];
}

// useCountdown: returns { phase, remaining, leadCount, total, isRunning, start, pause, reset }
// phase: 'idle' | 'lead' | 'run' | 'done'
function useCountdown({ duration, leadIn = 5, autoStart = false, onComplete } = {}) {
  const [phase, setPhase] = React.useState(autoStart ? (leadIn > 0 ? 'lead' : 'run') : 'idle');
  const [remaining, setRemaining] = React.useState(duration);
  const [leadCount, setLeadCount] = React.useState(leadIn);

  React.useEffect(() => {
    if (phase !== 'lead' && phase !== 'run') return;
    const tick = () => {
      if (phase === 'lead') {
        setLeadCount(c => {
          if (c <= 1) { setPhase('run'); return 0; }
          return c - 1;
        });
      } else {
        setRemaining(r => {
          if (r <= 1) {
            setPhase('done');
            if (onComplete) onComplete();
            return 0;
          }
          return r - 1;
        });
      }
    };
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [phase, onComplete]);

  const start = () => {
    if (phase === 'idle' || phase === 'done') {
      setRemaining(duration);
      setLeadCount(leadIn);
      setPhase(leadIn > 0 ? 'lead' : 'run');
    } else if (phase === 'paused') {
      setPhase('run');
    }
  };
  const pause = () => phase === 'run' && setPhase('paused');
  const reset = () => { setPhase('idle'); setRemaining(duration); setLeadCount(leadIn); };

  return { phase, remaining, leadCount, total: duration, isRunning: phase === 'run' || phase === 'lead', start, pause, reset };
}

// CircularTimer — visual ring + lead-in overlay
function CircularTimer({ remaining, total, leadCount, phase, size = 220, accent }) {
  const ring = accent || KB.primary;
  const r = size / 2 - 14;
  const c = 2 * Math.PI * r;
  const pct = phase === 'run' || phase === 'paused' || phase === 'done'
    ? remaining / total
    : 1;
  const dash = c * pct;
  const mm = Math.floor(remaining / 60).toString().padStart(2, '0');
  const ss = (remaining % 60).toString().padStart(2, '0');

  const isLead = phase === 'lead';

  return (
    <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={KB.surface3} strokeWidth="8"/>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={isLead ? KB.accent : ring} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          style={{ transition: 'stroke-dasharray 0.5s linear' }}/>
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        {isLead ? (
          <>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: KB.accent }}>Get ready</div>
            <div style={{ fontSize: 96, fontWeight: 800, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.04em', lineHeight: 1, marginTop: 4, color: KB.accent }}>
              {leadCount}
            </div>
          </>
        ) : phase === 'done' ? (
          <>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: KB.workBorder }}>Done</div>
            <div style={{ fontSize: 56, fontWeight: 700, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.04em', color: KB.workBorder, marginTop: 4 }}>00:00</div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: phase === 'paused' ? KB.textMuted : KB.accent }}>
              {phase === 'paused' ? 'Paused' : phase === 'idle' ? 'Ready' : 'Remaining'}
            </div>
            <div style={{ fontSize: 56, fontWeight: 700, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.04em', lineHeight: 1, marginTop: 4 }}>
              {mm}:{ss}
            </div>
            <div style={{ fontSize: 12, color: KB.textMuted, marginTop: 6 }}>
              of {Math.floor(total / 60).toString().padStart(2,'0')}:{(total % 60).toString().padStart(2,'0')}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Inline tap-to-start set timer (smaller, for in-row plank/hold sets)
function SetTimerButton({ duration, leadIn, accent, onComplete }) {
  const t = useCountdown({ duration, leadIn, onComplete });
  const isActive = t.phase !== 'idle' && t.phase !== 'done';
  const display = t.phase === 'lead' ? t.leadCount
    : `${Math.floor(t.remaining/60).toString().padStart(2,'0')}:${(t.remaining%60).toString().padStart(2,'0')}`;
  return (
    <button onClick={() => isActive ? t.pause() : t.start()} style={{
      display: 'flex', alignItems: 'center', gap: 8,
      height: 36, padding: '0 14px', borderRadius: 10,
      background: t.phase === 'lead' ? KB.workBg : t.phase === 'run' ? (accent || KB.primary) : KB.surface,
      color: t.phase === 'run' ? KB.bg : t.phase === 'lead' ? KB.accent : KB.text,
      border: `1px solid ${t.phase === 'lead' ? KB.accent : t.phase === 'run' ? (accent || KB.primary) : KB.border}`,
      fontFamily: KB_FONT, fontWeight: 700, fontSize: 13, cursor: 'pointer',
      fontVariantNumeric: 'tabular-nums',
    }}>
      <I name={t.phase === 'run' ? 'pause' : 'play'} size={14} color={t.phase === 'run' ? KB.bg : t.phase === 'lead' ? KB.accent : KB.text}/>
      {t.phase === 'idle' ? `${duration}s` : display}
    </button>
  );
}

Object.assign(window, { useLeadIn, useCountdown, CircularTimer, SetTimerButton, LEAD_OPTS });
