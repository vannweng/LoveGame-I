exports.missionTemplates = {
  'birthday-dinner': {
    id: 'birthday-dinner',
    eventType: 'birthday',
    missionType: 'date_dinner',
    trigger: { eventOffsetDays: -5, reminderOffsetDays: 1, successDays: 5 },
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
};
