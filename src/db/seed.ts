import { db } from './db'
import programData from '../../programs/8-week-kettlebell-program.json'
import type { ProgramRecord, SessionRecord, SettingsRecord } from './types'

export async function seedIfNeeded(): Promise<void> {
  // Check if already seeded
  if (typeof localStorage !== 'undefined' && localStorage.getItem('kb.seeded')) {
    return
  }

  // Use a transaction to ensure atomicity
  await db.transaction('rw', db.programs, db.sessions, db.settings, async () => {
    // Insert program record
    const programRecord: ProgramRecord = {
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
      status: 'active',
      phaseIndex: 0,
      weekIndex: 0,
      dayIndex: 0,
      startedAt: Date.now(),
    }

    await db.programs.add(programRecord)

    // Insert all session templates as SessionRecords
    const sessions: SessionRecord[] = programData.session_templates.map((template: any) => ({
      sessionId: template.session_id,
      programId: programData.program_id,
      template: {
        session_id: template.session_id,
        metadata: template.metadata,
        blocks: template.blocks,
      },
      loadMultiplier: 1,
    }))

    await db.sessions.bulkAdd(sessions)

    // Insert default settings
    const defaultSettings: SettingsRecord = {
      id: 1,
      unit: 'lb',
      leadIn: 5,
      sound: true,
      haptics: true,
      restDefaults: { straight: 90, superset: 90, circuit: 60 },
    }

    await db.settings.add(defaultSettings)
  })

  // Mark as seeded in localStorage
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('kb.seeded', '1')
  }
}
