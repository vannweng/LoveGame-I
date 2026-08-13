import type {
  Mission,
  MissionResult,
  RewardResult,
} from './models';

const LATE_EXP = 5;

export function calculateReward(
  mission: Mission,
  result: MissionResult,
): RewardResult {
  if (result === 'success') {
    return {
      expDelta: mission.rewardExp,
      comboDelta: 1,
      rankDelta: mission.importance === 'survival' ? 1 : 0,
    };
  }

  if (result === 'late') {
    return { expDelta: LATE_EXP, comboDelta: 0, rankDelta: 0 };
  }

  return {
    expDelta: 0,
    comboDelta: 0,
    rankDelta: mission.importance === 'survival' ? -1 : 0,
  };
}
