import { StyleSheet, Text, View } from 'react-native';

import type { GameState } from '../../domain/gameplay';
import { AppButton } from '../components/AppButton';
import { ScreenLayout } from '../components/ScreenLayout';

interface HomeScreenProps {
  gameState: GameState;
  birthdayDaysRemaining: number;
  onOpenMissions: () => void;
}

export function HomeScreen({
  gameState,
  birthdayDaysRemaining,
  onOpenMissions,
}: HomeScreenProps) {
  const isSafe = gameState.status === 'safe';

  return (
    <ScreenLayout>
      <Text style={styles.eyebrow}>LOVEGAME I</Text>
      <View style={[styles.statusCard, isSafe ? styles.safe : styles.danger]}>
        <Text style={styles.status}>{isSafe ? '安全狀態' : '危險狀態'}</Text>
        <Text style={styles.detail}>生日剩 {birthdayDaysRemaining} 天</Text>
      </View>
      <View style={styles.stats}>
        <Text style={styles.stat}>EXP {gameState.exp}</Text>
        <Text style={styles.stat}>Combo {gameState.combo}</Text>
        <Text style={styles.stat}>Rank {gameState.rankScore}</Text>
      </View>
      <View style={styles.fill} />
      <AppButton label="查看任務" onPress={onOpenMissions} />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  eyebrow: { color: '#C6B8D8', fontSize: 13, fontWeight: '800', letterSpacing: 2 },
  statusCard: { borderRadius: 20, gap: 8, padding: 24 },
  danger: { backgroundColor: '#4B2131' },
  safe: { backgroundColor: '#173E38' },
  status: { color: '#FFFFFF', fontSize: 28, fontWeight: '800' },
  detail: { color: '#E6DCEA', fontSize: 16 },
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  stat: { color: '#F7F2FA', fontSize: 16, fontWeight: '700' },
  fill: { flex: 1 },
});
