import assert from 'node:assert/strict';
import test from 'node:test';

import { createDevelopmentOnboarding, createDevelopmentSession } from '@/application/dev/developmentScenario';

const now = new Date('2026-08-13T12:00:00+08:00');

test('GG development scenario seeds the terminal rank and grave collection', () => {
  const session = createDevelopmentSession('gg', now);
  assert.equal(session.gameState.rankScore, -10);
  assert.equal(session.collectionState.graves.length, 1);
  assert.equal(session.collectionState.items[0]?.type, 'grave');
});

test('birthday D-5 development scenario seeds a completed profile with a five-day birthday', () => {
  const onboarding = createDevelopmentOnboarding('birthday-d5', now);
  assert.equal(onboarding.status, 'completed');
  assert.equal(onboarding.profile?.birthday, '2026-08-18');
});
