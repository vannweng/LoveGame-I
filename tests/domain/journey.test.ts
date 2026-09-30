import assert from 'node:assert/strict';
import test from 'node:test';
import { getJourneyEvents } from '@/features/journey/domain/journeyEvents';
import { nextTask, previousChapter, resolveChapterTask, saveChapterReflection, saveChapterTaskDraft, startChapter, taskStatus } from '@/features/journey/domain/journey';
import type { JourneyState } from '@/features/journey/domain/models';
import { createRunHistory } from '@/game/run';
import { deserializeJourney } from '@/features/journey/data/serializeJourney';
import { JourneyService } from '@/features/journey/application/JourneyService';
import type { JourneyRepository } from '@/features/journey/data/JourneyRepository';
import { updateJourneyActivity } from '@/features/journey/domain/journeyActivities';
import { createActivityBoardState, getDailyDrawOptions } from '@/features/activities/domain';

const now = new Date(2026, 8, 18, 12);
const preferences = { style: 'practical' as const, preferenceTags: ['書'], dietaryPreferences: [], landmines: [] };
const event = { sourceId: 'birthday', title: '生日', date: '2026-09-20', daysRemaining: 2, importance: 'survival' as const, effort: 'full' as const };
const initial = (): JourneyState => ({ schemaVersion: 1, chapters: [], gameState: { exp: 0, combo: 0, rankScore: 0, status: 'danger' }, collectionState: { items: [], graves: [] }, runHistory: createRunHistory(now) });

test('all date sources participate in stable chronological ordering, including normal and leap dates', () => {
  const events = getJourneyEvents({ partnerNickname: 'P2', relationshipStartDate: '2020-10-10', birthday: '2000-02-29', customImportantDates: [
    { id: 'trip', title: '旅行', date: '2020-09-19', importance: 'normal', recurrence: 'yearly' },
  ] }, now);
  assert.deepEqual(events.map((event) => event.date), ['2026-09-19', '2026-10-10', '2027-02-28']);
  assert.equal(events[0].importance, 'normal');
  assert.equal(events[0].effort, 'balanced');
});

test('routes create 1, 3, or 5 tasks and snapshot rules and preferences', () => {
  for (const [effort, count] of [['minimal', 1], ['balanced', 3], ['full', 5]] as const) {
    const state = startChapter(initial(), event, effort, preferences, now);
    assert.equal(state.chapters[0].tasks.length, count);
    assert.notEqual(state.chapters[0].preferences, preferences);
    assert.equal(state.chapters[0].event.date, '2026-09-20');
    assert.equal(startChapter(state, event, 'minimal', preferences, now), state);
  }
});

test('same-year events have independent task IDs and dates', () => {
  const first = startChapter(initial(), event, 'minimal', preferences, now);
  const second = startChapter(first, { ...event, sourceId: 'custom:trip' }, 'minimal', preferences, now);
  assert.equal(second.chapters.length, 2);
  assert.notEqual(second.chapters[0].tasks[0].mission.id, second.chapters[1].tasks[0].mission.id);
});

test('a task can resolve once, then successful chapters archive without needing GG', () => {
  const started = startChapter(initial(), event, 'minimal', preferences, now);
  const chapter = started.chapters[0];
  const task = chapter.tasks[0];
  const completedAt = new Date(2026, 8, 17, 12);
  const completed = resolveChapterTask(started, chapter.id, task.mission.id, completedAt);
  assert.equal(completed.gameState.exp, 20);
  assert.equal(completed.chapters[0].tasks[0].result, 'success');
  assert.ok(completed.chapters[0].completedAt);
  assert.equal(resolveChapterTask(completed, chapter.id, task.mission.id, completedAt), completed);
  const saved = saveChapterReflection(completed, chapter.id, '  下次也提早確認  ');
  assert.equal(previousChapter(saved, { ...event, date: '2027-09-20' })?.reflection, '下次也提早確認');
  assert.equal(previousChapter(saved, { ...event, sourceId: 'custom:trip', date: '2027-09-20' }), undefined);
});

test('scheduled tasks cannot award rewards, normal missions never change rank, deadlines remain exclusive', () => {
  const state = startChapter(initial(), { ...event, importance: 'normal' }, 'minimal', preferences, now);
  const chapter = state.chapters[0];
  const task = chapter.tasks[0];
  assert.throws(() => resolveChapterTask(state, chapter.id, task.mission.id, new Date(2026, 8, 16)), /尚未開放/);
  assert.equal(taskStatus(task, new Date(2026, 8, 16)), 'scheduled');
  assert.equal(taskStatus(task, task.mission.successUntil), 'late');
  assert.equal(taskStatus(task, task.mission.failAt), 'fail');
  const failed = resolveChapterTask(state, chapter.id, task.mission.id, task.mission.failAt);
  assert.equal(failed.gameState.rankScore, 0);
  assert.equal(failed.chapters[0].tasks[0].result, 'fail');
  assert.ok(failed.chapters[0].completedAt);
});

