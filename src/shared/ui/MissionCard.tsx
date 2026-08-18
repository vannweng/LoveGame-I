import { StyleSheet, Text } from 'react-native';

import { AppButton } from '@/shared/ui/AppButton';
import { PixelCard } from '@/shared/ui/PixelCard';
import { StatusBadge, type StatusVariant } from '@/shared/ui/StatusBadge';
import { colors, fonts, typography } from '@/shared/theme/tokens';

interface MissionCardProps {
  title: string;
  subtitle?: string;
  status: { label: string; variant: StatusVariant };
  dueLabel?: string;
  rewardLabel?: string;
  actionLabel?: string;
  onPress?: () => void;
  disabled?: boolean;
}

export function MissionCard({ actionLabel, disabled = false, dueLabel, onPress, rewardLabel, status, subtitle, title }: MissionCardProps) {
  return (
    <PixelCard accentColor={colors.orange} subtitle={subtitle} title={title} trailing={<StatusBadge label={status.label} variant={status.variant} />}>
      {dueLabel ? <Text style={styles.meta}>{dueLabel}</Text> : null}
      {rewardLabel ? <Text style={styles.reward}>{rewardLabel}</Text> : null}
      {actionLabel && onPress ? <AppButton disabled={disabled} label={actionLabel} onPress={onPress} /> : null}
    </PixelCard>
  );
}

const styles = StyleSheet.create({
  meta: { color: colors.textMuted, fontFamily: fonts.body, fontSize: typography.caption, lineHeight: 20 },
  reward: { color: colors.gold, fontFamily: fonts.number, fontSize: typography.caption },
});
