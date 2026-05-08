import type { SessionType } from '../db/types'

export type BlockType = 'strength' | 'superset' | 'amrap' | 'emom' | 'density' | 'complex' | 'conditioning'
export type ChipColor = 'work' | 'rest' | 'accent' | 'default'

export interface SetSpec {
  exerciseId: string
  sets: string        // "3-4"
  reps: string        // "8" | "8-10" | "35 sec" | "AMRAP" | "8 min"
  restSec: number
  supersetWith?: string  // exerciseId of partner
  notes?: string
}

export interface Block {
  name: string
  type: BlockType
  durationMin?: number   // for timed blocks
  sets: SetSpec[]
  color: ChipColor
}

export interface ProgramSession {
  type: SessionType
  name: string
  estimatedMin: number
  blocks: Block[]
}

export interface PhaseWeek {
  phase: 1 | 2
  weekNumbers: number[]
  dailyRitual: string[]   // exerciseIds
  warmup: string[]        // exerciseIds
  sessions: Record<SessionType, ProgramSession>
}

// ── Phase 1 (Weeks 1–4) ───────────────────────────────────────────────────────
const phase1: PhaseWeek = {
  phase: 1,
  weekNumbers: [1, 2, 3, 4],
  dailyRitual: [
    'neck-mobility', 'shoulder-mobility', 'rf-stretch',
    'cat-camel', 'hamstring-switches', '90-90',
    'side-hip-bending', 'spinal-roll-spiderman',
  ],
  warmup: [
    'childs-pose-spiderman', 'thai-sit-shinbox', 'squat-to-stand',
    'yoga-pushup-reach', 'lateral-lunge-overhead',
    'end-range-iso-holds', 'glute-bridge-march', 'pogo-jumps-high-knees',
  ],
  sessions: {
    strength1: {
      type: 'strength1',
      name: 'Strength 1 — Squat & Pull',
      estimatedMin: 55,
      blocks: [
        {
          name: 'Squat Superset',
          type: 'superset',
          color: 'work',
          sets: [
            { exerciseId: 'double-kb-squat', sets: '3-4', reps: '8', restSec: 0, supersetWith: 'gorilla-row' },
            { exerciseId: 'gorilla-row', sets: '3-4', reps: '8', restSec: 75 },
          ],
        },
        {
          name: 'Lunge & Press',
          type: 'strength',
          color: 'work',
          sets: [
            { exerciseId: 'kb-anterior-lunge', sets: '3', reps: '8-10', restSec: 60 },
            { exerciseId: 'kb-clean-press', sets: '3', reps: '8-10', restSec: 60 },
          ],
        },
        {
          name: 'Finisher',
          type: 'strength',
          color: 'default',
          sets: [
            { exerciseId: 'bulgarian-split-squat-hold', sets: '2', reps: '35 sec', restSec: 45 },
            { exerciseId: 'hollow-hold', sets: '2', reps: '35 sec', restSec: 30 },
            { exerciseId: 'pushup-hold', sets: '2', reps: '35 sec', restSec: 30 },
          ],
        },
        {
          name: 'Bonus',
          type: 'emom',
          color: 'accent',
          durationMin: 10,
          sets: [
            { exerciseId: 'kb-swing', sets: '1', reps: '100-200', restSec: 0, notes: 'Complete all reps; record time' },
          ],
        },
      ],
    },
    strength2: {
      type: 'strength2',
      name: 'Strength 2 — Hinge & Press',
      estimatedMin: 50,
      blocks: [
        {
          name: 'Deadlift & Press',
          type: 'strength',
          color: 'work',
          sets: [
            { exerciseId: 'kb-sumo-deadlift', sets: '3-4', reps: '10-12', restSec: 75 },
            { exerciseId: 'kb-floor-press', sets: '3-4', reps: '10-12', restSec: 75 },
          ],
        },
        {
          name: 'Lunge & Row',
          type: 'strength',
          color: 'work',
          sets: [
            { exerciseId: 'offset-forward-lunge', sets: '3', reps: '8', restSec: 60 },
            { exerciseId: 'core-row', sets: '3', reps: '8', restSec: 60 },
          ],
        },
        {
          name: 'Complex',
          type: 'complex',
          color: 'accent',
          sets: [
            { exerciseId: 'kb-complex-s2', sets: '3', reps: '6 each side', restSec: 90 },
          ],
        },
        {
          name: 'Bonus EMOM',
          type: 'emom',
          color: 'accent',
          durationMin: 8,
          sets: [
            { exerciseId: 'kb-swing-emom', sets: '6-8', reps: '8-12', restSec: 0 },
          ],
        },
      ],
    },
    strength3: {
      type: 'strength3',
      name: 'Strength 3 — Lower & Density',
      estimatedMin: 50,
      blocks: [
        {
          name: 'Lower Body',
          type: 'strength',
          color: 'work',
          sets: [
            { exerciseId: 'kb-bulgarian-split-squat', sets: '3-4', reps: '8', restSec: 75 },
            { exerciseId: 'kb-bench-press', sets: '3-4', reps: '10', restSec: 75 },
          ],
        },
        {
          name: 'Density Block 1',
          type: 'density',
          color: 'accent',
          durationMin: 8,
          sets: [
            { exerciseId: 'density-rdl-yoga', sets: 'AMRAP', reps: '8 each', restSec: 0 },
          ],
        },
        {
          name: 'Density Block 2',
          type: 'density',
          color: 'accent',
          durationMin: 8,
          sets: [
            { exerciseId: 'density-goblet-row', sets: 'AMRAP', reps: '10 + 15 sec hold', restSec: 0 },
          ],
        },
      ],
    },
    conditioning1: {
      type: 'conditioning1',
      name: 'Conditioning 1 — Anaerobic',
      estimatedMin: 35,
      blocks: [
        {
          name: 'Anaerobic Circuit',
          type: 'conditioning',
          color: 'accent',
          durationMin: 20,
          sets: [
            { exerciseId: 'conditioning-circuit-p1c1', sets: '3-4', reps: '30s on / 30s rest', restSec: 90 },
          ],
        },
      ],
    },
    conditioning2: {
      type: 'conditioning2',
      name: 'Conditioning 2 — Full Body',
      estimatedMin: 35,
      blocks: [
        {
          name: 'Full Body Circuit',
          type: 'conditioning',
          color: 'accent',
          durationMin: 20,
          sets: [
            { exerciseId: 'conditioning-circuit-p1c2', sets: '3-4', reps: '40s on / 20s rest', restSec: 120 },
          ],
        },
      ],
    },
  },
}

