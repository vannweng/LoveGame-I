import { dailyActivityTemplates, milestoneActivityTemplates, weeklyChallengeTemplates } from '@/content/dailyActivities';
import type { ActivityBoardState, ActivityCompletion, ActivityTemplate } from './models';

export function createActivityBoardState(now: Date): ActivityBoardState {
  return {
    daily: { dayKey: getDayKey(now), templateId: null, rerolled: false, completedAt: null, reflection: null, previousTemplateId: null, deckTemplateIds: [], completedTemplateIds: [] }, rerollUsed: false,
    weekly: { weekKey: getWeekKey(now), templateId: null, completedAt: null, reflection: null, previousTemplateId: null, rerolled: false, deckTemplateIds: [], completedTemplateIds: [] },
  };
}

export function normalizeActivityBoard(state: ActivityBoardState, now: Date): ActivityBoardState {
  const daily = state.daily.dayKey === getDayKey(now) ? { ...state.daily, deckTemplateIds: state.daily.deckTemplateIds ?? [], completedTemplateIds: state.daily.completedTemplateIds ?? [] } : createActivityBoardState(now).daily;
  const weekly = state.weekly.weekKey === getWeekKey(now) ? { ...state.weekly, deckTemplateIds: state.weekly.deckTemplateIds ?? [], completedTemplateIds: state.weekly.completedTemplateIds ?? [], rerolled: state.weekly.rerolled ?? false } : createActivityBoardState(now).weekly;
  return { daily, weekly, rerollUsed: state.rerollUsed ?? false };
}

export function drawDailyActivity(state: ActivityBoardState, relationshipDays: number, now: Date): ActivityBoardState {
  const normalized = normalizeActivityBoard(state, now);
  if (normalized.daily.templateId) return normalized;
  return selectDailyActivity(normalized, relationshipDays, getDailyDrawOptions(normalized, relationshipDays, now)[0]?.id ?? '', now);
}

export function selectDailyActivity(state: ActivityBoardState, relationshipDays: number, templateId: string, now: Date): ActivityBoardState {
  const normalized = normalizeActivityBoard(state, now);
  const valid = getDailyDrawOptions(normalized, relationshipDays, now).some((template) => template.id === templateId);
  const deckTemplateIds = normalized.daily.deckTemplateIds.length ? normalized.daily.deckTemplateIds : getDailyDrawOptions(normalized, relationshipDays, now).map((template) => template.id);
  return !valid || normalized.daily.templateId || normalized.daily.completedTemplateIds.includes(templateId) ? normalized : { ...normalized, daily: { ...normalized.daily, deckTemplateIds, templateId } };
}

export function rerollDailyActivity(state: ActivityBoardState, relationshipDays: number, now: Date): ActivityBoardState {
  const normalized = normalizeActivityBoard(state, now);
  if (!normalized.daily.templateId || normalized.rerollUsed || isMilestoneDay(relationshipDays)) return normalized;
  return { ...normalized, rerollUsed: true, daily: { ...normalized.daily, rerolled: true, previousTemplateId: normalized.daily.templateId, templateId: null, deckTemplateIds: [] } };
}

export function openWeeklyChallenge(state: ActivityBoardState, now: Date): ActivityBoardState {
  const normalized = normalizeActivityBoard(state, now);
  if (![0, 6].includes(now.getDay()) || normalized.weekly.templateId) return normalized;
  return selectWeeklyChallenge(normalized, getWeeklyDrawOptions(normalized, now)[0]?.id ?? '', now);
}

export function selectWeeklyChallenge(state: ActivityBoardState, templateId: string, now: Date): ActivityBoardState {
  const normalized = normalizeActivityBoard(state, now);
  const valid = [0, 6].includes(now.getDay()) && getWeeklyDrawOptions(normalized, now).some((template) => template.id === templateId);
  const deckTemplateIds = normalized.weekly.deckTemplateIds.length ? normalized.weekly.deckTemplateIds : getWeeklyDrawOptions(normalized, now).map((template) => template.id);
  return !valid || normalized.weekly.templateId || normalized.weekly.completedTemplateIds.includes(templateId) ? normalized : { ...normalized, weekly: { ...normalized.weekly, deckTemplateIds, templateId } };
}

export function rerollWeeklyChallenge(state: ActivityBoardState, now: Date): ActivityBoardState {
  const normalized = normalizeActivityBoard(state, now);
  if (!normalized.weekly.templateId || normalized.rerollUsed || normalized.weekly.completedAt) return normalized;
  return { ...normalized, rerollUsed: true, weekly: { ...normalized.weekly, rerolled: true, previousTemplateId: normalized.weekly.templateId, templateId: null, deckTemplateIds: [] } };
}

