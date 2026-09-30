import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { getCopy } from '@/content';
import type { CrushCandidate, OnboardingState, RelationshipMode, RelationshipProfile, TutorialReward } from '@/features/relationship/domain';
import { AppButton, PageLayout, PixelCard } from '@/shared/ui';
import { colors, fonts, spacing, typography } from '@/shared/theme/tokens';
import { OnboardingImportantDateStep } from './OnboardingImportantDateStep';
import { OnboardingCrushStep } from './OnboardingCrushStep';

interface OnboardingViewProps {
  state: OnboardingState;
  onChooseRelationshipMode: (mode: RelationshipMode) => void;
  onStartCrushSetup: () => void;
  onStartSinglePractice: () => void;
  onSaveCrushes: (candidates: CrushCandidate[], activeId: CrushCandidate['id']) => void;
  onBack: () => void;
  onSavePartnerName: (name: string) => void;
  onAdvance: () => void;
  onSaveImportantDate: (profile: RelationshipProfile) => void;
  onFinish: () => void;
}

export function OnboardingView(props: OnboardingViewProps) {
  if (props.state.status === 'identity') return <IdentityStep onChoose={props.onChooseRelationshipMode} />;
  if (props.state.status === 'singleIntro') return <SingleIntroStep onBack={props.onBack} onCrushes={props.onStartCrushSetup} onPractice={props.onStartSinglePractice} />;
  if (props.state.status === 'crushes') return <OnboardingCrushStep candidates={props.state.crushCandidates} activeId={props.state.activeCrushId} onBack={props.onBack} onSave={props.onSaveCrushes} />;
  if (props.state.status === 'partnerName') return <PartnerNameStep initialName={props.state.profile?.partnerNickname ?? ''} onBack={props.onBack} onSave={props.onSavePartnerName} />;
  if (props.state.status === 'partnerReward') return <PartnerRewardStep onAdvance={props.onAdvance} onBack={props.onBack} />;
  if (props.state.status === 'tutorial') return <OnboardingImportantDateStep mode={props.state.relationshipMode ?? 'single'} profile={props.state.profile} onBack={props.onBack} onSave={props.onSaveImportantDate} />;
  return <RewardStep reward={props.state.tutorialReward} onFinish={props.onFinish} />;
}

function IdentityStep({ onChoose }: { onChoose: (mode: RelationshipMode) => void }) {
  return <PageLayout><View style={styles.step}><Text style={styles.eyebrow}>{getCopy('ONBOARDING_NEW_PLAYER')}</Text><PixelCard accentColor={colors.accent} subtitle={getCopy('ONBOARDING_TUTORIAL_SUBTITLE')} title={getCopy('ONBOARDING_IDENTITY_TITLE')}><Text style={styles.copy}>{getCopy('ONBOARDING_IDENTITY_COPY')}</Text></PixelCard></View><AppButton label={getCopy('ONBOARDING_IDENTITY_PARTNERED')} onPress={() => onChoose('partnered')} /><AppButton label={getCopy('ONBOARDING_IDENTITY_SINGLE')} onPress={() => onChoose('single')} secondary /></PageLayout>;
}

function SingleIntroStep({ onBack, onCrushes, onPractice }: { onBack: () => void; onCrushes: () => void; onPractice: () => void }) {
  return <PageLayout><View style={styles.step}><Text style={styles.eyebrow}>{getCopy('ONBOARDING_SINGLE_TAG')}</Text><PixelCard accentColor={colors.pink} subtitle={getCopy('ONBOARDING_SINGLE_SUBTITLE')} title={getCopy('ONBOARDING_SINGLE_TITLE')}><Text style={styles.copy}>{getCopy('ONBOARDING_SINGLE_COPY')}</Text><Text style={styles.warning}>{getCopy('ONBOARDING_SINGLE_WARNING')}</Text></PixelCard></View><AppButton label={getCopy('ONBOARDING_SINGLE_HAS_CRUSH')} onPress={onCrushes} /><AppButton label={getCopy('ONBOARDING_SINGLE_PRACTICE')} onPress={onPractice} secondary /><AppButton label={getCopy('ONBOARDING_BACK')} onPress={onBack} secondary /></PageLayout>;
}

