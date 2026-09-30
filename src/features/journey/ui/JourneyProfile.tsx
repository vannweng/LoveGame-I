import { ImportantDatesEditor } from '@/features/relationship/ui/ImportantDatesEditor';
import { RelationshipInfoEditor } from '@/features/relationship/ui/RelationshipInfoEditor';
import { PreferencesEditor } from '@/features/relationship/ui/PreferencesEditor';
import { RelationshipProfileView } from '@/features/relationship/ui/RelationshipProfileView';
import type { RelationshipProfile } from '@/features/relationship/domain';

export function JourneyProfile({ page, profile, userName, onPage, onSave }: {
  page: string; profile: RelationshipProfile; userName: string; onPage: (page: string) => void; onSave: (profile: RelationshipProfile) => void;
}) {
  const props = { profile, onCancel: () => onPage('profile'), onSave };
  if (page === 'profile-dates') return <ImportantDatesEditor {...props} />;
  if (page === 'profile-basic') return <RelationshipInfoEditor {...props} userName={userName} />;
  if (page === 'profile-preferences') return <PreferencesEditor {...props} />;
  return <RelationshipProfileView profile={profile} userName={userName} onOpenEditor={(editor) => onPage(`profile-${editor}`)} />;
}
