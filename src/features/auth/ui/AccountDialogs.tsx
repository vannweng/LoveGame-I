import { StyleSheet, Text } from 'react-native';

import { getCopy } from '@/content';
import type { RelationshipMode } from '@/features/relationship/domain';
import { AppButton } from '@/shared/ui/AppButton';
import { Dialog } from '@/shared/ui/Dialog';
import { colors, fonts, typography } from '@/shared/theme/tokens';

export type AccountInfo = 'announcements' | 'membership' | 'tutorial';

export function AccountInfoDialog({ info, relationshipMode, onClose }: {
  info: AccountInfo; relationshipMode: RelationshipMode; onClose: () => void;
}) {
  const content = {
    tutorial: { title: getCopy('PROFILE_TUTORIAL_TITLE'),
      copy: getCopy(relationshipMode === 'single' ? 'PROFILE_TUTORIAL_SINGLE_COPY' : 'PROFILE_TUTORIAL_COPY') },
    membership: { title: getCopy('PROFILE_MEMBERSHIP_TITLE'), copy: getCopy('PROFILE_MEMBERSHIP_COPY') },
    announcements: { title: getCopy('PROFILE_ANNOUNCEMENTS_TITLE'), copy: getCopy('PROFILE_ANNOUNCEMENTS_COPY') },
  }[info];
  return (
    <Dialog onClose={onClose} title={content.title} visible>
      <Text style={styles.copy}>{content.copy}</Text>
      <AppButton label={getCopy('PROFILE_DISMISS')} onPress={onClose} />
    </Dialog>
  );
}

export function ResetDataDialog({ busy, error, onCancel, onConfirm }: {
  busy: boolean; error: string; onCancel: () => void; onConfirm: () => void;
}) {
  return (
    <Dialog onClose={busy ? () => undefined : onCancel} closeDisabled={busy}
      title={getCopy('PROFILE_RESET_TITLE')} tone="danger" visible>
      <Text style={styles.copy}>{getCopy('PROFILE_RESET_COPY')}</Text>
      {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
      <AppButton disabled={busy} label={getCopy('PROFILE_RESET_CANCEL')} onPress={onCancel} secondary />
      <AppButton disabled={busy} label={busy ? getCopy('PROFILE_RESET_BUSY') : getCopy('PROFILE_RESET_ACTION')}
        onPress={onConfirm} tone="danger" />
    </Dialog>
  );
}

const styles = StyleSheet.create({
  copy: { color: colors.text, fontFamily: fonts.body, fontSize: typography.body, lineHeight: 26 },
  error: { color: colors.danger, fontFamily: fonts.body, fontSize: typography.caption, lineHeight: 23 },
});
