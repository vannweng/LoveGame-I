import { StyleSheet, Text, View } from 'react-native';

import { dailyGameplayConfig, getCopy } from '@/content';
import { AppButton } from '@/shared/ui/AppButton';
import { PixelCard } from '@/shared/ui/PixelCard';
import { PageLayout } from '@/shared/ui/PageLayout';
import { colors, fonts, typography } from '@/shared/theme/tokens';

interface SafeActionViewProps {
  onComplete: () => void;
}

export function SafeActionView({ onComplete }: SafeActionViewProps) {
  const action = dailyGameplayConfig.safeAction;
  return <PageLayout><Text style={styles.eyebrow}>{getCopy('DAILY_SAFE_SUBTITLE')}</Text><PixelCard accentColor={colors.safe} subtitle={getCopy('DAILY_SAFE_SUBTITLE')} title={getCopy(action.titleKey)}><Text style={styles.copy}>{getCopy(action.descriptionKey)}</Text></PixelCard><View style={styles.fill} /><AppButton label={getCopy('DAILY_COMPLETE_FREE_ACTION')} onPress={onComplete} /></PageLayout>;
}

const styles = StyleSheet.create({
  eyebrow: { color: colors.safe, fontFamily: fonts.number, fontSize: typography.micro, letterSpacing: 1 },
  copy: { color: colors.textMuted, fontFamily: fonts.body, fontSize: typography.body, lineHeight: 24 },
  fill: { flex: 1 },
});
