import { Share } from 'react-native';

import type { ChallengeShareService } from './ChallengeShareService';

export class ReactNativeChallengeShareService implements ChallengeShareService {
  async shareChallenge(input: { title: string; description: string }): Promise<void> {
    await Share.share({ message: `【${input.title}】\n${input.description}\n一起完成這個挑戰吧！`, title: input.title });
  }
}
