import { getFunctions, httpsCallable } from 'firebase/functions';

import type {
  MissionGenerationResult,
  MissionGenerationService,
} from '@/features/missions/application/MissionGenerationService';
import { firebaseApp } from '@/infrastructure/auth/firebaseClient';

const functions = getFunctions(firebaseApp);

export class CallableMissionGenerationService implements MissionGenerationService {
  async create(templateId: 'birthday-dinner'): Promise<MissionGenerationResult> {
    const callable = httpsCallable<{ templateId: string }, MissionGenerationResult>(functions, 'createMission');
    const response = await callable({ templateId });
    return response.data;
  }
}
