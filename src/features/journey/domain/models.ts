import type { GameplayProgress } from '@/features/missions/data/GameplayRepository';
import type { Mission, MissionResult } from '@/features/missions/domain';
import type { ImportantDateEffortLevel, RelationshipPreferences } from '@/features/relationship/domain';
import type { ActivityBoardState } from '@/features/activities/domain';

export interface JourneyEvent {
  sourceId: string;
  title: string;
  date: string;
  daysRemaining: number;
  importance: 'normal' | 'survival';
  effort: ImportantDateEffortLevel;
}

export interface JourneyTask {
  mission: Mission;
  opensAt: string;
  cardDraft?: string;
  result?: MissionResult;
  resolvedAt?: string;
}

export interface JourneyChapter {
  id: string;
  event: JourneyEvent;
  effort: ImportantDateEffortLevel;
  startedAt: string;
  completedAt?: string;
  reflection?: string;
  preferences: RelationshipPreferences;
  tasks: JourneyTask[];
  rulesetVersion: '0.2';
}

export interface JourneyState extends GameplayProgress {
  schemaVersion: 1;
  chapters: JourneyChapter[];
  activityBoard?: ActivityBoardState;
}
