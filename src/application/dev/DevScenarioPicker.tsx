import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { getCopy } from '@/content';
import { colors, fonts, radius, spacing, typography } from '@/shared/theme/tokens';
import { defaultDevScenarioConfiguration, developmentScenarios, type DevScenarioConfiguration, type DevelopmentScenario } from './developmentScenario';

interface DevScenarioPickerProps {
  onResetToday: () => void;
  onSelect: (scenario: DevelopmentScenario) => void;
  onClose: () => void;
  onConfigure: (config: DevScenarioConfiguration) => void;
  visible: boolean;
}

export function DevScenarioPicker({ onClose, onConfigure, onResetToday, onSelect, visible }: DevScenarioPickerProps) {
  const [config, setConfig] = useState<DevScenarioConfiguration>(defaultDevScenarioConfiguration);
  const update = <K extends keyof DevScenarioConfiguration>(key: K, value: DevScenarioConfiguration[K]) => setConfig((current) => ({ ...current, [key]: value }));
  return <Modal animationType="fade" onRequestClose={onClose} transparent visible={visible}><View style={styles.backdrop}><View style={styles.panel}><Pressable accessibilityLabel={getCopy('DEV_SCENARIO_CLOSE')} onPress={onClose} style={styles.close}><Text style={styles.closeText}>×</Text></Pressable><Text style={styles.title}>{getCopy('DEV_SCENARIO_TITLE')}</Text><Text style={styles.copy}>分類可同時套用；每一列僅能選一項。</Text><ScrollView contentContainerStyle={styles.actions}><ConfigRow label="日期" options={[['weekday', '平日'], ['saturday', '週六'], ['sunday', '週日'], ['day100', '關係 Day 100']]} value={config.date} onSelect={(value) => update('date', value as DevScenarioConfiguration['date'])} /><ConfigRow label="重要日" options={[['none', '無'], ['birthday-d30', '生日 D-30'], ['birthday-d5', '生日 D-5'], ['birthday-d1', '生日 D-1']]} value={config.important} onSelect={(value) => update('important', value as DevScenarioConfiguration['important'])} /><ConfigRow label="每日卡" options={[['initial', '初始'], ['done1', 'DONE 1'], ['done2', 'DONE 2'], ['done3', 'DONE 3']]} value={config.daily} onSelect={(value) => update('daily', value as DevScenarioConfiguration['daily'])} /><ConfigRow label="週末卡" options={[['initial', '初始'], ['done1', 'DONE 1'], ['done2', 'DONE 2'], ['done3', 'DONE 3']]} value={config.weekly} onSelect={(value) => update('weekly', value as DevScenarioConfiguration['weekly'])} /><Pressable onPress={() => { onConfigure(config); onClose(); }} style={styles.apply}><Text style={styles.actionText}>套用組合</Text></Pressable><Pressable onPress={() => { onResetToday(); onClose(); }} style={styles.reset}><Text style={styles.resetText}>{getCopy('DEV_RESET_TODAY')}</Text></Pressable><Text style={styles.title}>既有快捷情境</Text>{developmentScenarios.map((scenario) => <Pressable key={scenario.id} onPress={() => { onSelect(scenario.id); onClose(); }} style={styles.action}><Text style={styles.actionText}>{getCopy(scenario.labelKey)}</Text></Pressable>)}</ScrollView></View></View></Modal>;
}

function ConfigRow({ label, onSelect, options, value }: { label: string; onSelect: (value: string) => void; options: string[][]; value: string }) {
  return <View style={styles.group}><Text style={styles.groupLabel}>{label}</Text><View style={styles.options}>{options.map(([id, text]) => <Pressable key={id} onPress={() => onSelect(id)} style={[styles.option, value === id && styles.optionSelected]}><Text style={styles.actionText}>{text}</Text></Pressable>)}</View></View>;
}

const styles = StyleSheet.create({
  backdrop: { alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.72)', flex: 1, justifyContent: 'center', padding: spacing.lg },
  panel: { backgroundColor: colors.pageBg, borderColor: colors.violet, borderRadius: radius.sm, borderWidth: 2, gap: spacing.sm, maxHeight: '80%', padding: spacing.lg, width: '100%' },
  close: { alignItems: 'center', alignSelf: 'flex-end', justifyContent: 'center', minHeight: 32, minWidth: 32 }, closeText: { color: colors.text, fontSize: 28, lineHeight: 28 },
  title: { color: colors.violet, fontFamily: fonts.number, fontSize: typography.caption }, copy: { color: colors.textMuted, fontFamily: fonts.body, fontSize: typography.caption, lineHeight: 22 },
  actions: { gap: spacing.sm, paddingTop: spacing.sm }, action: { borderColor: colors.violet, borderRadius: radius.xs, borderWidth: 1, padding: spacing.md }, actionText: { color: colors.text, fontFamily: fonts.number, fontSize: typography.caption },
  reset: { borderColor: colors.danger, borderRadius: radius.xs, borderWidth: 1, padding: spacing.md }, resetText: { color: colors.danger, fontFamily: fonts.number, fontSize: typography.caption },
  apply: { backgroundColor: colors.violet, borderRadius: radius.xs, padding: spacing.md }, group: { gap: spacing.xs }, groupLabel: { color: colors.gold, fontFamily: fonts.number, fontSize: typography.caption }, options: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs }, option: { borderColor: colors.border, borderWidth: 1, padding: spacing.xs }, optionSelected: { borderColor: colors.accent, backgroundColor: colors.subBoxBg },
});
