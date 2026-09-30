exports.missionTemplates = {
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
  'birthday-gift': importantDateTemplate('birthday-gift', 'gift_order', -15, 5, 'GIFT'),
  'birthday-cinema': importantDateTemplate('birthday-cinema', 'cinema_booking', -9, 3, 'CINEMA'),
  'birthday-card': importantDateTemplate('birthday-card', 'card_writing', -5, 2, 'CARD'),
  'birthday-itinerary': importantDateTemplate('birthday-itinerary', 'itinerary_confirmation', -3, 1, 'ITINERARY'),
};

function importantDateTemplate(id, missionType, eventOffsetDays, successDays, copyName) {
  return {
    id, eventType: 'important_date', missionType,
    trigger: { eventOffsetDays, reminderOffsetDays: 1, successDays },
    titleKey: `MISSION_BIRTHDAY_${copyName}_TITLE`, descriptionKey: `MISSION_BIRTHDAY_${copyName}_DESCRIPTION`,
    reward: { success: { expDelta: 20, comboDelta: 1 }, late: { expDelta: 5, comboDelta: 0 }, fail: { expDelta: 0, comboDelta: 0 } },
    rankImpact: { appliesTo: 'survival', success: 1, late: 0, fail: -1 },
    successCopyKey: `MISSION_BIRTHDAY_${copyName}_SUCCESS`, lateCopyKey: `MISSION_BIRTHDAY_${copyName}_LATE`, failCopyKey: `MISSION_BIRTHDAY_${copyName}_FAIL`,
  };
}
