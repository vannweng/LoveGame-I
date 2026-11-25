import type { MissionType } from '@/features/missions/domain';

export interface RecommendationPreferences {
  style: 'romantic' | 'practical';
  preferenceTags: string[];
  dietaryPreferences: string[];
  landmines: string[];
}

export interface RecommendationDestination {
  provider: 'Pinkoi' | 'EZTABLE';
  url: string;
}

export interface RecommendationPrice {
  amountTwd: number;
  basis: 'product' | 'bookingFrom';
  checkedAt: string;
}

export interface MissionRecommendationCandidate {
  id: string;
  missionType: MissionType;
  title: string;
  description: string;
  preferenceMatches?: string[];
  blockedByDietary?: string[];
  blockedByLandmines?: string[];
  destination?: RecommendationDestination;
  price?: RecommendationPrice;
  city?: string;
}

export interface RankedMissionRecommendation extends MissionRecommendationCandidate {
  matchedPreferences: string[];
}
