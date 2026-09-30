import assert from 'node:assert/strict';
import test from 'node:test';
import { getFirestore } from '../../functions/node_modules/firebase-admin/lib/firestore/index.js';
import { createMission } from '../../functions/src/index.js';
const db = getFirestore();
let sequence = 0;

test('createMission derives a birthday mission from the server profile and deduplicates it', async () => {
  const userId = `create-test-${Date.now()}-${sequence += 1}`;
  const save = db.doc(`users/${userId}/saves/default`);
  await save.set({ ownerUserId: userId, schemaVersion: 1, timezone: 'Asia/Taipei' });
  await save.collection('profile').doc('current').set({ birthday: '2026-12-30', partnerNickname: 'P2' });

  const first = await createMission.run(callCreateAs(userId, 'birthday-dinner'));
  const second = await createMission.run(callCreateAs(userId, 'birthday-dinner'));
  const mission = await save.collection('missions').doc(first.missionId).get();

  assert.equal(first.created, true);
  assert.equal(second.created, false);
  assert.equal(second.missionId, first.missionId);
  assert.equal(mission.data()?.template.id, 'birthday-dinner');
  assert.equal(mission.data()?.sourceImportantDateId, 'birthday');
  assert.equal(mission.data()?.eventDate, '2026-12-01');
  assert.equal(mission.data()?.targetDate, '2026-12-30');
  assert.equal(mission.data()?.successUntil.toDate().toISOString(), '2026-12-09T16:00:00.000Z');
  assert.match(mission.data()?.generationKey, /^birthday:\d{4}-12-30:birthday-dinner$/);
  assert.equal(mission.data()?.failAt.toDate().toISOString(), '2026-12-29T16:00:00.000Z');
});

test('createMission rejects an unapproved template', async () => {
  await assert.rejects(createMission.run(callCreateAs('any-user', 'client-supplied-reward')), { code: 'invalid-argument' });
});

test('createMission accepts every approved important-date template', async () => {
  const templateIds = ['birthday-dinner', 'birthday-gift', 'birthday-cinema', 'birthday-card', 'birthday-itinerary'];
  const userId = `catalog-test-${Date.now()}-${sequence += 1}`;
  const save = db.doc(`users/${userId}/saves/default`);
  await save.set({ ownerUserId: userId, schemaVersion: 1, timezone: 'Asia/Taipei' });
  await save.collection('profile').doc('current').set({ birthday: '2026-12-30', partnerNickname: 'P2' });
  const results = await Promise.all(templateIds.map((id) => createMission.run(callCreateAs(userId, id))));
  assert.deepEqual(results.map((result) => result.created), [true, true, true, true, true]);
  const missions = await Promise.all(results.map((result) => save.collection('missions').doc(result.missionId).get()));
  assert.deepEqual(
    missions.map((mission) => mission.data()?.failAt.toDate().toISOString()),
    Array(5).fill('2026-12-29T16:00:00.000Z'),
  );
  assert.deepEqual(
    missions.map((mission) => [mission.data()?.eventDate, mission.data()?.successUntil.toDate().toISOString()]),
    [
      ['2026-12-01', '2026-12-09T16:00:00.000Z'],
      ['2026-12-15', '2026-12-19T16:00:00.000Z'],
      ['2026-12-21', '2026-12-23T16:00:00.000Z'],
      ['2026-12-25', '2026-12-26T16:00:00.000Z'],
      ['2026-12-27', '2026-12-27T16:00:00.000Z'],
    ],
  );
});

test('createMission derives a normal mission from a custom important date', async () => {
  const userId = `custom-date-test-${Date.now()}-${sequence += 1}`;
  const save = db.doc(`users/${userId}/saves/default`);
  await save.set({ ownerUserId: userId, schemaVersion: 1, timezone: 'Asia/Taipei' });
  await save.collection('profile').doc('current').set({
    birthday: '2026-12-30', partnerNickname: 'P2',
    customImportantDates: [{ id: 'first-trip', title: '第一次旅行', date: '2026-09-01', importance: 'normal', recurrence: 'yearly' }],
  });

  const result = await createMission.run(callCreateAs(userId, 'birthday-gift', 'custom:first-trip'));
  const mission = await save.collection('missions').doc(result.missionId).get();

  assert.equal(mission.data()?.sourceImportantDateId, 'custom:first-trip');
  assert.match(mission.data()?.targetDate, /^\d{4}-09-01$/);
  assert.equal(mission.data()?.importance, 'normal');
  assert.equal(mission.data()?.effortLevel, 'full');
});

test('createMission enforces the selected effort template set', async () => {
  const userId = `effort-test-${Date.now()}-${sequence += 1}`;
  const save = db.doc(`users/${userId}/saves/default`);
  await save.set({ ownerUserId: userId, schemaVersion: 1, timezone: 'Asia/Taipei' });
  await save.collection('profile').doc('current').set({
    partnerNickname: 'P2', relationshipStartDate: '2025-08-13',
    customImportantDates: [{ id: 'simple-day', title: '簡單過', date: '2026-09-01', effortLevel: 'minimal', importance: 'normal' }],
  });

  await assert.rejects(
    createMission.run(callCreateAs(userId, 'birthday-gift', 'custom:simple-day')),
    { code: 'failed-precondition' },
  );
  const result = await createMission.run(callCreateAs(userId, 'birthday-itinerary', 'custom:simple-day'));
  const mission = await save.collection('missions').doc(result.missionId).get();
  assert.equal(mission.data()?.effortLevel, 'minimal');
});

test('same-year date sources and concurrent retries generate independent single missions', async () => {
  const userId = `occurrence-test-${Date.now()}-${sequence += 1}`;
  const save = db.doc(`users/${userId}/saves/default`);
  await save.set({ ownerUserId: userId, schemaVersion: 1, timezone: 'Asia/Taipei' });
  await save.collection('profile').doc('current').set({
    birthday: '2000-12-30', relationshipStartDate: '2020-12-30',
  });
  const results = await Promise.all([
    createMission.run(callCreateAs(userId, 'birthday-card', 'birthday')),
    createMission.run(callCreateAs(userId, 'birthday-card', 'relationshipAnniversary')),
    createMission.run(callCreateAs(userId, 'birthday-card', 'birthday')),
  ]);
  assert.equal(results[0].missionId, results[2].missionId);
  assert.notEqual(results[0].missionId, results[1].missionId);
  assert.equal((await save.collection('missions').get()).size, 2);
});

function callCreateAs(userId: string, templateId: string, sourceImportantDateId?: string): Parameters<typeof createMission.run>[0] {
  return { auth: { uid: userId }, data: { sourceImportantDateId, templateId } } as unknown as Parameters<typeof createMission.run>[0];
}
