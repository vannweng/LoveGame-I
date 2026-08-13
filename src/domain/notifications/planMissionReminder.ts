import type { Mission } from '../gameplay';

import type { MissionReminderPlan } from './models';

export function planMissionReminder(mission: Mission, now: Date): MissionReminderPlan | null {
  const scheduledAt = new Date(mission.successUntil.getTime() - 24 * 60 * 60 * 1000);

  if (scheduledAt.getTime() <= now.getTime()) return null;

  return {
    missionId: mission.id,
    scheduledAt,
    fingerprint: `${mission.id}:${mission.title}:${scheduledAt.toISOString()}:${mission.successUntil.toISOString()}`,
  };
}
