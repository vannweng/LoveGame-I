import { gameRules, missionTemplates } from '@/content';
import type { CollectionState } from '@/features/collection/domain';
import type { GameplaySession } from '@/features/missions/data/GameplayRepository';
import type { Mission } from '@/features/missions/domain';
import type { OnboardingState } from '@/features/relationship/domain';

export type DevelopmentScenario =
  | 'safe' | 'birthday-d30' | 'birthday-d5' | 'mission-success' | 'mission-late'
  | 'mission-fail' | 'rank-up' | 'rank-down' | 'gg' | 'collection-unlock';

export const developmentScenarios: { id: DevelopmentScenario; labelKey: string }[] = [
  { id: 'safe', labelKey: 'DEV_SAFE' }, { id: 'birthday-d30', labelKey: 'DEV_BIRTHDAY_D30' },
  { id: 'birthday-d5', labelKey: 'DEV_BIRTHDAY_D5' }, { id: 'mission-success', labelKey: 'DEV_MISSION_SUCCESS' },
  { id: 'mission-late', labelKey: 'DEV_MISSION_LATE' }, { id: 'mission-fail', labelKey: 'DEV_MISSION_FAIL' },
  { id: 'rank-up', labelKey: 'DEV_RANK_UP' }, { id: 'rank-down', labelKey: 'DEV_RANK_DOWN' },
  { id: 'gg', labelKey: 'DEV_GG' }, { id: 'collection-unlock', labelKey: 'DEV_COLLECTION_UNLOCK' },
];

export function createDevelopmentSession(scenario: DevelopmentScenario, now = new Date()): GameplaySession {
  const score = scoreForScenario(scenario);
  return {
    relationship: { id: 'dev-relationship', ownerUserId: 'dev-user', partnerDisplayName: 'P2', timezone: 'Asia/Taipei' },
    mission: createMission(now),
    gameState: { exp: scenario === 'mission-success' ? 60 : 40, combo: comboForScenario(scenario), rankScore: score, status: score >= 1 ? 'safe' : 'danger' },
    collectionState: collectionForScenario(scenario, now),
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