test('a scheduled card can save a draft without resolving the mission or changing game progress', () => {
  const state = startChapter(initial(), { ...event, date: '2026-10-20' }, 'full', preferences, now);
  const chapter = state.chapters[0];
  const card = chapter.tasks.find((task) => task.mission.template.id === 'birthday-card');
  assert.ok(card);
  assert.equal(taskStatus(card, now), 'scheduled');
  const drafted = saveChapterTaskDraft(state, chapter.id, card.mission.id, '先寫好想說的話');
  assert.equal(drafted.chapters[0].tasks.find((task) => task.mission.id === card.mission.id)?.cardDraft, '先寫好想說的話');
  assert.deepEqual(drafted.gameState, state.gameState);
  assert.throws(() => resolveChapterTask(drafted, chapter.id, card.mission.id, now), /尚未開放/);
  assert.throws(() => saveChapterTaskDraft(state, chapter.id, chapter.tasks[0].mission.id, '不是卡片'), /只有卡片/);
});

test('save round-trip restores timestamps and preserves results, notes, and next task', () => {
  const state = startChapter(initial(), event, 'full', preferences, now);
  const chapter = state.chapters[0];
  const card = chapter.tasks.find((task) => task.mission.template.id === 'birthday-card');
  assert.ok(card);
  const withDraft = saveChapterTaskDraft(state, chapter.id, card.mission.id, '草稿也要保存');
  const loaded = deserializeJourney(JSON.stringify(withDraft));
  assert.deepEqual(loaded, withDraft);
  assert.equal(nextTask(loaded.chapters[0], now)?.mission.template.id, 'birthday-dinner');
  assert.throws(() => saveChapterReflection(state, state.chapters[0].id, 'too soon'), /完成篇章/);
});

test('serialized repository updates survive rapid repeated completion and failed writes', async () => {
  let stored: string | null = null;
  let rejectSave = false;
  const repository: JourneyRepository = {
    load: async () => stored ? deserializeJourney(stored) : null,
    save: async (_id, state) => { if (rejectSave) throw new Error('disk full'); stored = JSON.stringify(state); },
  };
  const service = new JourneyService(repository, 'test');
  const state = startChapter(initial(), event, 'minimal', preferences, now);
  await service.load(state);
  const chapter = state.chapters[0];
  const resolve = (current: JourneyState) => resolveChapterTask(current, chapter.id, chapter.tasks[0].mission.id, new Date(2026, 8, 17, 12));
  rejectSave = true;
  await assert.rejects(service.update(resolve), /disk full/);
  rejectSave = false;
  const results = await Promise.all([service.update(resolve), service.update(resolve)]);
  assert.equal(results[1].gameState.exp, 20);
  assert.equal((await new JourneyService(repository, 'test').load(initial())).chapters[0].tasks[0].result, 'success');
});

test('daily completion and EXP persist as one state change and cannot be awarded twice', () => {
  const board = createActivityBoardState(now);
  const id = getDailyDrawOptions(board, 42, now)[0].id;
  const selected = updateJourneyActivity({ ...initial(), activityBoard: board }, 'selectDaily', 42, id, now);
  const done = updateJourneyActivity(selected, 'completeDaily', 42, '謝謝今天的陪伴', now);
  assert.equal(done.gameState.exp, 2);
  assert.ok(done.activityBoard?.daily.completedTemplateIds.includes(id));
  const reloaded = deserializeJourney(JSON.stringify(done));
  assert.equal(updateJourneyActivity(reloaded, 'completeDaily', 42, '', now).gameState.exp, 2);
});

test('GG requires rebirth before resolving remaining tasks and changing profiles does not alter snapshots', () => {
  const started = startChapter(initial(), event, 'minimal', preferences, now);
  const chapter = started.chapters[0];
  const stopped = { ...started, gameState: { ...started.gameState, rankScore: -10, status: 'gg' as const } };
  assert.throws(() => resolveChapterTask(stopped, chapter.id, chapter.tasks[0].mission.id, now), /重生/);
  const changed = { ...event, title: '改過的名字' };
  assert.equal(startChapter(started, changed, 'full', { ...preferences, preferenceTags: [] }, now), started);
  assert.equal(started.chapters[0].event.title, '生日');
  assert.deepEqual(started.chapters[0].preferences.preferenceTags, ['書']);
});
