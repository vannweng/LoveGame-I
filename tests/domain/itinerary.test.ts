import assert from 'node:assert/strict';
import test from 'node:test';
import { findPlanPlace } from '@/content/taipeiPlanPlaces';
import { buildItinerary } from '@/features/journey/domain/itinerary';
import { estimateMetroTrip } from '@/features/journey/domain/metroEstimate';
import { itemEnd, itemStart } from '@/features/journey/domain/planTime';
import { replaceFreeActivity, resolveChapterTask, saveBookingReport, saveItineraryItem, startChapter } from '@/features/journey/domain/journey';
import type { BookingReport, JourneyState } from '@/features/journey/domain/models';
import { deserializeJourney } from '@/features/journey/data/serializeJourney';
import { createJourneyPlanActions } from '@/features/journey/application/createJourneyPlanActions';
import { planRouteUrl } from '@/features/journey/domain/planRouteUrl';
import { createRunHistory } from '@/game/run';

const now = new Date(2026, 8, 10, 12);
const event = { sourceId: 'birthday', title: '生日', date: '2026-09-20', daysRemaining: 10, importance: 'normal' as const, effort: 'full' as const };
const preferences = { style: 'romantic' as const, preferenceTags: ['文青手作'], dietaryPreferences: [], landmines: [] };
function initial(): JourneyState {
  return startChapter({ schemaVersion: 1, chapters: [], gameState: { exp: 0, combo: 0, rankScore: 0, status: 'danger' }, collectionState: { items: [], graves: [] }, runHistory: createRunHistory(now) }, event, 'full', preferences, now);
}
function booking(kind: BookingReport['kind'], id: string, startTime: string, durationMinutes = 120): BookingReport {
  const location = findPlanPlace(id)!;
  return { kind, name: location.name, startTime, durationMinutes, location };
}
function withBoth(reverse = false): JourneyState {
  let state = initial();
  const reports = [booking('cinema', 'cinema-qsquare', '15:30'), booking('dinner', 'dinner-village', '18:30')];
  if (reverse) reports.reverse();
  for (const report of reports) state = saveBookingReport(state, state.chapters[0].id, report, now);
  return state;
}

test('both bookings survive replanning in either report order, and feasible transfers never overlap', () => {
  const forward = withBoth().chapters[0];
  assert.deepEqual(forward.itinerary, withBoth(true).chapters[0].itinerary);
  const items = forward.itinerary!.items;
  assert.equal(items.find((item) => item.kind === 'cinema')?.startTime, '15:30');
  assert.equal(items.find((item) => item.kind === 'dinner')?.startTime, '18:30');
  assert.ok(items.some((item) => item.kind === 'transport' && item.description.includes('淡水信義線')));
  assert.ok(items.some((item) => item.free && item.location?.address));
  assert.deepEqual(forward.itinerary?.alerts, []);
  for (let i = 1; i < items.length; i++) assert.ok(itemEnd(items[i - 1]) <= itemStart(items[i]));
});

test('tight bookings keep their original time, warn about transit, and omit activities that cannot fit', () => {
  let state = initial();
  state = saveBookingReport(state, state.chapters[0].id, booking('cinema', 'cinema-qsquare', '15:30'), now);
  state = saveBookingReport(state, state.chapters[0].id, booking('dinner', 'dinner-village', '17:45'), now);
  const plan = state.chapters[0].itinerary!;
  assert.ok(plan.alerts?.some((alert) => alert.includes('轉場時間不足')));
  assert.equal(plan.items.find((item) => item.kind === 'dinner')?.startTime, '17:45');
  assert.ok(!plan.items.some((item) => item.free && itemStart(item) >= 1050 && itemStart(item) < 1065));
});

