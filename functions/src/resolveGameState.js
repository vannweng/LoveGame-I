const { gameRules } = require('./gameRules');

exports.resolveGameState = (mission, previous, result) => {
  const reward = mission.template.reward[result];
  const rankDelta = (mission.importance ?? 'survival') === (mission.template.rankImpact.appliesTo ?? 'survival')
    ? mission.template.rankImpact[result] : 0;
  const rankScore = Math.max(gameRules.progression.minRank, Math.min(gameRules.progression.maxRank, previous.rankScore + rankDelta));
  return {
    reward: { ...reward, rankDelta },
    gameState: {
      exp: previous.exp + reward.expDelta,
      combo: result === 'fail' ? 0 : previous.combo + reward.comboDelta,
      rankScore,
      status: rankScore === gameRules.progression.minRank ? 'gg' : rankScore >= gameRules.progression.safeRankThreshold ? 'safe' : 'danger',
    },
  };
};
