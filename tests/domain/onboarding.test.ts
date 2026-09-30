import assert from 'node:assert/strict';
import test from 'node:test';

import { OnboardingService } from '@/features/relationship/application/OnboardingService';
import { advanceOnboarding, normalizeOnboardingState, retreatOnboarding, type OnboardingState } from '@/features/relationship/domain';
import type { OnboardingRepository } from '@/features/relationship/data/OnboardingRepository';

test('onboarding advances through every resumable status', () => {
  assert.equal(advanceOnboarding('identity'), 'tutorial');
  assert.equal(advanceOnboarding('singleIntro'), 'tutorial');
  assert.equal(advanceOnboarding('crushes'), 'tutorial');
  assert.equal(advanceOnboarding('partnerName'), 'partnerReward');
  assert.equal(advanceOnboarding('partnerReward'), 'tutorial');
  assert.equal(advanceOnboarding('tutorial'), 'reward');
  assert.equal(advanceOnboarding('reward'), 'completed');
});

test('completed onboarding remains completed', () => {
  assert.equal(advanceOnboarding('completed'), 'completed');
});

test('onboarding returns to the prior step without crossing completed rewards', () => {
  assert.equal(retreatOnboarding('partnerName', 'partnered'), 'identity');
  assert.equal(retreatOnboarding('singleIntro', 'single'), 'identity');
  assert.equal(retreatOnboarding('crushes', 'single'), 'singleIntro');
  assert.equal(retreatOnboarding('partnerReward', 'partnered'), 'partnerName');
  assert.equal(retreatOnboarding('tutorial', 'partnered'), 'partnerReward');
  assert.equal(retreatOnboarding('tutorial', 'single'), 'singleIntro');
  assert.equal(retreatOnboarding('tutorial', 'single', true), 'crushes');
  assert.equal(retreatOnboarding('reward', 'single'), 'reward');
});

test('legacy incomplete onboarding resumes at an equivalent new step', () => {
  assert.equal(normalizeOnboardingState({ status: 'intro' }).status, 'identity');
  assert.equal(normalizeOnboardingState({ status: 'profile' }).status, 'partnerName');
  assert.equal(normalizeOnboardingState({ status: 'notificationExplained', profile: { partnerNickname: 'P2' } }).status, 'partnerReward');
});

test('relationship mode branches to the correct next onboarding step', async () => {
  const repository = new MemoryOnboardingRepository();
  const service = new OnboardingService(repository);
  const initial = createInitialState();

  const single = await service.chooseRelationshipMode('user', initial, 'single');
  assert.equal(single.status, 'singleIntro');
  assert.equal(single.profile?.partnerNickname, '');

  const partnered = await service.chooseRelationshipMode('user', initial, 'partnered');
  const named = await service.savePartnerName('user', partnered, '小明');
  assert.equal(partnered.status, 'partnerName');
  assert.equal(named.status, 'partnerReward');
  assert.equal(named.profile?.partnerNickname, '小明');
});

test('single onboarding saves up to three candidates and activates one profile', async () => {
  const repository = new MemoryOnboardingRepository();
  const service = new OnboardingService(repository);
  const single = await service.chooseRelationshipMode('user', createInitialState(), 'single');
  const setup = await service.startCrushSetup('user', single);
  const candidates = [
    { id: 'crush-a' as const, nickname: '咖啡店那位' },
    { id: 'crush-b' as const, nickname: '隔壁部門的人' },
  ];
  const saved = await service.saveCrushCandidates('user', setup, candidates, 'crush-b');

  assert.equal(setup.status, 'crushes');
  assert.equal(saved.status, 'tutorial');
  assert.equal(saved.activeCrushId, 'crush-b');
  assert.equal(saved.profile?.partnerNickname, '隔壁部門的人');
  assert.equal(saved.profile?.birthday, undefined);
});

test('single onboarding rejects duplicate candidate slots', async () => {
  const service = new OnboardingService(new MemoryOnboardingRepository());
  const initial = createInitialState();
  const duplicates = [
    { id: 'crush-a' as const, nickname: 'A' },
    { id: 'crush-a' as const, nickname: 'B' },
  ];

  await assert.rejects(() => service.saveCrushCandidates('user', initial, duplicates, 'crush-a'));
});

class MemoryOnboardingRepository implements OnboardingRepository {
  private state = createInitialState();

  async getForUser(): Promise<OnboardingState> { return this.state; }

  async saveForUser(_userId: string, state: OnboardingState): Promise<void> { this.state = state; }
}

function createInitialState(): OnboardingState {
  return { status: 'identity', relationshipMode: null, crushCandidates: [], activeCrushId: null, profile: null, tutorialReward: null };
}
