import type { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/shared/ui/AppButton';
import { getCopy } from '@/content';
import { PageLayout } from '@/shared/ui/PageLayout';
import { useResponsiveLayout } from '@/shared/hooks/useResponsiveLayout';
import { colors, fonts, spacing, typography } from '@/shared/theme/tokens';

interface RelationshipEditorLayoutProps extends PropsWithChildren {
  onCancel: () => void;
  onSave: () => void;
  subtitle: string;
  title: string;
  saveDisabled?: boolean;
}

export function RelationshipEditorLayout({ children, onCancel, onSave, saveDisabled = false, subtitle, title }: RelationshipEditorLayoutProps) {
  const { isCompact } = useResponsiveLayout();
  return <PageLayout><View><Text style={styles.title}>{title}</Text><Text style={styles.subtitle}>{subtitle}</Text></View>{children}<View style={[styles.actions, isCompact && styles.compactActions]}><AppButton label={getCopy('RELATIONSHIP_BACK')} onPress={onCancel} secondary /><AppButton disabled={saveDisabled} label={getCopy('RELATIONSHIP_SAVE')} onPress={onSave} /></View></PageLayout>;
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontFamily: fonts.body, fontSize: typography.hero, fontWeight: '700' },
  subtitle: { color: colors.accent, fontFamily: fonts.number, fontSize: typography.micro, letterSpacing: 1, marginTop: spacing.xs },
  actions: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'flex-end' }, compactActions: { flexDirection: 'column' },
});
