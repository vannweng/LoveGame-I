import type { MissionType } from '@/features/missions/domain';

export interface RecommendationPreferences {
  style: 'romantic' | 'practical';
  preferenceTags: string[];
  dietaryPreferences: string[];
  landmines: string[];
}

export interface MissionRecommendationCandidate {
  id: string;
  missionType: MissionType;
  title: string;
  description: string;
  preferenceMatches?: string[];
  blockedByDietary?: string[];
  blockedByLandmines?: string[];
}

export interface RankedMissionRecommendation extends MissionRecommendationCandidate {
  matchedPreferences: string[];
}
