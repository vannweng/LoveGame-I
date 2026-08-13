export type MissionResult = 'success' | 'late' | 'fail';

export type MissionImportance = 'survival' | 'normal';

export type RankIdentity =
  | '英雄守護者'
  | '生還者'
  | '探索者'
  | '普通人'
  | '偷懶鬼'
  | '勇者'
  | 'GG';

export interface Mission {
  id: string;
  title: string;
  importance: MissionImportance;
  successUntil: Date;
  failAt: Date;
  rewardExp: number;
}

export interface GameState {
  exp: number;
  combo: number;
  rankScore: number;
  status: 'danger' | 'safe';
}

export interface RewardResult {
  expDelta: number;
  comboDelta: number;
  rankDelta: number;
}
