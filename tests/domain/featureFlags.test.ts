import assert from 'node:assert/strict';
import test from 'node:test';

import { featureFlags } from '@/application/config/featureFlags';

test('unapproved integration flags default to disabled', () => {
  assert.equal(featureFlags.actionHub, true);
  assert.equal(featureFlags.aiRecommendation, false);
  assert.equal(featureFlags.restaurant, false);
  assert.equal(featureFlags.calendar, false);
});
