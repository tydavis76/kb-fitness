export interface Exercise {
  id: string
  name: string
  equipment: string
  pattern: string
  primary: string[]
}

export interface ExerciseDetail extends Exercise {
  category: string
  description: string
  cues: string[]
  secondary: string[]
  youtubeId: string | null
  duration: string | null
}

// All exercises drawn directly from the 8-week kettlebell program
export const EXERCISES: Exercise[] = [
  // Swings & Hinges
  { id: 'kb_swing_c1p2',            name: 'Kettlebell Swing',                     equipment: 'kettlebell',  pattern: 'hinge',  primary: ['posterior chain', 'glutes'] },
  { id: 'kb_swing_c2',              name: 'Kettlebell Swing (Relaxed)',            equipment: 'kettlebell',  pattern: 'hinge',  primary: ['posterior chain', 'glutes'] },
  { id: 'kb_swing_bonus_s1',        name: 'Kettlebell Swing (Bonus Finisher)',     equipment: 'kettlebell',  pattern: 'hinge',  primary: ['posterior chain', 'glutes'] },
  { id: 'kb_swing_bonus_s1p2',      name: 'Kettlebell Swing (Bonus #2)',           equipment: 'kettlebell',  pattern: 'hinge',  primary: ['posterior chain', 'glutes'] },
  { id: 'kb_swing_emom',            name: 'Kettlebell Swing EMOM',                 equipment: 'kettlebell',  pattern: 'hinge',  primary: ['posterior chain', 'glutes'] },
  { id: 'combo_single_arm_swing',   name: 'Single Arm Swing',                     equipment: 'kettlebell',  pattern: 'hinge',  primary: ['posterior chain', 'glutes'] },
  { id: 'skier_swing',              name: 'Skier Swing',                           equipment: 'kettlebell',  pattern: 'hinge',  primary: ['posterior chain', 'core'] },
  { id: 'staggered_rdl_swing',      name: 'Staggered RDL / Swing',                equipment: 'kettlebell',  pattern: 'hinge',  primary: ['hamstrings', 'glutes'] },
  { id: 'elevated_deadlift',        name: 'Elevated Deadlift',                    equipment: 'kettlebell',  pattern: 'hinge',  primary: ['posterior chain', 'hamstrings'] },
  { id: 'kb_sumo_deadlift',         name: 'Kettlebell Sumo Deadlift',             equipment: 'kettlebell',  pattern: 'hinge',  primary: ['glutes', 'hamstrings'] },
  { id: 'suitcase_deadlift',        name: 'Suitcase Deadlift',                    equipment: 'kettlebell',  pattern: 'hinge',  primary: ['posterior chain', 'core'] },
  { id: 'kb_rdl_density',           name: 'Kettlebell RDL',                       equipment: 'kettlebell',  pattern: 'hinge',  primary: ['hamstrings', 'glutes'] },
  { id: 'single_leg_rdl',           name: 'Single Leg RDL',                       equipment: 'kettlebell',  pattern: 'hinge',  primary: ['hamstrings', 'glutes'] },
  { id: 'single_leg_hip_thrust',    name: 'Single Leg Hip Thrust',                equipment: 'bodyweight',  pattern: 'hinge',  primary: ['glutes', 'hamstrings'] },

  // Squats & Lunges
  { id: 'staggered_squat',          name: 'Staggered Squat',                      equipment: 'kettlebell',  pattern: 'squat',  primary: ['quads', 'glutes'] },
  { id: 'double_kb_squat',          name: 'Double Kettlebell Squat',              equipment: 'kettlebell',  pattern: 'squat',  primary: ['quads', 'glutes'] },
  { id: 'offset_squat',             name: 'Offset Squat',                         equipment: 'kettlebell',  pattern: 'squat',  primary: ['quads', 'glutes'] },
  { id: 'goblet_squat_1_5',         name: 'Goblet Squat (1.5 reps)',              equipment: 'kettlebell',  pattern: 'squat',  primary: ['quads', 'glutes'] },
  { id: 'kb_bulgarian_split_squat', name: 'KB Bulgarian Split Squat',             equipment: 'kettlebell',  pattern: 'squat',  primary: ['quads', 'glutes'] },
  { id: 'bulgarian_split_squat_hold', name: 'Bulgarian Split Squat Hold',         equipment: 'bodyweight',  pattern: 'squat',  primary: ['quads', 'glutes'] },
  { id: 'pistol_squat_box',         name: 'Pistol Squat to Box',                  equipment: 'bodyweight',  pattern: 'squat',  primary: ['quads', 'glutes'] },
  { id: 'kb_anterior_lunge',        name: 'Kettlebell Anterior Lunge',            equipment: 'kettlebell',  pattern: 'squat',  primary: ['quads', 'glutes'] },
  { id: 'offset_forward_lunge',     name: 'Offset Forward Lunge',                 equipment: 'kettlebell',  pattern: 'squat',  primary: ['quads', 'glutes'] },
  { id: 'offset_side_lunge',        name: 'Offset Side Lunge',                    equipment: 'kettlebell',  pattern: 'squat',  primary: ['quads', 'glutes', 'adductors'] },
  { id: 'lateral_lunge_kb_shift',   name: 'Lateral Lunge KB Weight Shift',        equipment: 'kettlebell',  pattern: 'squat',  primary: ['quads', 'glutes', 'adductors'] },
  { id: 'step_over_lunge',          name: 'Step Over Lunge',                      equipment: 'kettlebell',  pattern: 'squat',  primary: ['quads', 'glutes'] },
  { id: 'combo_offset_reverse_lunge', name: 'Offset Reverse Lunge',              equipment: 'kettlebell',  pattern: 'squat',  primary: ['quads', 'glutes'] },
  { id: 'double_clean_reverse_lunge', name: 'Double Clean to Reverse Lunge',      equipment: 'kettlebell',  pattern: 'power',  primary: ['legs', 'posterior chain'] },

  // Pressing
  { id: 'kb_floor_press',           name: 'Kettlebell Floor Press',               equipment: 'kettlebell',  pattern: 'push',   primary: ['chest', 'triceps'] },
  { id: 'kb_bench_press_p1',        name: 'Kettlebell Bench Press',               equipment: 'kettlebell',  pattern: 'push',   primary: ['chest', 'triceps'] },
  { id: 'kb_bench_press_p2',        name: 'Kettlebell Bench Press (Phase 2)',      equipment: 'kettlebell',  pattern: 'push',   primary: ['chest', 'triceps'] },
  { id: 'half_kneeling_press',      name: 'Half Kneeling Press',                  equipment: 'kettlebell',  pattern: 'push',   primary: ['shoulders', 'core'] },
  { id: 'push_press_complex',       name: 'Push Press',                           equipment: 'kettlebell',  pattern: 'push',   primary: ['shoulders', 'legs'] },
  { id: 'single_arm_incline_press_1_5', name: 'Single Arm Incline Press (1.5 reps)', equipment: 'kettlebell', pattern: 'push', primary: ['chest', 'shoulders'] },
  { id: 'controlled_pushups',       name: 'Pushups (Controlled Cadence)',         equipment: 'bodyweight',  pattern: 'push',   primary: ['chest', 'triceps'] },
  { id: 'explosive_pushup',         name: 'Explosive Pushups',                    equipment: 'bodyweight',  pattern: 'power',  primary: ['chest', 'triceps'] },
  { id: 'pushup_hold',              name: 'Pushup Hold (Half-Down)',              equipment: 'bodyweight',  pattern: 'push',   primary: ['chest', 'core'] },
  { id: 'pushup_shoulder_tap',      name: 'Pushup Shoulder Tap',                  equipment: 'bodyweight',  pattern: 'push',   primary: ['chest', 'core'] },
  { id: 'push_away_pushup',         name: 'Push Away Push Up',                    equipment: 'bodyweight',  pattern: 'push',   primary: ['chest', 'shoulders'] },
  { id: 'pike_pushup_iso',          name: 'Pike Push Up ISO Hold',                equipment: 'bodyweight',  pattern: 'push',   primary: ['shoulders'] },
  { id: 'yoga_pushup',              name: 'Yoga Pushup',                          equipment: 'bodyweight',  pattern: 'push',   primary: ['chest', 'shoulders', 'core'] },

  // Pulling & Rows
  { id: 'single_arm_supported_row', name: '1-Arm Supported Row + Hold',           equipment: 'kettlebell',  pattern: 'pull',   primary: ['back', 'biceps'] },
  { id: 'single_arm_row_hold_1_5',  name: '1-Arm Row Hold (1.5 reps)',            equipment: 'kettlebell',  pattern: 'pull',   primary: ['back', 'biceps'] },
  { id: 'single_arm_row_hold_15s',  name: '1-Arm Row Hold (15 seconds)',          equipment: 'kettlebell',  pattern: 'pull',   primary: ['back', 'biceps'] },
  { id: 'kb_alternating_row',       name: 'Kettlebell Alternating Row',           equipment: 'kettlebell',  pattern: 'pull',   primary: ['back', 'biceps'] },
  { id: 'gorilla_row',              name: 'Gorilla Row',                          equipment: 'kettlebell',  pattern: 'pull',   primary: ['back', 'biceps'] },
  { id: 'bent_row',                 name: 'Bent Row (Suitcase)',                  equipment: 'kettlebell',  pattern: 'pull',   primary: ['back'] },
  { id: 'core_row',                 name: 'Core Row',                             equipment: 'kettlebell',  pattern: 'pull',   primary: ['back', 'core'] },
  { id: 'crawl_renegade_row',       name: 'Crawl Position Renegade Row',          equipment: 'kettlebell',  pattern: 'pull',   primary: ['back', 'core'] },
  { id: 'combo_row',                name: 'Combo: Row',                           equipment: 'kettlebell',  pattern: 'pull',   primary: ['back'] },
  { id: 'oh_pulls',                 name: 'Overhead Pulls',                       equipment: 'kettlebell',  pattern: 'pull',   primary: ['back', 'shoulders'] },
  { id: 'kb_crush_curl',            name: 'Kettlebell Crush Curl',                equipment: 'kettlebell',  pattern: 'pull',   primary: ['biceps'] },

  // Power / Cleans / Complexes
  { id: 'kb_clean_press',           name: 'Kettlebell Clean + Press',             equipment: 'kettlebell',  pattern: 'power',  primary: ['posterior chain', 'shoulders'] },
  { id: 'kb_clean_goblet_squat_density', name: 'KB Clean to Goblet Squat',       equipment: 'kettlebell',  pattern: 'power',  primary: ['posterior chain', 'quads'] },
  { id: 'kb_clean_goblet_halo',     name: 'KB Clean to Goblet Squat with Halo',  equipment: 'kettlebell',  pattern: 'power',  primary: ['full body'] },
  { id: 'kb_deadlift_jump',         name: 'Kettlebell Deadlift Jump',             equipment: 'kettlebell',  pattern: 'power',  primary: ['posterior chain', 'legs'] },
  { id: 'combo_rot_clean',          name: 'Rotational Clean',                     equipment: 'kettlebell',  pattern: 'power',  primary: ['posterior chain', 'core'] },
  { id: 'combo_squat_rot_press',    name: 'Squat + Rotational Press',             equipment: 'kettlebell',  pattern: 'power',  primary: ['quads', 'shoulders'] },
  { id: 'squat_jump',               name: 'Squat Jump',                           equipment: 'bodyweight',  pattern: 'power',  primary: ['quads', 'glutes'] },
  { id: 'broad_jump',               name: 'Broad Jump',                           equipment: 'bodyweight',  pattern: 'power',  primary: ['glutes', 'legs'] },
  { id: 'jumping_lunge',            name: 'Jumping Lunge',                        equipment: 'bodyweight',  pattern: 'power',  primary: ['quads', 'glutes'] },
  { id: 'pulse_squats',             name: 'Pulse Squats (Jump every 4th)',        equipment: 'bodyweight',  pattern: 'power',  primary: ['quads', 'glutes'] },

  // Carries
  { id: 'oh_waiter_walk',           name: 'Overhead Waiter Walk',                 equipment: 'kettlebell',  pattern: 'carry',  primary: ['core', 'shoulders'] },

  // Core
  { id: 'rkc_plank',                name: 'RKC Plank',                            equipment: 'bodyweight',  pattern: 'core',   primary: ['core'] },
  { id: 'hollow_hold',              name: 'Hollow Hold',                          equipment: 'bodyweight',  pattern: 'core',   primary: ['core'] },
  { id: 'hollow_hold_c2',           name: 'Hollow Hold',                          equipment: 'bodyweight',  pattern: 'core',   primary: ['core'] },
  { id: 'hollow_hold_pull_through', name: 'Hollow Hold Pull-Through',             equipment: 'bodyweight',  pattern: 'core',   primary: ['core'] },
  { id: 'v_sit',                    name: 'V Sits',                               equipment: 'bodyweight',  pattern: 'core',   primary: ['core'] },
  { id: 'sit_through',              name: 'Sit-Through / Sit-Out',               equipment: 'bodyweight',  pattern: 'core',   primary: ['core', 'hips'] },
  { id: 'crawl_c1p2',              name: 'Crawl',                                equipment: 'bodyweight',  pattern: 'core',   primary: ['core', 'shoulders'] },
  { id: 'crawl_pull_through_frog_pushup', name: 'Crawl Pull-Through + Frog Pushup', equipment: 'bodyweight', pattern: 'core', primary: ['core', 'chest'] },

  // Cardio / Conditioning
  { id: 'lateral_slides_c1',        name: 'Lateral Slides',                       equipment: 'bodyweight',  pattern: 'cardio', primary: ['legs', 'hips'] },
  { id: 'lateral_slides_c1p2',      name: 'Lateral Slides',                       equipment: 'bodyweight',  pattern: 'cardio', primary: ['legs', 'hips'] },
  { id: 'lateral_high_knees',       name: 'Lateral Slides + High Knees',          equipment: 'bodyweight',  pattern: 'cardio', primary: ['legs', 'core'] },
  { id: 'sprint_high_knees',        name: 'Sprint / High Knees',                  equipment: 'bodyweight',  pattern: 'cardio', primary: ['legs', 'core'] },
  { id: 'mountain_climber',         name: 'Mountain Climbers / Shuttle Sprints',   equipment: 'bodyweight',  pattern: 'cardio', primary: ['core', 'legs'] },
]

