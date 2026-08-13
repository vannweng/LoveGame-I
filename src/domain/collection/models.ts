import type { MissionResult } from '../gameplay';

export type CollectionItemType = 'title' | 'grave';

export interface CollectionItem {
  id: string;
  type: CollectionItemType;
  name: string;
  unlockedAt: Date;
}

export interface GraveRecord {
  id: string;
  createdAt: Date;
  reason: 'rank_reached_negative_ten';
  rankScore: -10;
}

export interface CollectionState {
  items: CollectionItem[];
  graves: GraveRecord[];
}

export interface CollectionEvaluationInput {
  collectionState: CollectionState;
  previousRankScore: number;
  nextCombo: number;
  nextRankScore: number;
  missionResult: MissionResult;
  occurredAt: Date;
}

export interface CollectionEvaluationResult {
  collectionState: CollectionState;
  unlockedItems: CollectionItem[];
  createdGraves: GraveRecord[];
}
