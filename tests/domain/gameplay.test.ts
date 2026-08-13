import assert from 'node:assert/strict';
import test from 'node:test';

import {
  calculateReward,
  getRankIdentity,
  resolveMission,
  updateGameState,
} from '../../src/domain/gameplay';
import type { GameState, Mission } from '../../src/domain/gameplay';

const mission: Mission = {
  id: 'birthday-dinner',
  title: '安排生日晚餐',
  importance: 'survival',
  successUntil: new Date('2026-08-15T00:00:00+08:00'),
  failAt: new Date('2026-08-20T00:00:00+08:00'),
  rewardExp: 20,
};

const initialState: GameState = {
  exp: 40,
  combo: 3,
  rankScore: 0,
  status: 'danger',
};

test('resolveMission returns success before the success deadline', () => {
  const result = resolveMission(mission, new Date('2026-08-10T12:00:00+08:00'));

  assert.equal(result, 'success');
});

test('resolveMission returns late after success deadline and before fail deadline', () => {
  const result = resolveMission(mission, new Date('2026-08-16T12:00:00+08:00'));

  assert.equal(result, 'late');
});

test('resolveMission returns fail at the anniversary deadline', () => {
  const result = resolveMission(mission, new Date('2026-08-20T00:00:00+08:00'));

  assert.equal(result, 'fail');
});

test('success calculates the approved +20 EXP, +1 Combo, and +1 Rank reward', () => {
  const reward = calculateReward(mission, 'success');

  assert.deepEqual(reward, { expDelta: 20, comboDelta: 1, rankDelta: 1 });
});

test('success updates the prototype state from danger to safe', () => {
  const reward = calculateReward(mission, 'success');
  const nextState = updateGameState(initialState, 'success', reward);

  assert.deepEqual(nextState, {
    exp: 60,
    combo: 4,
    rankScore: 1,
    status: 'safe',
  });
});

test('late grants +5 EXP while preserving Combo and Rank', () => {
  const reward = calculateReward(mission, 'late');
  const nextState = updateGameState(initialState, 'late', reward);

  assert.deepEqual(reward, { expDelta: 5, comboDelta: 0, rankDelta: 0 });
  assert.deepEqual(nextState, {
    exp: 45,
    combo: 3,
    rankScore: 0,
    status: 'danger',
  });
});

test('fail grants no EXP, resets Combo, and decrements Rank', () => {
  const reward = calculateReward(mission, 'fail');
  const nextState = updateGameState(initialState, 'fail', reward);

  assert.deepEqual(reward, { expDelta: 0, comboDelta: 0, rankDelta: -1 });
  assert.deepEqual(nextState, {
    exp: 40,
    combo: 0,
    rankScore: -1,
    status: 'danger',
  });
});

test('fail cannot lower Rank below -10', () => {
  const reward = calculateReward(mission, 'fail');
  const nextState = updateGameState(
    { ...initialState, combo: 7, rankScore: -10 },
    'fail',
    reward,
  );

  assert.equal(nextState.combo, 0);
  assert.equal(nextState.rankScore, -10);
});

test('getRankIdentity maps all approved rank boundaries', () => {
  const cases = [
    [-10, 'GG'],
    [-9, '勇者'],
    [-4, '勇者'],
    [-3, '偷懶鬼'],
    [-1, '偷懶鬼'],
    [0, '普通人'],
    [1, '探索者'],
    [3, '探索者'],
    [4, '生還者'],
    [6, '生還者'],
    [7, '英雄守護者'],
    [10, '英雄守護者'],
  ] as const;

  cases.forEach(([rankScore, identity]) => {
    assert.equal(getRankIdentity(rankScore), identity);
  });
});
