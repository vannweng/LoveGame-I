# Firestore Security Rules

Rules 檔案位於 `firebase/firestore.rules`，MVP 使用單一存檔路徑：

```text
/users/{uid}/saves/default/...
```

## Client 權限

| 路徑 | Client 權限 |
| --- | --- |
| `saves/default` | 僅本人可建立／讀取；`ownerUserId`、`schemaVersion` 建立後不可變更 |
| `profile/current` | 僅本人讀取、建立、更新 |
| `onboarding/state` | 僅本人讀取、建立、更新；不得寫入 `tutorialReward` |
| `notificationPreferences/default` | 僅本人讀取、建立、更新 |
| `missions/*` | 僅本人讀取；client 不可寫入 |
| `resolutions/*` | 僅本人讀取；client 不可寫入 |
| `state/progression` | 僅本人讀取；client 不可寫入 |
| `state/collection` | 僅本人讀取；client 不可寫入 |
| `notificationJobs/*` | client 一律禁止 |

Mission、resolution、progression、collection 的寫入由 `resolveMission` Callable Cloud Function／Admin SDK transaction 處理；Admin SDK 不受 Firestore Rules 限制，因此 Cloud Functions 仍需以 IAM、輸入驗證與 transaction 保障安全。

`resolveMission` 只接受已登入使用者的 `missionId`，固定從該使用者的 `/users/{uid}/saves/default` 讀寫，並以 `resolutions/{missionId}` 防止同一任務重複結算。它尚未部署或接入 UI；公開 Beta 前仍必須補 Function Emulator 的成功、逾期、失敗、重送與跨使用者整合測試，並啟用 App Check。

## Emulator 測試

```bash
npm run test:firestore-rules
```

測試使用 `demo-lovegame-i`，只會啟動本機 Firestore Emulator，不會連線到正式 Firebase 資料。

目前 Firebase CLI 版本要求 **JDK 21 以上** 才能啟動 Firestore Emulator。JDK 17 會讓 Emulator 在測試啟動前失敗。開發機需安裝／設定 JDK 21；本次驗證以隔離暫存 JDK 21 執行。
