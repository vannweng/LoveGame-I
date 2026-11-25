import assert from 'node:assert/strict';
import test from 'node:test';
import { isCalendarDate, daysUntilCalendarDate } from '@/shared/utils/calendarDate';
import { canSaveRelationshipInfo, hasValidProfileDates } from '@/features/relationship/domain/validateProfileDates';
import { OnboardingService } from '@/features/relationship/application/OnboardingService';
import type { RelationshipProfile, OnboardingState } from '@/features/relationship/domain';

const profile: RelationshipProfile = { userNickname: 'P1', partnerNickname: '', customImportantDates: [] };

test('calendar validation checks format, month lengths, leap years and early years', () => {
  for (const value of ['2026-10-04', '2000-02-29', '2024-02-29', '0001-01-01', '0099-12-31']) assert.ok(isCalendarDate(value), value);
  for (const value of ['2026-13-40', '2026-02-29', '1900-02-29', '2026-04-31', '2026-00-01', '2026-10-00', '2026-1-01', '0000-01-01', '2026-10-04x', '']) assert.equal(isCalendarDate(value), false, value);
});

test('optional dates can be absent but all supplied profile dates must be valid', () => {
  assert.ok(hasValidProfileDates(profile));
  for (const field of ['birthday', 'marriageDate', 'relationshipStartDate']) assert.equal(hasValidProfileDates({ ...profile, [field]: '2026-13-40' }), false);
  assert.equal(hasValidProfileDates({ ...profile, customImportantDates: [{ title: '記念', date: '2026-02-30', recurrence: 'yearly', importance: 'normal' }] }), false);
});

test('single practice and crush profiles can save only their real information; partnered requirements stay intact', () => {
  assert.ok(canSaveRelationshipInfo(profile, 'single'));
  assert.ok(canSaveRelationshipInfo({ ...profile, partnerNickname: '曖昧對象' }, 'single'));
  assert.equal(canSaveRelationshipInfo({ ...profile, userNickname: ' ' }, 'single'), false);
  assert.equal(canSaveRelationshipInfo({ ...profile, relationshipStartDate: '2026-13-40' }, 'single'), false);
  assert.equal(canSaveRelationshipInfo(profile, 'partnered'), false);
  const partnered = { ...profile, partnerNickname: 'P2', relationshipStartDate: '2020-10-04' };
  assert.ok(canSaveRelationshipInfo(partnered, 'partnered'));
  assert.equal(canSaveRelationshipInfo({ ...partnered, relationshipStatus: 'married' }, 'partnered'), false);
  assert.ok(canSaveRelationshipInfo({ ...partnered, relationshipStatus: 'married', marriageDate: '2024-02-29' }, 'partnered'));
});

test('application profile saves reject invalid dates even when UI validation is bypassed', async () => {
  const state: OnboardingState = { status: 'completed', relationshipMode: 'single', crushCandidates: [], activeCrushId: null, profile, tutorialReward: null };
  let writes = 0;
  const service = new OnboardingService({ async getForUser() { return state; }, async saveForUser() { writes++; } });
  await assert.rejects(service.updateRelationshipProfile('user', state, { ...profile, birthday: '2026-13-40' }));
  await assert.rejects(service.saveProfile('user', state, { ...profile, marriageDate: '2026-02-29' }));
  assert.equal(writes, 0);
});

test('remaining calendar days follow local date, not elapsed hours or old event snapshots', () => {
  assert.equal(daysUntilCalendarDate('2026-10-12', new Date(2026, 9, 5, 23, 59)), 7);
  assert.equal(daysUntilCalendarDate('2026-10-12', new Date(2026, 9, 12)), 0);
  assert.equal(daysUntilCalendarDate('2026-10-12', new Date(2026, 9, 14)), -2);
  assert.equal(daysUntilCalendarDate('2027-01-01', new Date(2026, 11, 31)), 1);
  assert.equal(daysUntilCalendarDate('2024-03-01', new Date(2024, 1, 28)), 2);
});
