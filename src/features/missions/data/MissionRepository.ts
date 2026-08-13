import type { Mission, MissionResult, RewardResult } from '@/features/missions/domain';

export interface MissionResolutionRecord {
  missionId: string;
  resolvedAt: Date;
  result: MissionResult;
  reward: RewardResult;
}

export interface MissionRepository {
  create(userId: string, mission: Mission): Promise<void>;
  getActiveMissions(userId: string): Promise<Mission[]>;
  getById(userId: string, missionId: string): Promise<Mission | null>;
  saveResolution(userId: string, resolution: MissionResolutionRecord): Promise<void>;
}
