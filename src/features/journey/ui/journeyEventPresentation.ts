import type { JourneyChapter, JourneyEvent, JourneyState } from '../domain/models';
import { chapterId } from '../domain/journeyEvents';
import { daysUntilCalendarDate } from '@/shared/utils/calendarDate';

export function getJourneyCardEvents(events: JourneyEvent[], state: JourneyState, now: Date): JourneyEvent[] {
  const active = state.chapters.filter((chapter) => !chapter.completedAt).map((chapter) => chapter.event);
  const unique = [...active, ...events].filter((event, index, source) => source.findIndex((item) => chapterId(item) === chapterId(event)) === index);
  return unique.map((event) => ({ ...event, daysRemaining: daysUntilCalendarDate(event.date, now) }))
    .sort((left, right) => Number(left.daysRemaining >= 0) - Number(right.daysRemaining >= 0) || left.date.localeCompare(right.date));
}

export function countdownCopy(event: JourneyEvent, _chapter: JourneyChapter | undefined, now: Date): string {
  const days = daysUntilCalendarDate(event.date, now);
  if (days < 0) return `重要日已過 ${Math.abs(days)} 天，請查看這次準備的結果。`;
  if (days === 0) return '重要日就是今天，查看你們的專屬行程。';
  return `還有 ${days} 天，快點動起來。`;
}
