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

目前 App profile 的 relationship start date 與 birthday 都按 `yearly` 計算下一次 occurrence。自訂重要日的 recurrence 欄位尚未提供設定 UI，因此尚未加入首頁倒數計算。

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

MVP 採 **單一關係存檔**。每一位使用者只使用固定的 `default` save；不提供多關係、封存或切換 save 的 UI。若未來需要多存檔，必須新增 `activeSaveId` 與 migration，不可改變既有 `default` 文件路徑。

```text
/users/{userId}
  createdAt, updatedAt

/users/{userId}/devices/{deviceId}
  expoPushToken, nativePushToken?, platform, appVersion, timezone,
  permissionStatus, enabled, lastSeenAt

/users/{userId}/saves/default
  ownerUserId, timezone, schemaVersion, createdAt, updatedAt

/users/{userId}/saves/default/profile/current
  partnerNickname, relationshipStartDate, birthday?, customImportantDates, updatedAt

/users/{userId}/saves/default/onboarding/state
  status, profile, tutorialReward, updatedAt

/users/{userId}/saves/default/missions/{missionId}
  ...Mission

/users/{userId}/saves/default/resolutions/{resolutionId}
  ...MissionResolution

/users/{userId}/saves/default/state/progression
  ...Progression

/users/{userId}/saves/default/state/collection
  items, graves, updatedAt

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
