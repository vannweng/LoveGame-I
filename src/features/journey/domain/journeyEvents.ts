import { calculateAnnualDateCountdown } from '@/features/relationship/domain/calculateAnnualDateCountdown';
import { getCustomImportantDateId } from '@/features/relationship/domain/customImportantDate';
import type { RelationshipProfile } from '@/features/relationship/domain';
import type { JourneyEvent } from './models';

export function getJourneyEvents(profile: RelationshipProfile, now: Date): JourneyEvent[] {
  const sources = [
    { sourceId: 'birthday', title: '生日', date: profile.birthday, importance: 'survival' as const, effort: profile.importantDateEffort?.birthday ?? 'balanced' as const },
    { sourceId: 'relationshipAnniversary', title: '交往紀念日', date: profile.relationshipStartDate, importance: 'survival' as const, effort: profile.importantDateEffort?.relationshipAnniversary ?? 'balanced' as const },
    { sourceId: 'marriageAnniversary', title: '結婚紀念日', date: profile.marriageDate, importance: 'survival' as const, effort: profile.importantDateEffort?.marriageAnniversary ?? 'balanced' as const },
    ...profile.customImportantDates.map((date) => ({ sourceId: `custom:${getCustomImportantDateId(date)}`, title: date.title, date: date.date, importance: date.importance, effort: date.effortLevel ?? 'balanced' as const })),
  ];
  return sources.flatMap((source) => {
    const countdown = source.date ? calculateAnnualDateCountdown(source.date, now) : null;
    return countdown ? [{ ...source, date: countdown.occurrenceDate, daysRemaining: countdown.daysRemaining }] : [];
  }).sort((a, b) => a.daysRemaining - b.daysRemaining || a.sourceId.localeCompare(b.sourceId));
}

export function chapterId(event: JourneyEvent): string {
  return `${event.sourceId}:${event.date}`;
}

/** Local prototype uses the device timezone; production timestamps come from the server/save timezone. */
export function dateAtOffset(date: string, days: number): Date {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year, month - 1, day + days);
}
