import type { ScheduledMissionReminder } from '@/features/missions/domain';
import type { MissionReminderRepository } from '@/features/missions/data/MissionReminderRepository';
import { secureStorage } from '@/infrastructure/storage/secureStorage';

const storageKey = (missionId: string) => `lovegame:mission-reminder:${missionId}`;

export class LocalMissionReminderRepository implements MissionReminderRepository {
  async get(missionId: string): Promise<ScheduledMissionReminder | null> {
    const value = await secureStorage.getItem(storageKey(missionId));
    if (!value) return null;

    const parsed = JSON.parse(value) as Omit<ScheduledMissionReminder, 'scheduledAt'> & { scheduledAt: string };
    return { ...parsed, scheduledAt: new Date(parsed.scheduledAt) };
  }

  async save(reminder: ScheduledMissionReminder): Promise<void> {
    await secureStorage.setItem(storageKey(reminder.missionId), JSON.stringify(reminder));
  }

  async remove(missionId: string): Promise<void> {
    await secureStorage.removeItem(storageKey(missionId));
  }
}
