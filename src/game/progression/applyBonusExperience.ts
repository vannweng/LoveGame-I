import type { GameState } from '@/features/missions/domain';

/** Applies rewards that are explicitly outside the important-day Combo and Rank loop. */
export function applyBonusExperience(state: GameState, expDelta: number): GameState {
  return { ...state, exp: state.exp + Math.max(0, expDelta) };
}
