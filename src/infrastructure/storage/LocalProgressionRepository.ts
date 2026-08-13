import type { ProgressionRepository } from '@/features/missions/data/ProgressionRepository';
import type { GameState } from '@/features/missions/domain';
import { secureStorage } from './secureStorage';

export class LocalProgressionRepository implements ProgressionRepository {
  async getForUser(userId: string): Promise<GameState | null> {
    const value = await secureStorage.getItem(storageKey(userId));
    return value ? JSON.parse(value) as GameState : null;
  }

  async saveForUser(userId: string, state: GameState): Promise<void> {
    await secureStorage.setItem(storageKey(userId), JSON.stringify(state));
  }
}

function storageKey(userId: string): string {
  return `lovegame:progression:${userId}`;
}
