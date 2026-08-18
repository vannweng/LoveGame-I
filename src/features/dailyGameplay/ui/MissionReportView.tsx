import { StyleSheet, Text, View } from 'react-native';

import { getCopy } from '@/content';
import { AppButton } from '@/shared/ui/AppButton';
import { PixelCard } from '@/shared/ui/PixelCard';
import { PageLayout } from '@/shared/ui/PageLayout';
import { colors, fonts, spacing, typography } from '@/shared/theme/tokens';

interface MissionReportViewProps {
  onComplete: () => void;
  onLater: () => void;
  onDemoFail?: () => void;
  onDemoLate?: () => void;
}

export function MissionReportView({ onComplete, onDemoFail, onDemoLate, onLater }: MissionReportViewProps) {
  return <PageLayout><Text style={styles.eyebrow}>{getCopy('DAILY_REPORT_SUBTITLE')}</Text><PixelCard accentColor={colors.accent} subtitle={getCopy('DAILY_REPORT_SUBTITLE')} title={getCopy('DAILY_REPORT_TITLE')}><Text style={styles.copy}>{getCopy('DAILY_REPORT_COPY')}</Text></PixelCard><View style={styles.fill} /><AppButton label={getCopy('DAILY_REPORT_COMPLETE')} onPress={onComplete} /><AppButton label={getCopy('DAILY_REPORT_LATER')} onPress={onLater} secondary />{__DEV__ && onDemoLate && onDemoFail ? <View style={styles.demo}><Text style={styles.demoLabel}>{getCopy('MISSION_DEVELOPMENT_DEMO')}</Text><AppButton label={getCopy('MISSION_DEMO_LATE')} onPress={onDemoLate} secondary /><AppButton label={getCopy('MISSION_DEMO_FAIL')} onPress={onDemoFail} secondary /></View> : null}</PageLayout>;
}

const styles = StyleSheet.create({
  eyebrow: { color: colors.accent, fontFamily: fonts.number, fontSize: typography.micro, letterSpacing: 1 },
  copy: { color: colors.textMuted, fontFamily: fonts.body, fontSize: typography.body, lineHeight: 24 },
  fill: { flex: 1 },
  demo: { gap: spacing.sm },
  demoLabel: { color: colors.violet, fontFamily: fonts.number, fontSize: typography.micro },
});
