import type { JourneyRepository } from '@/features/journey/data/JourneyRepository';
import type { JourneyState } from '@/features/journey/domain/models';
import { secureStorage } from './secureStorage';
import { deserializeJourney } from '@/features/journey/data/serializeJourney';

export class LocalJourneyRepository implements JourneyRepository {
  async load(userId: string): Promise<JourneyState | null> {
    const value = await secureStorage.getItem(`lovegame:journey:${userId}`);
    if (!value) return null;
    return deserializeJourney(value);
  }

  async save(userId: string, state: JourneyState): Promise<void> {
    await secureStorage.setItem(`lovegame:journey:${userId}`, JSON.stringify(state));
  }
}
