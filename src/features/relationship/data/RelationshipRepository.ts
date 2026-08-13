import type { RelationshipProfile } from '@/features/relationship/domain';

export interface RelationshipRepository {
  getProfile(userId: string): Promise<RelationshipProfile | null>;
  saveProfile(userId: string, profile: RelationshipProfile): Promise<void>;
}
