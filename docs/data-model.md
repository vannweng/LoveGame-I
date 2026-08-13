# Data Model and Firestore Schema

## Core domain models

### LoveSave

```text
id
ownerUserId
partnerDisplayName
relationshipStartDate       # LocalDate
timezone                     # e.g. Asia/Taipei
status: active | gg | archived
rulesetVersion: "0.2"
createdAt, updatedAt
```

一位使用者在 MVP 只有一個 active save；資料結構仍允許未來保留舊存檔或建立新存檔。

### ImportantDate

```text
id
saveId
type: relationship_anniversary | marriage_anniversary | birthday | custom
title
dateSpec                     # calendar-date / yearly recurrence semantics
recurrence: yearly | none
importance: survival | normal
importanceSource: template_default | player_override
enabled
nextOccurrenceAt
```

### MissionTemplate

MVP 先做為 versioned domain catalog，而非 Firestore 可編輯內容。

```text
id
title
offsetDays                   # -29, -15, -9, -5, -3
successDays                  # 9, 5, 3, 2, 1
defaultImportance
allowImportanceOverride
rulesetVersion
```

### Mission

```text
id
saveId
sourceImportantDateId
templateId
occurrenceKey                # unique: importantDate + target date + template
eventDate                    # LocalDate
targetDate                   # target Important Date occurrence
opensAt
successUntil
failAt
importance                   # snapshot
lifecycleStatus: scheduled | active | resolved
resolvedAt?
resolutionId?
rulesetVersion
createdAt
```

### MissionResolution

```text
id
missionId
saveId
outcome: success | late | fail
reason: completed_on_time | completed_late | abandoned | expired
resolvedBy: player | system
serverResolvedAt
idempotencyKey
ruleSnapshot
rewardDelta
createdAt
```

### Progression and Revival

```text
Progression
  totalExp
  combo
  rankScore
  currentTitleId?
  gameStatus: active | warning | critical | gg | reviving
  activeRevivalId?
  version

Revival
  id
  triggerResolutionId
  revivalMissionId
  status: available | started | completed
  rankBefore
  rankAfter
  startedAt
  completedAt?
```

## Firestore layout

```text
/users/{userId}
  displayName, email, photoUrl, activeSaveId, createdAt, updatedAt

/users/{userId}/devices/{deviceId}
  expoPushToken, nativePushToken?, platform, appVersion, timezone,
  permissionStatus, enabled, lastSeenAt

/saves/{saveId}
  ownerUserId, partnerDisplayName, relationshipStartDate, timezone,
  status, rulesetVersion, createdAt, updatedAt

/saves/{saveId}/importantDates/{importantDateId}
  ...ImportantDate

/saves/{saveId}/missions/{missionId}
  ...Mission

/saves/{saveId}/resolutions/{resolutionId}
  ...MissionResolution

/saves/{saveId}/state/progression
  ...Progression

/saves/{saveId}/unlocks/{itemId}
  category, unlockedAt, sourceResolutionId?

/saves/{saveId}/revivals/{revivalId}
  ...Revival

/saves/{saveId}/notificationPreferences/default
  enabled, quietHours, reminderOffsets, timezone

/notificationJobs/{jobId}       # Cloud Functions / Admin SDK only
  userId, saveId, missionId, scheduledAt, type, status, attempts,
  dedupeKey, sentAt, deliveryError?
```

## Security boundaries

The client may read its own save data; edit partner information, important dates, preferences, and its device registration.

The client must not directly modify `Progression`, `MissionResolution`, resolved fields on `Mission`, `Unlock`, `Revival`, or `notificationJobs`. These writes are owned by Cloud Functions using the Admin SDK.

Firestore rules must ensure an authenticated user cannot access another user's save, even if an ID is guessed.

## Integrity requirements

- `occurrenceKey` prevents duplicate mission generation.
- `idempotencyKey` prevents double submission and retry rewards.
- Existing Missions keep time, importance, template, and ruleset snapshots.
- Firestore transaction atomically persists resolution, mission status, progression, unlocks, and GG/revival changes.
- All server writes use server timestamps; LocalDate values retain calendar semantics separately from timestamps.
