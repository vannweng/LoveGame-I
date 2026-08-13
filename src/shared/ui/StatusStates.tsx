import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from './AppButton';
import { getCopy } from '@/content';
import { PixelCard } from './PixelCard';
import { colors, fonts, spacing, typography } from '@/shared/theme/tokens';

export function LoadingState({ label = getCopy('STATUS_LOADING') }: { label?: string }) {
  return <StateFrame title={label} copy={getCopy('STATUS_LOADING_COPY')} />;
}

export function EmptyState({ title, copy }: { title: string; copy: string }) {
  return <StateFrame title={title} copy={copy} />;
}

interface ErrorStateProps {
  copy?: string;
  onRetry: () => void;
  title?: string;
}

export function ErrorState({ copy = getCopy('STATUS_ERROR_COPY'), onRetry, title = getCopy('STATUS_ERROR_TITLE') }: ErrorStateProps) {
  return <StateFrame title={title} copy={copy} action={<AppButton label={getCopy('STATUS_RETRY')} onPress={onRetry} />} />;
}

function StateFrame({ title, copy, action }: { title: string; copy: string; action?: ReactNode }) {
  return <View style={styles.frame}><PixelCard accentColor={colors.accent} title={title} subtitle={getCopy('STATUS_SYSTEM')}>{<Text style={styles.copy}>{copy}</Text>}{action}</PixelCard></View>;
}

const styles = StyleSheet.create({
  frame: { flex: 1, justifyContent: 'center', margin: spacing.lg },
  copy: { color: colors.textMuted, fontFamily: fonts.body, fontSize: typography.body, lineHeight: 22, textAlign: 'center' },
});
