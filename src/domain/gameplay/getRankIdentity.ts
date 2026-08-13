import type { RankIdentity } from './models';

export function getRankIdentity(rankScore: number): RankIdentity {
  if (rankScore >= 7) {
    return '英雄守護者';
  }

  if (rankScore >= 4) {
    return '生還者';
  }

  if (rankScore >= 1) {
    return '探索者';
  }

  if (rankScore === 0) {
    return '普通人';
  }

  if (rankScore >= -3) {
    return '偷懶鬼';
  }

  if (rankScore >= -9) {
    return '勇者';
  }

  return 'GG';
}
