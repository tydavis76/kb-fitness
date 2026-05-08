// data.jsx — Mock workout schema data, exercise library, and helpers
// All data conforms to WorkoutSessionV2 schema with K&B home-gym vocabulary
// (kettlebell, dumbbell, TRX, pull-up bar, band, rower, slam ball, bodyweight)

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
const lbToKg = (lb) => Math.round((lb / 2.2046) * 2) / 2; // round to 0.5kg
const fmtLoad = (load, unit = 'lb') => {
  if (load == null || load.value == null) return load?.label || '—';
  if (unit === 'kg' && load.unit === 'lb') return `${lbToKg(load.value)} kg`;
  if (unit === 'lb' && load.unit === 'kg') return `${Math.round(load.value * 2.2046)} lb`;
  return load.label;
};

// ─────────────────────────────────────────────────────────────
// Exercise library
// ─────────────────────────────────────────────────────────────
const EXERCISES = [
  { id: 'kb-swing',         name: 'Kettlebell swing',         equipment: 'kettlebell', pattern: 'hinge',     primary: ['posterior', 'glutes'] },
  { id: 'kb-clean',         name: 'Kettlebell clean',         equipment: 'kettlebell', pattern: 'pull',      primary: ['posterior'] },
  { id: 'kb-press',         name: 'Kettlebell press',         equipment: 'kettlebell', pattern: 'push',      primary: ['shoulders'] },
  { id: 'kb-snatch',        name: 'Kettlebell snatch',        equipment: 'kettlebell', pattern: 'pull',      primary: ['posterior'] },
  { id: 'kb-goblet-squat',  name: 'Goblet squat',             equipment: 'kettlebell', pattern: 'squat',     primary: ['quads', 'glutes'] },
  { id: 'kb-rdl',           name: 'KB Romanian deadlift',     equipment: 'kettlebell', pattern: 'hinge',     primary: ['hamstrings'] },
  { id: 'kb-tgu',           name: 'Turkish get-up',           equipment: 'kettlebell', pattern: 'carry',     primary: ['core'] },
  { id: 'kb-farmer',        name: 'Farmer carry',             equipment: 'kettlebell', pattern: 'carry',     primary: ['grip', 'core'] },
  { id: 'db-bench',         name: 'Dumbbell bench press',     equipment: 'dumbbell',   pattern: 'push',      primary: ['chest'] },
  { id: 'db-row',           name: 'Dumbbell row',             equipment: 'dumbbell',   pattern: 'pull',      primary: ['back'] },
  { id: 'db-curl',          name: 'Dumbbell curl',            equipment: 'dumbbell',   pattern: 'pull',      primary: ['biceps'] },
  { id: 'db-shoulder-press',name: 'Shoulder press',           equipment: 'dumbbell',   pattern: 'push',      primary: ['shoulders'] },
  { id: 'db-split-squat',   name: 'Split squat',              equipment: 'dumbbell',   pattern: 'squat',     primary: ['quads'] },
  { id: 'trx-row',          name: 'TRX row',                  equipment: 'trx',        pattern: 'pull',      primary: ['back'] },
  { id: 'trx-pushup',       name: 'TRX push-up',              equipment: 'trx',        pattern: 'push',      primary: ['chest'] },
  { id: 'trx-fallout',      name: 'TRX fallout',              equipment: 'trx',        pattern: 'core',      primary: ['core'] },
  { id: 'pullup',           name: 'Pull-up',                  equipment: 'pull-up bar',pattern: 'pull',      primary: ['back'] },
  { id: 'chinup',           name: 'Chin-up',                  equipment: 'pull-up bar',pattern: 'pull',      primary: ['biceps', 'back'] },
  { id: 'hang-leg-raise',   name: 'Hanging leg raise',        equipment: 'pull-up bar',pattern: 'core',      primary: ['core'] },
  { id: 'pushup',           name: 'Push-up',                  equipment: 'bodyweight', pattern: 'push',      primary: ['chest'] },
  { id: 'plank',            name: 'Plank',                    equipment: 'bodyweight', pattern: 'core',      primary: ['core'] },
  { id: 'lunge',            name: 'Walking lunge',            equipment: 'bodyweight', pattern: 'squat',     primary: ['legs'] },
  { id: 'band-pullapart',   name: 'Band pull-apart',          equipment: 'band',       pattern: 'pull',      primary: ['rear delts'] },
  { id: 'band-pressdown',   name: 'Band tricep pressdown',    equipment: 'band',       pattern: 'push',      primary: ['triceps'] },
  { id: 'row-erg',          name: 'Row',                      equipment: 'rower',      pattern: 'cardio',    primary: ['posterior'] },
  { id: 'slam',             name: 'Slam ball',                equipment: 'slam ball',  pattern: 'power',     primary: ['core'] },
  { id: 'med-throw',        name: 'Med ball rotational throw',equipment: 'med ball',   pattern: 'power',     primary: ['core'] },
];

