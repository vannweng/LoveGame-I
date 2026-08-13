import type { CollectionState } from '../../domain/collection';
import type { GameState, Mission } from '../../domain/gameplay';
import type { Relationship } from '../../domain/relationship/models';

export interface GameplaySession {
  relationship: Relationship;
  mission: Mission;
  gameState: GameState;
  collectionState: CollectionState;
}

export interface GameplayRepository {
  loadForUser(userId: string): Promise<GameplaySession>;
}
