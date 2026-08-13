import type { RelationshipRepository } from '@/features/relationship/data/RelationshipRepository';
import type { RelationshipProfile } from '@/features/relationship/domain';
import { secureStorage } from './secureStorage';

export class LocalRelationshipRepository implements RelationshipRepository {
  async getProfile(userId: string): Promise<RelationshipProfile | null> {
    const value = await secureStorage.getItem(storageKey(userId));
    return value ? JSON.parse(value) as RelationshipProfile : null;
  }

  async saveProfile(userId: string, profile: RelationshipProfile): Promise<void> {
    await secureStorage.setItem(storageKey(userId), JSON.stringify(profile));
  }
}

function storageKey(userId: string): string {
  return `lovegame:relationship:${userId}`;
}
