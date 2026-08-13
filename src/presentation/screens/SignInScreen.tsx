import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../components/AppButton';
import { ScreenLayout } from '../components/ScreenLayout';

interface SignInScreenProps {
  error: string | null;
  onSignIn: () => void;
}

export function SignInScreen({ error, onSignIn }: SignInScreenProps) {
  return (
    <ScreenLayout>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>LOVEGAME I</Text>
        <Text style={styles.title}>登入後開始守護關係。</Text>
        <Text style={styles.description}>使用 Google 帳號安全保存你的戀愛生存進度。</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
      <AppButton label={error ? '重試 Google 登入' : '使用 Google 登入'} onPress={onSignIn} />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, gap: 14, justifyContent: 'center' },
  eyebrow: { color: '#C6B8D8', fontSize: 13, fontWeight: '800', letterSpacing: 2 },
  title: { color: '#F7F2FA', fontSize: 32, fontWeight: '900', lineHeight: 42 },
  description: { color: '#D6C9E0', fontSize: 16, lineHeight: 24 },
  error: { color: '#FF9E9E', fontSize: 15, fontWeight: '700', lineHeight: 22 },
});
