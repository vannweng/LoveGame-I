import type { ScheduledMissionReminder } from '../../domain/notifications';

export interface MissionReminderRepository {
  get(missionId: string): Promise<ScheduledMissionReminder | null>;
  save(reminder: ScheduledMissionReminder): Promise<void>;
  remove(missionId: string): Promise<void>;
}
