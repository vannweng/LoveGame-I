import { StyleSheet, Text, View } from 'react-native';

import { getCopy } from '@/content';
import { recommendForMission, type RecommendationPreferences } from '@/features/recommendations/domain';
import type { MissionType } from '@/features/missions/domain';
import { PixelCard } from '@/shared/ui/PixelCard';
import { PixelTag } from '@/shared/ui/PixelTag';
import { colors, fonts, spacing, typography } from '@/shared/theme/tokens';

interface MissionRecommendationsProps {
  missionType: MissionType;
  preferences: RecommendationPreferences;
}

export function MissionRecommendations({ missionType, preferences }: MissionRecommendationsProps) {
  const recommendations = recommendForMission(missionType, preferences).slice(0, 3);
  return <PixelCard accentColor={colors.violet} title={getCopy('MISSION_RECOMMENDATION_TITLE')} subtitle={getCopy('MISSION_RECOMMENDATION_SUBTITLE')}>
    {recommendations.length ? recommendations.map((recommendation) => <View key={recommendation.id} style={styles.item}>
      <Text style={styles.title}>{recommendation.title}</Text>
      <Text style={styles.description}>{recommendation.description}</Text>
      {recommendation.matchedPreferences.length ? <View style={styles.tags}>{recommendation.matchedPreferences.map((tag) => <PixelTag color={colors.accent} key={tag} label={tag} size="S" />)}</View> : null}
    </View>) : <Text style={styles.empty}>{getCopy('MISSION_RECOMMENDATION_EMPTY')}</Text>}
    <Text style={styles.note}>{getCopy('MISSION_RECOMMENDATION_NOTE')}</Text>
  </PixelCard>;
}

const styles = StyleSheet.create({
  item: { backgroundColor: colors.subBoxBg, gap: spacing.xs, padding: spacing.sm },
  title: { color: colors.text, fontFamily: fonts.body, fontSize: typography.cardTitle, fontWeight: '700' },
  description: { color: colors.textMuted, fontFamily: fonts.body, fontSize: typography.caption, lineHeight: 20 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  empty: { color: colors.textMuted, fontFamily: fonts.body, fontSize: typography.body },
  note: { color: colors.gold, fontFamily: fonts.body, fontSize: typography.micro },
});
