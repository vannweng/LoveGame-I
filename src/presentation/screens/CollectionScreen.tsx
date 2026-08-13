import { StyleSheet, Text, View } from 'react-native';

import type { CollectionState } from '../../domain/collection';
import { EmptyState } from '../components/ScreenStates';
import { ScreenLayout } from '../components/ScreenLayout';
import { colors, radius, spacing } from '../theme/tokens';

export function CollectionScreen({ collectionState }: { collectionState: CollectionState }) {
  if (collectionState.items.length === 0) return <EmptyState title="圖鑑尚未解鎖" copy="完成生存任務，解鎖你的第一個稱號。" />;
  return <ScreenLayout><Text style={styles.copy}>身份與稱號</Text>{collectionState.items.map((item) => <View key={item.id} style={styles.card}><Text style={styles.type}>{item.type === 'title' ? '稱號' : '墓碑'}</Text><Text style={styles.name}>{item.name}</Text></View>)}</ScreenLayout>;
}

const styles = StyleSheet.create({
  copy: { color: colors.textMuted }, card: { backgroundColor: colors.surface, borderRadius: radius.md, gap: spacing.xs, padding: spacing.md },
  type: { color: colors.gold, fontWeight: '800' }, name: { color: colors.text, fontSize: 20, fontWeight: '900' },
});
