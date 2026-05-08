// components.jsx — Shared K&B Fitness UI primitives
// Phone shell, status bar, headers, nav, cards, chips, buttons, icons, sparkline

const KB_FONT = "Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif";
const KB_MONO = "'SF Mono', 'JetBrains Mono', ui-monospace, monospace";

// Tokens (re-exported as JS for easy spreading)
const KB = {
  bg: '#0F1115',
  surface: '#171A21',
  surface2: '#1E222B',
  surface3: '#252A35',
  border: '#2A313D',
  borderSoft: '#222833',
  text: '#F3F5F7',
  textMuted: '#A6B0BF',
  textDim: '#6E7785',
  primary: '#7BD88F',
  primaryActive: '#63C978',
  accent: '#F59E0B',
  danger: '#F87171',
  rest: '#60A5FA',
  work: '#7BD88F',
  // alpha
  workBg: 'rgba(123,216,143,0.10)',
  restBg: 'rgba(96,165,250,0.10)',
  accentBg: 'rgba(245,158,11,0.10)',
  dangerBg: 'rgba(248,113,113,0.10)',
};

// ─────────────────────────────────────────────────────────────
// Phone shell — 390 × 844, rounded, with iOS status & home bar
// ─────────────────────────────────────────────────────────────
function PhoneShell({ children, statusTime = '9:41', statusDark = false, scrollKey, fill }) {
  return (
    <div style={{
      width: 390, height: 844,
      background: fill || KB.bg,
      borderRadius: 44,
      border: '1px solid #2A313D',
      boxShadow: '0 30px 60px rgba(0,0,0,0.4), 0 0 0 8px #1a1d24',
      overflow: 'hidden',
      position: 'relative',
      display: 'flex', flexDirection: 'column',
      fontFamily: KB_FONT, color: KB.text,
      isolation: 'isolate',
    }}>
      <KBStatusBar time={statusTime} dark={statusDark} />
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
      <KBHomeBar />
    </div>
  );
}

