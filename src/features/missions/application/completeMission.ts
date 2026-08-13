import {
  calculateReward,
  resolveMission,
  updateGameState,
} from '@/features/missions/domain';
import { evaluateCollectionUnlocks } from '@/features/collection/domain';
import type { CollectionItem, CollectionState, GraveRecord } from '@/features/collection/domain';
import type {
  GameState,
  Mission,
  MissionResult,
  RewardResult,
} from '@/features/missions/domain';

export interface MissionCompletion {
  collectionState: CollectionState;
  createdGraves: GraveRecord[];
  gameState: GameState;
  result: MissionResult;
  reward: RewardResult;
  unlockedItems: CollectionItem[];
}

export function completeMission(
  mission: Mission,
  gameState: GameState,
  collectionState: CollectionState,
  completedAt: Date,
): MissionCompletion {
  const result = resolveMission(mission, completedAt);
  const reward = calculateReward(mission, result);
  const nextGameState = updateGameState(gameState, result, reward);
  const collection = evaluateCollectionUnlocks({
    collectionState,
    previousRankScore: gameState.rankScore,
    nextCombo: nextGameState.combo,
    nextRankScore: nextGameState.rankScore,
    missionResult: result,
    occurredAt: completedAt,
  });

  return {
    result,
    reward,
    gameState: nextGameState,
    collectionState: collection.collectionState,
    createdGraves: collection.createdGraves,
    unlockedItems: collection.unlockedItems,
  };
}
