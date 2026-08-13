import type { RelationshipProfile } from './models';
import { calculateAnnualDateCountdown, type AnnualDateCountdown } from './calculateAnnualDateCountdown';
import { calculateRelationshipDays } from './calculateRelationshipDays';

export interface RelationshipDashboardMetrics {
  birthday: AnnualDateCountdown | null;
  relationshipAnniversary: AnnualDateCountdown | null;
  relationshipDays: number;
}

export function getRelationshipDashboardMetrics(
  profile: RelationshipProfile | null,
  today: Date,
): RelationshipDashboardMetrics {
  if (!profile) {
    return { birthday: null, relationshipAnniversary: null, relationshipDays: 0 };
  }

  return {
    birthday: profile.birthday ? calculateAnnualDateCountdown(profile.birthday, today) : null,
    relationshipAnniversary: calculateAnnualDateCountdown(profile.relationshipStartDate, today),
    relationshipDays: calculateRelationshipDays(profile.relationshipStartDate, today),
  };
}
