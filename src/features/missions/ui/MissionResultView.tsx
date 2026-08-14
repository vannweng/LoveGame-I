import { StyleSheet, Text, View } from 'react-native';

import type { MissionCompletion } from '@/features/missions/application/completeMission';
import { getCopy } from '@/content';
import { AppButton } from '@/shared/ui/AppButton';
import { PixelCard } from '@/shared/ui/PixelCard';
import { RewardSummary } from '@/shared/ui/RewardSummary';
import { StatusBadge } from '@/shared/ui/StatusBadge';
import { PageLayout } from '@/shared/ui/PageLayout';
import { colors, fonts, typography } from '@/shared/theme/tokens';

interface MissionResultViewProps {
  completion: MissionCompletion;
  mission: import('@/features/missions/domain').Mission;
  onReturnHome: () => void;
}

export function MissionResultView({ completion, mission, onReturnHome }: MissionResultViewProps) {
  return (
    <PageLayout>
      <Text style={styles.eyebrow}>{getCopy('MISSION_RESULT_EYEBROW')}</Text>
      <PixelCard accentColor={resultColor(completion.result)} title={getCopy('MISSION_RESULT_TITLE')} subtitle={completion.result.toUpperCase()} trailing={<StatusBadge label={completion.result.toUpperCase()} variant={statusVariant(completion.result)} />}>
        <RewardSummary comboDelta={completion.reward.comboDelta} expDelta={completion.reward.expDelta} rankDelta={completion.reward.rankDelta} />
      </PixelCard>
      <Text style={styles.copy}>{getCopy(mission.template[`${completion.result}CopyKey`])}</Text>
      <View style={styles.fill} />
      <AppButton label={getCopy('MISSION_BACK_HOME')} onPress={onReturnHome} />
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  eyebrow: { color: colors.accent, fontFamily: fonts.number, fontSize: typography.micro, letterSpacing: 1 },
  copy: { color: colors.textMuted, fontFamily: fonts.body, fontSize: typography.body, lineHeight: 24 },
  fill: { flex: 1 },
});

function resultColor(result: MissionCompletion['result']): string {
  return result === 'success' ? colors.safe : result === 'late' ? colors.orange : colors.danger;
}

function statusVariant(result: MissionCompletion['result']): 'success' | 'late' | 'fail' {
  return result === 'success' ? 'success' : result === 'late' ? 'late' : 'fail';
}
