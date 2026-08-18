import type { MissionResult } from '@/features/missions/domain';

export interface ActiveRun {
  highestRank: number;
  lateCount: number;
  startedAt: string;
  successCount: number;
  failCount: number;
}

export interface CompletedRun extends ActiveRun {
  endedAt: string;
  deathCause: string;
  oath?: string;
}

export interface RunHistoryState {
  activeRun: ActiveRun | null;
  completedRuns: CompletedRun[];
}

export interface RunResolutionInput {
  deathCause: string;
  occurredAt: Date;
  result: MissionResult;
  rankScore: number;
}
