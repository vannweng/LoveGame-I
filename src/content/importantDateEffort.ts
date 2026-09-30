import type { ImportantDateMissionTemplateId } from '@/features/missions/application/MissionGenerationService';
import type { ImportantDateEffortLevel } from '@/features/relationship/domain';

export const importantDateEffortTemplates: Readonly<Record<ImportantDateEffortLevel, readonly ImportantDateMissionTemplateId[]>> = {
  full: ['birthday-dinner', 'birthday-gift', 'birthday-cinema', 'birthday-card', 'birthday-itinerary'],
  balanced: ['birthday-gift', 'birthday-card', 'birthday-itinerary'],
  minimal: ['birthday-itinerary'],
};

export function getMissionTemplateIdsForEffort(level: ImportantDateEffortLevel): readonly ImportantDateMissionTemplateId[] {
  return importantDateEffortTemplates[level];
}
