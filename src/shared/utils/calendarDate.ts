export function parseCalendarDate(value: string): { year: number; month: number; day: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const [year, month, day] = match.slice(1).map(Number);
  if (year < 1) return null;
  const parsed = new Date(0);
  parsed.setUTCFullYear(year, month - 1, day);
  if (parsed.getUTCFullYear() !== year || parsed.getUTCMonth() !== month - 1 || parsed.getUTCDate() !== day) return null;
  return { year, month, day };
}

export function isCalendarDate(value: string): boolean {
  return parseCalendarDate(value) !== null;
}

export function calendarTimestamp(year: number, month: number, day: number): number {
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  return date.getTime();
}

export function daysUntilCalendarDate(value: string, now: Date): number {
  const parsed = parseCalendarDate(value);
  if (!parsed) throw new Error('Invalid calendar date.');
  return Math.round((calendarTimestamp(parsed.year, parsed.month, parsed.day) - calendarTimestamp(now.getFullYear(), now.getMonth() + 1, now.getDate())) / 86_400_000);
}
