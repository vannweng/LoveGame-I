import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { getCopy, relationshipProfileOptions } from '@/content';
import { withRelationshipProfileDefaults, type RelationshipPreferences, type RelationshipProfile } from '@/features/relationship/domain';
import { borderWidth, colors, fonts, radius, spacing, typography } from '@/shared/theme/tokens';
import { RelationshipEditorLayout } from './RelationshipEditorLayout';

interface PreferencesEditorProps {
  profile: RelationshipProfile | null;
  onCancel: () => void;
  onSave: (profile: RelationshipProfile) => void;
}

export function PreferencesEditor({ onCancel, onSave, profile }: PreferencesEditorProps) {
  const baseProfile = withRelationshipProfileDefaults(profile);
  const [preferences, setPreferences] = useState(baseProfile.preferences);
  const setStyle = (style: RelationshipPreferences['style']) => setPreferences({ ...preferences, style });
  const toggle = (category: keyof Pick<RelationshipPreferences, 'preferenceTags' | 'dietaryPreferences' | 'landmines'>, value: string) => {
    const selected = preferences[category];
    setPreferences({ ...preferences, [category]: selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value] });
  };

  return <RelationshipEditorLayout onCancel={onCancel} onSave={() => onSave({ ...baseProfile, preferences })} subtitle={getCopy('RELATIONSHIP_EDITOR_PREFERENCES_SUBTITLE')} title={getCopy('RELATIONSHIP_QUICK_PREFERENCES')}>
    <Text style={styles.label}>{getCopy('RELATIONSHIP_PREFERENCE_STYLE')}</Text>
    <View style={styles.styleRow}><StyleOption active={preferences.style === 'romantic'} label={getCopy('RELATIONSHIP_STYLE_ROMANTIC')} onPress={() => setStyle('romantic')} /><StyleOption active={preferences.style === 'practical'} label={getCopy('RELATIONSHIP_STYLE_PRACTICAL')} onPress={() => setStyle('practical')} /></View>
    <TagGroup category="preferenceTags" selected={preferences.preferenceTags} onToggle={toggle} />
    <TagGroup category="dietaryPreferences" selected={preferences.dietaryPreferences} onToggle={toggle} />
    <TagGroup category="landmines" selected={preferences.landmines} onToggle={toggle} danger />
  </RelationshipEditorLayout>;
}

function TagGroup({ category, danger = false, onToggle, selected }: {
  category: keyof Pick<RelationshipPreferences, 'preferenceTags' | 'dietaryPreferences' | 'landmines'>;
  danger?: boolean;
  selected: string[];
  onToggle: (category: keyof Pick<RelationshipPreferences, 'preferenceTags' | 'dietaryPreferences' | 'landmines'>, value: string) => void;
}) {
  const options = relationshipProfileOptions[category];
  return <View style={styles.group}><Text style={[styles.label, danger && styles.dangerLabel]}>{getCopy(relationshipProfileOptions.categoryCopy[category])}</Text><View style={styles.tags}>{options.map((option) => <Tag active={selected.includes(option)} danger={danger} key={option} label={option} onPress={() => onToggle(category, option)} />)}</View></View>;
}

function StyleOption({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={[styles.styleOption, active && styles.activeStyle]}><Text style={[styles.styleText, active && styles.activeStyleText]}>{`[${label}]`}</Text></Pressable>;
}

function Tag({ active, danger, label, onPress }: { active: boolean; danger: boolean; label: string; onPress: () => void }) {
  const color = danger ? colors.danger : colors.accent;
  return <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: active }} onPress={onPress} style={[styles.tag, { borderColor: active ? color : colors.border }, active && { backgroundColor: color }]}><Text style={[styles.tagText, { color: active ? colors.ink : colors.textMuted }]}>{label}</Text></Pressable>;
}

const styles = StyleSheet.create({
  label: { color: colors.text, fontFamily: fonts.body, fontSize: typography.cardTitle, fontWeight: '700' },
  dangerLabel: { color: colors.danger },
  styleRow: { flexDirection: 'row', gap: spacing.sm },
  styleOption: { alignItems: 'center', borderColor: colors.border, borderRadius: radius.xs, borderWidth, flex: 1, minHeight: 44, justifyContent: 'center', padding: spacing.sm },
  activeStyle: { backgroundColor: colors.accent, borderColor: colors.accent },
  styleText: { color: colors.text, fontFamily: fonts.number, fontSize: typography.caption },
  activeStyleText: { color: colors.ink },
  group: { gap: spacing.sm },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  tag: { borderRadius: radius.xs, borderWidth: 1, paddingHorizontal: spacing.sm, paddingVertical: spacing.sm },
  tagText: { fontFamily: fonts.body, fontSize: typography.caption },
});
