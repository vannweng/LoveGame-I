import type { ActivityBoardRepository } from '@/features/activities/data/ActivityBoardRepository';
import type { ActivityBoardState } from '@/features/activities/domain';
import { secureStorage } from './secureStorage';

export class LocalActivityBoardRepository implements ActivityBoardRepository {
  async get(userId: string): Promise<ActivityBoardState | null> {
    const value = await secureStorage.getItem(storageKey(userId));
    return value ? JSON.parse(value) as ActivityBoardState : null;
  }

  async save(userId: string, state: ActivityBoardState): Promise<void> {
    await secureStorage.setItem(storageKey(userId), JSON.stringify(state));
  }
}

function storageKey(userId: string): string {
  return `lovegame:activity-board:${userId}`;
}
