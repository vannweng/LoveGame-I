import type { CollectionState } from '@/features/collection/domain';
import type { GameState, Mission } from '@/features/missions/domain';
import type { Relationship } from '@/features/relationship/domain';
import type { RunHistoryState } from '@/game/run';

export interface GameplaySession {
  relationship: Relationship;
  mission: Mission;
  gameState: GameState;
  collectionState: CollectionState;
  runHistory: RunHistoryState;
}

export interface GameplayRepository {
  loadForUser(userId: string): Promise<GameplaySession>;
  saveProgress(userId: string, progress: GameplayProgress): Promise<void>;
}

export type GameplayProgress = Pick<GameplaySession, 'collectionState' | 'gameState' | 'runHistory'>;
