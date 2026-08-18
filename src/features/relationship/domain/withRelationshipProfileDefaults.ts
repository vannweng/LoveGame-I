import type { RelationshipPreferences, RelationshipProfile } from './models';

const defaultPreferences: RelationshipPreferences = {
  style: 'romantic',
  preferenceTags: [],
  dietaryPreferences: [],
  landmines: [],
};

export type RelationshipProfileWithDefaults = RelationshipProfile & {
  preferences: RelationshipPreferences;
  relationshipStatus: NonNullable<RelationshipProfile['relationshipStatus']>;
};

export function withRelationshipProfileDefaults(profile: RelationshipProfile | null): RelationshipProfileWithDefaults {
  return {
    partnerNickname: profile?.partnerNickname ?? '',
    relationshipStartDate: profile?.relationshipStartDate ?? '',
    marriageDate: profile?.marriageDate,
    birthday: profile?.birthday,
    customImportantDates: (profile?.customImportantDates ?? []).map((date) => ({
      ...date,
      recurrence: date.recurrence ?? 'yearly',
      importance: date.importance ?? 'survival',
    })),
    userNickname: profile?.userNickname,
    relationshipMotto: profile?.relationshipMotto,
    relationshipStatus: profile?.relationshipStatus ?? 'dating',
    preferences: {
      ...defaultPreferences,
      ...profile?.preferences,
      preferenceTags: profile?.preferences?.preferenceTags ?? [],
      dietaryPreferences: profile?.preferences?.dietaryPreferences ?? [],
      landmines: profile?.preferences?.landmines ?? [],
    },
  };
}
