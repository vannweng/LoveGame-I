import { advanceOnboarding } from '../domain/onboarding';
import type {
  OnboardingState,
  RelationshipProfile,
  TutorialReward,
} from '../domain/onboarding';
import type { OnboardingRepository } from '../data/repositories/OnboardingRepository';

export class OnboardingService {
  constructor(private readonly repository: OnboardingRepository) {}

  getState(userId: string): Promise<OnboardingState> {
    return this.repository.getForUser(userId);
  }

  async advance(userId: string, state: OnboardingState): Promise<OnboardingState> {
    return this.save(userId, { ...state, status: advanceOnboarding(state.status) });
  }

  async saveProfile(
    userId: string,
    state: OnboardingState,
    profile: RelationshipProfile,
  ): Promise<OnboardingState> {
    return this.save(userId, { ...state, profile, status: 'notificationExplained' });
  }

  async saveTutorialReward(
    userId: string,
    state: OnboardingState,
    tutorialReward: TutorialReward,
  ): Promise<OnboardingState> {
    return this.save(userId, { ...state, tutorialReward, status: 'reward' });
  }

  async updateRelationshipProfile(
    userId: string,
    state: OnboardingState,
    profile: RelationshipProfile,
  ): Promise<OnboardingState> {
    return this.save(userId, { ...state, profile });
  }

  private async save(userId: string, state: OnboardingState): Promise<OnboardingState> {
    await this.repository.saveForUser(userId, state);
    return state;
  }
}
