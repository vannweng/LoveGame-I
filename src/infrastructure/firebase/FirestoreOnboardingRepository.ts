import { getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

import type { OnboardingRepository } from '@/features/relationship/data/OnboardingRepository';
import type { OnboardingState } from '@/features/relationship/domain';
import { firestorePaths } from './firestorePaths';
import { toOnboardingState } from './firestoreMappers';

export class FirestoreOnboardingRepository implements OnboardingRepository {
  async getForUser(userId: string): Promise<OnboardingState> {
    const snapshot = await getDoc(firestorePaths.onboarding(userId));
    return snapshot.exists() ? toOnboardingState(snapshot.data()) : createInitialState();
  }

  async saveForUser(userId: string, state: OnboardingState): Promise<void> {
    await setDoc(firestorePaths.onboarding(userId), { ...state, updatedAt: serverTimestamp() }, { merge: true });
  }
}

function createInitialState(): OnboardingState {
  return { status: 'intro', profile: null, tutorialReward: null };
}
