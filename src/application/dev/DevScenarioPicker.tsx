import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { getCopy } from '@/content';
import { colors, fonts, radius, spacing, typography } from '@/shared/theme/tokens';
import { developmentScenarios, type DevelopmentScenario } from './developmentScenario';

interface DevScenarioPickerProps {
  onSelect: (scenario: DevelopmentScenario) => void;
  onClose: () => void;
  visible: boolean;
}

export function DevScenarioPicker({ onClose, onSelect, visible }: DevScenarioPickerProps) {
  return <Modal animationType="fade" onRequestClose={onClose} transparent visible={visible}><View style={styles.backdrop}><View style={styles.panel}><Pressable accessibilityLabel={getCopy('DEV_SCENARIO_CLOSE')} onPress={onClose} style={styles.close}><Text style={styles.closeText}>×</Text></Pressable><Text style={styles.title}>{getCopy('DEV_SCENARIO_TITLE')}</Text><Text style={styles.copy}>{getCopy('DEV_SCENARIO_COPY')}</Text><ScrollView contentContainerStyle={styles.actions}>{developmentScenarios.map((scenario) => <Pressable key={scenario.id} onPress={() => { onSelect(scenario.id); onClose(); }} style={styles.action}><Text style={styles.actionText}>{getCopy(scenario.labelKey)}</Text></Pressable>)}</ScrollView></View></View></Modal>;
}

const styles = StyleSheet.create({
  backdrop: { alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.72)', flex: 1, justifyContent: 'center', padding: spacing.lg },
  panel: { backgroundColor: colors.pageBg, borderColor: colors.violet, borderRadius: radius.sm, borderWidth: 2, gap: spacing.sm, maxHeight: '80%', padding: spacing.lg, width: '100%' },
  close: { alignItems: 'center', alignSelf: 'flex-end', justifyContent: 'center', minHeight: 32, minWidth: 32 }, closeText: { color: colors.text, fontSize: 28, lineHeight: 28 },
  title: { color: colors.violet, fontFamily: fonts.number, fontSize: typography.caption }, copy: { color: colors.textMuted, fontFamily: fonts.body, fontSize: typography.caption, lineHeight: 22 },
  actions: { gap: spacing.sm, paddingTop: spacing.sm }, action: { borderColor: colors.violet, borderRadius: radius.xs, borderWidth: 1, padding: spacing.md }, actionText: { color: colors.text, fontFamily: fonts.number, fontSize: typography.caption },
});
