import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import type { OnboardingState, RelationshipProfile, TutorialReward } from '../../domain/onboarding';
import { AppButton } from '../components/AppButton';
import { ScreenLayout } from '../components/ScreenLayout';

interface OnboardingFlowProps {
  state: OnboardingState;
  onAdvance: () => void;
  onSaveProfile: (profile: RelationshipProfile) => void;
  onCompleteTutorial: () => void;
  onFinish: () => void;
}

export function OnboardingFlow(props: OnboardingFlowProps) {
  if (props.state.status === 'intro') return <IntroStep onAdvance={props.onAdvance} />;
  if (props.state.status === 'profile') return <ProfileStep onSave={props.onSaveProfile} />;
  if (props.state.status === 'notificationExplained') return <NotificationStep onAdvance={props.onAdvance} />;
  if (props.state.status === 'identity') return <IdentityStep onAdvance={props.onAdvance} />;
  if (props.state.status === 'tutorial') return <TutorialStep onComplete={props.onCompleteTutorial} />;
  return <RewardStep reward={props.state.tutorialReward} onFinish={props.onFinish} />;
}

function IntroStep({ onAdvance }: { onAdvance: () => void }) {
  return <Step title="戀愛也需要生存策略。" copy="重要日子會化為任務；及時完成，守住你的關係 Rank。" label="開始建立存檔" onPress={onAdvance} />;
}

function NotificationStep({ onAdvance }: { onAdvance: () => void }) {
  return <Step title="提醒是你的生存雷達。" copy="之後我們會在重要任務接近截止前提醒你。你可隨時在系統設定中調整權限。" label="了解，繼續" onPress={onAdvance} />;
}

function IdentityStep({ onAdvance }: { onAdvance: () => void }) {
  return <Step title="初始身份：普通人" copy="從 Rank 0 出發。每次成功完成生存任務，都會讓你的身份成長。" label="接受第一個教學任務" onPress={onAdvance} />;
}

function TutorialStep({ onComplete }: { onComplete: () => void }) {
  return <Step title="教學任務：設定第一個戀愛提醒" copy="你已理解任務與提醒的核心。完成它，領取你的第一份生存獎勵。" label="完成教學任務" onPress={onComplete} />;
}

function RewardStep({ reward, onFinish }: { reward: TutorialReward | null; onFinish: () => void }) {
  const copy = reward ? `EXP +${reward.reward.expDelta} · Combo +${reward.reward.comboDelta} · Rank +${reward.reward.rankDelta}` : '你的第一份生存獎勵已領取。';
  return <Step title="獎勵已發放" copy={copy} label="前往首頁" onPress={onFinish} />;
}

function ProfileStep({ onSave }: { onSave: (profile: RelationshipProfile) => void }) {
  const [partnerNickname, setPartnerNickname] = useState('');
  const [relationshipStartDate, setRelationshipStartDate] = useState('');
  const [birthday, setBirthday] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [customDate, setCustomDate] = useState('');
  const [customImportantDates, setCustomImportantDates] = useState<RelationshipProfile['customImportantDates']>([]);
  const canContinue = partnerNickname.trim().length > 0 && relationshipStartDate.trim().length > 0;
  const addCustomDate = () => {
    if (!customTitle.trim() || !customDate.trim()) return;
    setCustomImportantDates([...customImportantDates, { title: customTitle.trim(), date: customDate.trim() }]);
    setCustomTitle('');
    setCustomDate('');
  };
  const save = () => onSave({
    partnerNickname: partnerNickname.trim(),
    relationshipStartDate: relationshipStartDate.trim(),
    birthday: birthday.trim() || undefined,
    customImportantDates: customTitle.trim() && customDate.trim()
      ? [...customImportantDates, { title: customTitle.trim(), date: customDate.trim() }]
      : customImportantDates,
  });

  return (
    <ScreenLayout>
      <Text style={styles.title}>建立戀愛存檔</Text>
      <Text style={styles.copy}>必填：伴侶稱呼與關係開始日。生日與自訂重要日可選填。</Text>
      <TextInput placeholder="伴侶稱呼" placeholderTextColor="#A99AB7" style={styles.input} value={partnerNickname} onChangeText={setPartnerNickname} />
      <TextInput placeholder="關係開始日 YYYY-MM-DD" placeholderTextColor="#A99AB7" style={styles.input} value={relationshipStartDate} onChangeText={setRelationshipStartDate} />
      <TextInput placeholder="生日 YYYY-MM-DD（選填）" placeholderTextColor="#A99AB7" style={styles.input} value={birthday} onChangeText={setBirthday} />
      <TextInput placeholder="自訂重要日名稱（選填）" placeholderTextColor="#A99AB7" style={styles.input} value={customTitle} onChangeText={setCustomTitle} />
      <TextInput placeholder="自訂重要日 YYYY-MM-DD（選填）" placeholderTextColor="#A99AB7" style={styles.input} value={customDate} onChangeText={setCustomDate} />
      <AppButton label="加入自訂重要日" onPress={addCustomDate} secondary />
      {customImportantDates.map((item) => <Text key={`${item.title}-${item.date}`} style={styles.savedDate}>已加入：{item.title} · {item.date}</Text>)}
      <View style={styles.fill} />
      <AppButton label="儲存並繼續" onPress={save} disabled={!canContinue} />
    </ScreenLayout>
  );
}

function Step({ title, copy, label, onPress }: { title: string; copy: string; label: string; onPress: () => void }) {
  return <ScreenLayout><View style={styles.step}><Text style={styles.eyebrow}>ONBOARDING</Text><Text style={styles.title}>{title}</Text><Text style={styles.copy}>{copy}</Text></View><AppButton label={label} onPress={onPress} /></ScreenLayout>;
}

const styles = StyleSheet.create({
  eyebrow: { color: '#C6B8D8', fontSize: 13, fontWeight: '800', letterSpacing: 2 },
  step: { flex: 1, gap: 16, justifyContent: 'center' },
  title: { color: '#F7F2FA', fontSize: 30, fontWeight: '900', lineHeight: 40 },
  copy: { color: '#D6C9E0', fontSize: 16, lineHeight: 24 },
  input: { backgroundColor: '#2B2437', borderRadius: 12, color: '#F7F2FA', fontSize: 16, padding: 14 },
  savedDate: { color: '#A5E7D9', fontSize: 14, fontWeight: '700' },
  fill: { flex: 1 },
});
