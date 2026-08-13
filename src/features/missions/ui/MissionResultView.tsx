import { StyleSheet, Text, View } from 'react-native';

import type { MissionCompletion } from '@/features/missions/application/completeMission';
import { getCopy } from '@/content';
import { AppButton } from '@/shared/ui/AppButton';
import { PixelCard } from '@/shared/ui/PixelCard';
import { PixelTag } from '@/shared/ui/PixelTag';
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
      <PixelCard accentColor={resultColor(completion.result)} title={getCopy('MISSION_RESULT_TITLE')} subtitle={completion.result.toUpperCase()} trailing={<PixelTag color={resultColor(completion.result)} label={completion.result.toUpperCase()} />}>
        <Text style={styles.reward}>{getCopy('MISSION_RESULT_EXP', { value: completion.reward.expDelta })}</Text>
        <Text style={styles.reward}>{getCopy('MISSION_RESULT_COMBO', { value: completion.reward.comboDelta })}</Text>
        <Text style={styles.reward}>{getCopy('MISSION_RESULT_RANK', { value: formatDelta(completion.reward.rankDelta) })}</Text>
      </PixelCard>
      <Text style={styles.copy}>{getCopy(mission.template[`${completion.result}CopyKey`])}</Text>
      <View style={styles.fill} />
      <AppButton label={getCopy('MISSION_BACK_HOME')} onPress={onReturnHome} />
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  eyebrow: { color: colors.accent, fontFamily: fonts.number, fontSize: typography.micro, letterSpacing: 1 },
  reward: { color: colors.gold, fontFamily: fonts.number, fontSize: typography.body },
  copy: { color: colors.textMuted, fontFamily: fonts.body, fontSize: typography.body, lineHeight: 24 },
  fill: { flex: 1 },
});

function formatDelta(value: number): string {
  return value >= 0 ? `+${value}` : String(value);
}

function resultColor(result: MissionCompletion['result']): string {
  return result === 'success' ? colors.safe : result === 'late' ? colors.orange : colors.danger;
}
