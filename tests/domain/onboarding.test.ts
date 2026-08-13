import assert from 'node:assert/strict';
import test from 'node:test';

import { advanceOnboarding } from '../../src/domain/onboarding';

test('onboarding advances through every resumable status', () => {
  assert.equal(advanceOnboarding('intro'), 'profile');
  assert.equal(advanceOnboarding('profile'), 'notificationExplained');
  assert.equal(advanceOnboarding('notificationExplained'), 'identity');
  assert.equal(advanceOnboarding('identity'), 'tutorial');
  assert.equal(advanceOnboarding('tutorial'), 'reward');
  assert.equal(advanceOnboarding('reward'), 'completed');
});

test('completed onboarding remains completed', () => {
  assert.equal(advanceOnboarding('completed'), 'completed');
});
