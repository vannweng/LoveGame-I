import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { PageLayout } from '@/shared/ui/PageLayout';
import { getCopy } from '@/content';
import { colors, fonts, spacing, typography } from '@/shared/theme/tokens';

export function AuthLoadingView() {
  return (
    <PageLayout>
      <View style={styles.content}>
        <ActivityIndicator color={colors.accent} size="large" />
        <Text style={styles.label}>{getCopy('AUTH_LOADING')}</Text>
      </View>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  content: { alignItems: 'center', flex: 1, gap: spacing.lg, justifyContent: 'center' },
  label: { color: colors.text, fontFamily: fonts.number, fontSize: typography.caption },
});
