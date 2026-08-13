import type { CollectionState } from '@/features/collection/domain';
import type { Mission } from '@/features/missions/domain';
import type { OnboardingState, RelationshipProfile } from '@/features/relationship/domain';

type FirestoreDate = { toDate?: () => Date } | Date | string;

export function toCollectionState(value: unknown): CollectionState {
  const state = value as CollectionState;
  return {
    items: state.items.map((item) => ({ ...item, unlockedAt: toDate(item.unlockedAt) })),
    graves: state.graves.map((grave) => ({ ...grave, createdAt: toDate(grave.createdAt) })),
  };
}

export function toMission(value: unknown): Mission {
  const mission = value as Mission;
  return { ...mission, successUntil: toDate(mission.successUntil), failAt: toDate(mission.failAt) };
}

export function toOnboardingState(value: unknown): OnboardingState {
  return value as OnboardingState;
}

export function toRelationshipProfile(value: unknown): RelationshipProfile {
  return value as RelationshipProfile;
}

function toDate(value: FirestoreDate): Date {
  if (value instanceof Date) return value;
  if (typeof value === 'string') return new Date(value);
  if (typeof value?.toDate === 'function') return value.toDate();
  throw new Error('Firestore document contains an invalid date field.');
}
