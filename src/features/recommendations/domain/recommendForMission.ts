import { missionRecommendationCatalog } from '@/content/missionRecommendations';
import type { MissionType } from '@/features/missions/domain';
import type { MissionRecommendationCandidate, RankedMissionRecommendation, RecommendationPreferences } from './models';

export function recommendForMission(
  missionType: MissionType,
  preferences: RecommendationPreferences,
  catalog: readonly MissionRecommendationCandidate[] = missionRecommendationCatalog,
): RankedMissionRecommendation[] {
  const selectedPreferences = new Set([preferences.style === 'romantic' ? '浪漫派' : '實用派', ...preferences.preferenceTags]);
  return catalog
    .filter((candidate) => candidate.missionType === missionType)
    .filter((candidate) => !intersects(candidate.blockedByDietary, preferences.dietaryPreferences))
    .filter((candidate) => !intersects(candidate.blockedByLandmines, preferences.landmines))
    .map((candidate) => ({
      ...candidate,
      matchedPreferences: (candidate.preferenceMatches ?? []).filter((tag) => selectedPreferences.has(tag)),
    }))
    .sort((left, right) => right.matchedPreferences.length - left.matchedPreferences.length || left.id.localeCompare(right.id));
}

function intersects(blockers: string[] | undefined, selected: string[]): boolean {
  return blockers?.some((blocker) => selected.includes(blocker)) ?? false;
}
