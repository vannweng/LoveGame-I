import type { GameplayProgress } from '@/features/missions/data/GameplayRepository';
import type { Mission, MissionResult } from '@/features/missions/domain';
import type { ImportantDateEffortLevel, RelationshipPreferences } from '@/features/relationship/domain';
import type { ActivityBoardState } from '@/features/activities/domain';
import type { CinemaReservation, DinnerReservation, ImportantDateItinerary } from './itineraryModels';
export type { BookingReport, CinemaReservation, DinnerReservation, ImportantDateItinerary, ItineraryItem, PlanLocation } from './itineraryModels';

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
  /** Persisted legacy field: suggested reminder time, never an action gate. */
  opensAt: string;
  cardDraft?: string;
  result?: MissionResult;
  resolvedAt?: string;
  dinnerReservation?: DinnerReservation;
  cinemaReservation?: CinemaReservation;
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
  itinerary?: ImportantDateItinerary;
  dinnerReservation?: DinnerReservation;
  cinemaReservation?: CinemaReservation;
  rulesetVersion: '0.2';
}

export interface JourneyState extends GameplayProgress {
  schemaVersion: 1;
  chapters: JourneyChapter[];
  activityBoard?: ActivityBoardState;
}
