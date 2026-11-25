import assert from 'node:assert/strict';
import test from 'node:test';
import { acknowledgeStoredDraft, createStoredDraft, syncStoredDraft } from '@/shared/utils/storedDraft';
import { countdownCopy, getJourneyCardEvents } from '@/features/journey/ui/journeyEventPresentation';
import { resolveChapterTask, startChapter } from '@/features/journey/domain/journey';
import type { JourneyEvent, JourneyState } from '@/features/journey/domain/models';
import { createRunHistory } from '@/game/run';
import { deserializeJourney } from '@/features/journey/data/serializeJourney';

const now = new Date(2026, 9, 4, 12);
const event: JourneyEvent = { sourceId: 'birthday', title: '生日', date: '2026-10-12', importance: 'survival', effort: 'full', daysRemaining: 8 };
const initial = (): JourneyState => ({ schemaVersion: 1, chapters: [], gameState: { exp: 0, combo: 0, rankScore: 0, status: 'danger' }, collectionState: { items: [], graves: [] }, runHistory: createRunHistory(now) });
const started = () => startChapter(initial(), event, 'full', { style: 'practical', preferenceTags: [], dietaryPreferences: [], landmines: [] }, now);

test('unchanged persisted objects do not erase unsaved movie or itinerary drafts', () => {
  const original = { startTime: '18:00', name: '影城' };
  const draft = { ...createStoredDraft('cinema', original), value: { ...original, startTime: '16:30' } };
  assert.equal(syncStoredDraft(draft, 'cinema', { ...original }), draft);
  assert.equal(syncStoredDraft(draft, 'cinema', { ...original, name: '系統更新' }).value.startTime, '16:30');
});

test('clean drafts sync to actual data changes and switching scope initializes the right form', () => {
  const current = createStoredDraft('chapter1:dinner', '18:00');
  assert.equal(syncStoredDraft(current, current.scope, '19:00').value, '19:00');
  const dirty = { ...current, value: '20:00' };
  assert.equal(syncStoredDraft(dirty, 'chapter2:dinner', '17:00').value, '17:00');
});

test('saving acknowledges a dirty draft without clearing it or making it permanently dirty', () => {
  const dirty = { ...createStoredDraft('cinema', '18:00'), value: '16:30' };
  const saved = syncStoredDraft(dirty, 'cinema', '16:30');
  assert.equal(saved.value, '16:30');
  assert.equal(syncStoredDraft(saved, 'cinema', '17:00').value, '17:00');
});

test('successful saves accept normalized data regardless of render order, but never erase newer edits', () => {
  const initial = createStoredDraft('activity', { title: '景點', source: 'system' });
  const submitted = { title: ' 新名稱 ', source: 'system' };
  const normalized = { title: '新名稱', source: 'user' };
  const dirty = { ...initial, value: submitted };
  const rendered = syncStoredDraft(dirty, 'activity', normalized);
  assert.deepEqual(acknowledgeStoredDraft(rendered, submitted, initial.source).value, normalized);
  const acknowledgedFirst = acknowledgeStoredDraft(dirty, submitted, initial.source);
  assert.deepEqual(syncStoredDraft(acknowledgedFirst, 'activity', normalized).value, normalized);
  const newer = { ...rendered, value: { ...submitted, title: '保存時又修改' } };
  assert.equal(acknowledgeStoredDraft(newer, submitted, initial.source), newer);
});

test('daily and weekly reflections cannot leak between cards, dates or weeks', () => {
  for (const [from, to] of [['daily:2026-10-04:card1', 'daily:2026-10-04:card2'], ['daily:2026-10-04:card1', 'daily:2026-10-05:card1'], ['weekly:week1:card1', 'weekly:week2:card1']]) {
    const dirty = { ...createStoredDraft(from, ''), value: '上一張心得' };
    assert.equal(syncStoredDraft(dirty, to, '').value, '');
    assert.equal(syncStoredDraft(dirty, from, '').value, '上一張心得');
  }
});

test('active chapter countdown updates without changing its event, deadlines or deduplication', () => {
  const state = started();
  const snapshot = JSON.stringify(state);
  const tomorrow = new Date(2026, 9, 5, 12);
  const cards = getJourneyCardEvents([{ ...event, daysRemaining: 7 }], state, tomorrow);
  assert.equal(cards.length, 1);
  assert.equal(cards[0].daysRemaining, 7);
  assert.match(countdownCopy(event, state.chapters[0], tomorrow), /還有 7 天/);
  assert.match(countdownCopy(event, state.chapters[0], new Date(2026, 9, 12)), /就是今天/);
  assert.match(countdownCopy(event, state.chapters[0], new Date(2026, 9, 14)), /已過 2 天/);
  assert.equal(JSON.stringify(state), snapshot);
});

test('card completion atomically retains unsaved text and completed contents remain immutable after reload', () => {
  const state = started(); const chapter = state.chapters[0];
  const card = chapter.tasks.find((task) => task.mission.template.id === 'birthday-card')!;
  const completed = resolveChapterTask(state, chapter.id, card.mission.id, now, '謝謝妳，生日快樂。');
  const loaded = deserializeJourney(JSON.stringify(completed));
  assert.equal(loaded.chapters[0].tasks.find((task) => task.mission.id === card.mission.id)?.cardDraft, '謝謝妳，生日快樂。');
  assert.equal(resolveChapterTask(loaded, chapter.id, card.mission.id, now, '不能覆蓋'), loaded);
  assert.equal(loaded.gameState.exp, 20);
});
