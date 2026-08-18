import type { ActivityBoardState } from '@/features/activities/domain';

export interface ActivityBoardRepository {
  get(userId: string): Promise<ActivityBoardState | null>;
  save(userId: string, state: ActivityBoardState): Promise<void>;
}
