import { StyleSheet, Text, View } from 'react-native';

import type { Mission } from '@/features/missions/domain';
import { getCopy } from '@/content';
import { AppButton } from '@/shared/ui/AppButton';
import { PixelCard } from '@/shared/ui/PixelCard';
import { PixelTag } from '@/shared/ui/PixelTag';
import { PageLayout } from '@/shared/ui/PageLayout';
import { colors, fonts, typography } from '@/shared/theme/tokens';

interface MissionDetailViewProps {
  mission: Mission;
  onBack: () => void;
  onStartAction: () => void;
}

export function MissionDetailView({
  mission,
  onBack,
  onStartAction,
}: MissionDetailViewProps) {
  return (
    <PageLayout>
      <Text style={styles.eyebrow}>{getCopy('MISSION_DETAIL_EYEBROW')}</Text>
      <PixelCard accentColor={colors.orange} title={getCopy(mission.template.titleKey)} subtitle={getCopy('MISSION_DETAIL_SUBTITLE')} trailing={<PixelTag color={colors.orange} label={getCopy('MISSION_ACTIVE')} />}>
        <Text style={styles.description}>{getCopy(mission.template.descriptionKey)}</Text>
        <Text style={styles.reward}>{getCopy('MISSION_REWARD', { exp: mission.template.reward.success.expDelta })}</Text>
      </PixelCard>
      <View style={styles.fill} />
      <AppButton label={getCopy('DAILY_START_REPORT')} onPress={onStartAction} />
      <AppButton label={getCopy('MISSION_BACK_LIST')} onPress={onBack} secondary />
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  eyebrow: { color: colors.accent, fontFamily: fonts.number, fontSize: typography.micro, letterSpacing: 1 },
  description: { color: colors.textMuted, fontFamily: fonts.body, fontSize: typography.body, lineHeight: 24 },
  reward: { color: colors.gold, fontFamily: fonts.number, fontSize: typography.caption },
  fill: { flex: 1 },
});
