import type { GameState, RewardResult } from '../../missions/domain';

export interface Relationship {
  id: string;
  ownerUserId: string;
  partnerDisplayName: string;
  timezone: string;
}

export type OnboardingStatus = 'identity' | 'singleIntro' | 'crushes' | 'partnerName' | 'partnerReward' | 'tutorial' | 'reward' | 'completed';
export type RelationshipMode = 'single' | 'partnered';

export interface CrushCandidate {
  id: 'crush-a' | 'crush-b' | 'crush-c';
  nickname: string;
}

export interface RelationshipProfile {
  partnerNickname: string;
  relationshipStartDate?: string;
  marriageDate?: string;
  birthday?: string;
  customImportantDates: CustomImportantDate[];
  importantDateEffort?: BuiltInImportantDateEffort;
  userNickname?: string;
  relationshipMotto?: string;
  relationshipStatus?: RelationshipStatus;
  preferences?: RelationshipPreferences;
}

export interface CustomImportantDate {
  id?: string;
  title: string;
  date: string;
  recurrence: 'yearly';
  importance: 'survival' | 'normal';
  effortLevel?: ImportantDateEffortLevel;
}

export type ImportantDateEffortLevel = 'full' | 'balanced' | 'minimal';

export interface BuiltInImportantDateEffort {
  birthday?: ImportantDateEffortLevel;
  marriageAnniversary?: ImportantDateEffortLevel;
  relationshipAnniversary?: ImportantDateEffortLevel;
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
  relationshipMode: RelationshipMode | null;
  crushCandidates: CrushCandidate[];
  activeCrushId: CrushCandidate['id'] | null;
  profile: RelationshipProfile | null;
  tutorialReward: TutorialReward | null;
}
