import { useEffect } from 'react';

import type { Mission } from '@/features/missions/domain';
import type { MissionNotificationService } from '@/infrastructure/notifications';
import { MissionReminderService } from './MissionReminderService';

export function useMissionReminder(
  mission: Mission | null,
  enabled: boolean,
  reminderService: MissionReminderService,
  onMissionOpen: (missionId: string) => void,
): void {
  useEffect(() => {
    if (!enabled || !mission) return;
    void reminderService.sync(mission);
  }, [enabled, mission, reminderService]);

  useEffect(() => {
    if (!enabled) return;
    return reminderService.subscribeToMissionOpen(onMissionOpen);
  }, [enabled, onMissionOpen, reminderService]);
}

export async function requestMissionNotificationPermission(
  notificationService: MissionNotificationService,
): Promise<void> {
  await notificationService.requestPermission();
}
