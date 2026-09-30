import type { JourneyChapter, JourneyEvent, JourneyState } from '../domain/models';
import { chapterId } from '../domain/journeyEvents';

export function getJourneyCardEvents(events: JourneyEvent[], state: JourneyState, now: Date): JourneyEvent[] {
  const today = localDate(now);
  const active = state.chapters.filter((chapter) => !chapter.completedAt).map((chapter) => chapter.event);
  const unique = [...active, ...events].filter((event, index, source) => source.findIndex((item) => chapterId(item) === chapterId(event)) === index);
  return unique.sort((left, right) => Number(left.date >= today) - Number(right.date >= today) || left.date.localeCompare(right.date));
}

export function countdownCopy(event: JourneyEvent, chapter: JourneyChapter | undefined, now: Date): string {
  const today = localDate(now);
  if (chapter && event.date < today) return `只剩 ${calendarDaysBetween(event.date, today)} 天，你已經快要ＧＧ了。`;
  return `還有 ${event.daysRemaining} 天，快點動起來。`;
}

export function chapterProgress(chapter: JourneyChapter): string {
  return `${chapter.tasks.filter((task) => task.result).length} / ${chapter.tasks.length} 步已記錄`;
}

function localDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function calendarDaysBetween(from: string, to: string): number {
  const [fromYear, fromMonth, fromDay] = from.split('-').map(Number);
  const [toYear, toMonth, toDay] = to.split('-').map(Number);
  return Math.round((Date.UTC(toYear, toMonth - 1, toDay) - Date.UTC(fromYear, fromMonth - 1, fromDay)) / 86_400_000);
}
