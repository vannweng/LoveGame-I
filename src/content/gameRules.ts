import type { RankIdentity } from '@/features/missions/domain';

export const gameRules = {
  progression: { minRank: -10, maxRank: 10, safeRankThreshold: 1 },
  revival: {
    comboAfter: 0,
    oathRequired: true,
    rankAfter: -5,
    titleKey: 'REBIRTH_TITLE',
  },
  rankIdentities: [
    { minRank: 7, identity: '英雄守護者' },
    { minRank: 4, identity: '生還者' },
    { minRank: 1, identity: '探索者' },
    { minRank: 0, identity: '普通人' },
    { minRank: -3, identity: '偷懶鬼' },
    { minRank: -9, identity: '勇者' },
    { minRank: -10, identity: 'GG' },
  ] satisfies { identity: RankIdentity; minRank: number }[],
  collectionUnlocks: [
    { id: 'title:first-survived', type: 'title', name: '第一次活下來', condition: { kind: 'firstNonFail' } },
    { id: 'title:combo-five', type: 'title', name: '開始有點東西', condition: { kind: 'comboAtLeast', value: 5 } },
    { id: 'grave:rank-negative-ten', type: 'grave', name: '墓碑', condition: { kind: 'reachesRank', value: -10 } },
  ] as const,
} as const;
