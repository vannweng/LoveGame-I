import type { Mission } from '../../domain/gameplay';
import type { MissionRepository } from '../repositories/MissionRepository';

export class LocalMissionRepository implements MissionRepository {
  constructor(
    readonly userId: string,
    private readonly mission: Mission,
  ) {}

  getActiveMission(): Mission {
    return this.mission;
  }
}
