import type { ItineraryItem } from './itineraryModels';

export function parsePlanTime(value: string): number {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match || Number(match[1]) > 23 || Number(match[2]) > 59) throw new Error('請以 HH:mm 填寫有效時間，例如 18:30。');
  return Number(match[1]) * 60 + Number(match[2]);
}

export function planTime(value: number): string {
  const minutes = value % 1440;
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
}

export function itemStart(item: ItineraryItem): number { return parsePlanTime(item.startTime) + (item.startDayOffset ?? 0) * 1440; }
export function itemEnd(item: ItineraryItem): number { return parsePlanTime(item.endTime) + (item.endDayOffset ?? 0) * 1440; }
export function timedItem(item: Omit<ItineraryItem, 'startTime' | 'endTime'>, start: number, end: number): ItineraryItem {
  return { ...item, startTime: planTime(start), endTime: planTime(end), startDayOffset: Math.floor(start / 1440), endDayOffset: Math.floor(end / 1440) };
}