function KBStatusBar({ time = '9:41', dark = false }) {
  const c = dark ? '#0F1115' : '#F3F5F7';
  return (
    <div style={{
      height: 54, padding: '0 32px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      flexShrink: 0, position: 'relative', zIndex: 5,
    }}>
      <div style={{ fontSize: 15, fontWeight: 600, color: c, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em' }}>{time}</div>
      <div style={{ position: 'absolute', left: '50%', top: 8, transform: 'translateX(-50%)', width: 120, height: 32, background: '#000', borderRadius: 20 }}/>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <svg width="17" height="11" viewBox="0 0 17 11"><rect x="0" y="6" width="3" height="5" rx="0.7" fill={c}/><rect x="4.5" y="4" width="3" height="7" rx="0.7" fill={c}/><rect x="9" y="2" width="3" height="9" rx="0.7" fill={c}/><rect x="13.5" y="0" width="3" height="11" rx="0.7" fill={c}/></svg>
        <svg width="16" height="11" viewBox="0 0 17 12"><path d="M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2Z" fill={c}/><path d="M8.5 6.8C9.9 6.8 11.1 7.3 12 8.2L13.1 7.1C11.8 5.9 10.2 5.1 8.5 5.1C6.8 5.1 5.2 5.9 3.9 7.1L5 8.2C5.9 7.3 7.1 6.8 8.5 6.8Z" fill={c}/><circle cx="8.5" cy="10.5" r="1.5" fill={c}/></svg>
        <svg width="25" height="11" viewBox="0 0 27 13"><rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke={c} strokeOpacity="0.4" fill="none"/><rect x="2" y="2" width="18" height="9" rx="2" fill={c}/><path d="M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z" fill={c} fillOpacity="0.4"/></svg>
      </div>
    </div>
  );
}

function KBHomeBar() {
  return (
    <div style={{ height: 28, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', paddingBottom: 8, flexShrink: 0 }}>
      <div style={{ width: 134, height: 5, background: '#F3F5F7', borderRadius: 3 }}/>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Icons — minimal stroke, drawn inline so we don't depend on Lucide
// ─────────────────────────────────────────────────────────────
function I({ name, size = 20, color = 'currentColor', stroke = 1.75 }) {
  const s = { width: size, height: size, display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 };
  const p = { fill: 'none', stroke: color, strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'play':       return <svg style={s} viewBox="0 0 24 24"><polygon {...p} fill={color} points="6,4 20,12 6,20"/></svg>;
    case 'pause':      return <svg style={s} viewBox="0 0 24 24"><rect {...p} fill={color} x="6" y="4" width="4" height="16" rx="1"/><rect {...p} fill={color} x="14" y="4" width="4" height="16" rx="1"/></svg>;
    case 'check':      return <svg style={s} viewBox="0 0 24 24"><polyline {...p} points="20,6 9,17 4,12"/></svg>;
    case 'check-circle': return <svg style={s} viewBox="0 0 24 24"><circle {...p} cx="12" cy="12" r="9"/><polyline {...p} points="16.5,9.5 10.5,15.5 7.5,12.5"/></svg>;
    case 'plus':       return <svg style={s} viewBox="0 0 24 24"><line {...p} x1="12" y1="5" x2="12" y2="19"/><line {...p} x1="5" y1="12" x2="19" y2="12"/></svg>;
    case 'minus':      return <svg style={s} viewBox="0 0 24 24"><line {...p} x1="5" y1="12" x2="19" y2="12"/></svg>;
    case 'plus-circle':return <svg style={s} viewBox="0 0 24 24"><circle {...p} cx="12" cy="12" r="9"/><line {...p} x1="12" y1="8" x2="12" y2="16"/><line {...p} x1="8" y1="12" x2="16" y2="12"/></svg>;
    case 'chevron-right': return <svg style={s} viewBox="0 0 24 24"><polyline {...p} points="9,6 15,12 9,18"/></svg>;
    case 'chevron-left':  return <svg style={s} viewBox="0 0 24 24"><polyline {...p} points="15,6 9,12 15,18"/></svg>;
    case 'chevron-down':  return <svg style={s} viewBox="0 0 24 24"><polyline {...p} points="6,9 12,15 18,9"/></svg>;
    case 'arrow-right': return <svg style={s} viewBox="0 0 24 24"><line {...p} x1="5" y1="12" x2="19" y2="12"/><polyline {...p} points="13,6 19,12 13,18"/></svg>;
    case 'calendar':   return <svg style={s} viewBox="0 0 24 24"><rect {...p} x="3" y="5" width="18" height="16" rx="2"/><line {...p} x1="3" y1="10" x2="21" y2="10"/><line {...p} x1="8" y1="3" x2="8" y2="7"/><line {...p} x1="16" y1="3" x2="16" y2="7"/></svg>;
    case 'flame':      return <svg style={s} viewBox="0 0 24 24"><path {...p} d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-3 2-4 2-7 0 0 2 1 3 4 1-4 0-7 0-7Z"/></svg>;
    case 'dumbbell':   return <svg style={s} viewBox="0 0 24 24"><line {...p} x1="6" y1="8" x2="6" y2="16"/><line {...p} x1="3" y1="10" x2="3" y2="14"/><line {...p} x1="21" y1="10" x2="21" y2="14"/><line {...p} x1="18" y1="8" x2="18" y2="16"/><line {...p} x1="6" y1="12" x2="18" y2="12"/></svg>;
    case 'kettlebell': return <svg style={s} viewBox="0 0 24 24"><path {...p} d="M9 4h6a1 1 0 0 1 1 1 4 4 0 0 1-1 2.5A6 6 0 1 1 9 7.5 4 4 0 0 1 8 5a1 1 0 0 1 1-1Z"/></svg>;
    case 'timer':      return <svg style={s} viewBox="0 0 24 24"><circle {...p} cx="12" cy="13" r="8"/><line {...p} x1="9" y1="2" x2="15" y2="2"/><line {...p} x1="12" y1="9" x2="12" y2="13"/><line {...p} x1="12" y1="13" x2="15" y2="15"/></svg>;
    case 'flag':       return <svg style={s} viewBox="0 0 24 24"><line {...p} x1="5" y1="22" x2="5" y2="4"/><path {...p} d="M5 4h13l-3 4 3 4H5"/></svg>;
    case 'bar-chart':  return <svg style={s} viewBox="0 0 24 24"><line {...p} x1="6" y1="20" x2="6" y2="10"/><line {...p} x1="12" y1="20" x2="12" y2="4"/><line {...p} x1="18" y1="20" x2="18" y2="14"/></svg>;
    case 'list':       return <svg style={s} viewBox="0 0 24 24"><line {...p} x1="3" y1="6" x2="21" y2="6"/><line {...p} x1="3" y1="12" x2="21" y2="12"/><line {...p} x1="3" y1="18" x2="21" y2="18"/></svg>;
    case 'settings':   return <svg style={s} viewBox="0 0 24 24"><circle {...p} cx="12" cy="12" r="3"/><path {...p} d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h0a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5h0a1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v0a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/></svg>;
    case 'skip':       return <svg style={s} viewBox="0 0 24 24"><polygon {...p} fill={color} points="5,4 15,12 5,20"/><line {...p} x1="19" y1="5" x2="19" y2="19"/></svg>;
    case 'note':       return <svg style={s} viewBox="0 0 24 24"><path {...p} d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline {...p} points="14,3 14,9 20,9"/></svg>;
    case 'pencil':     return <svg style={s} viewBox="0 0 24 24"><path {...p} d="M12 20h9"/><path {...p} d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4Z"/></svg>;
    case 'trash':      return <svg style={s} viewBox="0 0 24 24"><polyline {...p} points="3,6 5,6 21,6"/><path {...p} d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;
    case 'swap':       return <svg style={s} viewBox="0 0 24 24"><polyline {...p} points="17,1 21,5 17,9"/><path {...p} d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline {...p} points="7,23 3,19 7,15"/><path {...p} d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>;
    case 'search':     return <svg style={s} viewBox="0 0 24 24"><circle {...p} cx="11" cy="11" r="7"/><line {...p} x1="21" y1="21" x2="16.5" y2="16.5"/></svg>;
    case 'filter':     return <svg style={s} viewBox="0 0 24 24"><polygon {...p} points="22,3 2,3 10,12.5 10,19 14,21 14,12.5"/></svg>;
    case 'rotate':     return <svg style={s} viewBox="0 0 24 24"><polyline {...p} points="23,4 23,10 17,10"/><path {...p} d="M20.5 15A9 9 0 1 1 19 7.5"/></svg>;
    case 'rower':      return <svg style={s} viewBox="0 0 24 24"><circle {...p} cx="6" cy="12" r="3"/><line {...p} x1="9" y1="12" x2="20" y2="12"/><line {...p} x1="20" y1="9" x2="20" y2="15"/></svg>;
    case 'home':       return <svg style={s} viewBox="0 0 24 24"><path {...p} d="M3 11l9-8 9 8"/><path {...p} d="M5 10v10h14V10"/></svg>;
    case 'bodyweight': return <svg style={s} viewBox="0 0 24 24"><circle {...p} cx="12" cy="5" r="2.2"/><line {...p} x1="12" y1="7.5" x2="12" y2="14"/><path {...p} d="M7 10l5 2 5-2"/><path {...p} d="M12 14l-3 7M12 14l3 7"/></svg>;
    case 'flash':      return <svg style={s} viewBox="0 0 24 24"><polygon {...p} fill={color} points="13,2 3,14 12,14 11,22 21,10 12,10"/></svg>;
    case 'wand':       return <svg style={s} viewBox="0 0 24 24"><line {...p} x1="3" y1="21" x2="14" y2="10"/><polygon {...p} points="18,2 19,5 22,6 19,7 18,10 17,7 14,6 17,5"/></svg>;
    case 'thumbs-up':  return <svg style={s} viewBox="0 0 24 24"><path {...p} d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.3a2 2 0 0 0 2-1.7l1.4-9a2 2 0 0 0-2-2.3Z"/><line {...p} x1="7" y1="22" x2="7" y2="11"/></svg>;
    case 'menu':       return <svg style={s} viewBox="0 0 24 24"><line {...p} x1="3" y1="6" x2="21" y2="6"/><line {...p} x1="3" y1="12" x2="21" y2="12"/><line {...p} x1="3" y1="18" x2="21" y2="18"/></svg>;
    case 'grip':       return <svg style={s} viewBox="0 0 24 24"><circle cx="9" cy="6" r="1.4" fill={color}/><circle cx="15" cy="6" r="1.4" fill={color}/><circle cx="9" cy="12" r="1.4" fill={color}/><circle cx="15" cy="12" r="1.4" fill={color}/><circle cx="9" cy="18" r="1.4" fill={color}/><circle cx="15" cy="18" r="1.4" fill={color}/></svg>;
    case 'x':          return <svg style={s} viewBox="0 0 24 24"><line {...p} x1="6" y1="6" x2="18" y2="18"/><line {...p} x1="18" y1="6" x2="6" y2="18"/></svg>;
    case 'close':      return <svg style={s} viewBox="0 0 24 24"><line {...p} x1="6" y1="6" x2="18" y2="18"/><line {...p} x1="18" y1="6" x2="6" y2="18"/></svg>;
    case 'info':       return <svg style={s} viewBox="0 0 24 24"><circle {...p} cx="12" cy="12" r="9"/><line {...p} x1="12" y1="11" x2="12" y2="16"/><circle cx="12" cy="8" r="1" fill={color}/></svg>;
    case 'trx':        return <svg style={s} viewBox="0 0 24 24"><line {...p} x1="12" y1="3" x2="12" y2="9"/><path {...p} d="M12 9l-4 8M12 9l4 8"/><line {...p} x1="6" y1="20" x2="10" y2="20"/><line {...p} x1="14" y1="20" x2="18" y2="20"/></svg>;
    case 'band':       return <svg style={s} viewBox="0 0 24 24"><path {...p} d="M3 12c2-4 4-4 4-4M21 12c-2 4-4 4-4 4M5 12c4 0 6-3 7-3s3 3 7 3"/></svg>;
    case 'pull-bar':   return <svg style={s} viewBox="0 0 24 24"><line {...p} x1="3" y1="6" x2="21" y2="6"/><line {...p} x1="3" y1="3" x2="3" y2="9"/><line {...p} x1="21" y1="3" x2="21" y2="9"/><line {...p} x1="9" y1="6" x2="9" y2="14"/><line {...p} x1="15" y1="6" x2="15" y2="14"/><circle {...p} cx="12" cy="18" r="3"/></svg>;
    default: return null;
  }
}

// ─────────────────────────────────────────────────────────────
// Generic UI primitives
// ─────────────────────────────────────────────────────────────
function ScreenHeader({ title, subtitle, leftIcon, leftAction, rightContent, dense }) {
  return (
    <div style={{
      padding: dense ? '8px 16px 12px' : '12px 16px 16px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
        {leftIcon && (
          <button onClick={leftAction} style={{
            width: 36, height: 36, background: 'transparent', border: 'none',
            color: KB.text, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginLeft: -8, borderRadius: 10,
          }}>
            <I name={leftIcon} size={22}/>
          </button>
        )}
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.2, color: KB.text }}>{title}</div>
          {subtitle && <div style={{ fontSize: 13, fontWeight: 500, color: KB.textMuted, marginTop: 2 }}>{subtitle}</div>}
        </div>
      </div>
      {rightContent}
    </div>
  );
}

function Sectionlabel({ children, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', marginBottom: 8 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: KB.textMuted, letterSpacing: '0.10em', textTransform: 'uppercase' }}>{children}</div>
      {right}
    </div>
  );
}

function Card({ children, elevated, padded = true, style, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: elevated ? KB.surface2 : KB.surface,
      border: `1px solid ${KB.border}`,
      borderRadius: 14,
      padding: padded ? 16 : 0,
      cursor: onClick ? 'pointer' : 'default',
      ...style,
    }}>{children}</div>
  );
}

function Chip({ children, tone = 'default', size = 'md', style }) {
  const tones = {
    default: { bg: KB.surface2, color: KB.textMuted, border: KB.border },
    work:    { bg: KB.workBg,   color: KB.work,      border: KB.work },
    rest:    { bg: KB.restBg,   color: KB.rest,      border: KB.rest },
    accent:  { bg: KB.accentBg, color: KB.accent,    border: KB.accent },
    danger:  { bg: KB.dangerBg, color: KB.danger,    border: KB.danger },
    solid:   { bg: KB.text,     color: KB.bg,        border: KB.text },
    ghost:   { bg: 'transparent', color: KB.textMuted, border: KB.border },
  };
  const t = tones[tone] || tones.default;
  const h = size === 'sm' ? 22 : size === 'lg' ? 32 : 26;
  const fs = size === 'sm' ? 10 : size === 'lg' ? 12 : 11;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      height: h, padding: `0 ${size === 'sm' ? 8 : 10}px`,
      borderRadius: 999, background: t.bg, color: t.color,
      border: `1px solid ${t.border}`,
      fontSize: fs, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
      ...style,
    }}>{children}</span>
  );
}

function Btn({ children, variant = 'primary', size = 'md', icon, iconRight, onClick, full, style, disabled, accent }) {
  const variants = {
    primary:   { bg: accent || KB.primary, color: '#0F1115', border: 'transparent' },
    secondary: { bg: KB.surface2, color: KB.text, border: KB.border },
    ghost:     { bg: 'transparent', color: KB.textMuted, border: 'transparent' },
    danger:    { bg: 'transparent', color: KB.danger, border: KB.danger },
    outline:   { bg: 'transparent', color: KB.text, border: KB.border },
  };
  const v = variants[variant] || variants.primary;
  const heights = { sm: 36, md: 44, lg: 56 };
  const fs = { sm: 13, md: 15, lg: 17 };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      width: full ? '100%' : 'auto',
      height: heights[size], padding: `0 ${size === 'lg' ? 24 : 18}px`,
      background: v.bg, color: v.color,
      border: `1px solid ${v.border}`,
      borderRadius: size === 'lg' ? 16 : 12,
      fontSize: fs[size], fontWeight: size === 'lg' ? 700 : 600, fontFamily: KB_FONT,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.4 : 1,
      letterSpacing: '-0.005em',
      ...style,
    }}>
      {icon && <I name={icon} size={size === 'lg' ? 20 : 18}/>}
      {children}
      {iconRight && <I name={iconRight} size={size === 'lg' ? 20 : 18}/>}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Bottom navigation
