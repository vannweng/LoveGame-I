import type { Mission } from '@/features/missions/domain';
import type { MissionRepository } from '@/features/missions/data/MissionRepository';
import { secureStorage } from './secureStorage';

export class LocalMissionRepository implements MissionRepository {
  async getActiveMissions(userId: string): Promise<Mission[]> {
    const value = await secureStorage.getItem(missionsKey(userId));
    return value ? (JSON.parse(value) as StoredMission[]).map(reviveMission) : [];
  }

  async getById(userId: string, missionId: string): Promise<Mission | null> {
    const missions = await this.getActiveMissions(userId);
    return missions.find((mission) => mission.id === missionId) ?? null;
  }

}

type StoredMission = Omit<Mission, 'failAt' | 'successUntil'> & { failAt: string; successUntil: string };

function reviveMission(mission: StoredMission): Mission {
  return { ...mission, successUntil: new Date(mission.successUntil), failAt: new Date(mission.failAt) };
}

function missionsKey(userId: string): string {
  return `lovegame:missions:${userId}`;
}
