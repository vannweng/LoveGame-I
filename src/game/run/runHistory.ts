import type { GameState } from '@/features/missions/domain';
import { gameRules } from '@/content';
import type { ActiveRun, RunHistoryState, RunResolutionInput } from './models';

export function createRunHistory(now: Date, rankScore = 0): RunHistoryState {
  return { activeRun: createActiveRun(now, rankScore), completedRuns: [] };
}

export function recordRunResolution(state: RunHistoryState, input: RunResolutionInput): RunHistoryState {
  const activeRun = state.activeRun ?? createActiveRun(input.occurredAt, input.rankScore);
  const nextRun = {
    ...activeRun,
    highestRank: Math.max(activeRun.highestRank, input.rankScore),
    successCount: activeRun.successCount + Number(input.result === 'success'),
    lateCount: activeRun.lateCount + Number(input.result === 'late'),
    failCount: activeRun.failCount + Number(input.result === 'fail'),
  };
  if (input.rankScore !== gameRules.progression.minRank) {
    return { ...state, activeRun: nextRun };
  }

  return {
    activeRun: null,
    completedRuns: [...state.completedRuns, { ...nextRun, endedAt: input.occurredAt.toISOString(), deathCause: input.deathCause }],
  };
}

export function reviveRun(
  state: RunHistoryState,
  currentGameState: GameState,
  oath: string,
  now: Date,
): { gameState: GameState; runHistory: RunHistoryState } {
  const normalizedOath = oath.trim();
  if (gameRules.revival.oathRequired && !normalizedOath) {
    throw new Error('A rebirth oath is required.');
  }
  const completedRuns = state.completedRuns.map((run, index) => index === state.completedRuns.length - 1
    ? { ...run, oath: normalizedOath }
    : run);
  return {
    gameState: {
      ...currentGameState,
      combo: gameRules.revival.comboAfter,
      rankScore: gameRules.revival.rankAfter,
      status: 'danger',
    },
    runHistory: { activeRun: createActiveRun(now, gameRules.revival.rankAfter), completedRuns },
  };
}

function createActiveRun(now: Date, rankScore: number): ActiveRun {
  return { startedAt: now.toISOString(), highestRank: rankScore, successCount: 0, lateCount: 0, failCount: 0 };
}
