import assert from 'node:assert/strict';
import test from 'node:test';

import { formatLocalDateInput } from '@/shared/utils/formatLocalDateInput';

test('formatLocalDateInput inserts date separators from numeric keyboard input', () => {
  assert.equal(formatLocalDateInput('20260813'), '2026-08-13');
  assert.equal(formatLocalDateInput('2026-0813'), '2026-08-13');
});

test('formatLocalDateInput limits input to an ISO local date shape', () => {
  assert.equal(formatLocalDateInput('202608131234'), '2026-08-13');
  assert.equal(formatLocalDateInput('20a2b6'), '2026');
});
