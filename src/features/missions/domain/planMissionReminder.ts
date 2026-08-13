import type { Mission, MissionReminderPlan } from './models';

export function planMissionReminder(mission: Mission, now: Date): MissionReminderPlan | null {
  const scheduledAt = new Date(
    mission.successUntil.getTime() - mission.template.trigger.reminderOffsetDays * 86_400_000,
  );

  if (scheduledAt.getTime() <= now.getTime()) return null;

  return {
    missionId: mission.id,
    scheduledAt,
    fingerprint: `${mission.id}:${mission.template.id}:${scheduledAt.toISOString()}:${mission.successUntil.toISOString()}`,
  };
}
