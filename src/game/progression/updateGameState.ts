import type { GameState, MissionResult, RewardResult } from '../../features/missions/domain/models';
import { gameRules } from '@/content/gameRules';

export function updateGameState(
  currentState: GameState,
  result: MissionResult,
  reward: RewardResult,
): GameState {
  const combo = result === 'fail' ? 0 : currentState.combo + reward.comboDelta;
  const rankScore = clamp(currentState.rankScore + reward.rankDelta);

  return {
    exp: currentState.exp + reward.expDelta,
    combo,
    rankScore,
    status: rankScore >= gameRules.progression.safeRankThreshold ? 'safe' : 'danger',
  };
}

function clamp(rankScore: number): number {
  return Math.max(gameRules.progression.minRank, Math.min(gameRules.progression.maxRank, rankScore));
}
