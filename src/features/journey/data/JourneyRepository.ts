import type { JourneyState } from '../domain/models';

export interface JourneyRepository {
  load(userId: string): Promise<JourneyState | null>;
  save(userId: string, state: JourneyState): Promise<void>;
}
