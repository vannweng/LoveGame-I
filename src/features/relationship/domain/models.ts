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
  marriageDate?: string;
  birthday?: string;
  customImportantDates: CustomImportantDate[];
  userNickname?: string;
  relationshipMotto?: string;
  relationshipStatus?: RelationshipStatus;
  preferences?: RelationshipPreferences;
}

export interface CustomImportantDate {
  title: string;
  date: string;
  recurrence: 'yearly';
  importance: 'survival' | 'normal';
}

export type RelationshipStatus = 'dating' | 'married';

export interface RelationshipPreferences {
  style: 'romantic' | 'practical';
  preferenceTags: string[];
  dietaryPreferences: string[];
  landmines: string[];
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
