import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { ImportantDateItinerary as ImportantDateItineraryData } from '../domain/models';
import { PixelTag } from '@/shared/ui/PixelTag';
import { AppButton } from '@/shared/ui/AppButton';
import { colors, fonts, spacing, typography } from '@/shared/theme/tokens';
import { openPlanRoute } from '../application/openPlanRoute';

export function ImportantDateItinerary({ itinerary, busy = false, onReplace }: { itinerary: ImportantDateItineraryData; busy?: boolean; onReplace?: (itemId: string) => Promise<boolean> }) {
  const [openError, setOpenError] = useState(false);
  return <View style={styles.timeline}>
    {itinerary.alerts?.map((alert) => <Text key={alert} accessibilityRole="alert" style={styles.alert}>{alert}</Text>)}
    {itinerary.items.map((item) => item.kind === 'transport' ? <View key={item.id} style={styles.row}>
      <View style={styles.marker} />
      <View style={styles.transportContent}>
        <Text style={styles.transportTime}>預估交通時間 {item.estimatedMinutes ?? '—'} 分鐘</Text>
        {item.route ? <View style={styles.routeAction}><AppButton label="路線確認" secondary size="S" onPress={() => { setOpenError(false); void openPlanRoute(item.route!).catch(() => setOpenError(true)); }} /></View> : null}
      </View>
    </View> : <View key={item.id} style={styles.row}>
      <View style={styles.marker}><View style={[styles.dot, item.status === 'confirmed' && styles.confirmedDot]} /></View>
      <View style={styles.content}>
        <Text style={styles.time}>{item.startDayOffset ? '次日 ' : ''}{item.startTime} – {item.endDayOffset ? '次日 ' : ''}{item.endTime}</Text>
        <View style={styles.titleRow}><Text style={styles.title}>{item.title}</Text><PixelTag color={item.status === 'confirmed' ? colors.safe : colors.gold} label={item.status === 'confirmed' ? '已確認' : '建議'} size="S" />{item.free ? <PixelTag color={colors.safe} label="免門票" size="S" /> : null}</View>
        {item.location ? <Text style={styles.description}>{item.location.address} · {item.location.station ?? '捷運站待補'}</Text> : null}
        <Text style={styles.description}>{item.description}</Text>
        {item.free && onReplace ? <AppButton disabled={busy} label="換一個順路的免費景點" secondary size="S" onPress={() => { void onReplace(item.id); }} /> : null}
      </View>
    </View>)}
    {openError ? <Text style={styles.alert}>暫時無法開啟路線，請稍後再試。</Text> : null}
  </View>;
}

const styles = StyleSheet.create({
  timeline: { gap: spacing.sm },
  row: { flexDirection: 'row', gap: spacing.sm },
  marker: { alignItems: 'center', borderLeftColor: colors.border, borderLeftWidth: 2, marginLeft: spacing.xs, paddingTop: spacing.xs, width: 10 },
  dot: { backgroundColor: colors.gold, borderColor: colors.ink, borderRadius: 8, borderWidth: 2, height: 14, width: 14 },
  confirmedDot: { backgroundColor: colors.safe },
  content: { backgroundColor: colors.subBoxBg, flex: 1, gap: spacing.xs, padding: spacing.sm },
  transportContent: { alignItems: 'center', flex: 1, flexDirection: 'row', gap: spacing.sm, justifyContent: 'space-between', paddingVertical: spacing.xs },
  transportTime: { color: colors.text, flex: 1, fontFamily: fonts.body, fontSize: typography.body, lineHeight: 22 },
  routeAction: { flexShrink: 0 },
  time: { color: colors.pink, fontFamily: fonts.number, fontSize: typography.caption },
  titleRow: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  title: { color: colors.text, fontFamily: fonts.body, fontSize: typography.cardTitle, fontWeight: '700' },
  description: { color: colors.textMuted, fontFamily: fonts.body, fontSize: typography.caption, lineHeight: 20 },
  alert: { color: colors.orange, fontFamily: fonts.body, fontSize: typography.body, lineHeight: 22 },
});
