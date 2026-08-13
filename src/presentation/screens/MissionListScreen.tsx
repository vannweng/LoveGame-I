import { StyleSheet, Text, View } from 'react-native';

import type { Mission } from '../../domain/gameplay';
import { AppButton } from '../components/AppButton';
import { ScreenLayout } from '../components/ScreenLayout';

interface MissionListScreenProps {
  mission: Mission;
  onBack: () => void;
  onOpenMission: () => void;
}

export function MissionListScreen({
  mission,
  onBack,
  onOpenMission,
}: MissionListScreenProps) {
  return (
    <ScreenLayout>
      <Text style={styles.title}>任務列表</Text>
      <View style={styles.card}>
        <Text style={styles.badge}>主線任務</Text>
        <Text style={styles.missionTitle}>{mission.title}</Text>
        <Text style={styles.meta}>生日生存任務 · Reward EXP +{mission.rewardExp}</Text>
        <AppButton label="查看詳情" onPress={onOpenMission} />
      </View>
      <View style={styles.fill} />
      <AppButton label="回首頁" onPress={onBack} secondary />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  title: { color: '#F7F2FA', fontSize: 30, fontWeight: '800' },
  card: { backgroundColor: '#2B2437', borderRadius: 20, gap: 14, padding: 20 },
  badge: { color: '#F6BE73', fontSize: 13, fontWeight: '800' },
  missionTitle: { color: '#FFFFFF', fontSize: 23, fontWeight: '800' },
  meta: { color: '#D6C9E0', fontSize: 15, lineHeight: 22 },
  fill: { flex: 1 },
});
