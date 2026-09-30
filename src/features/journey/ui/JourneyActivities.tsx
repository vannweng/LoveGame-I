import { useMemo, useState } from 'react';
import { Text } from 'react-native';
import { createActivityBoardState, normalizeActivityBoard } from '@/features/activities/domain';
import { ReactNativeChallengeShareService } from '@/infrastructure/sharing';
import { MissionBoardView } from '@/features/actions/ui/ActionsView';
import { tutorialMission } from '@/features/missions/data/mockGameplayData';
import { colors } from '@/shared/theme/tokens';
import type { JourneyState } from '../domain/models';
import { updateJourneyActivity, type JourneyActivityAction } from '../domain/journeyActivities';

export function JourneyActivities({ state, now, relationshipDays, mutate, actionTime, embedded = false }: {
  state: JourneyState; now: Date; relationshipDays: number; actionTime: () => Date; embedded?: boolean; mutate: (change: (state: JourneyState) => JourneyState) => Promise<boolean>;
}) {
  const sharing = useMemo(() => new ReactNativeChallengeShareService(), []);
  const [error, setError] = useState('');
  const board = normalizeActivityBoard(state.activityBoard ?? createActivityBoardState(now), now);
  const act = (action: JourneyActivityAction, value = '') => { void mutate((current) => updateJourneyActivity(current, action, relationshipDays, value, actionTime())); };
  return <>{error ? <Text style={{ color: colors.danger }}>{error}</Text> : null}<MissionBoardView board={board} embedded={embedded} mission={tutorialMission} showMainMission={false} now={now} relationshipDays={relationshipDays} onOpenMainMission={() => undefined}
    onRerollDaily={() => act('rerollDaily')} onSelectDaily={(id) => act('selectDaily', id)}
    onContinueDaily={() => act('nextDaily')} onCompleteDaily={(text) => act('completeDaily', text)}
    onCancelDaily={() => act('cancelDaily')} onSelectWeekly={(id) => act('selectWeekly', id)}
    onContinueWeekly={() => act('nextWeekly')} onRerollWeekly={() => act('rerollWeekly')}
    onCompleteWeekly={(text) => act('completeWeekly', text)} onCancelWeekly={() => act('cancelWeekly')}
    onShareWeekly={(template) => { void sharing.shareChallenge({ title: template.title, description: template.description }).catch(() => setError('暫時無法分享，請重試。')); }}
  /></>;
}
