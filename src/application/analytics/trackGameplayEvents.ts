import type { MissionCompletion } from '@/features/missions/application/completeMission';
import type { Mission } from '@/features/missions/domain';
import type { AnalyticsService } from '@/infrastructure/analytics';

export function getMissionAnalyticsProperties(mission: Mission, now: Date) {
  return {
    mission_id: mission.id,
    mission_type: mission.template.eventType,
    mission_source: 'system',
    difficulty: 'normal',
    days_before_due: Math.ceil((mission.successUntil.getTime() - now.getTime()) / 86_400_000),
  };
}

export function trackMissionResolution(analytics: AnalyticsService, completion: MissionCompletion, mission: Mission, completedAt: Date, previousRank: number): void {
  const eventName = completion.result === 'success' ? 'mission_complete' : completion.result === 'late' ? 'mission_late' : 'mission_fail';
  const missionProperties = getMissionAnalyticsProperties(mission, completedAt);
  const rankProperties = { rank_before: previousRank, rank_after: completion.gameState.rankScore };
  analytics.track({ name: eventName, properties: { ...missionProperties, ...rankProperties, exp_delta: completion.reward.expDelta } });
  if (completion.gameState.rankScore > previousRank) analytics.track({ name: 'rank_up', properties: rankProperties });
  if (completion.gameState.rankScore < previousRank) analytics.track({ name: 'rank_down', properties: rankProperties });
  completion.unlockedItems.forEach((item) => analytics.track({ name: 'collection_unlock', properties: { ...missionProperties, collection_type: item.type } }));
  if (completion.createdGraves.length > 0) analytics.track({ name: 'gg', properties: rankProperties });
}
