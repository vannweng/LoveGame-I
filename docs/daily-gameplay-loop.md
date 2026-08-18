# Daily Gameplay Loop

目前採用 **B：狀態機 + Content Config**。UI 只能呈現目前狀態並送出使用者意圖；任務判定、獎勵與遊戲狀態更新維持在 Application / Domain / server transaction。

## 流程

```text
Home
├─ crisis → offered → accepted → action → reporting → resolved → nextHook → safe
└─ safe → free action → nextHook → safe
```

`resolved` 只會在既有 `completeMission` 完成 Domain 結算後寫入。正式版則由 `resolveMission` Callable Function transaction 成為唯一權威；client 不可自行寫入 result、EXP、Combo、Rank、collection 或 notification job。

## 資料契約

`DailyGameplayState`：

```ts
{
  mode: 'crisis' | 'safe',
  stage: 'safe' | 'offered' | 'accepted' | 'action' | 'reporting' | 'resolved' | 'nextHook',
  nextHookId: string,
  safeActionId: string,
}
```

內容放在 `src/content/dailyGameplayConfig.ts`：

- `safeAction`：安全狀態時可做的自由行動。
- `nextHooks`：結算後的下一個期待與目標。

新增事件類型、自由行動或目標時，優先新增 Content Config 與 copy key；不可將規則或文案散落在 View。

## Application 與 Repository

`DailyGameplayService` 只負責載入與 dispatch 狀態轉換；它依賴 `DailyGameplayRepository` interface。

目前開發模式使用 `LocalDailyGameplayRepository`。正式 Firestore adapter 啟用時，必須：

1. 將 state 寫在使用者 default save 下的 owner-only 文件。
2. 以 schema version 儲存，避免日後 lifecycle 欄位 migration 困難。
3. 由 Cloud Function 驗證 `resolve`，不可相信 client 傳入的完成結果。

## Analytics

新增事件：`daily_loop_view`、`crisis_detected`、`safe_state_view`、`mission_accept`、`mission_defer`、`mission_report`、`next_hook_view`。

事件僅傳 mode、stage、hook ID 與既有 mission 的安全分類參數；不得傳送姓名、完整日期、任務文案、備註或位置。

## 開發驗收

Development Scenario 可直接切換：Safe、Mission Accepted、Mission Reporting、Free Action、Next Hook，以及既有 Success / Late / Fail / GG / Collection Unlock。

Domain tests 必須覆蓋危機分支、安全分支與非法狀態轉換。每次新增 lifecycle transition 都要先新增測試。
