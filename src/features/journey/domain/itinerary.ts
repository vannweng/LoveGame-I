import { findPlanPlace } from '@/content/taipeiPlanPlaces';
import type { RelationshipPreferences } from '@/features/relationship/domain';
import type { DinnerReservation, ImportantDateItinerary, ItineraryItem, JourneyChapter, JourneyEvent } from './models';
import { entryBuffer, freeItem, suggestFreeStop } from './itineraryActivities';
import { estimateMetroTrip } from './metroEstimate';
import { itemEnd, itemStart, parsePlanTime, timedItem } from './planTime';
import { supportedMetroStations } from '@/content/taipeiMetro';

type PlanContext = Pick<JourneyChapter, 'tasks' | 'itinerary' | 'dinnerReservation' | 'cinemaReservation'> & { event: Pick<JourneyEvent, 'date'>; preferences?: RelationshipPreferences };

export function createSuggestedItinerary(event: JourneyEvent, preferences?: RelationshipPreferences): ImportantDateItinerary {
  return buildItinerary({ event, preferences, tasks: [] });
}

export function buildItinerary(chapter: PlanContext): ImportantDateItinerary {
  const fixed = bookingItems(chapter);
  const edited = (chapter.itinerary?.items ?? []).filter((item) => item.source === 'user' && item.kind !== 'transport' && !fixed.some((anchor) => anchor.id === item.id));
  const anchors = [...fixed, ...edited].sort((a, b) => itemStart(a) - itemStart(b));
  let activities = [...anchors];
  const used = new Set(anchors.flatMap((item) => item.location?.placeId ? [item.location.placeId] : []));
  if (!anchors.length) {
    activities = [freeItem(findPlanPlace('free-songshan')!, 'prelude', 900, 945), freeItem(findPlanPlace('free-village')!, 'evening', 1005, 1050)];
  } else {
    for (let index = 0; index <= anchors.length; index++) {
      const extra = suggestFreeStop(anchors[index - 1], anchors[index], used, `free:${anchors[index - 1]?.id ?? 'start'}:${anchors[index]?.id ?? 'end'}`, chapter.preferences);
      if (extra) { activities.push(extra); used.add(extra.location!.placeId!); }
    }
  }
  return connectActivities(chapter.event.date, activities);
}

export function bookingItems(chapter: PlanContext): ItineraryItem[] {
  const dinner = chapter.dinnerReservation ?? chapter.tasks.find((task) => task.dinnerReservation)?.dinnerReservation;
  const cinema = chapter.cinemaReservation ?? chapter.tasks.find((task) => task.cinemaReservation)?.cinemaReservation;
  const items: ItineraryItem[] = [];
  if (dinner) items.push(timedItem({ id: 'dinner', kind: 'dinner', title: dinner.restaurantName, description: '已回報訂位；用餐長度依回報資訊預留。', status: 'confirmed', source: 'system', location: dinner.location ?? findPlanPlace(dinner.restaurantName) }, parsePlanTime(dinner.reservedTime), parsePlanTime(dinner.reservedTime) + (dinner.durationMinutes ?? 120)));
  if (cinema) items.push(timedItem({ id: 'cinema', kind: 'cinema', title: cinema.movieTitle ? `${cinema.movieTitle}・${cinema.cinemaName}` : cinema.cinemaName, description: '已回報訂票；開演前另預留 20 分鐘入場。', status: 'confirmed', source: 'system', location: cinema.location }, parsePlanTime(cinema.reservedTime), parsePlanTime(cinema.reservedTime) + cinema.durationMinutes));
  return items;
}