test('late cinema retains next-day ending instead of wrapping it before the start', () => {
  const state = saveBookingReport(initial(), initial().chapters[0].id, booking('cinema', 'cinema-xinyi', '23:00', 150), now);
  const cinema = state.chapters[0].itinerary!.items.find((item) => item.kind === 'cinema')!;
  assert.equal(cinema.endTime, '01:30');
  assert.equal(cinema.endDayOffset, 1);
  assert.ok(itemEnd(cinema) > itemStart(cinema));
  assert.ok(!state.chapters[0].itinerary!.items.some((item) => item.free && itemStart(item) > itemStart(cinema)));
  assert.ok(state.chapters[0].itinerary!.alerts?.some((alert) => alert.includes('首末班車')));
});

test('free attractions respect visit windows and selected landmines', () => {
  let state = initial();
  state.chapters[0].preferences.landmines = ['花粉過敏'];
  state = saveBookingReport(state, state.chapters[0].id, booking('dinner', 'dinner-village', '18:30'), now);
  for (const item of state.chapters[0].itinerary!.items.filter((item) => item.free)) {
    const place = findPlanPlace(item.location!.placeId!)!;
    assert.ok(!place.landmines?.includes('花粉過敏'));
    assert.ok(itemStart(item) >= place.opens! && itemEnd(item) <= place.closes!);
  }
});

test('editing and replacing free stops preserve bookings and unique timeline IDs', () => {
  const state = withBoth();
  const chapter = state.chapters[0];
  const free = chapter.itinerary!.items.find((item) => item.free)!;
  const changed = saveItineraryItem(state, chapter.id, { ...free, title: '我們的城市合照' });
  const updated = saveBookingReport(changed, chapter.id, booking('dinner', 'dinner-village', '19:00'), now);
  assert.equal(updated.chapters[0].itinerary!.items.find((item) => item.id === free.id)?.title, '我們的城市合照');
  assert.throws(() => replaceFreeActivity(updated, chapter.id, free.id), /沒有其他順路/);
  assert.equal(updated.chapters[0].itinerary!.items.find((item) => item.kind === 'cinema')?.startTime, '15:30');
  const defaultState = initial();
  const alternate = replaceFreeActivity(defaultState, chapter.id, 'prelude');
  assert.notEqual(alternate.chapters[0].itinerary!.items.find((item) => item.id === 'prelude')?.location?.placeId, 'free-songshan');
  assert.equal(new Set(alternate.chapters[0].itinerary!.items.map((item) => item.id)).size, alternate.chapters[0].itinerary!.items.length);
});

test('booked and transport slots cannot be changed through activity editing', () => {
  const state = withBoth();
  for (const item of state.chapters[0].itinerary!.items.filter((item) => item.kind === 'transport' || item.status === 'confirmed')) {
    assert.throws(() => saveItineraryItem(state, state.chapters[0].id, item), /固定時段/);
  }
});

test('unknown and legacy locations do not invent a zero-minute transfer; minimal plans persist reservations', () => {
  const state = initial();
  const legacy = { ...state, chapters: [{ ...state.chapters[0], tasks: [], dinnerReservation: { restaurantName: '自己的餐廳', reservedTime: '18:30', reportedAt: now.toISOString() } }] };
  const plan = buildItinerary(legacy.chapters[0]);
  assert.ok(plan.alerts?.some((alert) => alert.includes('捷運站')));
  assert.ok(!plan.items.some((item) => item.kind === 'transport' && item.estimatedMinutes === 0));
  const reported = saveBookingReport({ ...state, chapters: [{ ...state.chapters[0], tasks: [] }] }, state.chapters[0].id, booking('cinema', 'cinema-xinyi', '15:00'), now);
  assert.deepEqual(deserializeJourney(JSON.stringify(reported)).chapters[0].cinemaReservation, JSON.parse(JSON.stringify(reported.chapters[0].cinemaReservation)));
});

test('cinema requires report details to complete, while overdue failures remain reportable without booking', () => {
  const state = initial();
  const task = state.chapters[0].tasks.find((item) => item.mission.template.missionType === 'cinema_booking')!;
  assert.throws(() => resolveChapterTask(state, state.chapters[0].id, task.mission.id, now), /開演時間與片長/);
  assert.equal(resolveChapterTask(state, state.chapters[0].id, task.mission.id, task.mission.failAt).chapters[0].tasks.find((item) => item.mission.id === task.mission.id)?.result, 'fail');
});

