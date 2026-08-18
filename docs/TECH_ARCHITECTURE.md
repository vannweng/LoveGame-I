# 戀愛生存 App｜Technical Architecture

> 本文件整理技術棧、責任邊界與工程規則。它描述目前 MVP 與目標架構；Roadmap 中的外部服務不代表已獲准接入。

## 現況與技術方向

- React Native + Expo + TypeScript，Android-first，同時保留 Web 預覽能力。
- 目前入口為 `App.tsx`，由自有 Route state 與 App Shell 組裝畫面；尚未安裝 Expo Router。
- Firebase SDK 已存在；正式資料方向為 Firebase Authentication、Cloud Firestore 與 Cloud Functions。
- 通知方向為 `expo-notifications`、Expo Push Service／FCM。
- 目前 Local repositories 支援 prototype；正式資料切換必須在 composition root 完成。
- Google 原生登入、推播、SecureStore、deep link 與正式 Android 行為需由 Development／Internal Build 驗證，不能只以 Web 或 Expo Go 驗收。

`docs/architecture.md` 中的 Expo Router、Zustand 等項目屬目標架構；在依賴尚未導入前，不應在本文把它們描述成已完成現況。

## 依賴方向

```text
UI / View
    ↓
Application use cases
    ↓
Domain / Game rules（pure TypeScript）
    ↓
Repository / Service contracts
    ↓
Local、Firebase 與 external-service adapters
```

### UI

- 只負責顯示、互動、loading、empty、error 與 success state。
- 不計算 EXP、Combo、Rank、Mission Result、收藏或 GG。
- 不直接存取 Firebase、repository、通知、分享、Analytics 或其他外部服務。
- 不以顯示文案或 Rank 名稱判斷商業規則。

### Application

- 編排 use case、資料流與 transaction boundary。
- 透過 contracts 讀寫資料或呼叫服務。
- 不依賴 React Native UI。
- `App.tsx` 只作 composition root 與導航組裝，不承載 feature 規則。

### Domain / Game

- 使用純 TypeScript 與純函式處理規則。
- 不 import React、React Native、Expo、Firebase 或 UI。
- Mission Result、EXP、Combo、Rank、Reward、Collection unlock、GG／Rebirth 必須集中處理並可單元測試。
- Revival 的 Rank、Combo 與必填誓言規則放在 versioned Content Config；UI 只能蒐集誓言與呈現結果。

### Infrastructure

- 實作 repository 及 Authentication、Notifications、Analytics、Sharing、Storage 等 service adapters。
- 外部供應商替換只能影響 composition root 與 adapter，不應改 View 或 Domain。

## 專案結構

```text
App.tsx                         # composition root / navigation assembly

src/
  application/
    config/                     # feature flags
    navigation/                 # App shell、header、bottom tabs
    providers/                  # app-wide providers / bootstrap
    dev/                        # __DEV__ scenario 與 seed data

  features/
    auth/
    home/
    missions/
    activities/
    dailyGameplay/
    relationship/
    collection/
    actions/
      ui/
      application/
      domain/
      data/

  game/
    progression/
    rewards/
    rank/
    combo/

  content/
    missionTemplates.ts
    gameRules.ts
    dailyActivities.ts
    copy/

  shared/
    analytics/
    hooks/
    theme/
    types/
    ui/
    utils/

  infrastructure/
    analytics/
    auth/
    clipboard/
    firebase/
    notifications/
    sharing/
    storage/

functions/src/                  # Firebase Cloud Functions
firebase/                       # Firestore rules / indexes
tests/domain/                   # game/domain unit tests
```

功能內部優先以 `ui`、`application`、`domain`、`data` 分責；不為了形式一次重構既有功能，只有需求涉及時才做最小拆分。Source files 應維持在 150–200 行內，超過前先拆責任；文件不受此限制。

## Game Engine 與 Content 分離

核心 Gameplay Engine 可分為：

```text
Mission Engine
Game State / Progression
Reward Engine
Collection Engine
```

可調整內容必須 data-driven：

- Mission reward、penalty、觸發與 deadline
- Rank definition 與門檻
- Collection definition 與 unlock condition
- 顯示文案與 asset key

數值與文案不可散落在 Screen。已生成任務應保存 template、importance、時間與 ruleset version 快照。

## State 與 Source of Truth

Current EXP、Rank、Combo、Current Run 等重要狀態只能有一個可信來源。不要讓 Screen local state、hook、context、local storage 與 Firebase 各自維護不同版本。