export function connectActivities(eventDate: string, activities: ItineraryItem[]): ImportantDateItinerary {
  const sorted = [...activities].sort((a, b) => itemStart(a) - itemStart(b));
  const items: ItineraryItem[] = [];
  const alerts: string[] = [];
  sorted.forEach((item, index) => {
    const previous = sorted[index - 1];
    if (previous) {
      const trip = estimateMetroTrip(previous.location, item.location);
      const buffer = entryBuffer(item);
      if (!trip) alerts.push(`${previous.title} → ${item.title}：地點或車站資料不足，請補齊後再估算交通。`);
      else {
        const departure = Math.max(itemEnd(previous), itemStart(item) - trip.minutes - buffer);
        if (itemEnd(previous) + trip.minutes + buffer > itemStart(item)) alerts.push(`${previous.title} → ${item.title}：轉場時間不足，預估交通 ${trip.minutes} 分鐘，另需 ${buffer} 分鐘入場／到店緩衝。`);
        const late = departure % 1440 < 360 || (departure + trip.minutes) % 1440 >= 1410 || Math.floor(departure / 1440) !== Math.floor((departure + trip.minutes) / 1440);
        if (late) alerts.push(`${previous.title} → ${item.title}：早晚場請自行確認捷運首末班車或另安排交通。`);
        items.push(timedItem({ id: `transport:${previous.id}:${item.id}`, kind: 'transport', title: late ? '交通需確認' : trip.mode === 'walking' ? '步行轉場' : '捷運轉場', description: trip.description, status: 'suggested', source: 'system', estimatedMinutes: trip.minutes, route: { origin: previous.location!.address, destination: item.location!.address, mode: trip.mode ?? 'transit' } }, departure, departure + trip.minutes));
      }
      if (itemEnd(previous) > itemStart(item)) alerts.push(`${previous.title}與${item.title}時間重疊，請調整已預訂或手動安排的時段。`);
    }
    if (item.status === 'confirmed' && !item.location?.station) alerts.push(`${item.title}尚未設定鄰近捷運站；先保留預訂時間。`);
    if (item.status === 'confirmed' && (itemStart(item) < 360 || itemEnd(item) >= 1410)) alerts.push(`${item.title}為早晚場；請確認去程與回程的捷運首末班車，必要時另安排交通。`);
    const place = item.location?.placeId ? findPlanPlace(item.location.placeId) : undefined;
    if (item.free && place && (itemStart(item) < (place.opens ?? 540) || itemEnd(item) > (place.closes ?? 1320))) alerts.push(`${item.title}超出建議參訪時段，請調整時間並確認現場開放資訊。`);
    items.push(item);
  });
  return { eventDate, items: items.sort((a, b) => itemStart(a) - itemStart(b)), alerts: [...new Set(alerts)], plannerVersion: 2 };
}

// Compatibility for old callers; new bookings rebuild the entire chapter plan.
export function applyDinnerReservation(itinerary: ImportantDateItinerary, dinnerReservation: DinnerReservation): ImportantDateItinerary {
  return buildItinerary({ event: { date: itinerary.eventDate }, tasks: [], itinerary, dinnerReservation });
}

export function updateItineraryItem(itinerary: ImportantDateItinerary, item: ItineraryItem): ImportantDateItinerary {
  const current = itinerary.items.find((candidate) => candidate.id === item.id);
  if (!current || current.kind === 'transport' || current.status === 'confirmed') throw new Error('請在訂位／訂票回報修改固定時段；交通時間會自動更新。');
  if (!item.title.trim()) throw new Error('請填寫行程名稱。');
  if (itemEnd(item) <= itemStart(item)) throw new Error('結束時間要晚於開始時間。');
  if (item.location?.station && !supportedMetroStations.includes(item.location.station)) throw new Error('此捷運站尚未在台北示範路線中，請確認車站名稱。');
  if (item.location && (!item.location.address.trim() || !Number.isInteger(item.location.walkMinutes) || item.location.walkMinutes! < 1 || item.location.walkMinutes! > 60)) throw new Error('請填完整地址，以及 1–60 分鐘的步行時間。');
  const moved = item.location?.address !== current.location?.address || item.location?.station !== current.location?.station;
  const location = item.location ? { ...item.location, ...(moved ? { placeId: undefined } : {}) } : undefined;
  return connectActivities(itinerary.eventDate, itinerary.items.filter((candidate) => candidate.kind !== 'transport').map((candidate) => candidate.id === item.id ? { ...current, startTime: item.startTime, endTime: item.endTime, title: item.title.trim().slice(0, 80), description: item.description.slice(0, 180), source: 'user', location, free: moved ? false : current.free } : candidate));
}