function PartnerNameStep({ initialName, onBack, onSave }: { initialName: string; onBack: () => void; onSave: (name: string) => void }) {
  const [name, setName] = useState(initialName);
  return <PageLayout><Text style={styles.eyebrow}>{getCopy('ONBOARDING_NEW_SAVE')}</Text><Text style={styles.title}>{getCopy('ONBOARDING_PARTNER_NAME_TITLE')}</Text><Text style={styles.copy}>{getCopy('ONBOARDING_PARTNER_NAME_COPY')}</Text><TextInput autoFocus maxLength={24} onChangeText={setName} placeholder={getCopy('ONBOARDING_PARTNER_PLACEHOLDER')} placeholderTextColor={colors.textMuted} style={styles.input} value={name} /><View style={styles.fill} /><AppButton disabled={!name.trim()} label={getCopy('ONBOARDING_PARTNER_NAME_ACTION')} onPress={() => onSave(name.trim())} /><AppButton label={getCopy('ONBOARDING_BACK')} onPress={onBack} secondary /></PageLayout>;
}

function PartnerRewardStep({ onAdvance, onBack }: { onAdvance: () => void; onBack: () => void }) {
  return <Step title={getCopy('ONBOARDING_PARTNER_REWARD_TITLE')} copy={getCopy('ONBOARDING_PARTNER_REWARD_COPY')} label={getCopy('ONBOARDING_PARTNER_REWARD_ACTION')} onBack={onBack} onPress={onAdvance} />;
}

function RewardStep({ reward, onFinish }: { reward: TutorialReward | null; onFinish: () => void }) {
  const copy = reward ? getCopy('REWARD_TUTORIAL_SUMMARY', { exp: reward.reward.expDelta, combo: reward.reward.comboDelta, rank: reward.reward.rankDelta }) : getCopy('REWARD_TUTORIAL_DEFAULT');
  return <Step title={getCopy('ONBOARDING_REWARD_TITLE')} copy={copy} label={getCopy('ONBOARDING_REWARD_ACTION')} onPress={onFinish} />;
}

function Step({ title, copy, label, onBack, onPress }: { title: string; copy: string; label: string; onBack?: () => void; onPress: () => void }) {
  return <PageLayout><View style={styles.step}><Text style={styles.eyebrow}>{getCopy('ONBOARDING_NEW_PLAYER')}</Text><PixelCard accentColor={colors.accent} subtitle={getCopy('ONBOARDING_TUTORIAL_SUBTITLE')} title={title}><Text style={styles.copy}>{copy}</Text></PixelCard></View><AppButton label={label} onPress={onPress} />{onBack ? <AppButton label={getCopy('ONBOARDING_BACK')} onPress={onBack} secondary /> : null}</PageLayout>;
}

const styles = StyleSheet.create({
  eyebrow: { color: colors.accent, fontFamily: fonts.number, fontSize: typography.micro, letterSpacing: 1 },
  fill: { flex: 1 },
  input: { backgroundColor: colors.cardBg, borderColor: colors.border, borderRadius: 4, borderWidth: 1, color: colors.text, fontFamily: fonts.body, fontSize: typography.caption, padding: spacing.md },
  step: { flex: 1, gap: spacing.md, justifyContent: 'center' },
  title: { color: colors.text, fontFamily: fonts.body, fontSize: typography.hero, fontWeight: '700' },
  copy: { color: colors.textMuted, fontFamily: fonts.body, fontSize: typography.body, lineHeight: 24 },
  warning: { color: colors.pink, fontFamily: fonts.body, fontSize: typography.caption, lineHeight: 22 },
});
