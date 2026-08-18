import type { PropsWithChildren, ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { borderWidth, colors, fonts, radius, spacing, typography } from '@/shared/theme/tokens';

interface PixelCardProps extends PropsWithChildren {
  accentColor?: string;
  subtitle?: string;
  title?: string;
  trailing?: ReactNode;
}

export function PixelCard({ accentColor = colors.border, children, subtitle, title, trailing }: PixelCardProps) {
  return (
    <View style={[styles.card, { borderColor: accentColor }]}>
      {title ? <View style={styles.header}><View style={styles.titleArea}><Text style={styles.title}>{title}</Text>{subtitle ? <Text style={[styles.subtitle, { color: accentColor }]}>{subtitle}</Text> : null}</View>{trailing}</View> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.cardBg, borderRadius: radius.sm, borderWidth, gap: spacing.md, padding: spacing.md },
  header: { alignItems: 'flex-start', flexDirection: 'row', gap: spacing.sm, justifyContent: 'space-between' },
  titleArea: { flex: 1, minWidth: 0 },
  title: { color: colors.text, fontFamily: fonts.body, fontSize: typography.sectionTitle, fontWeight: '700' },
  subtitle: { fontFamily: fonts.number, fontSize: typography.micro, letterSpacing: 1, marginTop: spacing.xs },
});