- 本機短暫 UI state 可以留在 component 或 UI store。
- 遠端實體由 repository query／subscription 取得。
- 正式 Progression 與 Mission Resolution 由 server transaction 權威寫入。
- DEV scenario 只可在 `__DEV__` 注入，不得改寫正式玩家存檔或 Domain 規則。

## Repository 與 Server Authority

所有資料存取必須經 repository abstraction。正式 client 不可直接寫入 EXP、Combo、Rank、resolution、unlock、GG／Rebirth 或 notification jobs。

Mission resolution 應在單一 Firestore transaction 中：

```text
驗證任務尚未結算
→ 依 server time 與規則快照計算結果
→ 寫入 resolution
→ 更新 mission
→ 更新 progression
→ 建立 collection unlock
→ 更新 GG / revival state
```

以 occurrence key 防止重複生成，以 idempotency key 防止重複結算與重複獎勵。Domain 若需與 Cloud Functions 共用，等實際需要時再抽成 workspace package，不提前增加 monorepo 複雜度。

## 日期、時區與通知

- 日曆事件依存檔時區解析；裝置時間不具有正式結算權。
- Server time 是 Success／Late／Fail 的真相。
- 年度事件、閏日與重複生成須由 Event Engine 統一處理。
- Push 只是提醒，不是遊戲資料真相；點擊後必須重新讀取並驗證 Mission。
- 核心流程不能依賴 notification permission 或 background JavaScript 才能成立。
- 通知只傳最低限度資料，不放入個資或完整任務內容。

## External Services 邊界

附件列出的長期技術方向包含 Google Login、Cloud Database、Push Notification、Calendar、Location 與 Analytics。其共同規則是：

- 一律透過 service adapter，不從 Screen 直接呼叫。
- Calendar、Location、AI／推薦、餐廳或地圖整合屬額外產品範圍，未經明確核准不得接入。
- Couple Mode 或 Personalized Mission 不應使 MVP schema 過度複雜。

## Analytics

建議漏斗：

```text
Mission Created
→ Mission Viewed
→ Mission Started
→ Mission Completed
→ Reward Viewed
```

事件可包括 `onboarding_complete`、`home_view`、`mission_create`、`mission_view`、`mission_start`、`mission_complete`、`mission_late`、`mission_fail`、`reward_view`、`rank_up`、`rank_down`、`collection_unlock`、`gg`、`rebirth`、`relationship_event_create`。

- 事件名稱與參數使用共用白名單，經 Analytics Service 上報。
- 不傳姓名、email、完整日期、任務內容、備註或精確位置。
- `app_open` 若由 Firebase Analytics 自動收集，client 不得重複送出。

## Copy Architecture 與 Naming

所有使用者可見文案放在 `src/content/copy/<feature>.ts`，以穩定 key 和 placeholder 取得，方便調整語氣、A/B test、Localization 及 Personality variants。

Domain 命名使用：

```text
player
partner
relationship
mission
rank
run
reward
collection
```

避免將 `boyfriend`／`girlfriend` 寫死在核心資料模型。特定世界觀文案留在 Content Layer。

## Feature Flags

可分階段釋出的入口由 `src/application/config/featureFlags.ts` 控制。Feature flag 不是授權機制：尚未核准的功能即使已有旗標，也不能因預設值或 Roadmap 描述而自行開發或公開。

## Security

- 傳輸使用 TLS；敏感本機資料使用 Keychain／Keystore 支援的安全儲存。
- Secret 不進 Git、App bundle、log、Analytics 或 `EXPO_PUBLIC_*`。
- Firestore Rules 驗證 authenticated owner，並以 Emulator tests 防止跨使用者讀寫。
- 正式敏感資料寫入前需有 schema version、migration、刪除／匯出及隱私設計。
- Web 不持久化敏感資料；若要長期登入或離線資料，先完成 Web threat model。

## 測試與變更原則

- 每一個新增或修改的遊戲規則都要有 unit tests。
- 完成工作後，執行現有的 lint、typecheck 與 tests。
- 不修改 `.expo`、`.vscode` 或 `node_modules`。
- 不破壞既有功能，不重構無關檔案。
- 發現架構會阻礙需求時，先說明問題與最小調整方案，不自行大規模重構。

## 文件優先順序

```text
最新明確 Task
> AGENTS.md 與已核准規格
> 現有程式實際 Architecture
> GAME_DESIGN_CONTEXT.md / PRODUCT_CONTEXT.md 的長期方向
```

本文件若與程式現況不同，應清楚標示「現況」與「目標」，不能假裝尚未導入的套件或服務已存在。
