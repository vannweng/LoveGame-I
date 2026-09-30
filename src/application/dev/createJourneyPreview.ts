import { createActivityBoardState } from '@/features/activities/domain';
import { getJourneyEvents } from '@/features/journey/domain/journeyEvents';
import { startChapter } from '@/features/journey/domain/journey';
import type { JourneyState } from '@/features/journey/domain/models';
import { withRelationshipProfileDefaults } from '@/features/relationship/domain';
import {
  createConfiguredActivityBoard, createConfiguredOnboarding, createDevelopmentOnboarding, createDevelopmentSession,
  getConfiguredDevelopmentNow, getDevelopmentNow, type DevelopmentScenario, type DevScenarioConfiguration,
} from './developmentScenario';

export function createJourneyPreview(input: DevelopmentScenario | DevScenarioConfiguration) {
  const now = typeof input === 'string' ? getDevelopmentNow(input) ?? new Date() : getConfiguredDevelopmentNow(input.date);
  const profile = withRelationshipProfileDefaults(typeof input === 'string' ? createDevelopmentOnboarding(input, now).profile : createConfiguredOnboarding(input, now).profile);
  const session = createDevelopmentSession(typeof input === 'string' ? input : 'safe', now);
  let state: JourneyState = {
    schemaVersion: 1, chapters: [], gameState: session.gameState, collectionState: session.collectionState,
    runHistory: session.runHistory, activityBoard: typeof input === 'string' ? createActivityBoardState(now) : createConfiguredActivityBoard(input, now),
  };
  const event = getJourneyEvents(profile, now)[0];
  if (event && input !== 'safe') state = startChapter(state, event, event.effort, profile.preferences, now);
  return { state, now, profile };
}
