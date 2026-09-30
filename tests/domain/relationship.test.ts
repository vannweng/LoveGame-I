import assert from 'node:assert/strict';
import test from 'node:test';

import {
  calculateAnnualDateCountdown,
  calculateRelationshipDays,
  withRelationshipProfileDefaults,
  getRelationshipDashboardMetrics,
} from '@/features/relationship/domain';
import type { CustomImportantDate } from '@/features/relationship/domain';

test('calculateRelationshipDays includes the relationship start day', () => {
  assert.equal(calculateRelationshipDays('2026-08-10', new Date('2026-08-13T10:00:00+08:00')), 4);
});

test('withRelationshipProfileDefaults hydrates optional relationship editor fields', () => {
  const profile = withRelationshipProfileDefaults({
    partnerNickname: 'P2',
    relationshipStartDate: '2026-08-13',
    customImportantDates: [],
  });

  assert.equal(profile.relationshipStatus, 'dating');
  assert.deepEqual(profile.importantDateEffort, {
    birthday: 'balanced', marriageAnniversary: 'balanced', relationshipAnniversary: 'balanced',
  });
  assert.deepEqual(profile.preferences, {
    style: 'romantic', preferenceTags: [], dietaryPreferences: [], landmines: [],
  });
});

test('custom important dates default to yearly survival events for existing profiles', () => {
  const profile = withRelationshipProfileDefaults({
    partnerNickname: 'P2', relationshipStartDate: '2026-08-13',
    customImportantDates: [{ title: '第一次旅行', date: '2026-09-01' } as CustomImportantDate],
  });

  assert.deepEqual(profile.customImportantDates, [{
    effortLevel: 'balanced', id: 'legacy-tyf54w', title: '第一次旅行', date: '2026-09-01', recurrence: 'yearly', importance: 'survival',
  }]);
});

test('calculateRelationshipDays rejects invalid or future dates', () => {
  const today = new Date('2026-08-13T10:00:00+08:00');
  assert.equal(calculateRelationshipDays('2026-02-30', today), 0);
  assert.equal(calculateRelationshipDays('2026-08-14', today), 0);
});

test('calculateAnnualDateCountdown calculates the next yearly occurrence', () => {
  const result = calculateAnnualDateCountdown('2020-08-20', new Date('2026-08-13T10:00:00+08:00'));
  assert.deepEqual(result, { daysRemaining: 7, occurrenceDate: '2026-08-20' });
});

test('calculateAnnualDateCountdown treats today as zero and resolves leap day on February 28', () => {
  assert.deepEqual(
    calculateAnnualDateCountdown('2020-08-13', new Date('2026-08-13T10:00:00+08:00')),
    { daysRemaining: 0, occurrenceDate: '2026-08-13' },
  );
  assert.deepEqual(
    calculateAnnualDateCountdown('2020-02-29', new Date('2027-02-01T10:00:00+08:00')),
    { daysRemaining: 27, occurrenceDate: '2027-02-28' },
  );
});

test('getRelationshipDashboardMetrics derives relationship and birthday metrics from profile', () => {
  const result = getRelationshipDashboardMetrics({
    partnerNickname: 'P2', relationshipStartDate: '2025-08-13', birthday: '2000-08-20', customImportantDates: [],
  }, new Date('2026-08-13T10:00:00+08:00'));

  assert.equal(result.relationshipDays, 366);
  assert.deepEqual(result.relationshipAnniversary, { daysRemaining: 0, occurrenceDate: '2026-08-13' });
  assert.deepEqual(result.birthday, { daysRemaining: 7, occurrenceDate: '2026-08-20' });
  assert.deepEqual(result.nextImportantDate, {
    daysRemaining: 0, kind: 'relationshipAnniversary', occurrenceDate: '2026-08-13', sourceId: 'relationshipAnniversary',
  });
});

test('dashboard selects the nearest configured built-in date instead of always preferring birthday', () => {
  const result = getRelationshipDashboardMetrics({
    partnerNickname: 'P2', relationshipStartDate: '2020-12-01', marriageDate: '2024-08-15',
    birthday: '2000-08-20', customImportantDates: [],
  }, new Date('2026-08-13T10:00:00+08:00'));

  assert.deepEqual(result.nextImportantDate, {
    daysRemaining: 2, kind: 'marriageAnniversary', occurrenceDate: '2026-08-15', sourceId: 'marriageAnniversary',
  });
});

test('dashboard uses a stable kind ordering when built-in dates occur on the same day', () => {
  const result = getRelationshipDashboardMetrics({
    partnerNickname: 'P2', relationshipStartDate: '2020-08-20', marriageDate: '2024-08-20',
    birthday: '2000-08-20', customImportantDates: [],
  }, new Date('2026-08-13T10:00:00+08:00'));

  assert.equal(result.nextImportantDate?.kind, 'birthday');
});

test('dashboard includes custom dates when selecting the nearest occurrence', () => {
  const result = getRelationshipDashboardMetrics({
    partnerNickname: 'P2', relationshipStartDate: '2020-12-01', birthday: '2000-08-20',
    customImportantDates: [{ id: 'first-trip', title: '第一次旅行', date: '2024-08-14', recurrence: 'yearly', importance: 'normal' }],
  }, new Date('2026-08-13T10:00:00+08:00'));

  assert.deepEqual(result.nextImportantDate, {
    daysRemaining: 1, kind: 'custom', occurrenceDate: '2026-08-14', sourceId: 'custom:first-trip', title: '第一次旅行',
  });
});
