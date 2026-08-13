import type { OnboardingState } from '../../domain/onboarding';

export interface OnboardingRepository {
  getForUser(userId: string): Promise<OnboardingState>;
  saveForUser(userId: string, state: OnboardingState): Promise<void>;
}
