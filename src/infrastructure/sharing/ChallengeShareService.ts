export interface ChallengeShareService {
  shareChallenge(input: { title: string; description: string }): Promise<void>;
}