// Rich detail (description, technique cues, secondary muscles, video) keyed by id.
// Anything not listed falls back to sensible defaults via getExerciseDetail().
const EXERCISE_DETAILS = {
  'kb-swing': {
    category: 'Ballistic',
    description: 'Hip-driven hinge that loads the posterior chain explosively. The bell floats — never lifted with the arms.',
    cues: ['Hike the bell back high between thighs', 'Snap hips through hard at the top', 'Float, don\'t lift — bell finishes around chest height', 'Brace abs at lockout', 'Let gravity drop the bell'],
    secondary: ['hamstrings', 'lats', 'core', 'grip'],
    youtubeId: 'dCQjEYr-pUg', duration: '0:54',
  },
  'kb-clean': {
    category: 'Ballistic',
    description: 'Brings the bell from the floor or hike position to the rack in a single fluid motion.',
    cues: ['Tame the arc — keep elbow close to ribs', 'Receive softly in the rack', 'Punch through, don\'t curl'],
    secondary: ['traps', 'shoulders', 'forearms'],
    youtubeId: 'tCEfrabuqkk', duration: '1:02',
  },
  'kb-press': {
    category: 'Strength',
    description: 'Strict overhead press from the rack. Builds vertical pushing strength without barbell.',
    cues: ['Pack the lat, depress shoulder', 'Slight knee bend, full body tension', 'Press in a slight arc around the head', 'Bicep finishes by ear'],
    secondary: ['triceps', 'core', 'upper back'],
    youtubeId: 'fnGjpoyIAtA', duration: '1:18',
  },
  'kb-snatch': {
    category: 'Ballistic',
    description: 'Floor (or hike) to overhead in one rep. Demanding on grip, conditioning, and shoulder mobility.',
    cues: ['High pull, then punch through', 'Loose grip — don\'t squeeze the handle', 'Soft fixation overhead'],
    secondary: ['shoulders', 'lats', 'grip'],
    youtubeId: 'cKx8xE8jJZs', duration: '1:32',
  },
  'kb-goblet-squat': {
    category: 'Strength',
    description: 'Front-loaded squat holding the bell at the chest. Reinforces upright torso and depth.',
    cues: ['Elbows tucked into ribs', 'Knees track over toes', 'Sit between the heels', 'Drive the floor away'],
    secondary: ['core', 'upper back'],
    youtubeId: 'MeIiIdhvXT4', duration: '0:48',
  },
  'kb-rdl': {
    category: 'Strength',
    description: 'Single-bell hinge focused on hamstring and glute eccentric tension.',
    cues: ['Push hips back, not down', 'Soft knee, long spine', 'Bell hovers an inch from shin', 'Squeeze glutes to stand'],
    secondary: ['glutes', 'erectors', 'grip'],
    youtubeId: 'CN_7cz3P-1U', duration: '1:12',
  },
  'kb-tgu': {
    category: 'Skill',
    description: 'Multi-step floor-to-stand with a loaded arm overhead. Builds shoulder stability and full-body coordination.',
    cues: ['Eyes on the bell at all times', 'Punch the bell to the ceiling', 'Move slowly — every position is a hold'],
    secondary: ['shoulders', 'glutes', 'obliques'],
    youtubeId: 'Snyq45T2ckA', duration: '2:14',
  },
  'kb-farmer': {
    category: 'Loaded carry',
    description: 'Walk holding bells at the sides. The simplest, most effective grip and core builder.',
    cues: ['Tall posture, ribs stacked over hips', 'Quiet feet, full breaths', 'Don\'t let bells swing'],
    secondary: ['traps', 'forearms', 'obliques'],
    youtubeId: 'p72FqQwOaqE', duration: '0:42',
  },
  'db-bench': {
    category: 'Strength',
    description: 'Horizontal press with dumbbells — wider range of motion than barbell, kinder to shoulders.',
    cues: ['Retract shoulder blades into the bench', 'Lower to nipple line', 'Press up and slightly together', 'Feet planted, glutes squeezed'],
    secondary: ['triceps', 'front delts'],
    youtubeId: 'YQ2s_Y7g5Qk', duration: '1:08',
  },
  'db-row': {
    category: 'Strength',
    description: 'Single-arm horizontal pull supported by the opposite hand. Trains lats and mid-back without spinal load.',
    cues: ['Pull elbow to hip, not shoulder', 'Squeeze the lat, brief pause at the top', 'Resist the negative — 2-3 sec down', 'Don\'t rotate the spine'],
    secondary: ['rhomboids', 'biceps', 'rear delts'],
    youtubeId: 'roCP6wCXPqo', duration: '1:00',
  },
  'db-curl': {
    category: 'Accessory',
    description: 'Standing alternating biceps curl.',
    cues: ['No swing — keep elbows pinned', 'Supinate as you curl up', 'Control the descent'],
    secondary: ['forearms'],
    youtubeId: 'ykJmrZ5v0Oo', duration: '0:38',
  },
  'db-shoulder-press': {
    category: 'Strength',
    description: 'Standing or seated overhead press with dumbbells.',
    cues: ['Brace core, don\'t arch low back', 'Press straight up', 'Bells meet (or nearly) overhead'],
    secondary: ['triceps', 'upper chest'],
    youtubeId: 'qEwKCR5JCog', duration: '0:52',
  },
  'db-split-squat': {
    category: 'Strength',
    description: 'Stationary lunge variation with dumbbells. Builds single-leg strength and stability.',
    cues: ['Long stance — front shin near vertical', 'Drop straight down, not forward', 'Drive through whole foot of front leg'],
    secondary: ['glutes', 'core'],
    youtubeId: '2C-uNgKwPLE', duration: '1:04',
  },
  'trx-row': {
    category: 'Strength',
    description: 'Inverted row using suspension straps. Difficulty scales with body angle.',
    cues: ['Plank from heels to head', 'Pull chest to handles', 'Squeeze shoulder blades together'],
    secondary: ['biceps', 'rear delts', 'core'],
    youtubeId: 'KqDNxDwT9Lg', duration: '0:48',
  },
  'trx-pushup': {
    category: 'Strength',
    description: 'Push-up with hands suspended in straps. Adds instability for shoulder stabilizers.',
    cues: ['Strong plank — no sag', 'Lower until hands are at chest', 'Press with control'],
    secondary: ['triceps', 'core'],
    youtubeId: 'ZfvQrLfUIXE', duration: '0:50',
  },
  'trx-fallout': {
    category: 'Anti-extension',
    description: 'Anti-extension core drill — body falls forward as arms extend overhead.',
    cues: ['Glutes squeezed throughout', 'Don\'t arch as you reach', 'Pull yourself back with the lats'],
    secondary: ['lats', 'shoulders'],
    youtubeId: 'JpwK9LQjElk', duration: '0:42',
  },
  'pullup': {
    category: 'Strength',
    description: 'Vertical pull from a dead hang to chin over bar. Pronated grip.',
    cues: ['Initiate with shoulder depression', 'Drive elbows to floor', 'Chin clears the bar — no kipping', 'Control the descent'],
    secondary: ['biceps', 'rear delts', 'core'],
    youtubeId: 'eGo4IYlbE5g', duration: '0:46',
  },
  'chinup': {
    category: 'Strength',
    description: 'Vertical pull, supinated grip. Easier than pull-up for most; more biceps engagement.',
    cues: ['Hands shoulder-width, palms toward you', 'Pull chest to bar', 'Slow eccentric'],
    secondary: ['back', 'forearms'],
    youtubeId: 'b-ztMQpj8yc', duration: '0:44',
  },
  'hang-leg-raise': {
    category: 'Core',
    description: 'Hanging from the bar, raise legs to parallel or higher.',
    cues: ['Active hang — engage lats', 'Raise legs with control, no swing', 'Posteriorly tilt the pelvis at the top'],
    secondary: ['hip flexors', 'grip'],
    youtubeId: 'Pr1ieGZ5atk', duration: '0:40',
  },
  'pushup': {
    category: 'Strength',
    description: 'Classic horizontal press from the floor.',
    cues: ['Hands under shoulders, slightly wider', 'Body in one line — no piking', 'Lower chest to fist height', 'Press up with full lockout'],
    secondary: ['triceps', 'shoulders', 'core'],
    youtubeId: 'IODxDxX7oi4', duration: '0:38',
  },
  'plank': {
    category: 'Core',
    description: 'Isometric anti-extension hold on forearms or hands.',
    cues: ['Tuck pelvis, squeeze glutes', 'Push the floor away', 'Breathe — don\'t hold breath'],
    secondary: ['shoulders', 'glutes'],
    youtubeId: 'ASdvN_XEl_c', duration: '0:32',
  },
  'lunge': {
    category: 'Strength',
    description: 'Walking lunge — alternates legs across distance.',
    cues: ['Long step', 'Back knee whispers the floor', 'Drive off the front heel'],
    secondary: ['glutes', 'core'],
    youtubeId: 'L8fvypPrzzs', duration: '0:48',
  },
  'band-pullapart': {
    category: 'Activation',
    description: 'Horizontal band pull-apart for upper-back activation. Great warm-up.',
    cues: ['Arms straight throughout', 'Pull from the mid-back, not the hands', 'Squeeze pause at end range'],
    secondary: ['rhomboids', 'mid traps'],
    youtubeId: 'fJ8x9wMP4HI', duration: '0:30',
  },
  'band-pressdown': {
    category: 'Accessory',
    description: 'Band tricep pressdown — anchored overhead.',
    cues: ['Elbows pinned to ribs', 'Lock out fully', 'Slow up, fast down'],
    secondary: [],
    youtubeId: 'Oms8jBcF49g', duration: '0:34',
  },
  'row-erg': {
    category: 'Conditioning',
    description: 'Indoor rower. Drive comes from legs first, then back, then arms.',
    cues: ['Legs → hips → arms on the drive', 'Arms → hips → legs on the recovery', 'Keep stroke rate steady'],
    secondary: ['lats', 'glutes', 'hamstrings'],
    youtubeId: 'H0r_ZPXJLtg', duration: '1:46',
  },
  'slam': {
    category: 'Power',
    description: 'Overhead-to-floor slam ball. Express max power and aggression.',
    cues: ['Reach all the way overhead', 'Slam through the floor', 'Catch on the bounce, repeat'],
    secondary: ['lats', 'shoulders'],
    youtubeId: 'GVz8d3oaJrM', duration: '0:36',
  },
  'med-throw': {
    category: 'Power',
    description: 'Rotational med ball throw — trains hip-led rotation against a wall.',
    cues: ['Load the back hip', 'Drive through with hips first', 'Let arms be passive — speed comes from torso'],
    secondary: ['obliques', 'shoulders'],
    youtubeId: 'JU5yj_3WzZk', duration: '0:30',
  },
};

