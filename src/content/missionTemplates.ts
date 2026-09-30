import type { MissionTemplate } from '@/features/missions/domain';

export const missionTemplates: Record<string, MissionTemplate> = {
  'birthday-dinner': {
    id: 'birthday-dinner',
    eventType: 'important_date',
    missionType: 'date_dinner',
    trigger: { eventOffsetDays: -29, reminderOffsetDays: 1, successDays: 9 },
    titleKey: 'MISSION_BIRTHDAY_DINNER_TITLE',
    descriptionKey: 'MISSION_BIRTHDAY_DINNER_DESCRIPTION',
    reward: {
      success: { expDelta: 20, comboDelta: 1 },
      late: { expDelta: 5, comboDelta: 0 },
      fail: { expDelta: 0, comboDelta: 0 },
    },
    rankImpact: { appliesTo: 'survival', success: 1, late: 0, fail: -1 },
    successCopyKey: 'MISSION_BIRTHDAY_DINNER_SUCCESS',
    lateCopyKey: 'MISSION_BIRTHDAY_DINNER_LATE',
    failCopyKey: 'MISSION_BIRTHDAY_DINNER_FAIL',
  },
  'birthday-gift': {
    id: 'birthday-gift', eventType: 'important_date', missionType: 'gift_order',
    trigger: { eventOffsetDays: -15, reminderOffsetDays: 1, successDays: 5 },
    titleKey: 'MISSION_BIRTHDAY_GIFT_TITLE', descriptionKey: 'MISSION_BIRTHDAY_GIFT_DESCRIPTION',
    reward: importantDateReward(), rankImpact: survivalRankImpact(),
    successCopyKey: 'MISSION_BIRTHDAY_GIFT_SUCCESS', lateCopyKey: 'MISSION_BIRTHDAY_GIFT_LATE', failCopyKey: 'MISSION_BIRTHDAY_GIFT_FAIL',
  },
  'birthday-cinema': {
    id: 'birthday-cinema', eventType: 'important_date', missionType: 'cinema_booking',
    trigger: { eventOffsetDays: -9, reminderOffsetDays: 1, successDays: 3 },
    titleKey: 'MISSION_BIRTHDAY_CINEMA_TITLE', descriptionKey: 'MISSION_BIRTHDAY_CINEMA_DESCRIPTION',
    reward: importantDateReward(), rankImpact: survivalRankImpact(),
    successCopyKey: 'MISSION_BIRTHDAY_CINEMA_SUCCESS', lateCopyKey: 'MISSION_BIRTHDAY_CINEMA_LATE', failCopyKey: 'MISSION_BIRTHDAY_CINEMA_FAIL',
  },
  'birthday-card': {
    id: 'birthday-card', eventType: 'important_date', missionType: 'card_writing',
    trigger: { eventOffsetDays: -5, reminderOffsetDays: 1, successDays: 2 },
    titleKey: 'MISSION_BIRTHDAY_CARD_TITLE', descriptionKey: 'MISSION_BIRTHDAY_CARD_DESCRIPTION',
    reward: importantDateReward(), rankImpact: survivalRankImpact(),
    successCopyKey: 'MISSION_BIRTHDAY_CARD_SUCCESS', lateCopyKey: 'MISSION_BIRTHDAY_CARD_LATE', failCopyKey: 'MISSION_BIRTHDAY_CARD_FAIL',
  },
  'birthday-itinerary': {
    id: 'birthday-itinerary', eventType: 'important_date', missionType: 'itinerary_confirmation',
    trigger: { eventOffsetDays: -3, reminderOffsetDays: 1, successDays: 1 },
    titleKey: 'MISSION_BIRTHDAY_ITINERARY_TITLE', descriptionKey: 'MISSION_BIRTHDAY_ITINERARY_DESCRIPTION',
    reward: importantDateReward(), rankImpact: survivalRankImpact(),
    successCopyKey: 'MISSION_BIRTHDAY_ITINERARY_SUCCESS', lateCopyKey: 'MISSION_BIRTHDAY_ITINERARY_LATE', failCopyKey: 'MISSION_BIRTHDAY_ITINERARY_FAIL',
  },
  'tutorial-first-reminder': {
    id: 'tutorial-first-reminder',
    eventType: 'tutorial',
    missionType: 'first_reminder',
    trigger: { eventOffsetDays: 0, reminderOffsetDays: 0, successDays: 1 },
    titleKey: 'MISSION_TUTORIAL_REMINDER_TITLE',
    descriptionKey: 'MISSION_TUTORIAL_REMINDER_DESCRIPTION',
    reward: {
      success: { expDelta: 20, comboDelta: 1 },
      late: { expDelta: 5, comboDelta: 0 },
      fail: { expDelta: 0, comboDelta: 0 },
    },
    rankImpact: { appliesTo: 'survival', success: 1, late: 0, fail: -1 },
    successCopyKey: 'MISSION_TUTORIAL_REMINDER_SUCCESS',
    lateCopyKey: 'MISSION_TUTORIAL_REMINDER_LATE',
    failCopyKey: 'MISSION_TUTORIAL_REMINDER_FAIL',
  },
};

function importantDateReward() {
  return {
    success: { expDelta: 20, comboDelta: 1 }, late: { expDelta: 5, comboDelta: 0 }, fail: { expDelta: 0, comboDelta: 0 },
  };
}

function survivalRankImpact() {
  return { appliesTo: 'survival' as const, success: 1, late: 0, fail: -1 };
}