test('legacy confirmed dinner and manually edited activities survive planner migration', () => {
  const state = initial();
  const chapter = state.chapters[0];
  const manual = { ...chapter.itinerary!.items[0], title: '我們自己的景點', source: 'user' as const };
  const dinner = { id: 'dinner', startTime: '18:30', endTime: '20:30', title: findPlanPlace('dinner-xuji')!.name, description: '已訂位', status: 'confirmed' as const, source: 'system' as const };
  const legacy = { ...state, chapters: [{ ...chapter, tasks: [], itinerary: { eventDate: event.date, items: [manual, dinner] } }] };
  const restored = deserializeJourney(JSON.stringify(legacy)).chapters[0];
  assert.equal(restored.dinnerReservation?.reservedTime, '18:30');
  assert.equal(restored.itinerary?.plannerVersion, 2);
  assert.ok(restored.itinerary?.items.some((item) => item.title === manual.title && item.source === 'user'));
  assert.equal(restored.itinerary?.items.find((item) => item.id === 'dinner')?.location?.station, '象山');
});

test('one-click booking report and reward save together, editing a completed booking never awards again', async () => {
  let state = initial();
  const task = state.chapters[0].tasks.find((item) => item.mission.template.missionType === 'cinema_booking')!;
  const actions = createJourneyPlanActions(async (change) => { state = change(state); return true; }, state.chapters[0].id, () => now, task.mission.id);
  assert.ok(await actions.onBooking(booking('cinema', 'cinema-xinyi', '15:30')));
  const exp = state.gameState.exp;
  assert.ok(exp > 0);
  assert.ok(await actions.onBooking(booking('cinema', 'cinema-qsquare', '16:00')));
  assert.equal(state.gameState.exp, exp);
});

test('metro estimates include transfers and return no route for unsupported stations', () => {
  const estimate = estimateMetroTrip({ name: '起點', address: '起點', station: '士林', walkMinutes: 10 }, { name: '終點', address: '終點', station: '國父紀念館', walkMinutes: 8 });
  assert.ok(estimate!.description.includes('轉乘'));
  assert.ok(estimate!.minutes >= 18);
  assert.equal(estimateMetroTrip({ name: '未知', address: '未知', station: '未支援車站' }, findPlanPlace('cinema-xinyi')), null);
});

test('reporting from the chapter panel completes the matching task without a second confirmation', async () => {
  let state = initial();
  const actions = createJourneyPlanActions(async (change) => { state = change(state); return true; }, state.chapters[0].id, () => now);
  await actions.onBooking(booking('dinner', 'dinner-xuji', '18:30'));
  assert.equal(state.chapters[0].tasks.find((task) => task.mission.template.missionType === 'date_dinner')?.result, 'late');
  assert.equal(state.chapters[0].tasks.find((task) => task.mission.template.missionType === 'cinema_booking')?.result, undefined);
});

test('route links encode addresses and use a normal external directions page', () => {
  const url = new URL(planRouteUrl({ origin: '台北市松壽路 20 號', destination: '台北市福林路188號', mode: 'transit' }));
  assert.equal(url.hostname, 'www.google.com');
  assert.equal(url.searchParams.get('origin'), '台北市松壽路 20 號');
  assert.equal(url.searchParams.get('travelmode'), 'transit');
});

test('report validation rejects unsupported locations and invalid occupancy lengths', () => {
  const state = initial();
  const report = booking('cinema', 'cinema-xinyi', '15:30');
  assert.throws(() => saveBookingReport(state, state.chapters[0].id, { ...report, durationMinutes: 0 }, now), /15–360/);
  assert.throws(() => saveBookingReport(state, state.chapters[0].id, { ...report, location: { name: '影城', address: '' } }, now), /地址/);
});
