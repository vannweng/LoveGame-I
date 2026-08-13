import assert from 'node:assert/strict';
import test from 'node:test';

import { getCopy, missionTemplates } from '@/content';

test('mission templates provide every result rule and content key', () => {
  Object.values(missionTemplates).forEach((template) => {
    assert.ok(template.id);
    assert.ok(getCopy(template.titleKey));
    assert.ok(getCopy(template.descriptionKey));
    assert.ok(getCopy(template.successCopyKey));
    assert.ok(getCopy(template.lateCopyKey));
    assert.ok(getCopy(template.failCopyKey));
    assert.notEqual(template.reward.success.expDelta, undefined);
    assert.notEqual(template.rankImpact.fail, undefined);
  });
});

test('copy resolves stable keys and interpolates dynamic values', () => {
  assert.equal(
    getCopy('HOME_IMPORTANT_DATE_ADVICE', { label: '生日', days: 5 }),
    '生日倒數 5 DAYS。現在開始準備，會比最後一刻更從容。',
  );
});
