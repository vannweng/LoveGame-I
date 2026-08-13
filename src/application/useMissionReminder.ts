import { useEffect } from 'react';

import type { Mission } from '../domain/gameplay';
import { LocalMissionReminderRepository } from '../data/local/LocalMissionReminderRepository';
import { ExpoMissionNotificationService } from '../services/notifications';
import { MissionReminderService } from './MissionReminderService';

const reminderService = new MissionReminderService(
  new LocalMissionReminderRepository(),
  new ExpoMissionNotificationService(),
);

export function useMissionReminder(
  mission: Mission | null,
  enabled: boolean,
  onMissionOpen: (missionId: string) => void,
): void {
  useEffect(() => {
    if (!enabled || !mission) return;
    void reminderService.sync(mission);
  }, [enabled, mission]);

  useEffect(() => {
    if (!enabled) return;
    return reminderService.subscribeToMissionOpen(onMissionOpen);
  }, [enabled, onMissionOpen]);
}

export async function requestMissionNotificationPermission(): Promise<void> {
  await new ExpoMissionNotificationService().requestPermission();
}
