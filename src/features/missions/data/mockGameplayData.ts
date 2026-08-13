import type { GameState, Mission } from '@/features/missions/domain';
import type { CollectionState } from '@/features/collection/domain';
import { missionTemplates } from '@/content/missionTemplates';

export const initialGameState: GameState = {
  exp: 40,
  combo: 3,
  rankScore: 0,
  status: 'danger',
};

export const initialCollectionState: CollectionState = {
  items: [],
  graves: [],
};

export const birthdayDinnerMission: Mission = {
  id: 'birthday-dinner-2026',
  importance: 'survival',
  successUntil: new Date('2026-08-15T00:00:00+08:00'),
  failAt: new Date('2026-08-20T00:00:00+08:00'),
  template: missionTemplates['birthday-dinner'],
};

export const tutorialMission: Mission = {
  id: 'tutorial-first-reminder',
  importance: 'survival',
  successUntil: new Date('2100-01-01T00:00:00+08:00'),
  failAt: new Date('2100-01-02T00:00:00+08:00'),
  template: missionTemplates['tutorial-first-reminder'],
};
