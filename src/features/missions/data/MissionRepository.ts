import type { Mission } from '@/features/missions/domain';

export interface MissionRepository {
  getActiveMissions(userId: string): Promise<Mission[]>;
  getById(userId: string, missionId: string): Promise<Mission | null>;
}
