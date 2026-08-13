import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import type { OnboardingState, RelationshipProfile, TutorialReward } from '@/features/relationship/domain';
import { getCopy } from '@/content';
import { AppButton } from '@/shared/ui/AppButton';
import { PixelCard } from '@/shared/ui/PixelCard';
import { PixelTag } from '@/shared/ui/PixelTag';
import { PageLayout } from '@/shared/ui/PageLayout';
import { borderWidth, colors, fonts, radius, spacing, typography } from '@/shared/theme/tokens';
import { formatLocalDateInput } from '@/shared/utils/formatLocalDateInput';

interface OnboardingViewProps {
  state: OnboardingState;
  onAdvance: () => void;
  onSaveProfile: (profile: RelationshipProfile) => void;
  onCompleteTutorial: () => void;
  onFinish: () => void;
}

export function OnboardingView(props: OnboardingViewProps) {
  if (props.state.status === 'intro') return <IntroStep onAdvance={props.onAdvance} />;
  if (props.state.status === 'profile') return <ProfileStep onSave={props.onSaveProfile} />;
  if (props.state.status === 'notificationExplained') return <NotificationStep onAdvance={props.onAdvance} />;
  if (props.state.status === 'identity') return <IdentityStep onAdvance={props.onAdvance} />;
  if (props.state.status === 'tutorial') return <TutorialStep onComplete={props.onCompleteTutorial} />;
  return <RewardStep reward={props.state.tutorialReward} onFinish={props.onFinish} />;
}

function IntroStep({ onAdvance }: { onAdvance: () => void }) {
  return <Step title={getCopy('ONBOARDING_INTRO_TITLE')} copy={getCopy('ONBOARDING_INTRO_COPY')} label={getCopy('ONBOARDING_INTRO_ACTION')} onPress={onAdvance} />;
}

function NotificationStep({ onAdvance }: { onAdvance: () => void }) {
  return <Step title={getCopy('ONBOARDING_NOTIFICATION_TITLE')} copy={getCopy('ONBOARDING_NOTIFICATION_COPY')} label={getCopy('ONBOARDING_NOTIFICATION_ACTION')} onPress={onAdvance} />;
}

function IdentityStep({ onAdvance }: { onAdvance: () => void }) {
  return <Step title={getCopy('ONBOARDING_IDENTITY_TITLE')} copy={getCopy('ONBOARDING_IDENTITY_COPY')} label={getCopy('ONBOARDING_IDENTITY_ACTION')} onPress={onAdvance} />;
}

function TutorialStep({ onComplete }: { onComplete: () => void }) {
  return <Step title={getCopy('ONBOARDING_TUTORIAL_TITLE')} copy={getCopy('ONBOARDING_TUTORIAL_COPY')} label={getCopy('ONBOARDING_TUTORIAL_ACTION')} onPress={onComplete} />;
}

function RewardStep({ reward, onFinish }: { reward: TutorialReward | null; onFinish: () => void }) {
  const copy = reward ? getCopy('REWARD_TUTORIAL_SUMMARY', { exp: reward.reward.expDelta, combo: reward.reward.comboDelta, rank: reward.reward.rankDelta }) : getCopy('REWARD_TUTORIAL_DEFAULT');
  return <Step title={getCopy('ONBOARDING_REWARD_TITLE')} copy={copy} label={getCopy('ONBOARDING_REWARD_ACTION')} onPress={onFinish} />;
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
    <PageLayout>
      <Text style={styles.eyebrow}>{getCopy('ONBOARDING_NEW_SAVE')}</Text>
      <Text style={styles.title}>{getCopy('ONBOARDING_PROFILE_TITLE')}</Text>
      <Text style={styles.copy}>{getCopy('ONBOARDING_PROFILE_COPY')}</Text>
      <TextInput placeholder={getCopy('ONBOARDING_PARTNER_PLACEHOLDER')} placeholderTextColor={colors.textMuted} style={styles.input} value={partnerNickname} onChangeText={setPartnerNickname} />
      <TextInput inputMode="numeric" keyboardType="numeric" maxLength={10} placeholder={getCopy('ONBOARDING_START_DATE_PLACEHOLDER')} placeholderTextColor={colors.textMuted} style={styles.input} value={relationshipStartDate} onChangeText={(value) => setRelationshipStartDate(formatLocalDateInput(value))} />
      <TextInput inputMode="numeric" keyboardType="numeric" maxLength={10} placeholder={getCopy('ONBOARDING_BIRTHDAY_PLACEHOLDER')} placeholderTextColor={colors.textMuted} style={styles.input} value={birthday} onChangeText={(value) => setBirthday(formatLocalDateInput(value))} />
      <TextInput placeholder={getCopy('ONBOARDING_CUSTOM_TITLE_PLACEHOLDER')} placeholderTextColor={colors.textMuted} style={styles.input} value={customTitle} onChangeText={setCustomTitle} />
      <TextInput inputMode="numeric" keyboardType="numeric" maxLength={10} placeholder={getCopy('ONBOARDING_CUSTOM_DATE_PLACEHOLDER')} placeholderTextColor={colors.textMuted} style={styles.input} value={customDate} onChangeText={(value) => setCustomDate(formatLocalDateInput(value))} />
      <AppButton label={getCopy('ONBOARDING_ADD_DATE')} onPress={addCustomDate} secondary />
      {customImportantDates.map((item) => <PixelTag key={`${item.title}-${item.date}`} color={colors.pink} label={getCopy('ONBOARDING_DATE_TAG', { title: item.title, date: item.date })} size="M" />)}
      <View style={styles.fill} />
      <AppButton label={getCopy('ONBOARDING_SAVE_CONTINUE')} onPress={save} disabled={!canContinue} />
    </PageLayout>
  );
}

function Step({ title, copy, label, onPress }: { title: string; copy: string; label: string; onPress: () => void }) {
  return <PageLayout><View style={styles.step}><Text style={styles.eyebrow}>{getCopy('ONBOARDING_NEW_PLAYER')}</Text><PixelCard accentColor={colors.accent} title={title} subtitle={getCopy('ONBOARDING_TUTORIAL_SUBTITLE')}><Text style={styles.copy}>{copy}</Text></PixelCard></View><AppButton label={label} onPress={onPress} /></PageLayout>;
}

const styles = StyleSheet.create({
  eyebrow: { color: colors.accent, fontFamily: fonts.number, fontSize: typography.micro, letterSpacing: 1 },
  step: { flex: 1, gap: spacing.md, justifyContent: 'center' },
  title: { color: colors.text, fontFamily: fonts.body, fontSize: typography.hero, fontWeight: '700' },
  copy: { color: colors.textMuted, fontFamily: fonts.body, fontSize: typography.body, lineHeight: 24 },
  input: { backgroundColor: colors.cardBg, borderColor: colors.border, borderRadius: radius.xs, borderWidth, color: colors.text, fontFamily: fonts.body, fontSize: typography.caption, padding: spacing.md },
  fill: { flex: 1 },
});
