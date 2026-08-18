import assert from 'node:assert/strict';
import test from 'node:test';

import { createRunHistory, recordRunResolution, reviveRun } from '@/game/run';

test('GG closes the active run and preserves its result history', () => {
  const now = new Date('2026-08-16T12:00:00+08:00');
  const state = recordRunResolution(createRunHistory(now, -9), {
    deathCause: 'MISSION_BIRTHDAY_DINNER_TITLE',
    occurredAt: now,
    result: 'fail',
    rankScore: -10,
  });

  assert.equal(state.activeRun, null);
  assert.deepEqual(state.completedRuns[0], {
    startedAt: now.toISOString(), highestRank: -9, successCount: 0, lateCount: 0, failCount: 1,
    endedAt: now.toISOString(), deathCause: 'MISSION_BIRTHDAY_DINNER_TITLE',
  });
});

test('rebirth returns to Rank -5 while preserving EXP, history, and a required oath', () => {
  const now = new Date('2026-08-16T12:00:00+08:00');
  const history = recordRunResolution(createRunHistory(now, -9), {
    deathCause: 'MISSION_BIRTHDAY_DINNER_TITLE', occurredAt: now, result: 'fail', rankScore: -10,
  });
  const outcome = reviveRun(history, { exp: 42, combo: 8, rankScore: -10, status: 'gg' }, ' 下次早點準備 ', now);

  assert.deepEqual(outcome.gameState, { exp: 42, combo: 0, rankScore: -5, status: 'danger' });
  assert.equal(outcome.runHistory.completedRuns[0].oath, '下次早點準備');
  assert.deepEqual(outcome.runHistory.activeRun, {
    startedAt: now.toISOString(), highestRank: -5, successCount: 0, lateCount: 0, failCount: 0,
  });
});

test('rebirth rejects an empty oath', () => {
  const now = new Date('2026-08-16T12:00:00+08:00');
  const history = recordRunResolution(createRunHistory(now, -9), {
    deathCause: 'MISSION_BIRTHDAY_DINNER_TITLE', occurredAt: now, result: 'fail', rankScore: -10,
  });

  assert.throws(
    () => reviveRun(history, { exp: 42, combo: 0, rankScore: -10, status: 'gg' }, '  ', now),
    /rebirth oath is required/i,
  );
});
