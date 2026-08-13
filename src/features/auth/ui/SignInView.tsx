import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/shared/ui/AppButton';
import { getCopy } from '@/content';
import { PixelCard } from '@/shared/ui/PixelCard';
import { PageLayout } from '@/shared/ui/PageLayout';
import { colors, fonts, spacing, typography } from '@/shared/theme/tokens';

interface SignInViewProps {
  error: string | null;
  onContinueAsDev?: () => void;
  onSignIn: () => void;
}

export function SignInView({ error, onContinueAsDev, onSignIn }: SignInViewProps) {
  return (
    <PageLayout>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>{getCopy('AUTH_EYEBROW')}</Text>
        <Text style={styles.title}>{getCopy('AUTH_TITLE')}</Text>
        <Text style={styles.description}>{getCopy('AUTH_DESCRIPTION')}</Text>
        {error ? <PixelCard accentColor={colors.danger} title={getCopy('AUTH_FAILED')} subtitle={getCopy('AUTH_ERROR_SUBTITLE')}><Text style={styles.error}>{error}</Text></PixelCard> : null}
      </View>
      <AppButton label={error ? getCopy('AUTH_RETRY_GOOGLE') : getCopy('AUTH_GOOGLE')} onPress={onSignIn} />
      {onContinueAsDev ? <AppButton label={getCopy('DEV_PREVIEW_LOGIN')} onPress={onContinueAsDev} secondary /> : null}
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, gap: spacing.md, justifyContent: 'center' },
  eyebrow: { color: colors.accent, fontFamily: fonts.number, fontSize: typography.micro, letterSpacing: 1 },
  title: { color: colors.text, fontFamily: fonts.body, fontSize: typography.hero, fontWeight: '700' },
  description: { color: colors.textMuted, fontFamily: fonts.body, fontSize: typography.body, lineHeight: 24 },
  error: { color: colors.danger, fontFamily: fonts.body, fontSize: typography.caption, lineHeight: 22 },
});
