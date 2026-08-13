import type { RankIdentity } from '../../features/missions/domain/models';
import { gameRules } from '@/content/gameRules';

export function getRankIdentity(rankScore: number): RankIdentity {
  return gameRules.rankIdentities.find((rule) => rankScore >= rule.minRank)?.identity ?? 'GG';
}
