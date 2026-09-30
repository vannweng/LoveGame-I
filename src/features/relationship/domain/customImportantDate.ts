import type { CustomImportantDate } from './models';

export function createCustomImportantDate(
  title: string,
  date: string,
  importance: CustomImportantDate['importance'],
  nonce = Date.now(),
): CustomImportantDate {
  return {
    id: `custom-${nonce.toString(36)}-${stableHash(`${title}:${date}`)}`,
    title,
    date,
    recurrence: 'yearly',
    importance,
    effortLevel: 'balanced',
  };
}

export function getCustomImportantDateId(date: Pick<CustomImportantDate, 'date' | 'id' | 'title'>): string {
  return date.id ?? `legacy-${stableHash(`${date.title}:${date.date}`)}`;
}

function stableHash(value: string): string {
  let hash = 0;
  for (const character of value) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  return hash.toString(36);
}
