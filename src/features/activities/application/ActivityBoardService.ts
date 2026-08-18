import type { ActivityBoardRepository } from '@/features/activities/data/ActivityBoardRepository';
import {
  completeDailyActivity,
  completeWeeklyChallenge,
  cancelDailyActivity,
  cancelWeeklyChallenge,
  createActivityBoardState,
  drawDailyActivity,
  normalizeActivityBoard,
  openWeeklyChallenge,
  rerollDailyActivity,
  rerollWeeklyChallenge,
  selectDailyActivity,
  selectWeeklyChallenge,
  selectNextDailyActivity,
  selectNextWeeklyChallenge,
  type ActivityBoardState,
  type ActivityCompletion,
} from '@/features/activities/domain';

export class ActivityBoardService {
  constructor(private readonly repository: ActivityBoardRepository) {}

  async load(userId: string, now = new Date()): Promise<ActivityBoardState> {
    const state = normalizeActivityBoard(await this.repository.get(userId) ?? createActivityBoardState(now), now);
    await this.repository.save(userId, state);
    return state;
  }

  async resetToday(userId: string, now = new Date()): Promise<ActivityBoardState> {
    const fresh = createActivityBoardState(now);
    await this.repository.save(userId, fresh);
    return fresh;
  }

  async replace(userId: string, state: ActivityBoardState): Promise<ActivityBoardState> {
    await this.repository.save(userId, state);
    return state;
  }

  async drawDaily(userId: string, state: ActivityBoardState, relationshipDays: number, now = new Date()): Promise<ActivityBoardState> {
    return this.save(userId, drawDailyActivity(state, relationshipDays, now));
  }

  async selectDaily(userId: string, state: ActivityBoardState, relationshipDays: number, templateId: string, now = new Date()): Promise<ActivityBoardState> {
    return this.save(userId, selectDailyActivity(state, relationshipDays, templateId, now));
  }

  async selectNextDaily(userId: string, state: ActivityBoardState, relationshipDays: number, now = new Date()): Promise<ActivityBoardState> {
    return this.save(userId, selectNextDailyActivity(state, relationshipDays, now));
  }

  async rerollDaily(userId: string, state: ActivityBoardState, relationshipDays: number, now = new Date()): Promise<ActivityBoardState> {
    return this.save(userId, rerollDailyActivity(state, relationshipDays, now));
  }

  async openWeekly(userId: string, state: ActivityBoardState, now = new Date()): Promise<ActivityBoardState> {
    return this.save(userId, openWeeklyChallenge(state, now));
  }

  async selectWeekly(userId: string, state: ActivityBoardState, templateId: string, now = new Date()): Promise<ActivityBoardState> {
    return this.save(userId, selectWeeklyChallenge(state, templateId, now));
  }

  async selectNextWeekly(userId: string, state: ActivityBoardState, now = new Date()): Promise<ActivityBoardState> {
    return this.save(userId, selectNextWeeklyChallenge(state, now));
  }

  async rerollWeekly(userId: string, state: ActivityBoardState, now = new Date()): Promise<ActivityBoardState> {
    return this.save(userId, rerollWeeklyChallenge(state, now));
  }

  async completeDaily(userId: string, state: ActivityBoardState, reflection: string, now = new Date()): Promise<ActivityCompletion> {
    return this.complete(userId, completeDailyActivity(state, now, reflection));
  }

  async cancelDaily(userId: string, state: ActivityBoardState, now = new Date()): Promise<ActivityBoardState> {
    return this.save(userId, cancelDailyActivity(state, now));
  }

  async completeWeekly(userId: string, state: ActivityBoardState, reflection: string, now = new Date()): Promise<ActivityCompletion> {
    return this.complete(userId, completeWeeklyChallenge(state, now, reflection));
  }

  async cancelWeekly(userId: string, state: ActivityBoardState, now = new Date()): Promise<ActivityBoardState> {
    return this.save(userId, cancelWeeklyChallenge(state, now));
  }

  private async save(userId: string, state: ActivityBoardState): Promise<ActivityBoardState> {
    await this.repository.save(userId, state);
    return state;
  }

  private async complete(userId: string, completion: ActivityCompletion): Promise<ActivityCompletion> {
    await this.repository.save(userId, completion.state);
    return completion;
  }
}
