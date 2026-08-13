import { StyleSheet, Text, View } from 'react-native';

import type { MissionCompletion } from '../../application/completeMission';
import { AppButton } from '../components/AppButton';
import { ScreenLayout } from '../components/ScreenLayout';

interface ResultScreenProps {
  completion: MissionCompletion;
  onReturnHome: () => void;
}

export function ResultScreen({ completion, onReturnHome }: ResultScreenProps) {
  return (
    <ScreenLayout>
      <Text style={styles.eyebrow}>MISSION RESOLVED</Text>
      <Text style={styles.title}>{completion.result.toUpperCase()}</Text>
      <View style={styles.card}>
        <Text style={styles.reward}>EXP +{completion.reward.expDelta}</Text>
        <Text style={styles.reward}>Combo +{completion.reward.comboDelta}</Text>
        <Text style={styles.reward}>Rank {formatDelta(completion.reward.rankDelta)}</Text>
      </View>
      <Text style={styles.copy}>生日晚餐已安排。生存狀態已更新。</Text>
      <View style={styles.fill} />
      <AppButton label="回首頁" onPress={onReturnHome} />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  eyebrow: { color: '#A5E7D9', fontSize: 13, fontWeight: '800', letterSpacing: 2 },
  title: { color: '#A5E7D9', fontSize: 38, fontWeight: '900' },
  card: { backgroundColor: '#173E38', borderRadius: 20, gap: 12, padding: 20 },
  reward: { color: '#FFFFFF', fontSize: 20, fontWeight: '800' },
  copy: { color: '#D6C9E0', fontSize: 16, lineHeight: 24 },
  fill: { flex: 1 },
});

function formatDelta(value: number): string {
  return value >= 0 ? `+${value}` : String(value);
}
