export type MissionResult = 'success' | 'late' | 'fail';
export type MissionImportance = 'survival' | 'normal';
export type MissionEventType = 'birthday' | 'tutorial';
export type MissionType = 'date_dinner' | 'first_reminder';
export type RankIdentity = '英雄守護者' | '生還者' | '探索者' | '普通人' | '偷懶鬼' | '勇者' | 'GG';

export interface Mission {
  id: string;
  importance: MissionImportance;
  successUntil: Date;
  failAt: Date;
  template: MissionTemplate;
}

export interface MissionTemplate {
  id: string;
  eventType: MissionEventType;
  missionType: MissionType;
  trigger: MissionTrigger;
  titleKey: ContentKey;
  descriptionKey: ContentKey;
  reward: MissionRewardConfig;
  rankImpact: MissionRankImpactConfig;
  successCopyKey: ContentKey;
  lateCopyKey: ContentKey;
  failCopyKey: ContentKey;
}

export type ContentKey = string;

export interface MissionTrigger {
  eventOffsetDays: number;
  reminderOffsetDays: number;
  successDays: number;
}

export type MissionRewardConfig = Record<MissionResult, RewardValues>;

export interface RewardValues {
  comboDelta: number;
  expDelta: number;
}

export interface MissionRankImpactConfig {
  appliesTo: MissionImportance;
  fail: number;
  late: number;
  success: number;
}

export interface GameState {
  exp: number;
  combo: number;
  rankScore: number;
  status: 'danger' | 'safe' | 'gg';
}

export interface RewardResult {
  expDelta: number;
  comboDelta: number;
  rankDelta: number;
}

export interface MissionReminderPlan {
  missionId: Mission['id'];
  scheduledAt: Date;
  fingerprint: string;
}

export interface ScheduledMissionReminder extends MissionReminderPlan {
  notificationId: string;
}
