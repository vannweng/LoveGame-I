/**
 * Server-side gameplay content. Keep these rules in data, rather than in the
 * transaction flow, so they can be reviewed and versioned as a single unit.
 *
 * This mirrors the MVP collection rules in src/content/gameRules.ts. Before
 * production rollout, move both consumers to one shared, versioned config.
 */
exports.gameRules = {
  progression: {
    maxRank: 10,
    minRank: -10,
    safeRankThreshold: 1,
  },
  collectionUnlocks: [
    {
      id: 'title:first-survived',
      type: 'title',
      name: '第一次活下來',
      condition: { kind: 'firstNonFail' },
    },
    {
      id: 'title:combo-five',
      type: 'title',
      name: '開始有點東西',
      condition: { kind: 'comboAtLeast', value: 5 },
    },
    {
      id: 'grave:rank-negative-ten',
      type: 'grave',
      name: '墓碑',
      condition: { kind: 'reachesRank', value: -10 },
    },
  ],
};
