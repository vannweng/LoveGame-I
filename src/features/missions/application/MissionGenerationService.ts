export interface MissionGenerationAnalytics {
  daysBeforeDue: number;
  difficulty: 'normal';
  missionSource: 'system';
  missionType: 'important_date';
}

export interface MissionGenerationResult {
  analytics?: MissionGenerationAnalytics;
  created: boolean;
  missionId: string;
  status?: 'active' | 'scheduled';
}

export type ImportantDateMissionTemplateId =
  | 'birthday-dinner'
  | 'birthday-gift'
  | 'birthday-cinema'
  | 'birthday-card'
  | 'birthday-itinerary';

export interface MissionGenerationService {
  create(templateId: ImportantDateMissionTemplateId, sourceImportantDateId?: string): Promise<MissionGenerationResult>;
}
