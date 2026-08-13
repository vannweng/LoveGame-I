import type { ScheduledMissionReminder } from '../../domain/notifications';
import type { MissionReminderRepository } from '../repositories/MissionReminderRepository';
import { secureStorage } from '../../services/storage/secureStorage';

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
