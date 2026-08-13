import assert from 'node:assert/strict';
import test from 'node:test';

import { evaluateCollectionUnlocks } from '@/features/collection/domain';
import type { CollectionState } from '@/features/collection/domain';

const emptyCollection: CollectionState = { items: [], graves: [] };
const occurredAt = new Date('2026-08-10T12:00:00+08:00');

test('first completed mission unlocks the first survival title', () => {
  const result = evaluateCollectionUnlocks({
    collectionState: emptyCollection,
    previousRankScore: 0,
    nextCombo: 4,
    nextRankScore: 1,
    missionResult: 'success',
    occurredAt,
  });

  assert.deepEqual(result.unlockedItems, [
    {
      id: 'title:first-survived',
      type: 'title',
      name: '第一次活下來',
      unlockedAt: occurredAt,
    },
  ]);
});

test('Combo 5 unlocks the combo title', () => {
  const result = evaluateCollectionUnlocks({
    collectionState: emptyCollection,
    previousRankScore: 3,
    nextCombo: 5,
    nextRankScore: 4,
    missionResult: 'success',
    occurredAt,
  });

  assert.equal(result.unlockedItems[0]?.name, '第一次活下來');
  assert.equal(result.unlockedItems[1]?.name, '開始有點東西');
});

test('Rank -10 creates a grave record and grave collection item', () => {
  const result = evaluateCollectionUnlocks({
    collectionState: emptyCollection,
    previousRankScore: -9,
    nextCombo: 0,
    nextRankScore: -10,
    missionResult: 'fail',
    occurredAt,
  });

  assert.deepEqual(result.createdGraves, [
    {
      id: 'grave:rank-negative-ten',
      createdAt: occurredAt,
      reason: 'rank_reached_negative_ten',
      rankScore: -10,
    },
  ]);
  assert.equal(result.unlockedItems[0]?.type, 'grave');
});

test('existing collection items and graves are not unlocked twice', () => {
  const firstResult = evaluateCollectionUnlocks({
    collectionState: emptyCollection,
    previousRankScore: -9,
    nextCombo: 5,
    nextRankScore: -10,
    missionResult: 'success',
    occurredAt,
  });
  const secondResult = evaluateCollectionUnlocks({
    collectionState: firstResult.collectionState,
    previousRankScore: -10,
    nextCombo: 6,
    nextRankScore: -10,
    missionResult: 'success',
    occurredAt,
  });

  assert.deepEqual(secondResult.unlockedItems, []);
  assert.deepEqual(secondResult.createdGraves, []);
});
