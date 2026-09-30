import type { RelationshipPreferences, RelationshipProfile } from './models';
import { getCustomImportantDateId } from './customImportantDate';

const defaultPreferences: RelationshipPreferences = {
  style: 'romantic',
  preferenceTags: [],
  dietaryPreferences: [],
  landmines: [],
};

export type RelationshipProfileWithDefaults = RelationshipProfile & {
  importantDateEffort: Required<NonNullable<RelationshipProfile['importantDateEffort']>>;
  preferences: RelationshipPreferences;
  relationshipStartDate: string;
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
      id: getCustomImportantDateId(date),
      effortLevel: date.effortLevel ?? 'balanced',
      recurrence: date.recurrence ?? 'yearly',
      importance: date.importance ?? 'survival',
    })),
    userNickname: profile?.userNickname,
    importantDateEffort: {
      birthday: profile?.importantDateEffort?.birthday ?? 'balanced',
      marriageAnniversary: profile?.importantDateEffort?.marriageAnniversary ?? 'balanced',
      relationshipAnniversary: profile?.importantDateEffort?.relationshipAnniversary ?? 'balanced',
    },
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