// ── Phase 2 (Weeks 5–8) ───────────────────────────────────────────────────────
const phase2: PhaseWeek = {
  phase: 2,
  weekNumbers: [5, 6, 7, 8],
  dailyRitual: [
    'ankle-pails-rails', 'quadruped-hip-cars',
    'frog-stretch', 'adductor-pails-rails',
  ],
  warmup: [
    'high-knee-pull-lunge', 'inchworm', 'scorpion',
    'single-leg-dd-spiderman', 'windmill', 'thread-the-needle',
    'glute-3-way', 'slalom-jumps-heidens',
  ],
  sessions: {
    strength1: {
      type: 'strength1',
      name: 'Strength 1 — Squat & Power',
      estimatedMin: 55,
      blocks: [
        {
          name: 'Squat Superset',
          type: 'superset',
          color: 'work',
          sets: [
            { exerciseId: 'staggered-squat', sets: '3-4', reps: '8', restSec: 0, supersetWith: 'squat-jump' },
            { exerciseId: 'squat-jump', sets: '3-4', reps: '5', restSec: 75 },
          ],
        },
        {
          name: 'Upper Body',
          type: 'strength',
          color: 'work',
          sets: [
            { exerciseId: 'single-arm-row-hold', sets: '3-4', reps: '10', restSec: 60 },
            { exerciseId: 'half-kneeling-press', sets: '3-4', reps: '8-10', restSec: 60 },
          ],
        },
        {
          name: 'Accessory',
          type: 'strength',
          color: 'default',
          sets: [
            { exerciseId: 'offset-side-lunge', sets: '3', reps: '8', restSec: 60 },
            { exerciseId: 'pistol-squat-to-box', sets: '2-3', reps: '5', restSec: 60 },
            { exerciseId: 'single-leg-hip-thrust', sets: '2-3', reps: '10', restSec: 45 },
            { exerciseId: 'pike-pushup-iso', sets: '2-3', reps: '20-30 sec', restSec: 45 },
          ],
        },
      ],
    },
    strength2: {
      type: 'strength2',
      name: 'Strength 2 — Hinge & Power',
      estimatedMin: 50,
      blocks: [
        {
          name: 'Hinge Superset',
          type: 'superset',
          color: 'work',
          sets: [
            { exerciseId: 'elevated-dl', sets: '3-4', reps: '8-10', restSec: 0, supersetWith: 'broad-jump' },
            { exerciseId: 'broad-jump', sets: '3-4', reps: '5', restSec: 75 },
          ],
        },
        {
          name: 'Press & Row',
          type: 'strength',
          color: 'work',
          sets: [
            { exerciseId: 'single-arm-incline-press', sets: '3', reps: '8 (1.5 rep)', restSec: 60 },
            { exerciseId: 'double-clean-reverse-lunge', sets: '3', reps: '6-8', restSec: 60 },
            { exerciseId: 'renegade-row', sets: '3', reps: '6-8', restSec: 60 },
          ],
        },
        {
          name: 'Bonus EMOM',
          type: 'emom',
          color: 'accent',
          durationMin: 15,
          sets: [
            { exerciseId: 'kb-swing-emom', sets: '15', reps: '6-10', restSec: 0 },
          ],
        },
      ],
    },
    strength3: {
      type: 'strength3',
      name: 'Strength 3 — Single Leg & Density',
      estimatedMin: 55,
      blocks: [
        {
          name: 'Single Leg',
          type: 'strength',
          color: 'work',
          sets: [
            { exerciseId: 'single-leg-rdl', sets: '3-4', reps: '8', restSec: 75 },
            { exerciseId: 'kb-bench-press', sets: '3-4', reps: '10', restSec: 75 },
          ],
        },
        {
          name: 'Density Block 1',
          type: 'density',
          color: 'accent',
          durationMin: 8,
          sets: [
            { exerciseId: 'density-staggered-rdl', sets: 'AMRAP', reps: '8 + 10', restSec: 0 },
          ],
        },
        {
          name: 'Density Block 2',
          type: 'density',
          color: 'accent',
          durationMin: 8,
          sets: [
            { exerciseId: 'density-clean-goblet', sets: 'AMRAP', reps: '10 + 15 sec', restSec: 0 },
          ],
        },
      ],
    },
    conditioning1: {
      type: 'conditioning1',
      name: 'Conditioning 1 — Lateral Power',
      estimatedMin: 35,
      blocks: [
        {
          name: 'Lateral Power Circuit',
          type: 'conditioning',
          color: 'accent',
          durationMin: 20,
          sets: [
            { exerciseId: 'conditioning-circuit-p2c1', sets: '4', reps: '40s on / 20s rest', restSec: 90 },
          ],
        },
      ],
    },
    conditioning2: {
      type: 'conditioning2',
      name: 'Conditioning 2 — Full Body',
      estimatedMin: 35,
      blocks: [
        {
          name: 'Full Body Circuit',
          type: 'conditioning',
          color: 'accent',
          durationMin: 20,
          sets: [
            { exerciseId: 'conditioning-circuit-p2c2', sets: '4', reps: '40s on / 20s rest', restSec: 90 },
          ],
        },
      ],
    },
  },
}

export const programWeeks: PhaseWeek[] = [phase1, phase2]

// Session order within a week — fixed schedule
export const SESSION_ORDER: SessionType[] = [
  'strength1', 'conditioning1', 'strength2', 'conditioning2', 'strength3',
]

export function getPhaseForWeek(week: number): PhaseWeek {
  return week <= 4 ? phase1 : phase2
}

export function getSession(week: number, sessionType: SessionType): ProgramSession {
  return getPhaseForWeek(week).sessions[sessionType]
}

// Given total completed sessions (0-indexed), return current week (1-8) and session type
export function progressFromCompletedSessions(completed: number): {
  week: number
  sessionType: SessionType
  sessionIndexInWeek: number
} {
  const week = Math.min(8, Math.floor(completed / SESSION_ORDER.length) + 1)
  const sessionIndexInWeek = completed % SESSION_ORDER.length
  return { week, sessionType: SESSION_ORDER[sessionIndexInWeek], sessionIndexInWeek }
}
