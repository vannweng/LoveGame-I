# Architecture

## 技術選型

- React Native + Expo + TypeScript
- Android first
- Expo Router
- Firebase Authentication + native Google Sign-In
- Cloud Firestore
- Firebase Cloud Functions
- `expo-notifications` + Expo Push Service / FCM
- Zustand：只管理 client UI/session state

Google native sign-in 與 push notification 需要原生設定，因此日常開發採 EAS Development Build，不以 Expo Go 作為完整測試環境。

## 分層與依賴方向

```text
Presentation (Expo Router, screens, components)
                 ↓
Application (use cases)
                 ↓
Domain (pure TypeScript rules)
                 ↑
Repository interfaces
                 ↑
Data / Firebase / external-service adapters
```

`domain` 不得 import React、Expo、Firebase、Zustand 或 UI 元件。UI 只能發送意圖，例如 `completeMission(missionId)` 或 `abandonMission(missionId)`；結果由 Mission Resolver 判定。

## 資安與加密規則

- 只要處理身分驗證 token、使用者／伴侶個資、推播 token、私密憑證或其他敏感資料，傳輸必須使用 TLS（HTTPS），靜態儲存必須使用平台或服務提供的加密機制。
- 用戶端的登入憑證與其他敏感本機資料必須存於 iOS Keychain／Android Keystore 支援的安全儲存區；不得存入 `AsyncStorage`、log、分析事件或通知內容。
- 後端私密憑證必須存於受管 secret store；不得寫入原始碼、`EXPO_PUBLIC_*` 環境變數、App bundle 或 Git。
- Firestore 的存取控制由 Firebase Authentication 與 Firestore Security Rules 執行；若資料敏感度需要防範後端或資料庫管理者讀取，必須在寫入前採用經審查的端對端／欄位加密設計，且金鑰不得與密文存放在同一位置。
- 推播只傳遞最低限度資訊；不得放入個資、token、完整任務內容或其他敏感資料，避免其顯示於裝置鎖定畫面。
- Web 版不持久化敏感資料；若日後要提供長期登入或離線資料，必須先完成獨立的 Web 威脅模型與加密設計。

## 建議專案結構

```text
app/                              # Expo Router routes
  (public)/sign-in.tsx
  (onboarding)/
  (app)/
    index.tsx                     # Home
    missions/index.tsx
    missions/[missionId].tsx
    collection.tsx
    profile.tsx

src/
  domain/
    event/                        # Event Engine
    mission/                      # Mission Engine + Resolver
    progression/                  # Reward / Rank / Combo
    collection/
    game-state/
    shared/
  application/                    # Auth, saves, missions, notifications use cases
  data/                           # repository interfaces and Firestore adapters
  services/                       # Google auth, notifications, clock adapters
  presentation/                   # components, hooks, Zustand stores, theme
  config/

functions/src/                    # Firebase Cloud Functions
  event-generation/
  mission-resolution/
  notification-dispatch/
  shared-domain/

firebase/                         # Firestore rules/indexes
tests/domain/
tests/integration/
tests/e2e/
docs/
```

初期可先將 domain 放在 `src/domain`。當 Cloud Functions 必須共用相同規則時，再抽成 workspace package，避免過早引入 monorepo 複雜度。

## Domain responsibilities

### Event Engine

- 根據 Important Date 和模板計算 occurrence。
- 計算任務事件日、Success 截止與 Fail 截止。
- 處理年度重複、時區、閏日與 duplicate prevention。

### Mission Engine

- 把 event occurrence 轉成任務實例。
- 固定寫入 template、importance、時間與 ruleset version 快照。

### Mission Resolver

- 使用 server time 判定 Success、Late、Fail。
- 驗證任務未結算。
- 對玩家完成、主動放棄、系統逾期採同一權威流程。
- 以 idempotency key 與 transaction 避免重複結算。

### Reward / Progression

- 計算 EXP、Combo、Rank delta。
- Clamp Rank。
- 判定 title、collection 與 GG / revival。

### Collection / Game State

- 依 resolution 產生一次性的 unlock。
- 維護 active、warning、critical、gg 等遊戲狀態。

## Client state

Zustand 用於：auth bootstrap、active save ID、onboarding draft、畫面 filter 與短暫 UI state。

Firestore query hooks / subscriptions 用於：LoveSave、Missions、Progression、Unlocks、notification preferences。不要把整個遠端資料鏡像到單一 global store。

## Navigation

```text
bootstrap
├─ unauthenticated → (public)/sign-in
├─ authenticated without active save → (onboarding)
└─ authenticated with active save → (app) bottom tabs
   ├─ 首頁
   ├─ 任務 → 任務詳情 stack screen
   ├─ 圖鑑
   └─ 檔案
```

GG 是 protected app 內的一種 game state，不是另一個登入流程。通知 deep link 格式為 `lovegame://missions/{missionId}`；開啟後須重新驗證任務擁有權與目前狀態。

## Notification flow

```text
Important Date / Mission generated
      ↓
notificationJobs created by server
      ↓
scheduled Cloud Function dispatches due jobs
      ↓
Expo Push Service → FCM → Android device
```

- Push 是提醒，不是遊戲資料真相。
- 點擊通知後重新讀取 Mission。
- 保存多裝置 token、token status、dedupe key 與 delivery errors。
- Permission 被拒絕時，核心遊戲流程仍可運作。
- 不依賴 background JavaScript 結算任務；Fail 由 server-side scheduled function 負責。

## Server authority and transaction

Client 不可直接寫入 EXP、Combo、Rank、resolution、unlock 或 notification jobs。Mission resolve 必須在單一 Firestore transaction 中完成：

```text
verify unresolved mission
→ calculate outcome with server time
→ create resolution
→ update mission
→ update progression
→ create collection unlocks
→ create/update GG or revival state
```
