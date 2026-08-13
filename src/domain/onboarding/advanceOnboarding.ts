import type { OnboardingStatus } from './models';

const nextStatus: Record<Exclude<OnboardingStatus, 'completed'>, OnboardingStatus> = {
  intro: 'profile',
  profile: 'notificationExplained',
  notificationExplained: 'identity',
  identity: 'tutorial',
  tutorial: 'reward',
  reward: 'completed',
};

export function advanceOnboarding(status: OnboardingStatus): OnboardingStatus {
  return status === 'completed' ? 'completed' : nextStatus[status];
}
