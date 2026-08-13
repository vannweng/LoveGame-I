import { readFileSync } from 'node:fs';
import test, { after, before } from 'node:test';

import { assertFails, assertSucceeds, initializeTestEnvironment, type RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc } from 'firebase/firestore';

let testEnvironment: RulesTestEnvironment;

before(async () => {
  testEnvironment = await initializeTestEnvironment({
    projectId: 'demo-lovegame-i',
    firestore: { rules: readFileSync('firebase/firestore.rules', 'utf8') },
  });
});

after(async () => {
  await testEnvironment.cleanup();
});

test('owner can create and read only their default save', async () => {
  const owner = testEnvironment.authenticatedContext('owner').firestore();
  const ownSave = doc(owner, 'users', 'owner', 'saves', 'default');
  await assertSucceeds(setDoc(ownSave, { ownerUserId: 'owner', schemaVersion: 1 }));
  await assertSucceeds(getDoc(ownSave));
});

test('another signed-in user cannot read or write an owner save', async () => {
  const intruder = testEnvironment.authenticatedContext('intruder').firestore();
  const ownerSave = doc(intruder, 'users', 'owner', 'saves', 'default');
  await assertFails(getDoc(ownerSave));
  await assertFails(setDoc(ownerSave, { ownerUserId: 'owner', schemaVersion: 1 }));
});

test('client cannot write progression, mission resolution, or collection state', async () => {
  const owner = testEnvironment.authenticatedContext('owner').firestore();
  const basePath = ['users', 'owner', 'saves', 'default'] as const;
  await assertFails(setDoc(doc(owner, ...basePath, 'state', 'progression'), { exp: 999 }));
  await assertFails(setDoc(doc(owner, ...basePath, 'resolutions', 'mission'), { result: 'success' }));
  await assertFails(setDoc(doc(owner, ...basePath, 'state', 'collection'), { items: [] }));
});

test('client cannot persist tutorial reward state during onboarding', async () => {
  const owner = testEnvironment.authenticatedContext('owner').firestore();
  const state = doc(owner, 'users', 'owner', 'saves', 'default', 'onboarding', 'state');
  await assertFails(setDoc(state, { status: 'tutorial', tutorialReward: { gameState: { rankScore: 10 } } }));
});