// ─────────────────────────────────────────────────────────────
function BottomNav({ active, onNavigate, accent = KB.primary }) {
  const tabs = [
    { id: 'today',    label: 'Today',    icon: 'flame' },
    { id: 'programs', label: 'Programs', icon: 'list' },
    { id: 'history',  label: 'History',  icon: 'bar-chart' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];
  return (
    <div style={{
      borderTop: `1px solid ${KB.border}`, background: KB.surface,
      padding: '6px 8px 0', display: 'flex', flexShrink: 0, height: 56,
    }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onNavigate?.(t.id)} style={{
          flex: 1, background: 'transparent', border: 'none', cursor: 'pointer',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
          color: active === t.id ? accent : KB.textMuted, padding: 6,
          fontFamily: KB_FONT,
        }}>
          <I name={t.icon} size={22} stroke={active === t.id ? 2 : 1.75}/>
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.02em' }}>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Stepper — for load entry
// ─────────────────────────────────────────────────────────────
function Stepper({ value, onChange, step = 5, min = 0, max = 200, suffix = 'lb' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: KB.surface2, borderRadius: 12, padding: 4, border: `1px solid ${KB.border}`}}>
      <button onClick={() => onChange(Math.max(min, value - step))} style={{
        width: 44, height: 44, background: KB.surface, border: 'none',
        borderRadius: 9, color: KB.text, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <I name="minus" size={18}/>
      </button>
      <div style={{ flex: 1, textAlign: 'center', fontSize: 22, fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: KB.text }}>
        {value} <span style={{ fontSize: 13, fontWeight: 500, color: KB.textMuted, marginLeft: 2 }}>{suffix}</span>
      </div>
      <button onClick={() => onChange(Math.min(max, value + step))} style={{
        width: 44, height: 44, background: KB.surface, border: 'none',
        borderRadius: 9, color: KB.text, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <I name="plus" size={18}/>
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Sparkline
// ─────────────────────────────────────────────────────────────
function Sparkline({ data, width = 280, height = 64, color = KB.primary, fill = true }) {
  if (!data || !data.length) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = (max - min) || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1 || 1)) * width;
    const y = height - ((v - min) / range) * height;
    return [x, y];
  });
  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const fillPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {fill && <path d={fillPath} fill={color} opacity="0.12"/>}
      <path d={linePath} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="3.5" fill={color}/>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Bottom sheet
// ─────────────────────────────────────────────────────────────
function BottomSheet({ children, open, onClose, title, height = 'auto' }) {
  if (!open) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 50, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }}/>
      <div style={{
        position: 'relative', background: KB.surface, borderTopLeftRadius: 22, borderTopRightRadius: 22,
        borderTop: `1px solid ${KB.border}`, padding: '12px 16px 24px',
        maxHeight: '82%', overflow: 'auto', height,
      }}>
        <div style={{ width: 40, height: 4, background: KB.border, borderRadius: 2, margin: '0 auto 12px' }}/>
        {title && <div style={{ fontSize: 18, fontWeight: 700, color: KB.text, marginBottom: 12 }}>{title}</div>}
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Block-type pill
// ─────────────────────────────────────────────────────────────
function BlockPill({ type }) {
  const labels = {
    straight: 'STRAIGHT', superset: 'SUPERSET', circuit: 'CIRCUIT',
    amrap: 'AMRAP', ladder: 'LADDER', interval: 'INTERVAL', carry: 'CARRY',
  };
  const tone = type === 'amrap' || type === 'ladder' ? 'accent' : type === 'interval' ? 'rest' : type === 'carry' ? 'accent' : 'default';
  return <Chip tone={tone} size="sm">{labels[type] || type.toUpperCase()}</Chip>;
}

// ─────────────────────────────────────────────────────────────
// Volume calculator + load formatter
// ─────────────────────────────────────────────────────────────
function totalVolume(block, unit = 'lb') {
  let total = 0;
  block.exercises.forEach(ex => {
    const sets = ex.prescription.sets || block.rounds || 1;
    const reps = typeof ex.prescription.target === 'number' ? ex.prescription.target : 0;
    const v = ex.prescription.load.value || 0;
    const u = ex.prescription.load.unit;
    if (u === unit) total += sets * reps * v;
    else if (u === 'lb' && unit === 'kg') total += sets * reps * lbToKg(v);
    else if (u === 'kg' && unit === 'lb') total += sets * reps * Math.round(v * 2.2046);
  });
  return total;
}

// Expose
Object.assign(window, {
  KB, KB_FONT, KB_MONO,
  PhoneShell, KBStatusBar, KBHomeBar,
  I, ScreenHeader, Sectionlabel, Card, Chip, Btn, BottomNav,
  Stepper, Sparkline, BottomSheet, BlockPill,
  totalVolume,
});
