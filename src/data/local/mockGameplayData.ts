import type { GameState, Mission } from '../../domain/gameplay';
import type { CollectionState } from '../../domain/collection';

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

export const birthdayDaysRemaining = 5;

export const birthdayDinnerMission: Mission = {
  id: 'birthday-dinner-2026',
  title: '安排生日晚餐',
  importance: 'survival',
  successUntil: new Date('2026-08-15T00:00:00+08:00'),
  failAt: new Date('2026-08-20T00:00:00+08:00'),
  rewardExp: 20,
};

export const tutorialMission: Mission = {
  id: 'tutorial-first-reminder',
  title: '設定第一個戀愛提醒',
  importance: 'survival',
  successUntil: new Date('2100-01-01T00:00:00+08:00'),
  failAt: new Date('2100-01-02T00:00:00+08:00'),
  rewardExp: 20,
};
