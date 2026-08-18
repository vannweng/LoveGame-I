export type DailyGameplayMode = 'crisis' | 'safe';
export type DailyGameplayStage = 'safe' | 'offered' | 'accepted' | 'action' | 'reporting' | 'resolved' | 'nextHook';

export interface DailyGameplayState {
  mode: DailyGameplayMode;
  stage: DailyGameplayStage;
  nextHookId: string;
  safeActionId: string;
}

export interface DailyGameplayConfig {
  safeAction: DailyGameplayContent;
  nextHooks: DailyGameplayContent[];
}

export interface DailyGameplayContent {
  id: string;
  titleKey: string;
  descriptionKey: string;
}

export type DailyGameplayEvent = 'accept' | 'beginAction' | 'openReport' | 'resolve' | 'completeSafeAction' | 'showNextHook' | 'returnHome';
