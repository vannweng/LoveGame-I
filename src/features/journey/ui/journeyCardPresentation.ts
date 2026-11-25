import type { JourneyChapter } from '../domain/models';
import { colors } from '@/shared/theme/tokens';
import type { taskStatus } from '../domain/journey';
export { getJourneyCardEvents, countdownCopy } from './journeyEventPresentation';

type TaskStatus = ReturnType<typeof taskStatus>;

export function taskAccent(status: TaskStatus): string {
  if (status === 'fail') return colors.danger;
  if (status === 'late') return colors.orange;
  if (status === 'success') return colors.gold;
  if (status === 'done') return colors.safe;
  return colors.border;
}

export function chapterProgress(chapter: JourneyChapter): string {
  return `${chapter.tasks.filter((task) => task.result).length} / ${chapter.tasks.length} 步已記錄`;
}