export function selectNextDailyActivity(state: ActivityBoardState, relationshipDays: number, now: Date): ActivityBoardState {
  const normalized = normalizeActivityBoard(state, now);
  if (normalized.daily.templateId) return normalized;
  const remaining = getDailyDrawOptions(normalized, relationshipDays, now).filter((template) => !normalized.daily.completedTemplateIds.includes(template.id));
  return selectDailyActivity(normalized, relationshipDays, pickOptions(remaining, `${normalized.daily.dayKey}:${normalized.daily.completedTemplateIds.length}` , 1)[0]?.id ?? '', now);
}

export function selectNextWeeklyChallenge(state: ActivityBoardState, now: Date): ActivityBoardState {
  const normalized = normalizeActivityBoard(state, now);
  if (normalized.weekly.templateId) return normalized;
  const remaining = getWeeklyDrawOptions(normalized, now).filter((template) => !normalized.weekly.completedTemplateIds.includes(template.id));
  return selectWeeklyChallenge(normalized, pickOptions(remaining, `${normalized.weekly.weekKey}:${normalized.weekly.completedTemplateIds.length}`, 1)[0]?.id ?? '', now);
}

export function getDailyDrawOptions(state: ActivityBoardState, relationshipDays: number, now: Date): ActivityTemplate[] {
  const normalized = normalizeActivityBoard(state, now);
  if (normalized.daily.deckTemplateIds.length) return normalized.daily.deckTemplateIds.map((id) => findTemplate(id)).filter((template): template is ActivityTemplate => Boolean(template));
  return pickOptions(getDailyTemplates(relationshipDays).filter((template) => template.id !== normalized.daily.previousTemplateId), normalized.daily.dayKey, 3);
}

export function getWeeklyDrawOptions(state: ActivityBoardState, now: Date): ActivityTemplate[] {
  const normalized = normalizeActivityBoard(state, now);
  if (normalized.weekly.deckTemplateIds.length) return normalized.weekly.deckTemplateIds.map((id) => findTemplate(id)).filter((template): template is ActivityTemplate => Boolean(template));
  return pickOptions(weeklyChallengeTemplates.filter((template) => template.id !== normalized.weekly.previousTemplateId), normalized.weekly.weekKey, 3);
}

export function completeDailyActivity(state: ActivityBoardState, now: Date, reflection = ''): ActivityCompletion {
  const normalized = normalizeActivityBoard(state, now);
  const template = findTemplate(normalized.daily.templateId);
  if (!template || normalized.daily.completedTemplateIds.includes(template.id)) return { expDelta: 0, state: normalized };
  return { expDelta: template.exp, state: { ...normalized, daily: { ...normalized.daily, templateId: null, completedAt: now.toISOString(), completedTemplateIds: [...normalized.daily.completedTemplateIds, template.id], reflection: cleanReflection(reflection) } } };
}

export function cancelDailyActivity(state: ActivityBoardState, now: Date): ActivityBoardState {
  const normalized = normalizeActivityBoard(state, now);
  return { ...normalized, daily: { ...normalized.daily, templateId: null } };
}

export function completeWeeklyChallenge(state: ActivityBoardState, now: Date, reflection: string): ActivityCompletion {
  const normalized = normalizeActivityBoard(state, now);
  const template = findTemplate(normalized.weekly.templateId);
  const cleaned = cleanReflection(reflection);
  if (!template || normalized.weekly.completedTemplateIds.includes(template.id)) return { expDelta: 0, state: normalized };
  return { expDelta: template.exp, state: { ...normalized, weekly: { ...normalized.weekly, templateId: null, completedAt: now.toISOString(), completedTemplateIds: [...normalized.weekly.completedTemplateIds, template.id], reflection: cleaned } } };
}

export function cancelWeeklyChallenge(state: ActivityBoardState, now: Date): ActivityBoardState {
  const normalized = normalizeActivityBoard(state, now);
  return { ...normalized, weekly: { ...normalized.weekly, templateId: null } };
}

export function findTemplate(id: string | null): ActivityTemplate | null {
  return [...dailyActivityTemplates, ...milestoneActivityTemplates, ...weeklyChallengeTemplates].find((template) => template.id === id) ?? null;
}

export function getDayKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function getDailyTemplates(relationshipDays: number): readonly ActivityTemplate[] {
  const milestone = milestoneActivityTemplates.filter((template) => template.id === `milestone-${relationshipDays}`);
  return milestone.length ? milestone : dailyActivityTemplates;
}

function isMilestoneDay(relationshipDays: number): boolean {
  return milestoneActivityTemplates.some((template) => template.id === `milestone-${relationshipDays}`);
}

function getWeekKey(date: Date): string {
  const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate() - ((date.getDay() + 6) % 7));
  return getDayKey(monday);
}

function pickOptions(templates: readonly ActivityTemplate[], seed: string, count: number): ActivityTemplate[] {
  const value = [...seed].reduce((total, char) => total + char.charCodeAt(0), 0);
  return templates.slice(value % templates.length).concat(templates.slice(0, value % templates.length)).slice(0, count);
}

function cleanReflection(value: string): string | null {
  const cleaned = value.trim().slice(0, 140);
  return cleaned || null;
}
