import { StyleSheet, Text, View } from 'react-native';

import type { Mission } from '@/features/missions/domain';
import { getCopy } from '@/content';
import { AppButton } from '@/shared/ui/AppButton';
import { MissionCard } from '@/shared/ui/MissionCard';
import { PageLayout } from '@/shared/ui/PageLayout';
import { colors, fonts, typography } from '@/shared/theme/tokens';

interface MissionListViewProps {
  mission: Mission;
  onBack: () => void;
  onOpenMission: () => void;
}

export function MissionListView({
  mission,
  onBack,
  onOpenMission,
}: MissionListViewProps) {
  return (
    <PageLayout>
      <Text style={styles.eyebrow}>{getCopy('MISSION_LIST_EYEBROW')}</Text>
      <MissionCard
        actionLabel={getCopy('MISSION_VIEW_DETAIL')}
        dueLabel={getCopy(mission.template.titleKey)}
        onPress={onOpenMission}
        rewardLabel={getCopy('MISSION_EVENT_REWARD', { eventType: mission.template.eventType.toUpperCase(), exp: mission.template.reward.success.expDelta })}
        status={{ label: getCopy('MISSION_LIST_STAGE'), variant: 'active' }}
        subtitle={getCopy('MISSION_LIST_SUBTITLE')}
        title={getCopy('MISSION_LIST_TITLE')}
      />
      <View style={styles.fill} />
      <AppButton label={getCopy('MISSION_BACK_HOME')} onPress={onBack} secondary />
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  eyebrow: { color: colors.accent, fontFamily: fonts.number, fontSize: typography.micro, letterSpacing: 1 },
  fill: { flex: 1 },
});
