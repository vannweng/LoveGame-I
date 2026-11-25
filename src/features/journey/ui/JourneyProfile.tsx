import { ImportantDatesEditor } from '@/features/relationship/ui/ImportantDatesEditor';
import { RelationshipInfoEditor } from '@/features/relationship/ui/RelationshipInfoEditor';
import { PreferencesEditor } from '@/features/relationship/ui/PreferencesEditor';
import { RelationshipProfileView } from '@/features/relationship/ui/RelationshipProfileView';
import type { RelationshipMode, RelationshipProfile } from '@/features/relationship/domain';

export function JourneyProfile({ page, profile, relationshipMode, userName, onPage, onSave }: {
  page: string; profile: RelationshipProfile; relationshipMode: RelationshipMode; userName: string; onPage: (page: string) => void; onSave: (profile: RelationshipProfile) => void;
}) {
  const props = { profile, onCancel: () => onPage('profile'), onSave };
  if (page === 'profile-dates') return <ImportantDatesEditor {...props} />;
  if (page === 'profile-basic') return <RelationshipInfoEditor {...props} relationshipMode={relationshipMode} userName={userName} />;
  if (page === 'profile-preferences') return <PreferencesEditor {...props} />;
  return <RelationshipProfileView profile={profile} relationshipMode={relationshipMode} userName={userName} onOpenEditor={(editor) => onPage(`profile-${editor}`)} />;
}
