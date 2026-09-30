import assert from 'node:assert/strict';
import test from 'node:test';

import { getMissionTemplateIdsForEffort } from '@/content';

test('full effort enables all five important-date missions', () => {
  assert.deepEqual(getMissionTemplateIdsForEffort('full'), [
    'birthday-dinner', 'birthday-gift', 'birthday-cinema', 'birthday-card', 'birthday-itinerary',
  ]);
});

test('balanced effort keeps gift, card, and itinerary missions', () => {
  assert.deepEqual(getMissionTemplateIdsForEffort('balanced'), [
    'birthday-gift', 'birthday-card', 'birthday-itinerary',
  ]);
});

test('minimal effort keeps only itinerary confirmation', () => {
  assert.deepEqual(getMissionTemplateIdsForEffort('minimal'), ['birthday-itinerary']);
});
