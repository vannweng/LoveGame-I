import type { DailyGameplayRepository } from '@/features/dailyGameplay/data/DailyGameplayRepository';
import type { DailyGameplayState } from '@/features/dailyGameplay/domain';

export class LocalDailyGameplayRepository implements DailyGameplayRepository {
  private readonly states = new Map<string, DailyGameplayState>();

  async get(userId: string): Promise<DailyGameplayState | null> {
    return this.states.get(userId) ?? null;
  }

  async save(userId: string, state: DailyGameplayState): Promise<void> {
    this.states.set(userId, state);
  }
}
