import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { getCopy } from '@/content';
import { openRecommendationSearch } from '@/features/recommendations/application/openRecommendationSearch';
import { recommendForMission, type RecommendationDestination, type RecommendationPreferences } from '@/features/recommendations/domain';
import type { MissionType } from '@/features/missions/domain';
import { AppButton } from '@/shared/ui/AppButton';
import { PixelCard } from '@/shared/ui/PixelCard';
import { PixelTag } from '@/shared/ui/PixelTag';
import { colors, fonts, spacing, typography } from '@/shared/theme/tokens';

interface MissionRecommendationsProps {
  missionType: MissionType;
  preferences: RecommendationPreferences;
}

export function MissionRecommendations({ missionType, preferences }: MissionRecommendationsProps) {
  const [openError, setOpenError] = useState(false);
  const recommendations = recommendForMission(missionType, preferences).slice(0, missionType === 'gift_order' || missionType === 'date_dinner' ? 5 : 3);
  const hasExternalDestination = recommendations.some((recommendation) => recommendation.destination);

  function handleOpen(destination: RecommendationDestination): void {
    setOpenError(false);
    void openRecommendationSearch(destination.url).catch(() => setOpenError(true));
  }

  return <PixelCard accentColor={colors.violet} title={getCopy('MISSION_RECOMMENDATION_TITLE')} subtitle={getCopy('MISSION_RECOMMENDATION_SUBTITLE')}>
    {recommendations.length ? recommendations.map((recommendation) => {
      const destination = recommendation.destination;
      const price = recommendation.price;
      return <View key={recommendation.id} style={styles.item}>
        <Text style={styles.title}>{recommendation.title}</Text>
        {price ? <Text style={styles.price}>{getCopy(price.basis === 'product' ? 'MISSION_RECOMMENDATION_PRODUCT_PRICE' : 'MISSION_RECOMMENDATION_BOOKING_PRICE', {
          amount: price.amountTwd.toLocaleString('zh-TW'), city: recommendation.city ?? '', date: price.checkedAt.replaceAll('-', '/'),
        })}</Text> : null}
        <Text style={styles.description}>{recommendation.description}</Text>
        {recommendation.matchedPreferences.length ? <View style={styles.tags}>{recommendation.matchedPreferences.map((tag) => <PixelTag color={colors.accent} key={tag} label={tag} size="S" />)}</View> : null}
        {destination ? <View style={styles.searchAction}><AppButton label={getCopy(missionType === 'gift_order' ? 'MISSION_RECOMMENDATION_BUY' : 'MISSION_RECOMMENDATION_RESERVE', { provider: destination.provider })} onPress={() => handleOpen(destination)} secondary size="S" /></View> : null}
      </View>;
    }) : <Text style={styles.empty}>{getCopy('MISSION_RECOMMENDATION_EMPTY')}</Text>}
    <Text style={styles.note}>{getCopy('MISSION_RECOMMENDATION_NOTE')}</Text>
    {missionType === 'date_dinner' ? <Text style={styles.externalNote}>{getCopy('MISSION_RECOMMENDATION_DIETARY_NOTE')}</Text> : null}
    {hasExternalDestination ? <Text style={styles.externalNote}>{getCopy('MISSION_RECOMMENDATION_EXTERNAL_NOTE')}</Text> : null}
    {openError ? <Text style={styles.error}>{getCopy('MISSION_RECOMMENDATION_OPEN_ERROR')}</Text> : null}
  </PixelCard>;
}

const styles = StyleSheet.create({
  item: { backgroundColor: colors.subBoxBg, gap: spacing.xs, padding: spacing.sm },
  title: { color: colors.text, fontFamily: fonts.body, fontSize: typography.cardTitle, fontWeight: '700' },
  description: { color: colors.textMuted, fontFamily: fonts.body, fontSize: typography.caption, lineHeight: 20 },
  price: { color: colors.gold, fontFamily: fonts.body, fontSize: typography.caption, fontWeight: '700' },
  searchAction: { alignSelf: 'flex-start', marginTop: spacing.xs },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  empty: { color: colors.textMuted, fontFamily: fonts.body, fontSize: typography.body },
  note: { color: colors.gold, fontFamily: fonts.body, fontSize: typography.micro },
  externalNote: { color: colors.textMuted, fontFamily: fonts.body, fontSize: typography.micro },
  error: { color: colors.danger, fontFamily: fonts.body, fontSize: typography.caption },
});
