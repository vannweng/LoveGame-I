import { applyBonusExperience } from '@/game/progression/applyBonusExperience';
import {
  cancelDailyActivity, cancelWeeklyChallenge, completeDailyActivity, completeWeeklyChallenge,
  createActivityBoardState, normalizeActivityBoard, rerollDailyActivity, rerollWeeklyChallenge,
  selectDailyActivity, selectNextDailyActivity, selectNextWeeklyChallenge, selectWeeklyChallenge,
} from '@/features/activities/domain';
import type { JourneyState } from './models';

export type JourneyActivityAction = 'selectDaily' | 'nextDaily' | 'rerollDaily' | 'cancelDaily' | 'completeDaily'
  | 'selectWeekly' | 'nextWeekly' | 'rerollWeekly' | 'cancelWeekly' | 'completeWeekly';

export function updateJourneyActivity(state: JourneyState, action: JourneyActivityAction, relationshipDays: number, value: string, now: Date): JourneyState {
  const board = normalizeActivityBoard(state.activityBoard ?? createActivityBoardState(now), now);
  if (action === 'completeDaily' || action === 'completeWeekly') {
    const outcome = action === 'completeDaily' ? completeDailyActivity(board, now, value) : completeWeeklyChallenge(board, now, value);
    return { ...state, activityBoard: outcome.state, gameState: applyBonusExperience(state.gameState, outcome.expDelta) };
  }
  const operations = {
    selectDaily: () => selectDailyActivity(board, relationshipDays, value, now),
    nextDaily: () => selectNextDailyActivity(board, relationshipDays, now),
    rerollDaily: () => rerollDailyActivity(board, relationshipDays, now),
    cancelDaily: () => cancelDailyActivity(board, now),
    selectWeekly: () => selectWeeklyChallenge(board, value, now),
    nextWeekly: () => selectNextWeeklyChallenge(board, now),
    rerollWeekly: () => rerollWeeklyChallenge(board, now),
    cancelWeekly: () => cancelWeeklyChallenge(board, now),
  };
  return { ...state, activityBoard: operations[action]() };
}
