import { getDoc, getDocs, setDoc, serverTimestamp } from 'firebase/firestore';

import type { MissionRepository, MissionResolutionRecord } from '@/features/missions/data/MissionRepository';
import type { Mission } from '@/features/missions/domain';
import { firestorePaths } from './firestorePaths';
import { toMission } from './firestoreMappers';

export class FirestoreMissionRepository implements MissionRepository {
  async create(userId: string, mission: Mission): Promise<void> {
    await setDoc(firestorePaths.mission(userId, mission.id), { ...mission, createdAt: serverTimestamp() }, { merge: false });
  }

  async getActiveMissions(userId: string): Promise<Mission[]> {
    const snapshot = await getDocs(firestorePaths.missions(userId));
    return snapshot.docs.map((document) => toMission(document.data()));
  }

  async getById(userId: string, missionId: string): Promise<Mission | null> {
    const snapshot = await getDoc(firestorePaths.mission(userId, missionId));
    return snapshot.exists() ? toMission(snapshot.data()) : null;
  }

  async saveResolution(userId: string, resolution: MissionResolutionRecord): Promise<void> {
    await setDoc(firestorePaths.resolution(userId, resolution.missionId), { ...resolution, updatedAt: serverTimestamp() }, { merge: true });
  }
}
