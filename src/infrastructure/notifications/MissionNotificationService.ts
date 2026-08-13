export type NotificationPermission = 'granted' | 'denied';

export interface MissionNotificationService {
  requestPermission(): Promise<NotificationPermission>;
  scheduleMissionReminder(input: { missionId: string; scheduledAt: Date }): Promise<string>;
  cancelScheduledReminder(notificationId: string): Promise<void>;
  subscribeToMissionOpen(listener: (missionId: string) => void): () => void;
}
