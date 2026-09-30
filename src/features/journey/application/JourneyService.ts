import type { JourneyRepository } from '../data/JourneyRepository';
import type { JourneyState } from '../domain/models';

/** Serialize read-modify-write operations so rapid taps cannot award a mission twice. */
export class JourneyService {
  private queue: Promise<unknown> = Promise.resolve();
  constructor(private readonly repository: JourneyRepository, private readonly userId: string) {}

  async load(initial: JourneyState): Promise<JourneyState> {
    const stored = await this.repository.load(this.userId);
    if (stored) return stored;
    await this.repository.save(this.userId, initial);
    return initial;
  }

  update(change: (state: JourneyState) => JourneyState): Promise<JourneyState> {
    const operation = this.queue.then(async () => {
      const state = await this.repository.load(this.userId);
      if (!state) throw new Error('尚未讀取旅程，請重新開啟頁面。');
      const next = change(state);
      await this.repository.save(this.userId, next);
      return next;
    });
    this.queue = operation.catch(() => undefined);
    return operation;
  }
}
