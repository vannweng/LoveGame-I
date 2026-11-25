import { calendarTimestamp, parseCalendarDate } from '@/shared/utils/calendarDate';

export interface AnnualDateCountdown {
  daysRemaining: number;
  occurrenceDate: string;
}

export function calculateAnnualDateCountdown(date: string, today: Date): AnnualDateCountdown | null {
  const parsedDate = parseCalendarDate(date);
  if (parsedDate === null) return null;

  const current = toUtcCalendarDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
  let occurrence = occurrenceForYear(parsedDate.month, parsedDate.day, today.getFullYear());
  if (occurrence < current) occurrence = occurrenceForYear(parsedDate.month, parsedDate.day, today.getFullYear() + 1);

  return {
    daysRemaining: Math.round((occurrence - current) / 86_400_000),
    occurrenceDate: toDateString(occurrence),
  };
}

function occurrenceForYear(month: number, day: number, year: number): number {
  const resolvedDay = month === 2 && day === 29 && !isLeapYear(year) ? 28 : day;
  return toUtcCalendarDate(year, month, resolvedDay);
}

function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function toUtcCalendarDate(year: number, month: number, day: number): number {
  return calendarTimestamp(year, month, day);
}

function toDateString(timestamp: number): string {
  return new Date(timestamp).toISOString().slice(0, 10);
}
