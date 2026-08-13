import type { OnboardingState } from '@/features/relationship/domain';

export interface OnboardingRepository {
  getForUser(userId: string): Promise<OnboardingState>;
  saveForUser(userId: string, state: OnboardingState): Promise<void>;
}
