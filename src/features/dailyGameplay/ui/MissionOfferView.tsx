import { StyleSheet, Text, View } from 'react-native';

import type { Mission } from '@/features/missions/domain';
import { getCopy } from '@/content';
import { AppButton } from '@/shared/ui/AppButton';
import { MissionCard } from '@/shared/ui/MissionCard';
import { PageLayout } from '@/shared/ui/PageLayout';
import { colors, fonts, typography } from '@/shared/theme/tokens';

interface MissionOfferViewProps {
  mission: Mission;
  onAccept: () => void;
  onDefer: () => void;
}

export function MissionOfferView({ mission, onAccept, onDefer }: MissionOfferViewProps) {
  return <PageLayout><MissionCard actionLabel={getCopy('DAILY_ACCEPT')} dueLabel={getCopy(mission.template.titleKey)} onPress={onAccept} rewardLabel={getCopy('MISSION_EVENT_REWARD', { eventType: mission.template.eventType.toUpperCase(), exp: mission.template.reward.success.expDelta })} status={{ label: getCopy('MISSION_ACTIVE'), variant: 'danger' }} title={getCopy('DAILY_CRISIS_TITLE')} /><Text style={styles.copy}>{getCopy('DAILY_CRISIS_COPY')}</Text><View style={styles.fill} /><AppButton label={getCopy('DAILY_DEFER')} onPress={onDefer} secondary /></PageLayout>;
}

const styles = StyleSheet.create({
  copy: { color: colors.textMuted, fontFamily: fonts.body, fontSize: typography.body, lineHeight: 24 },
  fill: { flex: 1 },
});
