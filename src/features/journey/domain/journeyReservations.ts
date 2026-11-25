import { findPlanPlace } from '@/content/taipeiPlanPlaces';
import { supportedMetroStations } from '@/content/taipeiMetro';
import type { BookingReport, CinemaReservation, DinnerReservation, JourneyChapter, JourneyState, PlanLocation } from './models';
import { buildItinerary } from './itinerary';
import { parsePlanTime } from './planTime';

export function saveBookingReport(state: JourneyState, id: string, input: BookingReport, now: Date): JourneyState {
  const name = input.name.trim();
  if (!name || !input.location.address.trim()) throw new Error('請選擇分店，或填寫名稱與地址。');
  if (!input.location.station || !supportedMetroStations.includes(input.location.station)) throw new Error('請填寫支援的鄰近捷運站，方便安排轉場。');
  validateTime(input.startTime, input.durationMinutes);
  const location: PlanLocation = { ...input.location, name: name.slice(0, 80), address: input.location.address.trim().slice(0, 160), walkMinutes: input.location.walkMinutes ?? 10 };
  if (!Number.isInteger(location.walkMinutes) || location.walkMinutes! < 1 || location.walkMinutes! > 60) throw new Error('到捷運站的步行時間請填 1–60 分鐘。');
  if (input.kind === 'dinner') return saveDinnerReservation(state, id, name, input.startTime, now, { location, durationMinutes: input.durationMinutes });
  return saveCinemaReservation(state, id, { cinemaName: name.slice(0, 80), movieTitle: input.movieTitle?.trim().slice(0, 80), reservedTime: input.startTime, durationMinutes: input.durationMinutes, location, reportedAt: now.toISOString() });
}

export function saveDinnerReservation(state: JourneyState, id: string, restaurantName: string, reservedTime: string, now: Date, options: Pick<DinnerReservation, 'durationMinutes' | 'location'> = {}): JourneyState {
  const name = restaurantName.trim();
  if (!name) throw new Error('請填寫已預訂的餐廳名稱。');
  validateTime(reservedTime, options.durationMinutes ?? 120);
  const reservation: DinnerReservation = { restaurantName: name.slice(0, 80), reservedTime, reportedAt: now.toISOString(), durationMinutes: options.durationMinutes ?? 120, location: options.location ?? findPlanPlace(name) };
  return updateChapter(state, id, (chapter) => ({ ...chapter, dinnerReservation: reservation, tasks: chapter.tasks.map((task) => task.mission.template.missionType === 'date_dinner' ? { ...task, dinnerReservation: reservation } : task) }));
}

export function saveCinemaReservation(state: JourneyState, id: string, reservation: CinemaReservation): JourneyState {
  validateTime(reservation.reservedTime, reservation.durationMinutes);
  if (!reservation.cinemaName.trim() || !reservation.location.address.trim()) throw new Error('請填寫影城分店與地址。');
  return updateChapter(state, id, (chapter) => ({ ...chapter, cinemaReservation: reservation, tasks: chapter.tasks.map((task) => task.mission.template.missionType === 'cinema_booking' ? { ...task, cinemaReservation: reservation } : task) }));
}

function updateChapter(state: JourneyState, id: string, change: (chapter: JourneyChapter) => JourneyChapter): JourneyState {
  const chapter = state.chapters.find((item) => item.id === id);
  if (!chapter) throw new Error('找不到這個篇章，請回重要日重試。');
  const updated = change(chapter);
  return { ...state, chapters: state.chapters.map((item) => item.id === id ? { ...updated, itinerary: buildItinerary(updated) } : item) };
}

function validateTime(time: string, duration: number): void {
  parsePlanTime(time);
  if (!Number.isInteger(duration) || duration < 15 || duration > 360) throw new Error('片長／用餐長度請填 15–360 分鐘。');
}
