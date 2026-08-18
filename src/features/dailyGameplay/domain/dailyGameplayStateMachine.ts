import type { DailyGameplayEvent, DailyGameplayState } from './models';

export function createDailyGameplayState(hasCrisis: boolean, nextHookId: string, safeActionId: string): DailyGameplayState {
  return { mode: hasCrisis ? 'crisis' : 'safe', stage: hasCrisis ? 'offered' : 'safe', nextHookId, safeActionId };
}

export function transitionDailyGameplay(state: DailyGameplayState, event: DailyGameplayEvent): DailyGameplayState {
  if (event === 'accept' && state.stage === 'offered') return { ...state, stage: 'accepted' };
  if (event === 'beginAction' && state.stage === 'accepted') return { ...state, stage: 'action' };
  if (event === 'openReport' && state.stage === 'action') return { ...state, stage: 'reporting' };
  if (event === 'resolve' && state.stage === 'reporting') return { ...state, stage: 'resolved' };
  if (event === 'completeSafeAction' && state.stage === 'safe') return { ...state, stage: 'nextHook' };
  if (event === 'showNextHook' && state.stage === 'resolved') return { ...state, stage: 'nextHook' };
  if (event === 'returnHome' && state.stage === 'nextHook') return { ...state, mode: 'safe', stage: 'safe' };
  return state;
}
