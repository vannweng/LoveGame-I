export type ActivityKind = 'daily' | 'milestone' | 'weekly';

export interface ActivityTemplate {
  id: string;
  kind: ActivityKind;
  title: string;
  description: string;
  reflectionPrompt: string;
  reflectionPlaceholder: string;
  exp: number;
}

export interface DailyActivityState {
  dayKey: string;
  templateId: string | null;
  rerolled: boolean;
  completedAt: string | null;
  reflection: string | null;
  previousTemplateId: string | null;
  deckTemplateIds: string[];
  completedTemplateIds: string[];
}

export interface WeeklyChallengeState {
  weekKey: string;
  templateId: string | null;
  completedAt: string | null;
  reflection: string | null;
  previousTemplateId: string | null;
  rerolled: boolean;
  deckTemplateIds: string[];
  completedTemplateIds: string[];
}

export interface ActivityBoardState {
  daily: DailyActivityState;
  rerollUsed: boolean;
  weekly: WeeklyChallengeState;
}

export interface ActivityCompletion {
  expDelta: number;
  state: ActivityBoardState;
}
