import { gameRules, missionTemplates } from '@/content';
import type { CollectionState } from '@/features/collection/domain';
import { createDailyGameplayState, transitionDailyGameplay, type DailyGameplayState } from '@/features/dailyGameplay/domain';
import type { GameplaySession } from '@/features/missions/data/GameplayRepository';
import type { Mission } from '@/features/missions/domain';
import type { OnboardingState } from '@/features/relationship/domain';
import { createActivityBoardState, type ActivityBoardState } from '@/features/activities/domain';
import { dailyActivityTemplates, weeklyChallengeTemplates } from '@/content/dailyActivities';
import { createRunHistory, recordRunResolution } from '@/game/run';

export type DevDatePreset = 'weekday' | 'saturday' | 'sunday' | 'day100';
export type DevImportantPreset = 'none' | 'birthday-d30' | 'birthday-d5' | 'birthday-d1';
export type DevCardProgress = 'initial' | 'done1' | 'done2' | 'done3';
export interface DevScenarioConfiguration { date: DevDatePreset; important: DevImportantPreset; daily: DevCardProgress; weekly: DevCardProgress; }
export const defaultDevScenarioConfiguration: DevScenarioConfiguration = { date: 'weekday', important: 'none', daily: 'initial', weekly: 'initial' };

export type DevelopmentScenario =
  | 'safe' | 'birthday-d30' | 'birthday-d5' | 'mission-success' | 'mission-late'
  | 'mission-fail' | 'rank-up' | 'rank-down' | 'gg' | 'collection-unlock'
  | 'mission-accepted' | 'mission-reporting' | 'free-action' | 'next-hook' | 'weekday' | 'weekend';

export const developmentScenarios: { id: DevelopmentScenario; labelKey: string }[] = [
  { id: 'safe', labelKey: 'DEV_SAFE' }, { id: 'birthday-d30', labelKey: 'DEV_BIRTHDAY_D30' },
  { id: 'birthday-d5', labelKey: 'DEV_BIRTHDAY_D5' }, { id: 'mission-success', labelKey: 'DEV_MISSION_SUCCESS' },
  { id: 'mission-late', labelKey: 'DEV_MISSION_LATE' }, { id: 'mission-fail', labelKey: 'DEV_MISSION_FAIL' },
  { id: 'rank-up', labelKey: 'DEV_RANK_UP' }, { id: 'rank-down', labelKey: 'DEV_RANK_DOWN' },
  { id: 'gg', labelKey: 'DEV_GG' }, { id: 'collection-unlock', labelKey: 'DEV_COLLECTION_UNLOCK' },
  { id: 'mission-accepted', labelKey: 'DEV_MISSION_ACCEPTED' }, { id: 'mission-reporting', labelKey: 'DEV_MISSION_REPORTING' },
  { id: 'free-action', labelKey: 'DEV_FREE_ACTION' }, { id: 'next-hook', labelKey: 'DEV_NEXT_HOOK' },
  { id: 'weekday', labelKey: 'DEV_WEEKDAY' }, { id: 'weekend', labelKey: 'DEV_WEEKEND' },
];

export function getDevelopmentNow(scenario: DevelopmentScenario): Date | null {
  if (scenario === 'weekday') return new Date('2026-08-17T12:00:00+08:00');
  if (scenario === 'weekend') return new Date('2026-08-15T12:00:00+08:00');
  return null;
}

export function getConfiguredDevelopmentNow(preset: DevDatePreset): Date {
  if (preset === 'saturday') return new Date('2026-08-15T12:00:00+08:00');
  if (preset === 'sunday') return new Date('2026-08-16T12:00:00+08:00');
  if (preset === 'day100') return new Date('2026-08-17T12:00:00+08:00');
  return new Date('2026-08-17T12:00:00+08:00');
}

export function createConfiguredOnboarding(config: DevScenarioConfiguration, now: Date): OnboardingState {
  const offset = config.important === 'birthday-d30' ? 30 : config.important === 'birthday-d5' ? 5 : config.important === 'birthday-d1' ? 1 : 90;
  const relationshipStartDate = config.date === 'day100' ? localDateAtOffset(now, -99) : localDateAtOffset(now, -365);
  return { status: 'completed', tutorialReward: null, profile: { partnerNickname: 'P2', relationshipStartDate, birthday: localDateAtOffset(now, offset), customImportantDates: [] } };
}

export function createConfiguredDailyGameplay(config: DevScenarioConfiguration): DailyGameplayState {
  return createDailyGameplayState(config.important !== 'none', 'combo-five', 'check-in');
}

