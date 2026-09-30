import type { OnboardingState, OnboardingStatus, RelationshipMode } from './models';

type LegacyOnboardingStatus = 'intro' | 'profile' | 'notificationExplained';

interface StoredOnboardingState extends Omit<Partial<OnboardingState>, 'status'> {
  status?: OnboardingStatus | LegacyOnboardingStatus;
}

export function normalizeOnboardingState(value: unknown): OnboardingState {
  const state = value as StoredOnboardingState;
  const status = normalizeStatus(state.status, state.profile?.partnerNickname);
  return {
    status,
    relationshipMode: state.relationshipMode ?? inferRelationshipMode(state.profile?.partnerNickname),
    crushCandidates: state.crushCandidates ?? [],
    activeCrushId: state.activeCrushId ?? null,
    profile: state.profile ?? null,
    tutorialReward: state.tutorialReward ?? null,
  };
}

function normalizeStatus(status: StoredOnboardingState['status'], partnerNickname?: string): OnboardingStatus {
  if (status === 'completed' || status === 'singleIntro' || status === 'crushes' || status === 'partnerName' || status === 'partnerReward' || status === 'tutorial' || status === 'reward') return status;
  if (status === 'notificationExplained') return 'partnerReward';
  if (status === 'profile') return 'partnerName';
  if (status === 'identity') return partnerNickname ? 'tutorial' : 'identity';
  return 'identity';
}

function inferRelationshipMode(partnerNickname?: string): RelationshipMode | null {
  return partnerNickname ? 'partnered' : null;
}
