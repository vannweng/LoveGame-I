export interface MissionGenerationAnalytics {
  daysBeforeDue: number;
  difficulty: 'normal';
  missionSource: 'system';
  missionType: 'birthday';
}

export interface MissionGenerationResult {
  analytics?: MissionGenerationAnalytics;
  created: boolean;
  missionId: string;
  status?: 'active' | 'scheduled';
}

export interface MissionGenerationService {
  create(templateId: 'birthday-dinner'): Promise<MissionGenerationResult>;
}
