import { StyleSheet, Text, View } from 'react-native';

import { dailyGameplayConfig, getCopy } from '@/content';
import type { DailyGameplayState } from '@/features/dailyGameplay/domain';
import { AppButton } from '@/shared/ui/AppButton';
import { PixelCard } from '@/shared/ui/PixelCard';
import { PageLayout } from '@/shared/ui/PageLayout';
import { colors, fonts, typography } from '@/shared/theme/tokens';

interface NextHookViewProps {
  state: DailyGameplayState;
  onReturnHome: () => void;
}

export function NextHookView({ onReturnHome, state }: NextHookViewProps) {
  const hook = dailyGameplayConfig.nextHooks.find((item) => item.id === state.nextHookId) ?? dailyGameplayConfig.nextHooks[0];
  return <PageLayout><Text style={styles.eyebrow}>{getCopy('DAILY_NEXT_HOOK_SUBTITLE')}</Text><PixelCard accentColor={colors.violet} subtitle={getCopy('DAILY_NEXT_HOOK_SUBTITLE')} title={getCopy(hook.titleKey)}><Text style={styles.copy}>{getCopy(hook.descriptionKey)}</Text></PixelCard><View style={styles.fill} /><AppButton label={getCopy('DAILY_BACK_HOME')} onPress={onReturnHome} /></PageLayout>;
}

const styles = StyleSheet.create({
  eyebrow: { color: colors.violet, fontFamily: fonts.number, fontSize: typography.micro, letterSpacing: 1 },
  copy: { color: colors.textMuted, fontFamily: fonts.body, fontSize: typography.body, lineHeight: 24 },
  fill: { flex: 1 },
});
