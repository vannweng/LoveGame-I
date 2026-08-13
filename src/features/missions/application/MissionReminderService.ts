import type { Mission } from '@/features/missions/domain';
import { planMissionReminder } from '@/features/missions/domain';
import type { MissionReminderRepository } from '@/features/missions/data/MissionReminderRepository';
import type { MissionNotificationService } from '@/infrastructure/notifications/MissionNotificationService';

export type ReminderSyncResult = 'scheduled' | 'unchanged' | 'notScheduled' | 'permissionDenied';

export class MissionReminderService {
  constructor(
    private readonly repository: MissionReminderRepository,
    private readonly notifications: MissionNotificationService,
  ) {}

  async sync(mission: Mission, now = new Date()): Promise<ReminderSyncResult> {
    const planned = planMissionReminder(mission, now);
    const existing = await this.repository.get(mission.id);
    if (existing?.fingerprint === planned?.fingerprint) return 'unchanged';

    if (existing) {
      await this.notifications.cancelScheduledReminder(existing.notificationId);
      await this.repository.remove(mission.id);
    }
    if (!planned) return 'notScheduled';
    if (await this.notifications.requestPermission() !== 'granted') return 'permissionDenied';

    const notificationId = await this.notifications.scheduleMissionReminder({
      missionId: mission.id, scheduledAt: planned.scheduledAt,
    });
    await this.repository.save({ ...planned, notificationId });
    return 'scheduled';
  }

  subscribeToMissionOpen(listener: (missionId: string) => void): () => void {
    return this.notifications.subscribeToMissionOpen(listener);
  }
}
