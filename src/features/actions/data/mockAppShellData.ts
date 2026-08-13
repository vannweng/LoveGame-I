import { getCopy } from '@/content';

export const mockActionGroups = [
  { title: getCopy('ACTION_DATE'), items: [getCopy('ACTION_DATE_RESTAURANTS'), getCopy('ACTION_DATE_RESERVATION')] },
  { title: getCopy('ACTION_GIFT'), items: [getCopy('ACTION_GIFT_RECOMMENDATIONS'), getCopy('ACTION_GIFT_LOG')] },
  { title: getCopy('ACTION_SCHEDULE'), items: [getCopy('ACTION_SCHEDULE_TODAY'), getCopy('ACTION_SCHEDULE_PLAN')] },
];

export const mockRelationshipSections = [
  { title: getCopy('PROFILE_SECTION_BASIC'), copy: getCopy('PROFILE_SECTION_BASIC_COPY') },
  { title: getCopy('PROFILE_SECTION_PREFERENCES'), copy: getCopy('PROFILE_SECTION_PREFERENCES_COPY') },
  { title: getCopy('PROFILE_SECTION_DATES'), copy: getCopy('PROFILE_SECTION_DATES_COPY') },
];
