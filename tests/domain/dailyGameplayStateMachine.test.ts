import assert from 'node:assert/strict';
import test from 'node:test';

import { createDailyGameplayState, transitionDailyGameplay } from '@/features/dailyGameplay/domain';

test('crisis loop progresses from offer through reporting to the next hook', () => {
  let state = createDailyGameplayState(true, 'combo-five', 'check-in');
  assert.equal(state.stage, 'offered');
  state = transitionDailyGameplay(state, 'accept');
  state = transitionDailyGameplay(state, 'beginAction');
  state = transitionDailyGameplay(state, 'openReport');
  state = transitionDailyGameplay(state, 'resolve');
  state = transitionDailyGameplay(state, 'showNextHook');
  assert.equal(state.stage, 'nextHook');
});

test('safe loop completes a free action before showing the next hook', () => {
  let state = createDailyGameplayState(false, 'combo-five', 'check-in');
  assert.equal(state.stage, 'safe');
  state = transitionDailyGameplay(state, 'completeSafeAction');
  assert.equal(state.stage, 'nextHook');
  state = transitionDailyGameplay(state, 'returnHome');
  assert.deepEqual(state, { mode: 'safe', stage: 'safe', nextHookId: 'combo-five', safeActionId: 'check-in' });
});

test('invalid transitions leave the gameplay state unchanged', () => {
  const state = createDailyGameplayState(true, 'combo-five', 'check-in');
  assert.equal(transitionDailyGameplay(state, 'resolve'), state);
});
