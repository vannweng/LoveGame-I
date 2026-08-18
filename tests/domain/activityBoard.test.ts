import assert from 'node:assert/strict';
import test from 'node:test';

import {
  completeDailyActivity,
  completeWeeklyChallenge,
  cancelDailyActivity,
  createActivityBoardState,
  drawDailyActivity,
  getDailyDrawOptions,
  getWeeklyDrawOptions,
  openWeeklyChallenge,
  rerollDailyActivity,
  rerollWeeklyChallenge,
  selectNextDailyActivity,
  selectDailyActivity,
} from '@/features/activities/domain';
import { applyBonusExperience } from '@/game/progression/applyBonusExperience';

const saturday = new Date('2026-08-15T10:00:00+08:00');
const monday = new Date('2026-08-17T10:00:00+08:00');

test('daily card completion grants EXP without changing Combo or Rank', () => {
  const drawn = drawDailyActivity(createActivityBoardState(saturday), 11, saturday);
  const completion = completeDailyActivity(drawn, saturday, '今天傳了一首歌');
  const gameState = applyBonusExperience({ exp: 40, combo: 3, rankScore: 1, status: 'safe' }, completion.expDelta);

  assert.ok(completion.expDelta > 0);
  assert.equal(gameState.combo, 3);
  assert.equal(gameState.rankScore, 1);
  assert.equal(gameState.exp, 40 + completion.expDelta);
});

test('relationship milestone replaces the normal daily draw on its exact day', () => {
  const drawn = drawDailyActivity(createActivityBoardState(saturday), 100, saturday);

  assert.equal(drawn.daily.templateId, 'milestone-100');
  assert.equal(rerollDailyActivity(drawn, 100, saturday).daily.templateId, 'milestone-100');
});

test('daily cards can be rerolled only once', () => {
  const drawn = drawDailyActivity(createActivityBoardState(saturday), 11, saturday);
  const rerolled = rerollDailyActivity(drawn, 11, saturday);
  const secondAttempt = rerollDailyActivity(rerolled, 11, saturday);

  assert.equal(rerolled.daily.rerolled, true);
  assert.notEqual(rerolled.daily.templateId, drawn.daily.templateId);
  assert.deepEqual(secondAttempt, rerolled);
});

test('daily draw presents three cards and only accepts a card from the presented deck', () => {
  const initial = createActivityBoardState(saturday);
  const options = getDailyDrawOptions(initial, 11, saturday);
  const selected = selectDailyActivity(initial, 11, options[2].id, saturday);
  const invalid = selectDailyActivity(initial, 11, 'not-in-deck', saturday);

  assert.equal(options.length, 3);
  assert.equal(selected.daily.templateId, options[2].id);
  assert.equal(invalid.daily.templateId, null);
});

test('selected daily card can be cancelled without rewards or a DONE record', () => {
  const initial = createActivityBoardState(saturday);
  const card = getDailyDrawOptions(initial, 11, saturday)[0];
  const selected = selectDailyActivity(initial, 11, card.id, saturday);
  const cancelled = cancelDailyActivity(selected, saturday);

  assert.equal(cancelled.daily.templateId, null);
  assert.deepEqual(cancelled.daily.completedTemplateIds, []);
});

test('weekly LINE challenge opens across Saturday and Sunday and accepts an optional reflection', () => {
  const unopened = openWeeklyChallenge(createActivityBoardState(monday), monday);
  const opened = openWeeklyChallenge(createActivityBoardState(saturday), saturday);
  const sundayOpened = openWeeklyChallenge(createActivityBoardState(new Date('2026-08-16T10:00:00+08:00')), new Date('2026-08-16T10:00:00+08:00'));
  const blankCompletion = completeWeeklyChallenge(opened, saturday, '  ');
  const completed = completeWeeklyChallenge(opened, saturday, 'Yesterday，因為想和你慢慢聽');

  assert.equal(unopened.weekly.templateId, null);
  assert.ok(opened.weekly.templateId);
  assert.ok(sundayOpened.weekly.templateId);
  assert.equal(blankCompletion.expDelta, 5);
  assert.equal(completed.expDelta, 5);
  assert.equal(completed.state.weekly.reflection, 'Yesterday，因為想和你慢慢聽');
});

test('weekly challenge has a three-card deck and one redraw excludes the first pick', () => {
  const initial = createActivityBoardState(saturday);
  const firstDeck = getWeeklyDrawOptions(initial, saturday);
  const selected = openWeeklyChallenge(initial, saturday);
  const rerolled = rerollWeeklyChallenge(selected, saturday);
  const secondDeck = getWeeklyDrawOptions(rerolled, saturday);

  assert.equal(firstDeck.length, 3);
  assert.equal(rerolled.weekly.rerolled, true);
  assert.ok(!secondDeck.some((template) => template.id === selected.weekly.templateId));
});

test('daily and weekly draws share one reroll opportunity', () => {
  const initial = createActivityBoardState(saturday);
  const daily = selectDailyActivity(initial, 11, getDailyDrawOptions(initial, 11, saturday)[0].id, saturday);
  const rerolledDaily = rerollDailyActivity(daily, 11, saturday);
  const weekly = openWeeklyChallenge(rerolledDaily, saturday);

  assert.equal(rerolledDaily.rerollUsed, true);
  assert.deepEqual(rerollWeeklyChallenge(weekly, saturday), weekly);
});

test('continuing a daily challenge selects one remaining card automatically', () => {
  const initial = createActivityBoardState(saturday);
  const selected = selectDailyActivity(initial, 11, getDailyDrawOptions(initial, 11, saturday)[0].id, saturday);
  const completed = completeDailyActivity(selected, saturday);
  const next = selectNextDailyActivity(completed.state, 11, saturday);

  assert.ok(next.daily.templateId);
  assert.ok(!completed.state.daily.completedTemplateIds.includes(next.daily.templateId));
});
