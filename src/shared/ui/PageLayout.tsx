import type { PropsWithChildren } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';

import { colors, spacing } from '@/shared/theme/tokens';

export function PageLayout({ children }: PropsWithChildren) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.pageBg, flex: 1 },
  content: { alignSelf: 'center', flexGrow: 1, gap: spacing.lg, maxWidth: 720, minWidth: 0, padding: spacing.lg, paddingBottom: spacing.xxl, width: '100%' },
});
