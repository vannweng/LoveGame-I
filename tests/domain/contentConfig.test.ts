import assert from 'node:assert/strict';
import test from 'node:test';

import { getCopy, missionTemplates, sosGuides } from '@/content';

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
    '生日倒數 5 DAYS。現在不動，未來的你會想把手機丟掉。',
  );
});

test('SOS guide config provides complete content for every level', () => {
  Object.values(sosGuides).forEach((guide) => {
    assert.ok(getCopy(guide.levelLabelKey));
    assert.ok(getCopy(guide.diagnosisTitleKey));
    guide.diagnosisKeys.forEach((key) => assert.ok(getCopy(key)));
    guide.actionKeys.forEach((key) => assert.ok(getCopy(key)));
    assert.ok(getCopy(guide.apologyKey));
    guide.quickActionKeys.forEach((key) => assert.ok(getCopy(key)));
  });
});
