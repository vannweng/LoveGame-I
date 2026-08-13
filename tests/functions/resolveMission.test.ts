import assert from 'node:assert/strict';
import test from 'node:test';

import { getFirestore, Timestamp } from '../../functions/node_modules/firebase-admin/lib/firestore/index.js';
import { resolveMission } from '../../functions/src/index.js';
const db = getFirestore();

let sequence = 0;

test('success resolves atomically and unlocks applicable collection items', async () => {
  const { missionRef, paths, userId } = await seedMission({
    progression: { combo: 4, exp: 10, rankScore: 0, status: 'danger' },
    result: 'success',
  });

  const response = await resolveMission.run(callAs(userId, missionRef.id));

  assert.equal(response.result, 'success');
  assert.deepEqual(response.reward, { comboDelta: 1, expDelta: 20, rankDelta: 1 });
  assert.deepEqual((await paths.progression.get()).data(), {
    combo: 5,
    exp: 30,
    rankScore: 1,
    status: 'safe',
    updatedAt: (await paths.progression.get()).data()?.updatedAt,
  });
  assert.equal((await missionRef.get()).data()?.status, 'resolved');
  assert.equal((await paths.resolution.get()).data()?.result, 'success');
  assert.deepEqual((await paths.collection.get()).data()?.items.map((item: { id: string }) => item.id), [
    'title:first-survived',
    'title:combo-five',
  ]);
});

test('late result grants only the configured late reward', async () => {
  const { missionRef, paths, userId } = await seedMission({ result: 'late' });

  const response = await resolveMission.run(callAs(userId, missionRef.id));

  assert.equal(response.result, 'late');
  assert.deepEqual(response.reward, { comboDelta: 0, expDelta: 5, rankDelta: 0 });
  assert.equal((await paths.progression.get()).data()?.exp, 5);
  assert.equal((await paths.progression.get()).data()?.combo, 0);
});

test('fail clamps rank, resets combo, and creates the GG grave', async () => {
  const { missionRef, paths, userId } = await seedMission({
    progression: { combo: 3, exp: 10, rankScore: -9, status: 'danger' },
    result: 'fail',
  });

  const response = await resolveMission.run(callAs(userId, missionRef.id));

  assert.equal(response.result, 'fail');
  assert.deepEqual((await paths.progression.get()).data()?.rankScore, -10);
  assert.equal((await paths.progression.get()).data()?.combo, 0);
  assert.deepEqual((await paths.collection.get()).data()?.graves[0].id, 'grave:rank-negative-ten');
});

test('a mission cannot be resolved twice or resolved from another user save', async () => {
  const seeded = await seedMission({ result: 'success' });
  await resolveMission.run(callAs(seeded.userId, seeded.missionRef.id));
  await assert.rejects(
    resolveMission.run(callAs(seeded.userId, seeded.missionRef.id)),
    { code: 'failed-precondition' },
  );
  const otherUserId = `${seeded.userId}-other`;
  await db.doc(`users/${otherUserId}/saves/default`).set({ ownerUserId: otherUserId, schemaVersion: 1 });
  await assert.rejects(
    resolveMission.run(callAs(otherUserId, seeded.missionRef.id)),
    { code: 'not-found' },
  );
});

async function seedMission(input: {
  progression?: { combo: number; exp: number; rankScore: number; status: 'danger' | 'safe' };
  result: 'success' | 'late' | 'fail';
}) {
  const id = `${Date.now()}-${sequence += 1}`;
  const userId = `function-test-${id}`;
  const save = db.doc(`users/${userId}/saves/default`);
  const missionRef = save.collection('missions').doc(`mission-${id}`);
  const paths = {
    collection: save.collection('state').doc('collection'),
    progression: save.collection('state').doc('progression'),
    resolution: save.collection('resolutions').doc(missionRef.id),
  };
  const now = Timestamp.now();
  const deadlines = getDeadlines(input.result, now);
  const batch = db.batch();
  batch.set(save, { ownerUserId: userId, schemaVersion: 1 });
  batch.set(missionRef, { ...deadlines, status: 'active', template: missionTemplate() });
  batch.set(paths.progression, input.progression ?? { combo: 0, exp: 0, rankScore: 0, status: 'danger' });
  batch.set(paths.collection, { graves: [], items: [] });
  await batch.commit();
  return { missionRef, paths, userId };
}

function getDeadlines(result: 'success' | 'late' | 'fail', now: Timestamp) {
  if (result === 'success') return { failAt: Timestamp.fromMillis(now.toMillis() + 120_000), successUntil: Timestamp.fromMillis(now.toMillis() + 60_000) };
  if (result === 'late') return { failAt: Timestamp.fromMillis(now.toMillis() + 60_000), successUntil: Timestamp.fromMillis(now.toMillis() - 60_000) };
  return { failAt: Timestamp.fromMillis(now.toMillis() - 60_000), successUntil: Timestamp.fromMillis(now.toMillis() - 120_000) };
}

function missionTemplate() {
  return {
    rankImpact: { fail: -1, late: 0, success: 1 },
    reward: {
      fail: { comboDelta: 0, expDelta: 0 },
      late: { comboDelta: 0, expDelta: 5 },
      success: { comboDelta: 1, expDelta: 20 },
    },
  };
}

function callAs(userId: string, missionId: string): Parameters<typeof resolveMission.run>[0] {
  return { auth: { uid: userId }, data: { missionId } } as unknown as Parameters<typeof resolveMission.run>[0];
}
