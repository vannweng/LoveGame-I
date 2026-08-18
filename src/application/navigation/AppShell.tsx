import { useMemo, useState, type PropsWithChildren } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { DevScenarioPicker } from '@/application/dev/DevScenarioPicker';
import type { FeatureFlags } from '@/application/config/featureFlags';
import type { DevScenarioConfiguration, DevelopmentScenario } from '@/application/dev/developmentScenario';
import { getCopy } from '@/content';
import { UserProfilePage } from '@/features/auth/ui/UserProfilePage';
import { colors, fonts, radius, spacing, typography } from '@/shared/theme/tokens';
import { AppHeader } from './AppHeader';
import { BottomNavigation, type BottomTab } from './BottomNavigation';
import { SosGuidePage } from '@/shared/ui/SosGuidePage';
import { ExpoClipboardService } from '@/infrastructure/clipboard';

interface AppShellProps extends PropsWithChildren {
  activeTab: BottomTab;
  flags: FeatureFlags;
  onSignOut: () => void;
  onSelectTab: (tab: BottomTab) => void;
  onSelectDevelopmentScenario?: (scenario: DevelopmentScenario) => void;
  onResetDevelopmentToday?: () => void;
  onConfigureDevelopment?: (config: DevScenarioConfiguration) => void;
  partnerName: string;
  relationshipDays: number;
  userName: string;
}

export function AppShell({ activeTab, children, flags, onSelectTab, onSelectDevelopmentScenario, onResetDevelopmentToday, onConfigureDevelopment, onSignOut, partnerName, relationshipDays, userName }: AppShellProps) {
  const [devVisible, setDevVisible] = useState(false);
  const [fullPage, setFullPage] = useState<'profile' | 'sos' | null>(null);
  const clipboardService = useMemo(() => new ExpoClipboardService(), []);
  if (fullPage === 'sos') return <SafeAreaView style={styles.safe}><SosGuidePage clipboardService={clipboardService} onClose={() => setFullPage(null)} /></SafeAreaView>;
  if (fullPage === 'profile') return <SafeAreaView style={styles.safe}><UserProfilePage onClose={() => setFullPage(null)} onSignOut={onSignOut} partnerName={partnerName} relationshipDays={relationshipDays} userName={userName} /></SafeAreaView>;
  return <SafeAreaView style={styles.safe}><AppHeader onProfile={() => setFullPage('profile')} onSos={() => setFullPage('sos')} /><View style={styles.content}>{children}</View>{onSelectDevelopmentScenario ? <Pressable onPress={() => setDevVisible(true)} style={styles.devButton}><Text style={styles.devLabel}>{getCopy('DEV_MENU_LABEL')}</Text></Pressable> : null}<BottomNavigation activeTab={activeTab} flags={flags} onSelect={onSelectTab} />{onSelectDevelopmentScenario && onResetDevelopmentToday && onConfigureDevelopment ? <DevScenarioPicker visible={devVisible} onClose={() => setDevVisible(false)} onConfigure={onConfigureDevelopment} onResetToday={onResetDevelopmentToday} onSelect={onSelectDevelopmentScenario} /> : null}</SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { backgroundColor: colors.pageBg, flex: 1, minWidth: 0 }, content: { flex: 1, minWidth: 0, width: '100%' },
  devButton: { alignSelf: 'flex-end', borderColor: colors.violet, borderRadius: radius.xs, borderWidth: 1, marginRight: spacing.sm, marginTop: spacing.xs, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
  devLabel: { color: colors.violet, fontFamily: fonts.number, fontSize: typography.micro },
});