// Returns a fully-populated detail object for any exercise id (with safe fallbacks).
function getExerciseDetail(idOrEx) {
  const ex = typeof idOrEx === 'string' ? EXERCISES.find(e => e.id === idOrEx) : idOrEx;
  if (!ex) return null;
  const d = EXERCISE_DETAILS[ex.id] || {};
  return {
    ...ex,
    category:    d.category    || (ex.pattern ? ex.pattern[0].toUpperCase() + ex.pattern.slice(1) : 'General'),
    description: d.description || `${ex.name} — ${ex.pattern} pattern using ${ex.equipment}.`,
    cues:        d.cues        || ['Set up with intention', 'Move through full range', 'Control the eccentric'],
    secondary:   d.secondary   || [],
    youtubeId:   d.youtubeId   || null,
    duration:    d.duration    || null,
  };
}

const SUBSTITUTIONS = {
  'pullup':      ['chinup', 'trx-row', 'db-row'],
  'kb-swing':    ['kb-clean', 'kb-snatch', 'kb-rdl'],
  'db-bench':    ['pushup', 'trx-pushup', 'db-shoulder-press'],
  'row-erg':     ['kb-swing', 'kb-snatch'],
};

// ─────────────────────────────────────────────────────────────
// Programs (Program → Phase → Week → Day → Workout)
// ─────────────────────────────────────────────────────────────
const PROGRAMS = [
  {
    id: 'hybrid-strength',
    name: 'Hybrid Strength',
    subtitle: 'Kettlebell · Dumbbell · TRX',
    weeks: 12,
    days_per_week: 4,
    environment: 'Home',
    phases: [
      { id: 'p1', name: 'Foundation', weeks: 4, focus: 'Volume + technique', repeats: true },
      { id: 'p2', name: 'Build',      weeks: 4, focus: 'Progressive load',   repeats: true },
      { id: 'p3', name: 'Peak',       weeks: 4, focus: 'Intensity + density',repeats: true },
    ],
    current_phase: 'p2',
    current_week: 6,
    current_day: 3,
  },
  {
    id: 'kb-pure',
    name: 'Pure Kettlebell',
    subtitle: 'Single bell · 5 days/wk',
    weeks: 6,
    days_per_week: 5,
    environment: 'Home',
    phases: [
      { id: 'p1', name: 'Density',  weeks: 3, focus: 'Time-under-tension' },
      { id: 'p2', name: 'Power',    weeks: 3, focus: 'Snatch + jerk' },
    ],
  },
  {
    id: 'rower-fortify',
    name: 'Rower + Fortify',
    subtitle: 'Conditioning + accessory',
    weeks: 8,
    days_per_week: 3,
    environment: 'Home',
    phases: [
      { id: 'p1', name: 'Aerobic base', weeks: 4 },
      { id: 'p2', name: 'Lactate',      weeks: 4 },
    ],
  },
];

