import type { Mission } from '../gameplay';

export interface MissionReminderPlan {
  missionId: Mission['id'];
  scheduledAt: Date;
  fingerprint: string;
}

export interface ScheduledMissionReminder extends MissionReminderPlan {
  notificationId: string;
}
