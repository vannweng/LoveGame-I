import assert from 'node:assert/strict';
import test from 'node:test';
import { createRequire } from 'node:module';
import { missionTemplates } from '@/content/missionTemplates';
import { calculateReward, updateGameState } from '@/features/missions/domain';
import type { GameState, Mission } from '@/features/missions/domain';

const require = createRequire(import.meta.url);
const { resolveGameState } = require('../../functions/src/resolveGameState.js');
const { createMissionDocument } = require('../../functions/src/createMissionDocument.js');
const { Timestamp } = require('../../functions/node_modules/firebase-admin/lib/firestore/index.js');

test('server and client agree on all results, importance values, and rank boundaries', () => {
  for (const importance of ['normal', 'survival'] as const) {
    for (const result of ['success', 'late', 'fail'] as const) {
      for (const rankScore of [-10, -9, 0, 9, 10]) {
        const previous: GameState = { rankScore, exp: 10, combo: 4, status: 'danger' };
        const mission: Mission = { id: 'test', importance, successUntil: new Date(), failAt: new Date(), template: missionTemplates['birthday-card'] };
        const reward = calculateReward(mission, result);
        assert.deepEqual(resolveGameState(mission, previous, result), { reward, gameState: updateGameState(previous, result, reward) });
      }
    }
  }
});

test('server occurrence key separates same-year events and retains save-timezone boundaries', () => {
  const create = (id: string) => createMissionDocument({ importantDate: { id, date: '2020-09-20', effortLevel: 'full', importance: 'survival' }, now: Timestamp.fromDate(new Date('2026-09-01T00:00:00Z')), template: missionTemplates['birthday-card'], timezone: 'Asia/Taipei' });
  const birthday = create('birthday');
  assert.notEqual(birthday.generationKey, create('custom:trip').generationKey);
  assert.equal(birthday.occurrenceKey, birthday.generationKey);
  assert.equal(birthday.failAt.toDate().toISOString(), '2026-09-19T16:00:00.000Z');
  assert.equal(birthday.successUntil.toDate().toISOString(), '2026-09-16T16:00:00.000Z');
});
