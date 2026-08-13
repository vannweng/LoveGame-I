import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from './AppButton';
import { colors, radius, spacing } from '../theme/tokens';

export function LoadingState({ label = '載入中…' }: { label?: string }) {
  return <StateFrame title={label} copy="正在整理你的戀愛生存資料。" />;
}

export function EmptyState({ title, copy }: { title: string; copy: string }) {
  return <StateFrame title={title} copy={copy} />;
}

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return <StateFrame title="暫時無法載入" copy="請確認連線後再試一次。" action={<AppButton label="重試" onPress={onRetry} />} />;
}

function StateFrame({ title, copy, action }: { title: string; copy: string; action?: ReactNode }) {
  return <View style={styles.frame}><Text style={styles.title}>{title}</Text><Text style={styles.copy}>{copy}</Text>{action}</View>;
}

const styles = StyleSheet.create({
  frame: { alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.md, gap: spacing.sm, justifyContent: 'center', margin: spacing.lg, padding: spacing.xl },
  title: { color: colors.text, fontSize: 20, fontWeight: '900' }, copy: { color: colors.textMuted, textAlign: 'center' },
});
