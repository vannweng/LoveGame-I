import type { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { borderWidth, colors, fonts, radius, spacing, typography } from '@/shared/theme/tokens';

interface DialogProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  children?: ReactNode;
  description?: string;
  tone?: 'danger' | 'info';
}

export function Dialog({ children, description, onClose, title, tone = 'info', visible }: DialogProps) {
  const accentColor = tone === 'danger' ? colors.danger : colors.accent;
  return (
    <Modal animationType="fade" onRequestClose={onClose} transparent visible={visible}>
      <View style={styles.backdrop}><View accessibilityViewIsModal style={[styles.dialog, { borderColor: accentColor }]}><View style={styles.header}><Text style={styles.title}>{title}</Text><Pressable accessibilityLabel="關閉對話框" accessibilityRole="button" hitSlop={spacing.sm} onPress={onClose}><Text style={[styles.close, { color: accentColor }]}>×</Text></Pressable></View>{description ? <Text style={styles.description}>{description}</Text> : null}{children}</View></View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)', flex: 1, justifyContent: 'center', padding: spacing.lg },
  dialog: { backgroundColor: colors.cardBg, borderRadius: radius.sm, borderWidth, gap: spacing.md, maxWidth: 480, padding: spacing.lg, width: '100%' },
  header: { alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' },
  title: { color: colors.text, flex: 1, fontFamily: fonts.body, fontSize: typography.sectionTitle, fontWeight: '700' },
  close: { fontFamily: fonts.number, fontSize: typography.hero, lineHeight: typography.hero },
  description: { color: colors.textMuted, fontFamily: fonts.body, fontSize: typography.body, lineHeight: 24 },
});
