import type { CollectionState } from '@/features/collection/domain';
import type { GameState, Mission } from '@/features/missions/domain';
import type { Relationship } from '@/features/relationship/domain';

export interface GameplaySession {
  relationship: Relationship;
  mission: Mission;
  gameState: GameState;
  collectionState: CollectionState;
}

export interface GameplayRepository {
  /** Temporary prototype aggregate. Replace with feature repositories in the Firestore composition root. */
  loadForUser(userId: string): Promise<GameplaySession>;
}
