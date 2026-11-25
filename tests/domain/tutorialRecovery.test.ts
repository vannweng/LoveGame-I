import assert from 'node:assert/strict';
import test from 'node:test';
import { TutorialCompletionService } from '@/features/relationship/application/TutorialCompletionService';
import { OnboardingService } from '@/features/relationship/application/OnboardingService';
import { normalizeOnboardingState, type OnboardingState, type RelationshipProfile } from '@/features/relationship/domain';
import type { OnboardingRepository } from '@/features/relationship/data/OnboardingRepository';
import type { GameplayProgress, GameplayRepository, GameplaySession } from '@/features/missions/data/GameplayRepository';
import { tutorialMission } from '@/features/missions/data/mockGameplayData';
import { createRunHistory } from '@/game/run';

const now = new Date(2026, 9, 4, 12);
const profile: RelationshipProfile = { partnerNickname: '', birthday: '2000-10-12', customImportantDates: [] };

function setup() {
  let onboarding: OnboardingState = { status: 'tutorial', relationshipMode: 'single', crushCandidates: [], activeCrushId: null, profile: null, tutorialReward: null };
  let session: GameplaySession = { mission: tutorialMission, relationship: { id: 'local', ownerUserId: 'user', partnerDisplayName: '', timezone: 'Asia/Taipei' },
    gameState: { exp: 0, combo: 0, rankScore: 0, status: 'danger' }, collectionState: { items: [], graves: [] }, runHistory: createRunHistory(now) };
  const failure = { onboardingWrite: 0, gameplayWrite: false };
  const writes = { onboarding: 0, gameplay: 0 };
  const onboardingRepository: OnboardingRepository = {
    async getForUser() { return normalizeOnboardingState(JSON.parse(JSON.stringify(onboarding))); },
    async saveForUser(_id, next) {
      writes.onboarding++;
      if (writes.onboarding === failure.onboardingWrite) throw new Error('disk failure');
      onboarding = structuredClone(next);
    },
  };
  const gameplayRepository: GameplayRepository = {
    async loadForUser() { return structuredClone(session); },
    async saveProgress(_id: string, next: GameplayProgress) {
      writes.gameplay++;
      if (failure.gameplayWrite) throw new Error('disk failure');
      session = { ...session, ...structuredClone(next) };
    },
  };
  return { failure, writes, onboardingRepository, gameplayRepository, service: () => new TutorialCompletionService(onboardingRepository, gameplayRepository),
    state: () => ({ onboarding: structuredClone(onboarding), session: structuredClone(session) }) };
}

for (const stage of ['intent', 'progress', 'finalize'] as const) {
  test(`tutorial ${stage} write failure can retry without duplicating EXP, combo, rank or collection`, async () => {
    const fixture = setup();
    fixture.failure.onboardingWrite = stage === 'intent' ? 1 : stage === 'finalize' ? 2 : 0;
    fixture.failure.gameplayWrite = stage === 'progress';
    await assert.rejects(fixture.service().complete('user', profile, now), /disk failure/);
    assert.equal(fixture.state().session.gameState.exp, stage === 'finalize' ? 20 : 0);
    fixture.failure.onboardingWrite = 0; fixture.failure.gameplayWrite = false;
    const completed = await fixture.service().complete('user', profile, now);
    assert.deepEqual(completed.session.gameState, { exp: 20, combo: 1, rankScore: 1, status: 'safe' });
    assert.equal(completed.session.collectionState.items.length, 1);
    assert.equal(completed.onboarding.status, 'reward');
    assert.equal(completed.onboarding.pendingTutorial, undefined);
    const again = await fixture.service().complete('user', profile, now);
    assert.deepEqual(again, completed);
  });
}

for (const stage of ['progress', 'finalize'] as const) {
  test(`reopening resumes a pending tutorial after ${stage} failure with the original profile and target`, async () => {
    const fixture = setup();
    fixture.failure.gameplayWrite = stage === 'progress'; fixture.failure.onboardingWrite = stage === 'finalize' ? 2 : 0;
    await assert.rejects(fixture.service().complete('user', profile, now));
    const stored = await fixture.onboardingRepository.getForUser('user');
    assert.ok(stored.pendingTutorial);
    await assert.rejects(new OnboardingService(fixture.onboardingRepository).retreat('user', stored), /重試/);
    fixture.failure.gameplayWrite = false; fixture.failure.onboardingWrite = 0;
    const recovered = await fixture.service().recover('user', stored, await fixture.gameplayRepository.loadForUser('user'));
    assert.equal(recovered.onboarding.profile?.birthday, profile.birthday);
    assert.equal(recovered.session.gameState.exp, 20);
    assert.equal(recovered.session.gameState.combo, 1);
    assert.equal(recovered.onboarding.status, 'reward');
  });
}

test('rapid duplicate tutorial submissions share one transaction', async () => {
  const fixture = setup(); const service = fixture.service();
  const [first, second] = await Promise.all([service.complete('user', profile, now), service.complete('user', profile, now)]);
  assert.deepEqual(first, second);
  assert.equal(fixture.writes.gameplay, 1);
  assert.equal(fixture.writes.onboarding, 2);
});

test('invalid or absent important dates never save progress or award tutorial rewards', async () => {
  const fixture = setup();
  for (const birthday of ['2026-13-40', '2026-02-29', undefined]) {
    await assert.rejects(fixture.service().complete('user', { ...profile, birthday }, now));
  }
  assert.deepEqual(fixture.writes, { gameplay: 0, onboarding: 0 });
});
