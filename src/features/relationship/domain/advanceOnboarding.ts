import type { OnboardingStatus, RelationshipMode } from './models';

const nextStatus: Record<Exclude<OnboardingStatus, 'completed'>, OnboardingStatus> = {
  identity: 'tutorial',
  singleIntro: 'tutorial',
  crushes: 'tutorial',
  partnerName: 'partnerReward',
  partnerReward: 'tutorial',
  tutorial: 'reward',
  reward: 'completed',
};

export function advanceOnboarding(status: OnboardingStatus): OnboardingStatus {
  return status === 'completed' ? 'completed' : nextStatus[status];
}

export function retreatOnboarding(status: OnboardingStatus, mode: RelationshipMode | null, hasCrushes = false): OnboardingStatus {
  if (status === 'singleIntro') return 'identity';
  if (status === 'crushes') return 'singleIntro';
  if (status === 'partnerName') return 'identity';
  if (status === 'partnerReward') return 'partnerName';
  if (status === 'tutorial') return mode === 'partnered' ? 'partnerReward' : hasCrushes ? 'crushes' : 'singleIntro';
  return status;
}
