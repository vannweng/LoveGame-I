import { getFunctions, httpsCallable } from 'firebase/functions';

import type {
  ImportantDateMissionTemplateId,
  MissionGenerationResult,
  MissionGenerationService,
} from '@/features/missions/application/MissionGenerationService';
import { firebaseApp } from '@/infrastructure/auth/firebaseClient';

const functions = getFunctions(firebaseApp);

export class CallableMissionGenerationService implements MissionGenerationService {
  async create(templateId: ImportantDateMissionTemplateId, sourceImportantDateId = 'birthday'): Promise<MissionGenerationResult> {
    const callable = httpsCallable<{ sourceImportantDateId: string; templateId: string }, MissionGenerationResult>(functions, 'createMission');
    const response = await callable({ sourceImportantDateId, templateId });
    return response.data;
  }
}
