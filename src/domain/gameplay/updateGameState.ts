import type { GameState, MissionResult, RewardResult } from './models';

const MIN_RANK = -10;
const MAX_RANK = 10;

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
    status: rankScore >= 1 ? 'safe' : 'danger',
  };
}

function clamp(rankScore: number): number {
  return Math.max(MIN_RANK, Math.min(MAX_RANK, rankScore));
}
