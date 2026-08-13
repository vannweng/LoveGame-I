import type {
  Mission,
  MissionResult,
  RewardResult,
} from '../../features/missions/domain/models';

export function calculateReward(
  mission: Mission,
  result: MissionResult,
): RewardResult {
  const reward = mission.template.reward[result];
  const rankDelta = mission.importance === mission.template.rankImpact.appliesTo
    ? mission.template.rankImpact[result]
    : 0;

  return {
    expDelta: reward.expDelta,
    comboDelta: reward.comboDelta,
    rankDelta,
  };
}
