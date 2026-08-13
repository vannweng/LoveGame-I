import { collection, doc } from 'firebase/firestore';

import { firebaseFirestore } from '@/infrastructure/auth/firebaseClient';

const defaultSaveId = 'default';

function saveDocument(userId: string) {
  return doc(firebaseFirestore, 'users', userId, 'saves', defaultSaveId);
}

export const firestorePaths = {
  collectionState: (userId: string) => doc(saveDocument(userId), 'state', 'collection'),
  mission: (userId: string, missionId: string) => doc(saveDocument(userId), 'missions', missionId),
  missions: (userId: string) => collection(saveDocument(userId), 'missions'),
  onboarding: (userId: string) => doc(saveDocument(userId), 'onboarding', 'state'),
  profile: (userId: string) => doc(saveDocument(userId), 'profile', 'current'),
  progression: (userId: string) => doc(saveDocument(userId), 'state', 'progression'),
  resolution: (userId: string, missionId: string) => doc(saveDocument(userId), 'resolutions', missionId),
  save: saveDocument,
};
