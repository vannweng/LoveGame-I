import type { AnalyticsService } from '@/infrastructure/analytics';
import type { ImportantDateMissionTemplateId, MissionGenerationResult, MissionGenerationService } from './MissionGenerationService';

export async function createMissionAndTrack(
  generationService: MissionGenerationService,
  analytics: AnalyticsService,
  templateId: ImportantDateMissionTemplateId,
  sourceImportantDateId?: string,
): Promise<MissionGenerationResult> {
  const result = await generationService.create(templateId, sourceImportantDateId);
  if (result.created && result.analytics) {
    analytics.track({
      name: 'mission_create',
      properties: {
        days_before_due: result.analytics.daysBeforeDue,
        difficulty: result.analytics.difficulty,
        mission_id: result.missionId,
        mission_source: result.analytics.missionSource,
        mission_type: result.analytics.missionType,
      },
    });
  }
  return result;
}
