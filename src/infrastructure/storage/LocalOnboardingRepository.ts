import type { OnboardingState } from '@/features/relationship/domain';
import type { OnboardingRepository } from '@/features/relationship/data/OnboardingRepository';
import { secureStorage } from '@/infrastructure/storage/secureStorage';

export class LocalOnboardingRepository implements OnboardingRepository {
  async getForUser(userId: string): Promise<OnboardingState> {
    const savedState = await secureStorage.getItem(storageKey(userId));
    return savedState ? (JSON.parse(savedState) as OnboardingState) : createInitialState();
  }

  async saveForUser(userId: string, state: OnboardingState): Promise<void> {
    await secureStorage.setItem(storageKey(userId), JSON.stringify(state));
  }
}

function storageKey(userId: string): string {
  return `lovegame:onboarding:${userId}`;
}

function createInitialState(): OnboardingState {
  return { status: 'intro', profile: null, tutorialReward: null };
}
