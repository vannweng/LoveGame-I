import { getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

import type { CollectionRepository } from '@/features/collection/data/CollectionRepository';
import type { CollectionState } from '@/features/collection/domain';
import { firestorePaths } from './firestorePaths';
import { toCollectionState } from './firestoreMappers';

export class FirestoreCollectionRepository implements CollectionRepository {
  async getForUser(userId: string): Promise<CollectionState | null> {
    const snapshot = await getDoc(firestorePaths.collectionState(userId));
    return snapshot.exists() ? toCollectionState(snapshot.data()) : null;
  }

  async saveForUser(userId: string, state: CollectionState): Promise<void> {
    await setDoc(firestorePaths.collectionState(userId), { ...state, updatedAt: serverTimestamp() }, { merge: true });
  }
}
