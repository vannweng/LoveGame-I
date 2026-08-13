import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { ScreenLayout } from '../components/ScreenLayout';

export function AuthLoadingScreen() {
  return (
    <ScreenLayout>
      <View style={styles.content}>
        <ActivityIndicator color="#F06A6A" size="large" />
        <Text style={styles.label}>正在確認登入狀態…</Text>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: { alignItems: 'center', flex: 1, gap: 16, justifyContent: 'center' },
  label: { color: '#F7F2FA', fontSize: 17, fontWeight: '700' },
});
