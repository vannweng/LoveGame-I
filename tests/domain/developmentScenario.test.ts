import assert from 'node:assert/strict';
import test from 'node:test';

import { createConfiguredActivityBoard, createConfiguredDailyGameplay, createConfiguredOnboarding, createDevelopmentDailyGameplay, createDevelopmentOnboarding, createDevelopmentSession, getConfiguredDevelopmentNow } from '@/application/dev/developmentScenario';

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

test('daily gameplay scenarios can start directly from reporting and next hook', () => {
  assert.equal(createDevelopmentDailyGameplay('mission-reporting').stage, 'reporting');
  assert.equal(createDevelopmentDailyGameplay('next-hook').stage, 'nextHook');
});

test('configured DEV options combine a weekend, important date, and independent card progress', () => {
  const now = getConfiguredDevelopmentNow('saturday');
  const config = { date: 'saturday' as const, important: 'birthday-d5' as const, daily: 'done1' as const, weekly: 'done2' as const };
  const onboarding = createConfiguredOnboarding(config, now);
  const board = createConfiguredActivityBoard(config, now);

  assert.equal(now.getDay(), 6);
  assert.equal(onboarding.profile?.birthday, '2026-08-20');
  assert.equal(board.daily.completedTemplateIds.length, 1);
  assert.equal(board.weekly.completedTemplateIds.length, 2);
  assert.equal(createConfiguredDailyGameplay(config).mode, 'crisis');
});
