import type { Mission, RewardResult } from '@/features/missions/domain';
import type { MissionRepository, MissionResolutionRecord } from '@/features/missions/data/MissionRepository';
import { secureStorage } from './secureStorage';

export class LocalMissionRepository implements MissionRepository {
  async create(userId: string, mission: Mission): Promise<void> {
    const missions = await this.getActiveMissions(userId);
    await secureStorage.setItem(missionsKey(userId), JSON.stringify([...missions.filter((item) => item.id !== mission.id), mission]));
  }

  async getActiveMissions(userId: string): Promise<Mission[]> {
    const value = await secureStorage.getItem(missionsKey(userId));
    return value ? (JSON.parse(value) as StoredMission[]).map(reviveMission) : [];
  }

  async getById(userId: string, missionId: string): Promise<Mission | null> {
    const missions = await this.getActiveMissions(userId);
    return missions.find((mission) => mission.id === missionId) ?? null;
  }

  async saveResolution(userId: string, resolution: MissionResolutionRecord): Promise<void> {
    const value = await secureStorage.getItem(resolutionsKey(userId));
    const existing = value ? JSON.parse(value) as StoredResolution[] : [];
    const next = [...existing.filter((item) => item.missionId !== resolution.missionId), resolution];
    await secureStorage.setItem(resolutionsKey(userId), JSON.stringify(next));
  }
}

type StoredMission = Omit<Mission, 'failAt' | 'successUntil'> & { failAt: string; successUntil: string };
type StoredResolution = Omit<MissionResolutionRecord, 'resolvedAt' | 'reward'> & { resolvedAt: string; reward: RewardResult };

function reviveMission(mission: StoredMission): Mission {
  return { ...mission, successUntil: new Date(mission.successUntil), failAt: new Date(mission.failAt) };
}

function missionsKey(userId: string): string {
  return `lovegame:missions:${userId}`;
}

function resolutionsKey(userId: string): string {
  return `lovegame:mission-resolutions:${userId}`;
}
