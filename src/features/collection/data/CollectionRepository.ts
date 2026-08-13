import type { CollectionState } from '@/features/collection/domain';

export interface CollectionRepository {
  getForUser(userId: string): Promise<CollectionState | null>;
  saveForUser(userId: string, state: CollectionState): Promise<void>;
}
