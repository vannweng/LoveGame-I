import { getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

import type { ProgressionRepository } from '@/features/missions/data/ProgressionRepository';
import type { GameState } from '@/features/missions/domain';
import { firestorePaths } from './firestorePaths';

export class FirestoreProgressionRepository implements ProgressionRepository {
  async getForUser(userId: string): Promise<GameState | null> {
    const snapshot = await getDoc(firestorePaths.progression(userId));
    return snapshot.exists() ? snapshot.data() as GameState : null;
  }

  async saveForUser(userId: string, state: GameState): Promise<void> {
    await setDoc(firestorePaths.progression(userId), { ...state, updatedAt: serverTimestamp() }, { merge: true });
  }
}