// Day templates for the active program (Hybrid Strength, Phase 2: Build)
const WEEK_TEMPLATE = [
  { day: 'Mon', title: 'Push + Carry',  focus: 'Strength', duration: 52, blocks: 4, status: 'done' },
  { day: 'Tue', title: 'Row intervals', focus: 'Cardio',   duration: 28, blocks: 2, status: 'done' },
  { day: 'Wed', title: 'Rest',          focus: '',         duration: 0,  blocks: 0, status: 'rest' },
  { day: 'Thu', title: 'Pull + Hinge',  focus: 'Strength', duration: 48, blocks: 4, status: 'today' },
  { day: 'Fri', title: 'AMRAP density', focus: 'Density',  duration: 24, blocks: 1, status: 'planned' },
  { day: 'Sat', title: 'Long row + TGU',focus: 'Mixed',    duration: 60, blocks: 3, status: 'planned' },
  { day: 'Sun', title: 'Rest',          focus: '',         duration: 0,  blocks: 0, status: 'rest' },
];

// ─────────────────────────────────────────────────────────────
// Today's session — fully populated per WorkoutSessionV2 schema
// "Pull + Hinge" — Thursday, Phase 2, Week 6
// ─────────────────────────────────────────────────────────────
const TODAY_SESSION = {
  session_id: 'sess-2026-05-08',
  metadata: {
    title: 'Pull + Hinge',
    environment: 'Home',
    tags: ['phase-2', 'build', 'week-6', 'day-3'],
    duration_estimate_min: 48,
    program_id: 'hybrid-strength',
    program_name: 'Hybrid Strength',
    phase: 'Build',
    week: 6,
    day: 3,
  },
  blocks: [
    {
      id: 'b1',
      type: 'straight',
      name: 'Warm-up',
      label: 'A',
      rounds: 1,
      rest_sec: 60,
      exercises: [
        { exercise_id: 'band-pullapart', name: 'Band pull-apart',
          prescription: { type: 'reps', target: 15, sets: 2,
            load: { value: null, unit: null, label: 'Red band' } } },
        { exercise_id: 'kb-swing', name: 'Kettlebell swing',
          prescription: { type: 'reps', target: 10, sets: 2,
            load: { value: 24, unit: 'kg', label: '24 kg' } } },
      ],
    },
    {
      id: 'b2',
      type: 'superset',
      name: 'Pull strength',
      label: 'B',
      rounds: 4,
      rest_sec: 90,
      exercises: [
        { exercise_id: 'pullup', name: 'Pull-up', sub_label: 'B1',
          prescription: { type: 'reps', target: 6, sets: 4,
            load: { value: null, unit: null, label: 'Bodyweight' } } },
        { exercise_id: 'db-row', name: 'Dumbbell row', sub_label: 'B2',
          prescription: { type: 'reps', target: 10, sets: 4,
            load: { value: 50, unit: 'lb', label: '50 lb' } },
          protocol_constraints: { tempo: '2-1-2-0', cues: ['Pull elbow to hip'] } },
      ],
    },
    {
      id: 'b3',
      type: 'ladder',
      name: 'Hinge ladder',
      label: 'C',
      rounds: 5,
      rest_sec: 75,
      exercises: [
        { exercise_id: 'kb-rdl', name: 'KB Romanian deadlift',
          prescription: { type: 'reps', target: '8/6/4/4/2',
            load: { value: 32, unit: 'kg', label: '32 kg' } },
          ladder: { kind: 'ascending-load', rungs: [
            { reps: 8, load: { value: 24, unit: 'kg', label: '24 kg' } },
            { reps: 6, load: { value: 28, unit: 'kg', label: '28 kg' } },
            { reps: 4, load: { value: 32, unit: 'kg', label: '32 kg' } },
            { reps: 4, load: { value: 32, unit: 'kg', label: '32 kg' } },
            { reps: 2, load: { value: 36, unit: 'kg', label: '36 kg' } },
          ] } },
      ],
    },
    {
      id: 'b4',
      type: 'amrap',
      name: 'Finisher',
      label: 'D',
      duration_sec: 8 * 60,
      exercises: [
        { exercise_id: 'kb-swing', name: 'KB swing',
          prescription: { type: 'reps', target: 15,
            load: { value: 20, unit: 'kg', label: '20 kg' } } },
        { exercise_id: 'pushup', name: 'Push-up',
          prescription: { type: 'reps', target: 10,
            load: { value: null, unit: null, label: 'Bodyweight' } } },
        { exercise_id: 'hang-leg-raise', name: 'Hanging leg raise',
          prescription: { type: 'reps', target: 8,
            load: { value: null, unit: null, label: 'Bodyweight' } } },
      ],
    },
  ],
};

