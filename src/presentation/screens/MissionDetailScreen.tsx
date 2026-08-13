import { StyleSheet, Text, View } from 'react-native';

import type { Mission, MissionResult } from '../../domain/gameplay';
import { AppButton } from '../components/AppButton';
import { ScreenLayout } from '../components/ScreenLayout';

interface MissionDetailScreenProps {
  mission: Mission;
  onBack: () => void;
  onComplete: (demoResult?: MissionResult) => void;
}

export function MissionDetailScreen({
  mission,
  onBack,
  onComplete,
}: MissionDetailScreenProps) {
  return (
    <ScreenLayout>
      <Text style={styles.eyebrow}>MISSION DETAIL</Text>
      <Text style={styles.title}>{mission.title}</Text>
      <View style={styles.card}>
        <Text style={styles.description}>在生日來臨前安排好一場晚餐。</Text>
        <Text style={styles.reward}>完成獎勵：EXP +{mission.rewardExp}</Text>
      </View>
      <View style={styles.fill} />
      <AppButton label="完成任務" onPress={onComplete} />
      {__DEV__ && (
        <View style={styles.demoControls}>
          <Text style={styles.demoLabel}>Development demo</Text>
          <AppButton label="Demo: Late" onPress={() => onComplete('late')} secondary />
          <AppButton label="Demo: Fail" onPress={() => onComplete('fail')} secondary />
        </View>
      )}
      <AppButton label="回任務列表" onPress={onBack} secondary />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  eyebrow: { color: '#C6B8D8', fontSize: 13, fontWeight: '800', letterSpacing: 2 },
  title: { color: '#F7F2FA', fontSize: 30, fontWeight: '800' },
  card: { backgroundColor: '#2B2437', borderRadius: 20, gap: 12, padding: 20 },
  description: { color: '#E6DCEA', fontSize: 16, lineHeight: 24 },
  reward: { color: '#F6BE73', fontSize: 16, fontWeight: '800' },
  fill: { flex: 1 },
  demoControls: { gap: 8 },
  demoLabel: { color: '#A99AB7', fontSize: 13, fontWeight: '700' },
});
