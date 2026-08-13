import type { GameState, RewardResult } from '../../missions/domain';

export interface Relationship {
  id: string;
  ownerUserId: string;
  partnerDisplayName: string;
  timezone: string;
}

export type OnboardingStatus = 'intro' | 'profile' | 'notificationExplained' | 'identity' | 'tutorial' | 'reward' | 'completed';

export interface RelationshipProfile {
  partnerNickname: string;
  relationshipStartDate: string;
  birthday?: string;
  customImportantDates: CustomImportantDate[];
}

export interface CustomImportantDate {
  title: string;
  date: string;
}

export interface TutorialReward {
  reward: RewardResult;
  gameState: GameState;
}

export interface OnboardingState {
  status: OnboardingStatus;
  profile: RelationshipProfile | null;
  tutorialReward: TutorialReward | null;
}
