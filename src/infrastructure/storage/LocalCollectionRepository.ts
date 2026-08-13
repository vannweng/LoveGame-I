import type { CollectionRepository } from '@/features/collection/data/CollectionRepository';
import type { CollectionState } from '@/features/collection/domain';
import { secureStorage } from './secureStorage';

export class LocalCollectionRepository implements CollectionRepository {
  async getForUser(userId: string): Promise<CollectionState | null> {
    const value = await secureStorage.getItem(storageKey(userId));
    return value ? reviveCollectionState(JSON.parse(value) as StoredCollectionState) : null;
  }

  async saveForUser(userId: string, state: CollectionState): Promise<void> {
    await secureStorage.setItem(storageKey(userId), JSON.stringify(state));
  }
}

type StoredCollectionState = Omit<CollectionState, 'graves' | 'items'> & {
  graves: (Omit<CollectionState['graves'][number], 'createdAt'> & { createdAt: string })[];
  items: (Omit<CollectionState['items'][number], 'unlockedAt'> & { unlockedAt: string })[];
};

function reviveCollectionState(state: StoredCollectionState): CollectionState {
  return {
    items: state.items.map((item) => ({ ...item, unlockedAt: new Date(item.unlockedAt) })),
    graves: state.graves.map((grave) => ({ ...grave, createdAt: new Date(grave.createdAt) })),
  };
}

function storageKey(userId: string): string {
  return `lovegame:collection:${userId}`;
}
