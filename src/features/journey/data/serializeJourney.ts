import type { JourneyState } from '../domain/models';

export function deserializeJourney(value: string): JourneyState {
  const state = JSON.parse(value) as JourneyState;
  if (state.schemaVersion !== 1) throw new Error('這份旅程存檔需要更新版本才能讀取。');
  return {
    ...state,
    collectionState: {
      items: state.collectionState.items.map((item) => ({ ...item, unlockedAt: new Date(item.unlockedAt) })),
      graves: state.collectionState.graves.map((item) => ({ ...item, createdAt: new Date(item.createdAt) })),
    },
    chapters: state.chapters.map((chapter) => ({ ...chapter, tasks: chapter.tasks.map((task) => ({
      ...task, mission: { ...task.mission, successUntil: new Date(task.mission.successUntil), failAt: new Date(task.mission.failAt) },
    })) })),
  };
}
