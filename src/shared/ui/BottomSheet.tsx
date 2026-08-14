import type { PropsWithChildren } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { borderWidth, colors, fonts, radius, spacing, typography } from '@/shared/theme/tokens';

interface BottomSheetProps extends PropsWithChildren {
  visible: boolean;
  title: string;
  onClose: () => void;
}

export function BottomSheet({ children, onClose, title, visible }: BottomSheetProps) {
  return (
    <Modal animationType="slide" onRequestClose={onClose} transparent visible={visible}>
      <View style={styles.backdrop}><Pressable accessibilityLabel="關閉面板" onPress={onClose} style={styles.dismiss} /><View accessibilityViewIsModal style={styles.sheet}><View style={styles.handle} /><View style={styles.header}><Text style={styles.title}>{title}</Text><Pressable accessibilityLabel="關閉面板" accessibilityRole="button" hitSlop={spacing.sm} onPress={onClose}><Text style={styles.close}>×</Text></Pressable></View><ScrollView contentContainerStyle={styles.content}>{children}</ScrollView></View></View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end' },
  dismiss: { backgroundColor: 'rgba(0, 0, 0, 0.7)', flex: 1 },
  sheet: { backgroundColor: colors.pageBg, borderColor: colors.accent, borderTopLeftRadius: radius.sm, borderTopRightRadius: radius.sm, borderWidth, gap: spacing.md, maxHeight: '85%', padding: spacing.lg },
  handle: { alignSelf: 'center', backgroundColor: colors.border, height: spacing.xs, width: spacing.xxl },
  header: { alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' },
  title: { color: colors.text, flex: 1, fontFamily: fonts.body, fontSize: typography.sectionTitle, fontWeight: '700' },
  close: { color: colors.accent, fontFamily: fonts.number, fontSize: typography.hero, lineHeight: typography.hero },
  content: { gap: spacing.md, paddingBottom: spacing.xl },
});