const EXERCISE_DETAILS: Record<string, Partial<ExerciseDetail>> = {
  kb_swing_c1p2:          { category: 'Ballistic', description: 'Hip-driven hinge that loads the posterior chain explosively. The bell floats — never lifted with the arms.', cues: ['Hike the bell back high between thighs', 'Snap hips through hard at the top', 'Float, don\'t lift — bell finishes around chest height', 'Brace abs at lockout', 'Let gravity drop the bell'], secondary: ['hamstrings', 'lats', 'core', 'grip'], youtubeId: 'dCQjEYr-pUg', duration: '0:54' },
  kb_clean_press:         { category: 'Ballistic', description: 'Brings the bell from the hike position to rack, then presses overhead. Conditions the whole body.', cues: ['Tame the arc — keep elbow close to ribs', 'Receive softly in the rack', 'Press strict from the rack — full lockout'], secondary: ['traps', 'core', 'forearms'], youtubeId: null, duration: null },
  half_kneeling_press:    { category: 'Strength', description: 'Strict press from a half-kneeling position. Challenges core stability and shoulder mechanics.', cues: ['Square hips to the front', 'Brace the glute of the down knee', 'Press without rotating the torso'], secondary: ['core', 'triceps'], youtubeId: null, duration: null },
  gorilla_row:            { category: 'Strength', description: 'Alternating row with two bells on the floor. The hip hinge holds tension through the set.', cues: ['Maintain a flat back in the hinge', 'Pull elbow to hip, not shoulder', 'Control the bell back to the floor'], secondary: ['biceps', 'rear delts', 'core'], youtubeId: null, duration: null },
  rkc_plank:              { category: 'Core', description: 'Intensified plank: posteriorly tilt the pelvis, squeeze glutes, pull elbows toward toes. Much harder than a standard plank.', cues: ['Posterior pelvic tilt — flatten the low back', 'Squeeze every muscle', 'Breathe in short pulses'], secondary: ['glutes', 'shoulders'], youtubeId: null, duration: null },
  hollow_hold:            { category: 'Core', description: 'Gymnastics core position: lower back pressed to floor, arms and legs hovering.', cues: ['Press low back into the floor', 'Tuck the chin slightly', 'Lower limbs only as far as you can maintain the hollow'], secondary: ['hip flexors'], youtubeId: null, duration: null },
  single_arm_supported_row: { category: 'Strength', description: 'Row with the opposite hand braced on the bell or bench. Adds an isometric hold at the top.', cues: ['Pull elbow to hip', 'Hold 1–2 seconds at the top', 'Don\'t rotate the torso'], secondary: ['biceps', 'rear delts'], youtubeId: null, duration: null },
  staggered_squat:        { category: 'Strength', description: 'Offset stance squat — one foot slightly back. Shifts load toward the front leg.', cues: ['Sit between the heels', 'Keep chest tall', 'Drive evenly through both feet'], secondary: ['glutes', 'core'], youtubeId: null, duration: null },
  elevated_deadlift:      { category: 'Strength', description: 'Deadlift from an elevated surface (plates or step) for extra range of motion.', cues: ['Reach the floor with a flat back', 'Drive the floor away', 'Full hip extension at the top'], secondary: ['glutes', 'erectors'], youtubeId: null, duration: null },
  oh_waiter_walk:         { category: 'Loaded carry', description: 'Walk with bell locked out overhead. Demands shoulder stability and full-body tension.', cues: ['Pack the lat, don\'t shrug', 'Tall posture, ribs down', 'Smooth steps — don\'t let the bell drift'], secondary: ['obliques', 'grip', 'traps'], youtubeId: null, duration: null },
}

export const SUBSTITUTIONS: Record<string, string[]> = {}

export function getExerciseDetail(idOrEx: string | Exercise): ExerciseDetail | null {
  const ex = typeof idOrEx === 'string' ? EXERCISES.find(e => e.id === idOrEx) : idOrEx
  if (!ex) return null
  const d = EXERCISE_DETAILS[ex.id] || {}
  return {
    ...ex,
    category:    d.category    ?? (ex.pattern ? ex.pattern[0].toUpperCase() + ex.pattern.slice(1) : 'General'),
    description: d.description ?? `${ex.name} — ${ex.pattern} pattern using ${ex.equipment}.`,
    cues:        d.cues        ?? ['Set up with intention', 'Move through full range', 'Control the eccentric'],
    secondary:   d.secondary   ?? [],
    youtubeId:   d.youtubeId   ?? null,
    duration:    d.duration    ?? null,
  }
}
