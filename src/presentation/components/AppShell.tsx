import type { PropsWithChildren } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

import type { GameState } from '../../domain/gameplay';
import { colors } from '../theme/tokens';
import { AppHeader } from './AppHeader';
import { BottomNavigation, type BottomTab } from './BottomNavigation';

interface AppShellProps extends PropsWithChildren {
  activeTab: BottomTab;
  gameState: GameState;
  title: string;
  onSelectTab: (tab: BottomTab) => void;
  onOptions?: () => void;
}

export function AppShell({ activeTab, children, gameState, title, onSelectTab, onOptions }: AppShellProps) {
  return <SafeAreaView style={styles.safe}><AppHeader title={title} gameState={gameState} onOptions={onOptions} /><View style={styles.content}>{children}</View><BottomNavigation activeTab={activeTab} onSelect={onSelectTab} /></SafeAreaView>;
}

const styles = StyleSheet.create({ safe: { backgroundColor: colors.background, flex: 1 }, content: { flex: 1 } });