// Sample circuit and interval blocks (for block-type showcase)
const CIRCUIT_BLOCK = {
  id: 'sb-circuit',
  type: 'circuit',
  name: 'Full-body circuit',
  label: 'A',
  rounds: 3,
  rest_sec: 60,
  exercises: [
    { exercise_id: 'kb-goblet-squat', name: 'Goblet squat',
      prescription: { type: 'reps', target: 12, load: { value: 20, unit: 'kg', label: '20 kg' } } },
    { exercise_id: 'trx-row', name: 'TRX row',
      prescription: { type: 'reps', target: 12, load: { value: null, unit: null, label: 'Bodyweight' } } },
    { exercise_id: 'pushup', name: 'Push-up',
      prescription: { type: 'reps', target: 12, load: { value: null, unit: null, label: 'Bodyweight' } } },
    { exercise_id: 'plank', name: 'Plank',
      prescription: { type: 'time', target: 30, load: { value: null, unit: null, label: 'Bodyweight' } } },
  ],
};

const INTERVAL_BLOCK = {
  id: 'sb-interval',
  type: 'interval',
  name: 'Row intervals',
  label: 'A',
  rounds: 6,
  work_sec: 60,
  rest_sec: 60,
  exercises: [
    { exercise_id: 'row-erg', name: 'Row',
      prescription: { type: 'time', target: 60, load: { value: 5, unit: 'damper', label: 'Damper 5' } },
      target_meters: 250 },
  ],
};

