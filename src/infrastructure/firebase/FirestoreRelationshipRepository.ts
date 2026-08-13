import { getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

import type { RelationshipRepository } from '@/features/relationship/data/RelationshipRepository';
import type { RelationshipProfile } from '@/features/relationship/domain';
import { firestorePaths } from './firestorePaths';
import { toRelationshipProfile } from './firestoreMappers';

export class FirestoreRelationshipRepository implements RelationshipRepository {
  async getProfile(userId: string): Promise<RelationshipProfile | null> {
    const snapshot = await getDoc(firestorePaths.profile(userId));
    return snapshot.exists() ? toRelationshipProfile(snapshot.data()) : null;
  }

  async saveProfile(userId: string, profile: RelationshipProfile): Promise<void> {
    await setDoc(firestorePaths.profile(userId), { ...profile, updatedAt: serverTimestamp() }, { merge: true });
  }
}