export function createConfiguredActivityBoard(config: DevScenarioConfiguration, now: Date): ActivityBoardState {
  const state = createActivityBoardState(now);
  const dailyIds = dailyActivityTemplates.slice(0, 3).map((template) => template.id);
  const weeklyIds = weeklyChallengeTemplates.slice(0, 3).map((template) => template.id);
  return {
    ...state,
    daily: { ...state.daily, deckTemplateIds: dailyIds, completedTemplateIds: completedIds(dailyIds, config.daily) },
    weekly: { ...state.weekly, deckTemplateIds: weeklyIds, completedTemplateIds: completedIds(weeklyIds, config.weekly) },
  };
}

function completedIds(ids: string[], progress: DevCardProgress): string[] {
  return ids.slice(0, progress === 'done3' ? 3 : progress === 'done2' ? 2 : progress === 'done1' ? 1 : 0);
}

export function createDevelopmentDailyGameplay(scenario: DevelopmentScenario): DailyGameplayState {
  let state = createDailyGameplayState(!['safe', 'free-action', 'weekday', 'weekend'].includes(scenario), 'combo-five', 'check-in');
  if (scenario === 'mission-accepted') state = transitionDailyGameplay(state, 'accept');
  if (scenario === 'mission-reporting') {
    state = transitionDailyGameplay(state, 'accept');
    state = transitionDailyGameplay(state, 'beginAction');
    state = transitionDailyGameplay(state, 'openReport');
  }
  if (scenario === 'next-hook') state = transitionDailyGameplay(createDailyGameplayState(false, 'combo-five', 'check-in'), 'completeSafeAction');
  return state;
}

export function createDevelopmentSession(scenario: DevelopmentScenario, now = new Date()): GameplaySession {
  const score = scoreForScenario(scenario);
  const mission = createMission(now);
  const runHistory = score === -10
    ? recordRunResolution(createRunHistory(now, -9), { deathCause: mission.template.titleKey, occurredAt: now, result: 'fail', rankScore: -10 })
    : createRunHistory(now, score);
  return {
    relationship: { id: 'dev-relationship', ownerUserId: 'dev-user', partnerDisplayName: 'P2', timezone: 'Asia/Taipei' },
    mission,
    gameState: { exp: scenario === 'mission-success' ? 60 : 40, combo: comboForScenario(scenario), rankScore: score, status: score === -10 ? 'gg' : score >= 1 ? 'safe' : 'danger' },
    collectionState: collectionForScenario(scenario, now),
    runHistory,
  };
}

export function createDevelopmentOnboarding(scenario: DevelopmentScenario, now = new Date()): OnboardingState {
  const birthdayOffset = scenario === 'birthday-d30' ? 30 : scenario === 'birthday-d5' ? 5 : 90;
  return {
    status: 'completed', tutorialReward: null,
    profile: { partnerNickname: 'P2', relationshipStartDate: localDateAtOffset(now, -365), birthday: localDateAtOffset(now, birthdayOffset), customImportantDates: [] },
  };
}

function createMission(now: Date): Mission {
  return { id: 'dev-birthday-dinner', importance: 'survival', successUntil: atOffset(now, 5), failAt: atOffset(now, 10), template: missionTemplates['birthday-dinner'] };
}

function scoreForScenario(scenario: DevelopmentScenario): number {
  if (scenario === 'rank-up') return 5;
  if (scenario === 'rank-down') return -5;
  if (scenario === 'gg') return -10;
  if (scenario === 'mission-success') return 1;
  if (scenario === 'mission-fail') return -1;
  return 0;
}

function comboForScenario(scenario: DevelopmentScenario): number {
  return scenario === 'collection-unlock' ? 5 : scenario === 'mission-success' ? 4 : scenario === 'mission-fail' ? 0 : 3;
}

function collectionForScenario(scenario: DevelopmentScenario, now: Date): CollectionState {
  if (scenario === 'collection-unlock') {
    const rule = gameRules.collectionUnlocks[1];
    return { items: [{ id: rule.id, type: rule.type, name: rule.name, unlockedAt: now }], graves: [] };
  }
  if (scenario === 'gg') {
    const rule = gameRules.collectionUnlocks[2];
    return { items: [{ id: rule.id, type: rule.type, name: rule.name, unlockedAt: now }], graves: [{ id: rule.id, createdAt: now, reason: 'rank_reached_negative_ten', rankScore: -10 }] };
  }
  return { items: [], graves: [] };
}

function atOffset(date: Date, offset: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + offset);
  return next;
}

function localDateAtOffset(date: Date, offset: number): string {
  const next = atOffset(date, offset);
  return `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}-${String(next.getDate()).padStart(2, '0')}`;
}
