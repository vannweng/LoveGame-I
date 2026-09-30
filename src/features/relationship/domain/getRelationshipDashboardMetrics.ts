import type { RelationshipProfile } from './models';
import { calculateAnnualDateCountdown, type AnnualDateCountdown } from './calculateAnnualDateCountdown';
import { calculateRelationshipDays } from './calculateRelationshipDays';
import { getCustomImportantDateId } from './customImportantDate';

export interface RelationshipDashboardMetrics {
  birthday: AnnualDateCountdown | null;
  marriageAnniversary: AnnualDateCountdown | null;
  nextImportantDate: ImportantDateCountdown | null;
  relationshipAnniversary: AnnualDateCountdown | null;
  relationshipDays: number;
}

export type ImportantDateKind = 'relationshipAnniversary' | 'marriageAnniversary' | 'birthday' | 'custom';

export interface ImportantDateCountdown extends AnnualDateCountdown {
  kind: ImportantDateKind;
  sourceId: string;
  title?: string;
}

export function getRelationshipDashboardMetrics(
  profile: RelationshipProfile | null,
  today: Date,
): RelationshipDashboardMetrics {
  if (!profile) {
    return { birthday: null, marriageAnniversary: null, nextImportantDate: null, relationshipAnniversary: null, relationshipDays: 0 };
  }

  const birthday = profile.birthday ? calculateAnnualDateCountdown(profile.birthday, today) : null;
  const marriageAnniversary = profile.marriageDate ? calculateAnnualDateCountdown(profile.marriageDate, today) : null;
  const relationshipAnniversary = profile.relationshipStartDate ? calculateAnnualDateCountdown(profile.relationshipStartDate, today) : null;
  const candidates: (ImportantDateCountdown | null)[] = [
    toImportantDate('relationshipAnniversary', relationshipAnniversary),
    toImportantDate('marriageAnniversary', marriageAnniversary),
    toImportantDate('birthday', birthday),
    ...profile.customImportantDates.map((date) => {
      const countdown = calculateAnnualDateCountdown(date.date, today);
      return countdown ? {
        ...countdown, kind: 'custom' as const, sourceId: `custom:${getCustomImportantDateId(date)}`, title: date.title,
      } : null;
    }),
  ];

  return {
    birthday,
    marriageAnniversary,
    nextImportantDate: candidates.filter((date): date is ImportantDateCountdown => date !== null).sort(compareImportantDates)[0] ?? null,
    relationshipAnniversary,
    relationshipDays: profile.relationshipStartDate ? calculateRelationshipDays(profile.relationshipStartDate, today) : 0,
  };
}

function toImportantDate(
  kind: Exclude<ImportantDateKind, 'custom'>,
  countdown: AnnualDateCountdown | null,
): ImportantDateCountdown | null {
  return countdown ? { ...countdown, kind, sourceId: kind } : null;
}

function compareImportantDates(left: ImportantDateCountdown, right: ImportantDateCountdown): number {
  return left.daysRemaining - right.daysRemaining || left.sourceId.localeCompare(right.sourceId);
}
