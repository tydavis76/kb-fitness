// exercise-detail.jsx — Exercise detail sheet + library picker mode

// Stylized YouTube-style video card (no remote thumb; pure CSS placeholder)
function VideoCard({ exercise, height = 180, compact = false }) {
  const det = getExerciseDetail(exercise);
  const hasVideo = !!det?.youtubeId;
  const eqIcon =
    exercise.equipment === 'kettlebell' ? 'kettlebell' :
    exercise.equipment === 'dumbbell' ? 'dumbbell' :
    exercise.equipment === 'trx' ? 'trx' :
    exercise.equipment === 'pull-up bar' ? 'pull-bar' :
    exercise.equipment === 'band' ? 'band' :
    exercise.equipment === 'rower' ? 'rower' :
    exercise.equipment === 'bodyweight' ? 'bodyweight' : 'flame';
  return (
    <div style={{
      position: 'relative', width: '100%', height,
      borderRadius: 14, overflow: 'hidden',
      background: `linear-gradient(135deg, ${KB.surface3} 0%, ${KB.surface2} 100%)`,
      border: `1px solid ${KB.border}`,
    }}>
      {/* Backdrop — equipment glyph repeated faintly */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.08,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: KB.text,
      }}>
        <div style={{ transform: `scale(${compact ? 2.2 : 4.5}) rotate(-12deg)` }}>
          <I name={eqIcon} size={28}/>
        </div>
      </div>
      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.45) 100%)',
      }}/>
      {/* Play button */}
      {!compact && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: hasVideo ? KB.primary : KB.surface3,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M8 5l11 7-11 7V5z" fill={hasVideo ? KB.bg : KB.textMuted}/>
            </svg>
          </div>
        </div>
      )}
      {/* Top-left equipment chip */}
      <div style={{
        position: 'absolute', top: 10, left: 10,
        padding: '4px 8px', borderRadius: 6,
        background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)',
        fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
        color: '#fff',
      }}>{exercise.equipment}</div>
      {/* Bottom — duration / source */}
      {!compact && hasVideo && (
        <div style={{
          position: 'absolute', bottom: 10, right: 10,
          padding: '4px 8px', borderRadius: 6,
          background: 'rgba(0,0,0,0.7)', color: '#fff',
          fontSize: 11, fontWeight: 700, fontVariantNumeric: 'tabular-nums',
        }}>{det.duration} · YouTube</div>
      )}
      {!compact && !hasVideo && (
        <div style={{
          position: 'absolute', bottom: 10, left: 10,
          fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
          color: KB.textMuted,
        }}>No demo yet</div>
      )}
    </div>
  );
}

// Body diagram — simple front-silhouette SVG with primary muscles highlighted
function MuscleDiagram({ primary = [], size = 88 }) {
  const has = (m) => primary.some(p => p.toLowerCase().includes(m));
  const on = KB.accent, off = KB.surface3;
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 100 140" style={{ flexShrink: 0 }}>
      {/* Head */}
      <circle cx="50" cy="14" r="9" fill={off} stroke={KB.border}/>
      {/* Torso */}
      <path d="M30 26 Q30 24 32 24 L68 24 Q70 24 70 26 L72 60 Q72 64 68 64 L32 64 Q28 64 28 60 Z"
        fill={off} stroke={KB.border}/>
      {/* Chest highlight */}
      <path d="M34 28 Q50 30 66 28 L66 42 Q50 46 34 42 Z"
        fill={has('chest') ? on : 'transparent'} opacity="0.85"/>
      {/* Abs */}
      <rect x="44" y="42" width="12" height="22" rx="2"
        fill={has('core') || has('abs') ? on : 'transparent'} opacity="0.85"/>
      {/* Shoulders */}
      <circle cx="28" cy="30" r="6" fill={has('shoulder') || has('delt') ? on : off} stroke={KB.border}/>
      <circle cx="72" cy="30" r="6" fill={has('shoulder') || has('delt') ? on : off} stroke={KB.border}/>
      {/* Arms */}
      <path d="M22 34 Q18 50 20 64 L26 64 Q26 48 28 36 Z"
        fill={has('biceps') || has('arm') ? on : off} stroke={KB.border}/>
      <path d="M78 34 Q82 50 80 64 L74 64 Q74 48 72 36 Z"
        fill={has('biceps') || has('arm') ? on : off} stroke={KB.border}/>
      {/* Forearms */}
      <rect x="18" y="64" width="8" height="16" rx="3"
        fill={has('forearm') || has('grip') ? on : off} stroke={KB.border}/>
      <rect x="74" y="64" width="8" height="16" rx="3"
        fill={has('forearm') || has('grip') ? on : off} stroke={KB.border}/>
      {/* Hips/glutes */}
      <path d="M32 64 L68 64 L66 78 L34 78 Z"
        fill={has('glute') || has('hip') ? on : off} stroke={KB.border}/>
      {/* Quads */}
      <rect x="34" y="78" width="13" height="32" rx="4"
        fill={has('quad') || has('leg') ? on : off} stroke={KB.border}/>
      <rect x="53" y="78" width="13" height="32" rx="4"
        fill={has('quad') || has('leg') ? on : off} stroke={KB.border}/>
      {/* Calves */}
      <rect x="35" y="112" width="11" height="22" rx="3"
        fill={has('hamstring') || has('calf') || has('posterior') ? on : off} stroke={KB.border}/>
      <rect x="54" y="112" width="11" height="22" rx="3"
        fill={has('hamstring') || has('calf') || has('posterior') ? on : off} stroke={KB.border}/>
    </svg>
  );
}

