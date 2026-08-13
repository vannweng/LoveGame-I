import type { ScheduledMissionReminder } from '@/features/missions/domain';

export interface MissionReminderRepository {
  get(missionId: string): Promise<ScheduledMissionReminder | null>;
  save(reminder: ScheduledMissionReminder): Promise<void>;
  remove(missionId: string): Promise<void>;
}
