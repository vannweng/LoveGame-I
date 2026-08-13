import { useState, type PropsWithChildren } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { DevScenarioPicker } from '@/application/dev/DevScenarioPicker';
import type { FeatureFlags } from '@/application/config/featureFlags';
import type { DevelopmentScenario } from '@/application/dev/developmentScenario';
import { getCopy } from '@/content';
import { UserProfileSheet } from '@/features/auth/ui/UserProfileSheet';
import { colors, fonts, radius, spacing, typography } from '@/shared/theme/tokens';
import { AppHeader } from './AppHeader';
import { BottomNavigation, type BottomTab } from './BottomNavigation';
import { SosGuideModal } from '@/shared/ui/SosGuideModal';

interface AppShellProps extends PropsWithChildren {
  activeTab: BottomTab;
  flags: FeatureFlags;
  onSignOut: () => void;
  onSelectTab: (tab: BottomTab) => void;
  onSelectDevelopmentScenario?: (scenario: DevelopmentScenario) => void;
  partnerName: string;
  relationshipDays: number;
  userName: string;
}

export function AppShell({ activeTab, children, flags, onSelectTab, onSelectDevelopmentScenario, onSignOut, partnerName, relationshipDays, userName }: AppShellProps) {
  const [sosVisible, setSosVisible] = useState(false);
  const [devVisible, setDevVisible] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);
  return <SafeAreaView style={styles.safe}><AppHeader onProfile={() => setProfileVisible(true)} onSos={() => setSosVisible(true)} /><View style={styles.content}>{children}</View>{onSelectDevelopmentScenario ? <Pressable onPress={() => setDevVisible(true)} style={styles.devButton}><Text style={styles.devLabel}>{getCopy('DEV_MENU_LABEL')}</Text></Pressable> : null}<BottomNavigation activeTab={activeTab} flags={flags} onSelect={onSelectTab} /><SosGuideModal visible={sosVisible} onClose={() => setSosVisible(false)} /><UserProfileSheet onClose={() => setProfileVisible(false)} onSignOut={onSignOut} partnerName={partnerName} relationshipDays={relationshipDays} userName={userName} visible={profileVisible} />{onSelectDevelopmentScenario ? <DevScenarioPicker visible={devVisible} onClose={() => setDevVisible(false)} onSelect={onSelectDevelopmentScenario} /> : null}</SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { backgroundColor: colors.pageBg, flex: 1 }, content: { flex: 1 },
  devButton: { alignSelf: 'flex-end', borderColor: colors.violet, borderRadius: radius.xs, borderWidth: 1, marginRight: spacing.sm, marginTop: spacing.xs, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
  devLabel: { color: colors.violet, fontFamily: fonts.number, fontSize: typography.micro },
});
