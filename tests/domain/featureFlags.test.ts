import assert from 'node:assert/strict';
import test from 'node:test';

import { featureFlags } from '@/application/config/featureFlags';

test('current release feature flags default to enabled', () => {
  assert.equal(featureFlags.actionHub, true);
  assert.equal(featureFlags.aiRecommendation, true);
  assert.equal(featureFlags.restaurant, true);
  assert.equal(featureFlags.calendar, true);
});
