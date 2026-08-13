import { StyleSheet, Text } from 'react-native';

import type { CollectionState } from '@/features/collection/domain';
import { getCopy } from '@/content';
import { PixelCard } from '@/shared/ui/PixelCard';
import { PixelTag } from '@/shared/ui/PixelTag';
import { ScreenState } from '@/shared/ui/ScreenState';
import { PageLayout } from '@/shared/ui/PageLayout';
import { colors, fonts, typography } from '@/shared/theme/tokens';

export function CollectionView({ collectionState }: { collectionState: CollectionState }) {
  const state = collectionState.items.length === 0
    ? { kind: 'empty' as const, title: getCopy('COLLECTION_EMPTY_TITLE'), copy: getCopy('COLLECTION_EMPTY_COPY') }
    : { kind: 'success' as const };

  return <ScreenState state={state}><PageLayout><Text style={styles.copy}>{getCopy('COLLECTION_VAULT_UNLOCKED', { count: collectionState.items.length })}</Text>{collectionState.items.map((item) => <PixelCard key={item.id} accentColor={item.type === 'title' ? colors.gold : colors.danger} title={item.name} subtitle={item.type === 'title' ? getCopy('COLLECTION_TITLE_UNLOCKED') : getCopy('COLLECTION_GG_RECORD')} trailing={<PixelTag color={item.type === 'title' ? colors.gold : colors.danger} label={item.type === 'title' ? getCopy('COLLECTION_TITLE_TAG') : getCopy('COLLECTION_GG_TAG')} />} />)}</PageLayout></ScreenState>;
}

const styles = StyleSheet.create({
  copy: { color: colors.accent, fontFamily: fonts.number, fontSize: typography.micro },
});
