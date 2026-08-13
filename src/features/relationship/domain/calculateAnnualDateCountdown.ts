export interface AnnualDateCountdown {
  daysRemaining: number;
  occurrenceDate: string;
}

export function calculateAnnualDateCountdown(date: string, today: Date): AnnualDateCountdown | null {
  const parsedDate = parseLocalDate(date);
  if (parsedDate === null) return null;

  const current = toUtcCalendarDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
  let occurrence = occurrenceForYear(parsedDate.month, parsedDate.day, today.getFullYear());
  if (occurrence < current) occurrence = occurrenceForYear(parsedDate.month, parsedDate.day, today.getFullYear() + 1);

  return {
    daysRemaining: Math.round((occurrence - current) / 86_400_000),
    occurrenceDate: toDateString(occurrence),
  };
}

interface LocalDateParts {
  day: number;
  month: number;
  year: number;
}

function parseLocalDate(value: string): LocalDateParts | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  if (parsed.getUTCFullYear() !== year || parsed.getUTCMonth() !== month - 1 || parsed.getUTCDate() !== day) return null;

  return { year, month, day };
}

function occurrenceForYear(month: number, day: number, year: number): number {
  const resolvedDay = month === 2 && day === 29 && !isLeapYear(year) ? 28 : day;
  return toUtcCalendarDate(year, month, resolvedDay);
}

function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function toUtcCalendarDate(year: number, month: number, day: number): number {
  return Date.UTC(year, month - 1, day);
}

function toDateString(timestamp: number): string {
  return new Date(timestamp).toISOString().slice(0, 10);
}
