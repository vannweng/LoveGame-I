import type { Mission, MissionResult } from './models';

export function resolveMission(
  mission: Mission,
  completedAt: Date,
): MissionResult {
  if (completedAt < mission.successUntil) {
    return 'success';
  }

  if (completedAt < mission.failAt) {
    return 'late';
  }

  return 'fail';
}
