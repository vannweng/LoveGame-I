import { getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

import type { SaveRepository } from '@/features/relationship/data/SaveRepository';
import { firestorePaths } from './firestorePaths';

export class FirestoreSaveRepository implements SaveRepository {
  async ensureDefaultSave(userId: string, timezone: string): Promise<void> {
    const reference = firestorePaths.save(userId);
    const snapshot = await getDoc(reference);
    if (snapshot.exists()) return;

    await setDoc(reference, {
      ownerUserId: userId,
      schemaVersion: 1,
      timezone,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
}
