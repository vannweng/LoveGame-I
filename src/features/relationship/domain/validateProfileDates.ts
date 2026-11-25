import { isCalendarDate } from '@/shared/utils/calendarDate';
import type { RelationshipMode, RelationshipProfile } from './models';

export const invalidDateMessage = '請輸入有效日期（YYYY-MM-DD），例如 2026-10-04。';

export function hasValidProfileDates(profile: RelationshipProfile): boolean {
  const optional = [profile.birthday, profile.relationshipStartDate, profile.marriageDate];
  return optional.every((date) => !date || isCalendarDate(date)) &&
    profile.customImportantDates.every((item) => Boolean(item.title.trim()) && isCalendarDate(item.date));
}

export function assertValidProfileDates(profile: RelationshipProfile): void {
  if (!hasValidProfileDates(profile)) throw new Error(invalidDateMessage);
}

export function canSaveRelationshipInfo(profile: RelationshipProfile, mode: RelationshipMode): boolean {
  if (!profile.userNickname?.trim() || !hasValidProfileDates(profile)) return false;
  if (mode === 'single') return true;
  return Boolean(profile.partnerNickname.trim() && profile.relationshipStartDate &&
    (profile.relationshipStatus !== 'married' || profile.marriageDate));
}
