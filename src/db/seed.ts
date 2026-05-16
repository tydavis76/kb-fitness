import { db } from './db'
import programData from '../../programs/8-week-kettlebell-program.json'
import type { ProgramRecord, SessionRecord, WorkoutSession } from './types'

// Runs on every app start. Upserts static data from JSON while preserving
// user-mutable state (progress, loadMultiplier). This means JSON changes
// (block names, prescriptions, etc.) are always reflected immediately.
export async function seedIfNeeded(): Promise<void> {
  const existingProgram = await db.programs
    .where('programId').equals(programData.program_id).first()

  const programRecord: ProgramRecord = {
    id: existingProgram?.id,
    programId: programData.program_id,
    title: programData.title,
    author: programData.author,
    phases: programData.phases.map((p: any) => ({
      id: p.id,
      name: p.name,
      weeks: p.weeks.length,
      description: p.notes || '',
    })),
    weeklyStructure: programData.weekly_structure,
    // Preserve user progress; initialize on first run
    status: existingProgram?.status ?? 'active',
    phaseIndex: existingProgram?.phaseIndex ?? 0,
    weekIndex: existingProgram?.weekIndex ?? 0,
    dayIndex: existingProgram?.dayIndex ?? 0,
    startedAt: existingProgram?.startedAt ?? Date.now(),
  }

  await db.programs.put(programRecord)

  for (const template of programData.session_templates) {
    const existing = await db.sessions
      .where('sessionId').equals(template.session_id).first()

    const sessionRecord: SessionRecord = {
      id: existing?.id,
      sessionId: template.session_id,
      programId: programData.program_id,
      // Always take template from JSON so block names / prescriptions stay fresh
      template: {
        session_id: template.session_id,
        metadata: template.metadata,
        blocks: template.blocks,
      } as WorkoutSession,
      loadMultiplier: existing?.loadMultiplier ?? 1,
    }

    await db.sessions.put(sessionRecord)
  }

  // Seed default settings once
  const settings = await db.settings.get(1)
  if (!settings) {
    await db.settings.add({
      id: 1,
      unit: 'lb',
      leadIn: 5,
      sound: true,
      haptics: true,
      restDefaults: { straight: 90, superset: 90, circuit: 60 },
      ownedKettlebells: [16, 20, 24, 32],
      sideSwitchSec: 5,
    })
  }
}
