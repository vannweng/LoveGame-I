import { dailyGameplayConfig } from '@/content';
import type { DailyGameplayRepository } from '@/features/dailyGameplay/data/DailyGameplayRepository';
import { createDailyGameplayState, transitionDailyGameplay, type DailyGameplayEvent, type DailyGameplayState } from '@/features/dailyGameplay/domain';

export class DailyGameplayService {
  constructor(private readonly repository: DailyGameplayRepository) {}

  async load(userId: string, hasCrisis: boolean): Promise<DailyGameplayState> {
    const existing = await this.repository.get(userId);
    if (existing) return existing;
    const initial = createDailyGameplayState(hasCrisis, dailyGameplayConfig.nextHooks[0].id, dailyGameplayConfig.safeAction.id);
    await this.repository.save(userId, initial);
    return initial;
  }

  async dispatch(userId: string, state: DailyGameplayState, event: DailyGameplayEvent): Promise<DailyGameplayState> {
    const next = transitionDailyGameplay(state, event);
    await this.repository.save(userId, next);
    return next;
  }
}
