import assert from 'node:assert/strict';
import test from 'node:test';

import {
  calculateAnnualDateCountdown,
  calculateRelationshipDays,
  getRelationshipDashboardMetrics,
} from '@/features/relationship/domain';

test('calculateRelationshipDays includes the relationship start day', () => {
  assert.equal(calculateRelationshipDays('2026-08-10', new Date('2026-08-13T10:00:00+08:00')), 4);
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
});
