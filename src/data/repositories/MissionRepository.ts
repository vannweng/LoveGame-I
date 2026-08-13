import type { Mission } from '../../domain/gameplay';

export interface MissionRepository {
  getActiveMission(): Mission;
}