const CARRY_BLOCK = {
  id: 'sb-carry',
  type: 'carry',
  name: 'Heavy carry',
  label: 'B',
  rounds: 3,
  rest_sec: 90,
  exercises: [
    { exercise_id: 'kb-farmer', name: 'Farmer carry',
      prescription: { type: 'distance', target: 40, unit: 'm',
        load: { value: 32, unit: 'kg', label: '32 kg ×2' } } },
  ],
};

// MSTF tempo example
const MSTF_BLOCK = {
  id: 'sb-mstf',
  type: 'straight',
  name: 'MSTF chest',
  label: 'A',
  rounds: 1,
  exercises: [
    { exercise_id: 'db-bench', name: 'Dumbbell bench press',
      prescription: { type: 'reps', target: 4, sets: 3,
        load: { value: 60, unit: 'lb', label: '60 lb' } },
      protocol_constraints: {
        tempo: '10-2-10-0',
        cues: ['Maximal slow tempo', 'No rest at bottom', 'Tension throughout'],
      } },
  ],
};

// History sessions
const HISTORY = [
  { date: '2026-05-06', day: 'Tue', title: 'Row intervals', duration: 28, volume: 0,    note: 'Easy', meters: 1500 },
  { date: '2026-05-05', day: 'Mon', title: 'Push + Carry',  duration: 52, volume: 9840, note: 'Just right' },
  { date: '2026-05-03', day: 'Sat', title: 'Long row + TGU',duration: 60, volume: 4200, note: 'Hard' },
  { date: '2026-05-02', day: 'Fri', title: 'AMRAP density', duration: 24, volume: 6720, note: 'Easy' },
  { date: '2026-04-30', day: 'Thu', title: 'Pull + Hinge',  duration: 48, volume: 11200,note: 'Just right' },
  { date: '2026-04-29', day: 'Wed', title: 'Push + Carry',  duration: 52, volume: 9520, note: 'Just right' },
];

// Sparkline data — recent volume (last 12 sessions)
const VOLUME_TREND = [4200, 6720, 11200, 9520, 0, 9840, 8800, 10240, 11800, 12400, 11600, 13100];
// KB swing 1RM-equivalent over 12 weeks (kg)
const SWING_TREND = [16, 16, 20, 20, 20, 24, 24, 24, 24, 28, 28, 32];

// Expose to window for cross-script use
Object.assign(window, {
  EXERCISES, EXERCISE_DETAILS, getExerciseDetail,
  SUBSTITUTIONS, PROGRAMS, WEEK_TEMPLATE, TODAY_SESSION,
  CIRCUIT_BLOCK, INTERVAL_BLOCK, CARRY_BLOCK, MSTF_BLOCK, HISTORY,
  VOLUME_TREND, SWING_TREND,
  fmtLoad, lbToKg,
});
