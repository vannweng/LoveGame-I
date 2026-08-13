import type { OnboardingState } from '../../domain/onboarding';
import type { OnboardingRepository } from '../repositories/OnboardingRepository';
import { secureStorage } from '../../services/storage/secureStorage';

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
