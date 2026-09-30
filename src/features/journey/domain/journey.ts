import { missionTemplates } from '@/content/missionTemplates';
import { getMissionTemplateIdsForEffort } from '@/content/importantDateEffort';
import { completeMission } from '@/features/missions/domain/completeMission';
import type { ImportantDateEffortLevel, RelationshipPreferences } from '@/features/relationship/domain';
import { recordRunResolution } from '@/game/run';
import type { JourneyChapter, JourneyEvent, JourneyState, JourneyTask } from './models';
import { chapterId, dateAtOffset } from './journeyEvents';

export function startChapter(state: JourneyState, event: JourneyEvent, effort: ImportantDateEffortLevel, preferences: RelationshipPreferences, now: Date): JourneyState {
  const id = chapterId(event);
  if (state.chapters.some((chapter) => chapter.id === id)) return state;
  const tasks = getMissionTemplateIdsForEffort(effort).map((templateId): JourneyTask => {
    const template = JSON.parse(JSON.stringify(missionTemplates[templateId])) as typeof missionTemplates[string];
    return {
      opensAt: dateAtOffset(event.date, template.trigger.eventOffsetDays).toISOString(),
      mission: {
        id: `${id}:${templateId}`, importance: event.importance, template,
        successUntil: dateAtOffset(event.date, template.trigger.eventOffsetDays + template.trigger.successDays),
        failAt: dateAtOffset(event.date, 0),
      },
    };
  });
  const preferenceSnapshot = { ...preferences, preferenceTags: [...preferences.preferenceTags], dietaryPreferences: [...preferences.dietaryPreferences], landmines: [...preferences.landmines] };
  const chapter: JourneyChapter = { id, event: { ...event }, effort, preferences: preferenceSnapshot, startedAt: now.toISOString(), tasks, rulesetVersion: '0.2' };
  return { ...state, chapters: [...state.chapters, chapter] };
}

export function resolveChapterTask(state: JourneyState, chapterId: string, missionId: string, now: Date): JourneyState {
  const chapter = state.chapters.find((item) => item.id === chapterId);
  const task = chapter?.tasks.find((item) => item.mission.id === missionId);
  if (!chapter || !task) throw new Error('找不到這個任務，請回篇章重試。');
  if (task.result) return state;
  if (state.gameState.status === 'gg') throw new Error('請先完成重生，再回來處理任務。');
  if (now < new Date(task.opensAt)) throw new Error('這個任務尚未開放。');
  const outcome = completeMission(task.mission, state.gameState, state.collectionState, now);
  const tasks = chapter.tasks.map((item) => item === task ? { ...item, result: outcome.result, resolvedAt: now.toISOString() } : item);
  return {
    ...state, gameState: outcome.gameState, collectionState: outcome.collectionState,
    runHistory: recordRunResolution(state.runHistory, { result: outcome.result, rankScore: outcome.gameState.rankScore, occurredAt: now, deathCause: task.mission.template.titleKey }),
    chapters: state.chapters.map((item) => item === chapter ? { ...item, tasks, completedAt: tasks.every((task) => task.result) ? now.toISOString() : undefined } : item),
  };
}

export function saveChapterReflection(state: JourneyState, id: string, reflection: string): JourneyState {
  const chapter = state.chapters.find((item) => item.id === id);
  if (!chapter?.completedAt) throw new Error('完成篇章後就能留下心得。');
  return { ...state, chapters: state.chapters.map((item) => item.id === id ? { ...item, reflection: reflection.trim().slice(0, 300) } : item) };
}

/** A card draft is preparatory only; it deliberately does not resolve a mission or award progress. */
export function saveChapterTaskDraft(state: JourneyState, chapterId: string, missionId: string, draft: string): JourneyState {
  const chapter = state.chapters.find((item) => item.id === chapterId);
  const task = chapter?.tasks.find((item) => item.mission.id === missionId);
  if (!chapter || !task) throw new Error('找不到這個任務，請回篇章重試。');
  if (task.mission.template.id !== 'birthday-card') throw new Error('只有卡片任務可以先保存草稿。');
  if (task.result) throw new Error('任務已結算，不能再修改卡片草稿。');
  const tasks = chapter.tasks.map((item) => item === task ? { ...item, cardDraft: draft.slice(0, 500) } : item);
  return { ...state, chapters: state.chapters.map((item) => item === chapter ? { ...item, tasks } : item) };
}

export function previousChapter(state: JourneyState, event: JourneyEvent): JourneyChapter | undefined {
  return state.chapters.filter((chapter) => chapter.event.sourceId === event.sourceId && chapter.event.date < event.date && chapter.completedAt)
    .sort((a, b) => b.event.date.localeCompare(a.event.date))[0];
}

export function taskStatus(task: JourneyTask, now: Date): 'scheduled' | 'success' | 'late' | 'fail' | 'done' {
  if (task.result) return 'done';
  if (now < new Date(task.opensAt)) return 'scheduled';
  if (now >= task.mission.failAt) return 'fail';
  return now < task.mission.successUntil ? 'success' : 'late';
}

export function nextTask(chapter: JourneyChapter, now: Date): JourneyTask | undefined {
  return chapter.tasks.filter((task) => !task.result).sort((a, b) => {
    const scheduled = Number(taskStatus(a, now) === 'scheduled') - Number(taskStatus(b, now) === 'scheduled');
    return scheduled || a.mission.successUntil.getTime() - b.mission.successUntil.getTime() || a.mission.id.localeCompare(b.mission.id);
  })[0];
}
