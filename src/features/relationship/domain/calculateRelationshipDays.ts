export function calculateRelationshipDays(startDate: string, today: Date): number {
  const start = parseLocalDate(startDate);
  const current = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  if (start === null || start > current) return 0;

  return Math.floor((current - start) / 86_400_000) + 1;
}

function parseLocalDate(value: string): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  if (parsed.getUTCFullYear() !== year || parsed.getUTCMonth() !== month - 1 || parsed.getUTCDate() !== day) return null;

  return parsed.getTime();
}
