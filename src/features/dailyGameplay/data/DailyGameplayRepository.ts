import type { DailyGameplayState } from '@/features/dailyGameplay/domain';

export interface DailyGameplayRepository {
  get(userId: string): Promise<DailyGameplayState | null>;
  save(userId: string, state: DailyGameplayState): Promise<void>;
}
