import {
  calculateReward,
  resolveMission,
  updateGameState,
} from '../domain/gameplay';
import { evaluateCollectionUnlocks } from '../domain/collection';
import type { CollectionState } from '../domain/collection';
import type {
  GameState,
  Mission,
  MissionResult,
  RewardResult,
} from '../domain/gameplay';

export interface MissionCompletion {
  collectionState: CollectionState;
  gameState: GameState;
  result: MissionResult;
  reward: RewardResult;
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
  };
}