// Bottom sheet with exercise details. mode = 'view' | 'picker'
function ExerciseDetailSheet({ open, onClose, exercise, mode = 'view', onPick }) {
  if (!open || !exercise) return null;
  const det = getExerciseDetail(exercise);
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 50,
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
    }}>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)',
      }}/>
      <div style={{
        position: 'relative', maxHeight: '92%', overflow: 'auto',
        background: KB.bg, borderTopLeftRadius: 22, borderTopRightRadius: 22,
        borderTop: `1px solid ${KB.border}`,
        boxShadow: '0 -16px 48px rgba(0,0,0,0.55)',
        padding: '10px 16px 16px',
      }}>
        {/* Drag handle */}
        <div style={{ width: 36, height: 4, borderRadius: 2, background: KB.border, margin: '4px auto 14px' }}/>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: KB.accent }}>{det.category}</div>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em', marginTop: 2 }}>{exercise.name}</div>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 8, background: KB.surface2, border: `1px solid ${KB.border}`,
            color: KB.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><I name="close" size={16}/></button>
        </div>
        {/* Video card */}
        <div style={{ marginBottom: 14 }}>
          <VideoCard exercise={exercise} height={170}/>
        </div>
        {/* Watch demo CTA */}
        {det.youtubeId && (
          <button style={{
            width: '100%', height: 44, marginBottom: 14,
            background: KB.surface, border: `1px solid ${KB.border}`, borderRadius: 12,
            color: KB.text, fontFamily: KB_FONT, fontWeight: 600, fontSize: 13,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M8 5l11 7-11 7V5z" fill={KB.text}/>
            </svg>
            Watch demo on YouTube
            <span style={{ marginLeft: 'auto', fontSize: 11, color: KB.textMuted, fontFamily: KB_MONO }}>↗</span>
          </button>
        )}
        {/* Description */}
        <div style={{ fontSize: 14, lineHeight: 1.5, color: KB.text, marginBottom: 14, textWrap: 'pretty' }}>
          {det.description}
        </div>
        {/* Equipment + muscles row */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, padding: 12, background: KB.surface, borderRadius: 12, border: `1px solid ${KB.border}` }}>
          <MuscleDiagram primary={[...exercise.primary, ...det.secondary]} size={72}/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: KB.textMuted, marginBottom: 4 }}>Equipment</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                <Chip size="sm">{exercise.equipment}</Chip>
              </div>
            </div>
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: KB.textMuted, marginBottom: 4 }}>Primary</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {exercise.primary.map(m => <Chip key={m} size="sm" tone="accent">{m}</Chip>)}
              </div>
            </div>
            {det.secondary.length > 0 && (
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: KB.textMuted, marginBottom: 4 }}>Secondary</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {det.secondary.map(m => <Chip key={m} size="sm">{m}</Chip>)}
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Cues */}
        <Sectionlabel>Technique cues</Sectionlabel>
        <Card padded={false} style={{ marginBottom: 14 }}>
          {det.cues.map((cue, i) => (
            <div key={i} style={{
              display: 'flex', gap: 12, padding: '12px 14px',
              borderTop: i > 0 ? `1px solid ${KB.borderSoft}` : 'none',
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                background: KB.surface2, color: KB.accent,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, fontVariantNumeric: 'tabular-nums', flexShrink: 0,
              }}>{i + 1}</div>
              <div style={{ flex: 1, fontSize: 13, lineHeight: 1.45, paddingTop: 2 }}>{cue}</div>
            </div>
          ))}
        </Card>
        {/* Substitutions */}
        {SUBSTITUTIONS[exercise.id] && (
          <>
            <Sectionlabel>Common substitutions</Sectionlabel>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
              {SUBSTITUTIONS[exercise.id].map(sid => {
                const sub = EXERCISES.find(e => e.id === sid);
                return sub ? <Chip key={sid} size="sm">{sub.name}</Chip> : null;
              })}
            </div>
          </>
        )}
        {/* Picker mode CTA */}
        {mode === 'picker' && (
          <div style={{ position: 'sticky', bottom: -16, marginLeft: -16, marginRight: -16, marginBottom: -16, padding: 16, background: KB.bg, borderTop: `1px solid ${KB.border}` }}>
            <Btn variant="primary" size="lg" full icon="plus" onClick={() => onPick && onPick(exercise)}>
              Add to workout
            </Btn>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { VideoCard, MuscleDiagram, ExerciseDetailSheet });
