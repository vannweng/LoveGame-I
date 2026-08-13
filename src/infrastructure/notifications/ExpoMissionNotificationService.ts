import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

import type { MissionNotificationService, NotificationPermission } from './MissionNotificationService';
import { getCopy } from '@/content';

const channelId = 'mission-reminders';

export class ExpoMissionNotificationService implements MissionNotificationService {
  async requestPermission(): Promise<NotificationPermission> {
    if (Platform.OS === 'web') return 'denied';
    const current = await Notifications.getPermissionsAsync();
    const finalStatus = current.status === 'granted'
      ? current.status
      : (await Notifications.requestPermissionsAsync()).status;
    if (Platform.OS === 'android' && finalStatus === 'granted') await this.ensureAndroidChannel();
    return finalStatus === 'granted' ? 'granted' : 'denied';
  }

  async scheduleMissionReminder(input: { missionId: string; scheduledAt: Date }): Promise<string> {
    await this.ensureAndroidChannel();
    return Notifications.scheduleNotificationAsync({
      content: {
        title: getCopy('NOTIFICATION_TITLE'),
        body: getCopy('NOTIFICATION_BODY'),
        data: { missionId: input.missionId, deepLink: `lovegame://missions/${input.missionId}` },
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: input.scheduledAt, channelId },
    });
  }

  async cancelScheduledReminder(notificationId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  subscribeToMissionOpen(listener: (missionId: string) => void): () => void {
    if (Platform.OS === 'web') return () => undefined;
    let active = true;
    const notify = (response: Notifications.NotificationResponse | null) => {
      const missionId = response?.notification.request.content.data.missionId;
      if (active && typeof missionId === 'string') listener(missionId);
    };
    void Notifications.getLastNotificationResponseAsync().then(notify);
    const subscription = Notifications.addNotificationResponseReceivedListener(notify);
    return () => { active = false; subscription.remove(); };
  }

  private async ensureAndroidChannel(): Promise<void> {
    if (Platform.OS !== 'android') return;
    await Notifications.setNotificationChannelAsync(channelId, {
      name: getCopy('NOTIFICATION_CHANNEL'), importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
}
