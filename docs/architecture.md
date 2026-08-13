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
UI（View、shared UI components）
                 ↓
Application (use cases)
                 ↓
Domain (pure TypeScript rules)
                 ↓
Repository contracts
                 ↓
Firebase / external-service adapters
```

- UI 只負責顯示資料、接收點擊、呈現 loading 與 error；不得計算遊戲規則、直接存取 repository，或直接呼叫 Firebase／通知等外部服務。
- 每個 View 的非同步資料流程一律經由 `shared/ui/ScreenState` 呈現 `loading`、`empty`、`error`、`success` 四種狀態；feature 內容只能在 `success` 狀態渲染。
- `src/application/` 是 composition root，負責 navigation、providers 與開發用 Scenario；不得命名為 `src/app/`，因 Expo 會將該路徑視為 Expo Router 的保留路由目錄。
- 開發用 Seed Data 與 Scenario 必須位於 `application/dev/`，只可在 `__DEV__` 下注入資料；不得改寫 Domain 規則、正式 repository 或正式玩家存檔。
- 在開發環境可使用匿名 DEV 預覽身份略過第三方登入；此身份僅存在於記憶體，正式版不得顯示或啟用。
- Application 只編排 use case 與 transaction 邊界，透過 repository contract 讀寫資料；不得依賴 React Native UI。
- Domain 只處理純 TypeScript 商業／遊戲規則；不得 import React、Expo、Firebase、Zustand 或 UI 元件。
- Repository contract 定義 feature 所需資料操作；實作放在 infrastructure，由 Firebase、SecureStore、通知或其他外部 service adapter 提供。
- Analytics 事件必須使用 `shared/analytics/AnalyticsEvent.ts` 定義的白名單，並透過 infrastructure adapter 上報；禁止傳送姓名、email、日期名稱或其他個資。開發環境使用 console adapter，Production 可在 composition root 替換為受審查的服務 adapter。
- `app_open` 由 Firebase Analytics 自動收集；不得由 client adapter 手動重複送出。事件表與共用參數規範見 `docs/analytics.md`。
- `App.tsx` 是 composition root，只負責組裝 UI、Application 與 infrastructure 實作，不承載 feature 遊戲規則。
- 所有可調整的遊戲數值、任務模板、解鎖門檻與顯示文案 key 必須存於 versioned Content Config；程式只讀取並套用設定，不得將這些規則散落在 UI、Application 或 Domain 函式中。
- 所有使用者可見文案必須定義於 `src/content/copy/<feature>.ts`，採穩定大寫 key（如 `HOME_NO_IMPORTANT_DATE`）；UI、共用元件與外部通知 adapter 必須透過 `getCopy()` 取得文字。動態值以 `{name}` placeholder 代入，避免在 View 內拼接產品文案。
- 所有可分階段釋出的功能入口必須由 `application/config/featureFlags.ts` 控制；目前旗標預設開啟，Production 可透過 `EXPO_PUBLIC_FEATURE_*` 環境變數關閉尚未核准的入口。

## 資安與加密規則

- 只要處理身分驗證 token、使用者／伴侶個資、推播 token、私密憑證或其他敏感資料，傳輸必須使用 TLS（HTTPS），靜態儲存必須使用平台或服務提供的加密機制。
- 用戶端的登入憑證與其他敏感本機資料必須存於 iOS Keychain／Android Keystore 支援的安全儲存區；不得存入 `AsyncStorage`、log、分析事件或通知內容。
- 後端私密憑證必須存於受管 secret store；不得寫入原始碼、`EXPO_PUBLIC_*` 環境變數、App bundle 或 Git。
- Firestore 的存取控制由 Firebase Authentication 與 Firestore Security Rules 執行；若資料敏感度需要防範後端或資料庫管理者讀取，必須在寫入前採用經審查的端對端／欄位加密設計，且金鑰不得與密文存放在同一位置。
- 推播只傳遞最低限度資訊；不得放入個資、token、完整任務內容或其他敏感資料，避免其顯示於裝置鎖定畫面。
- Web 版不持久化敏感資料；若日後要提供長期登入或離線資料，必須先完成獨立的 Web 威脅模型與加密設計。

## 專案結構（Feature-based）

```text
App.tsx                            # Expo entry；目前組裝 root navigation

src/
  application/
    config/                        # Feature Flags 與 application-level 設定
    navigation/                    # App shell、Header、底部導覽
    providers/                     # App-wide providers 與啟動狀態
    dev/                           # 開發用 Seed Data／Scenario

  features/
    home/ui/
    auth/ui/
    missions/
      ui/
      application/                 # 任務結算、提醒 use cases
      domain/                      # Mission、resolver、提醒規則
      data/                        # repository contracts、mock fixture
    collection/
      ui/
      domain/
    relationship/
      ui/
      application/                 # Onboarding use case
      domain/                      # 關係與 onboarding rules
      data/                        # repository contracts
    actions/
      ui/
      data/

  game/
    progression/                   # Game state updates
    rewards/                       # EXP／Combo／Rank reward
    rank/                          # Rank identity
    combo/                         # 未來獨立 Combo policy 的入口

  content/                         # versioned Content Config
    missionTemplates.ts             # 任務觸發、獎勵、Rank impact、文案 key
    gameRules.ts                    # Rank、解鎖與 progression 數值
    copy/                           # 依功能分割的文案與穩定 key

  shared/
    ui/                            # 可跨 feature 使用的像素 UI 元件
    hooks/
    utils/
    types/
    theme/                         # 設計 token

  infrastructure/
    firebase/                      # Firebase adapters（接入時）
    auth/                          # Google／Firebase Authentication
    notifications/                 # Expo notification adapter
    storage/                       # SecureStore 與 local repository adapter

functions/src/                    # Firebase Cloud Functions（接入時）
firebase/                         # Firestore rules/indexes（接入時）
tests/domain/                     # domain 與 game unit tests
```

當 Cloud Functions 必須共用相同規則時，再將 `features/*/domain` 與 `game/*` 抽成 workspace package，避免過早引入 monorepo 複雜度。

## Domain responsibilities

### Relationship Dashboard Metrics

- 交往天數以關係開始日為第 1 天計算。
- 交往紀念日與生日均以每年重複的日曆日期計算下一次 occurrence；當天倒數為 0。
- 生日已設定時，首頁優先顯示生日倒數；否則顯示交往紀念日倒數。
- 2 月 29 日在非閏年暫定於 2 月 28 日發生；自訂重要日尚未有 recurrence 設定，不能自行假定為年度重複。

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
