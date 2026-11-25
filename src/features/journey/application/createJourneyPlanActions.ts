import { replaceFreeActivity, resolveChapterTask, saveBookingReport, saveItineraryItem } from '../domain/journey';
import type { BookingReport, ItineraryItem, JourneyState } from '../domain/models';

export interface JourneyPlanActions {
  onBooking: (report: BookingReport) => Promise<boolean>;
  onSaveItem: (item: ItineraryItem) => Promise<boolean>;
  onReplace: (itemId: string) => Promise<boolean>;
}

export function createJourneyPlanActions(mutate: (change: (state: JourneyState) => JourneyState) => Promise<boolean>, chapterId: string, now: () => Date, missionId?: string): JourneyPlanActions {
  return {
    onBooking: (report) => mutate((state) => {
      const time = now();
      const updated = saveBookingReport(state, chapterId, report, time);
      const type = report.kind === 'dinner' ? 'date_dinner' : 'cinema_booking';
      const tasks = updated.chapters.find((chapter) => chapter.id === chapterId)?.tasks ?? [];
      const task = tasks.find((item) => item.mission.id === missionId && item.mission.template.missionType === type)
        ?? tasks.find((item) => item.mission.template.missionType === type);
      return task && !task.result && task.mission.template.missionType === type && time < task.mission.failAt
        ? resolveChapterTask(updated, chapterId, task.mission.id, time) : updated;
    }),
    onSaveItem: (item) => mutate((state) => saveItineraryItem(state, chapterId, item)),
    onReplace: (itemId) => mutate((state) => replaceFreeActivity(state, chapterId, itemId)),
  };
}
