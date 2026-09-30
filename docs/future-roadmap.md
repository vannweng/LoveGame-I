# 未來開發路線圖

## 最新進度：核心旅程第一版

使用者已確認先做三條投入路線、任務結果與篇章心得。現已接通本機真實日期篇章、選路線、一次性結算、篇章手記收藏與同一重要日下次回顧；行動中心預設隱藏。後端已修正跨日期去重與 normal／GG 規則。

這不代表正式 Firestore composition 或雲端篇章交易完成。剩餘部署、server 篇章保存、Android 驗收與未實作提案，詳見 [核心旅程第一版](core-journey-v1.md)。下方較早期 Phase 狀態應搭配此進度閱讀。

本文件記錄已確認、但尚未實作的後續工作。每完成一項，更新其狀態與驗收結果；未列入本文件的功能不應自行擴充至 MVP。

## 已確認決策

| 項目 | 選擇 | 狀態 |
| --- | --- | --- |
| Repository／資料庫 | 1A：依 feature 建立完整 repository contract，再加入 Local 與 Firestore adapter | 進行中：contracts、Local + Firestore adapters 已完成；等待 3A Rules 後切換 composition |
| `mission_create` Analytics | 2A：於 `MissionGenerationService` 真正建立任務成功後送出 | 已完成：`created === true` 才送安全參數 |
| 正式 Analytics | 3A：Firebase Analytics adapter | 待 Firebase 正式接入 |
| UI primitives | 4A：高頻 MVP 元件組 | 進行中：共用 primitive 已建立，任務、結果、個人中心與 Daily Gameplay Loop 已導入 |

## 正式 MVP 實作選擇與順序

```text
2A → 3A → 4A → 5A → 6B
```

| 步驟 | 已選方案 | 決策 |
| --- | --- | --- |
| 2 | 2A | Feature 分拆 Firestore repositories |
| 3 | 3A | Owner-only Firestore Security Rules + Emulator 自動測試 |
| 4 | 4A | Callable Cloud Function + Firestore transaction 結算任務 |
| 5 | 5A | Cloud Function + Expo Push API 遠端推播（目前受 Spark 限制） |
| 6 | 6B | 先使用 Expo Go 作為日常開發測試 |

> **6B 限制：** Expo Go 可驗證 UI、Domain 規則與一般互動，但不能作為 Google 原生登入、推播、SecureStore 行為、deep link 或正式 Android 簽署的驗收環境。上述原生能力在公開 Beta／上架前仍必須補一次 EAS Development Build 或 Android internal build 驗證。

> **3A 目前狀態：** owner-only Rules 與 Emulator tests 已建立且實跑通過（4 tests）。Firebase CLI 需要 JDK 21 以上；目前已以隔離的 Temurin JDK 21 驗證測試，但此 Mac 尚未完成永久系統安裝（需要管理員密碼）。開發機需持續保有 JDK 21 以便日後執行 `npm run test:firestore-rules`。

> **4A 目前狀態：** 已建立 `createMission` 與 `resolveMission` Callable Cloud Functions。前者只接受白名單 `templateId`，從 server profile 取得生日、依存檔時區產生期限與規則快照，且以模板／年度去重；後者在單一 Admin SDK transaction 中結算 mission、resolution、progression、collection，並禁止任務開放前結算。已補 Firestore Emulator server transaction tests。client 的 `MissionRepository` 已改為唯讀；正式建立一律經 `CallableMissionGenerationService` 請求。

> **部署準備狀態：** 已建立 `dev` Firebase alias（`lovegame-i-dev`）與只部署兩個任務 Function 的指令。目前專案為 Spark，無法部署 Cloud Functions；升級 Blaze、設定帳單預算警示與啟用 App Check 後，才可部署並進行遠端推播，詳見 `docs/functions-deployment.md`。

## 資安與上線前不可延後事項

以下不是一般 UI 優化；若延後處理，可能造成資料外洩、遊戲數值可竄改、上線前高成本 migration，或需要重新建置原生 App。

| 項目 | 風險／原因 | 最晚完成時點 |
| --- | --- | --- |
| Firestore Security Rules + Emulator tests | 沒有 owner isolation 時，猜到 ID 的使用者可能讀寫他人資料；Rules 若無測試，日後修改易意外開洞 | 第一筆正式使用者資料寫入前 |
| Server-side mission resolution | 若 client 可直接寫 EXP、Combo、Rank、解鎖或 GG，使用者可竄改遊戲結果；日後清理作弊資料成本很高 | 發布任務完成功能前 |
| 資料 schema version + migration | relationship、mission、progression 文件一旦有正式資料，欄位重命名／拆分將需要 migration | 第一版 Firestore schema 建立時 |
| Firebase App Check + API key restrictions | Firebase Web config 不是秘密；若缺少 App Check／限制，服務可能被非官方 client 濫用 | 公開 Beta 前 |
| **Blaze 方案 + 預算警示 + App Check** | Cloud Functions 與 server push 無法在 Spark 部署；未設預算警示可能產生未預期費用，未啟用 App Check 則增加非官方 client 濫用風險 | **部署任一 Cloud Function／遠端推播前（必修 gate）** |
| Analytics 資料最小化 | 一旦上傳姓名、email、完整日期、內容或位置，既有 Analytics 資料通常無法可靠刪除或回收 | Firebase Analytics adapter 上線前 |
| Push Token／通知內容 | Token 屬裝置識別資料；鎖定畫面通知若含任務內容或個資，無法由 App 控制誰看見 | 遠端推播接入前 |
| OAuth Client ID 與 Android SHA 指紋 | Google 登入需要正式 package name、SHA-1／SHA-256 與 redirect 設定；上架後變更會造成登入失敗並需重新發版 | EAS Development Build 前，Production build 前再次核對 |
| EAS／Android 簽署金鑰備份與權限 | 遺失上架簽署金鑰可能無法更新既有 Android App；多人共用帳號也增加供應鏈風險 | 第一個 Play internal build 前 |

### 全階段共通規則

- 不得將 Firebase Admin JSON、Expo access token、OAuth client secret、私密 API key 寫入 Git、App bundle、`EXPO_PUBLIC_*` 或 Analytics。
- `EXPO_PUBLIC_*` 僅能放公開設定與 Feature Flag，不可視為秘密。
- Firestore 文件不得以伴侶姓名、email、完整重要日等可猜測個資作為 document ID。
- 所有寫入必須驗證 authenticated `uid`，並以 server timestamp／使用者時區處理任務時間。
- 正式資料寫入前，先建立刪除帳號／資料匯出／隱私權政策的最小流程；這些需求日後補做會涉及既有資料與法規風險。

## Phase 1 — Repository contracts 與 Firestore adapter

### 目標

讓 UI 與 Application 永遠只依賴 repository interface；目前的 Local／Mock 儲存與未來 Firestore 可互換，不需要修改 View。

### 要建立的 contracts

```text
RelationshipRepository
├ getProfile(userId)
└ saveProfile(userId, profile)

MissionRepository (read only)
├ getActiveMissions(userId)
└ getMission(userId, missionId)

MissionGenerationService
└ create(templateId) → Callable Function

ProgressionRepository
├ getGameState(userId)
└ saveGameState(userId, state)

CollectionRepository
├ getCollectionState(userId)
└ saveCollectionState(userId, state)
```

### 實作順序

1. 在各 feature 的 `data/` 定義 interface 與 DTO。
2. 補齊 Local／Mock adapter，讓目前 prototype 繼續可執行。
3. 在 `infrastructure/firebase/` 建立對應 `Firestore*Repository` adapter。
4. 只在 `App.tsx` composition root 切換 Local 或 Firestore 實作。
5. 加入 Firestore Security Rules、schema mapping、錯誤轉換與 migration 策略。

目前已建立：`RelationshipRepository`、`MissionRepository`、`ProgressionRepository`、`CollectionRepository`、`SaveRepository`，以及對應 Local、Firestore adapters。Firestore 固定使用 `/users/{uid}/saves/default/...`；`FirestoreSaveRepository` 必須先建立有 `ownerUserId` 的 default save 根文件，才可寫入子集合。3A Security Rules 與 transaction 完成前，`GameplayRepository` 仍是 prototype aggregate 的相容層，App 不得切換為 Firestore 直連。

### 驗收條件

- View、shared UI、Domain 不得 import Firebase 或 Firestore。
- 每個 repository method 有 interface、Local adapter 與測試。
- 更換 adapter 後，導航與 View 不需要修改。
- 任務結算、EXP、Combo、Rank、收藏解鎖在正式版必須由 server transaction 權威寫入。

### 資安與不可逆備註

- **不可延後：** Firestore Security Rules、Emulator tests、schema version、document ownership 欄位必須和第一版 Firestore schema 一起完成。
- 任何包含伴侶資料的文件都必須以隨機 ID 建立，並含有不可由 client 偽造的 owner reference；不可直接用姓名或日期當 document ID。
- 一旦有正式資料，任意變更欄位名稱、日期格式、任務 ID 格式都需要 migration 計畫；不可直接覆寫舊 schema。

### 後續升級

任務結算已開始搬入 Cloud Functions；接下來將任務生成與通知工作搬入，client 僅讀取結果與提出請求。

## Phase 2 — 真實任務建立與 `mission_create`

### 目標

只在任務真正建立並成功寫入 repository 後，送出一次 `mission_create`。不得在讀取 mock 資料、重新整理頁面或單純開啟任務時假造此事件。

### 要建立的流程

```text
Important Date / 使用者建立事件
        ↓
MissionGenerationService
        ↓
createMission Callable Function
        ↓
成功寫入後 → AnalyticsService.track('mission_create')
```

### `mission_create` 共用參數

```ts
{
  mission_id,
  mission_type,
  mission_source,   // system | reminder | user
  difficulty,       // easy | normal | hard
  days_before_due,
}
```

### 驗收條件

- 同一個 `mission_id` 只送一次建立事件。
- 建立失敗時不得送 event。
- 不傳送伴侶姓名、完整日期、任務文案、備註或位置。
- `mission_view`、`mission_start`、`mission_complete` 能以同一 `mission_id` 串成漏斗。

### 資安與不可逆備註

- `mission_id` 必須是不可預測的 generated ID，不能含 user ID、伴侶名稱、完整日期或任務文案。
- client 僅能提出建立請求；正式版的期限、difficulty、reward、source 與 template version 應由可信任規則產生並寫入快照，避免日後 Content Config 變動改寫歷史任務意義。
- `createMission` 已由 Cloud Function 產生；目前開放五個生日準備模板，並以 `templateId:targetYear` 去重。擴充到其他日期來源仍列於 Phase 6；後續新模板必須先加到 server Content Config，不能讓 client 自帶 reward、期限或文案。

### 後續升級

`createMissionAndTrack` 已在 Application layer 實作：僅於 `created === true` 時送出 `mission_create`；去重命中或失敗時不得送出事件。正式 Firebase Analytics adapter 接入前，事件仍由 Development adapter 處理。

## Phase 3 — Firebase Analytics adapter

### 目標

以 Firebase Analytics 作為正式事件傳送服務，保留現有 `AnalyticsService` interface，取代開發用的 `DevelopmentAnalyticsService`。

### 實作順序

1. 完成 Firebase 專案的 Android／iOS 設定。
2. 建立 `FirebaseAnalyticsService implements AnalyticsService`。
3. 在 `App.tsx` composition root：Production 使用 Firebase adapter，`__DEV__` 使用 Console adapter。
4. 在 Firebase／Google Analytics 註冊必要 custom dimensions：`mission_type`、`mission_source`、`difficulty`、`collection_type`。
5. 驗證 DebugView 與正式事件命名。

### 重要規則

- `app_open` 由 Firebase Analytics 自動收集，client 不得手動呼叫一次。
- Analytics 僅收集行為分類與非個資參數。
- 不得送出姓名、email、電話、完整日期、任務文字、禮物內容、備註、精確位置。

### 資安與不可逆備註

- **不可延後：** Firebase Analytics adapter 上線前，必須檢查每個 event 的 properties 與 DebugView；事件資料上傳後不應假設能逐筆刪除。
- Firebase Analytics 的 `app_open` 已自動收集，禁止 client 手動重送，否則正式漏斗基準會被污染。
- 自訂參數名稱與型別要在上線前固定，並在 Firebase 註冊 custom dimensions；頻繁改名會切斷歷史趨勢。

### Google Analytics 漏斗

Google Analytics → 探索 → 漏斗探索：

1. `mission_create`
2. `mission_view`
3. `mission_start`
4. `mission_complete`
5. `reward_view`

### 驗收條件

- DebugView 可看到手動事件，且沒有重複 `app_open`。
- 每個 mission funnel event 帶 `mission_id`。
- 正式 adapter 替換不改動 View 與 Domain。

## Phase 4 — 高頻 UI primitives

### 要建立的元件

| 元件 | 統一的內容 |
| --- | --- |
| `StatusBadge` | danger、success、late、fail、active、GG 等狀態 |
| `ProgressBar` | HP、EXP、Combo、任務進度 |
| `MissionCard` | 任務類型、狀態、截止、獎勵、主要行動 |
| `RewardSummary` | EXP、Combo、Rank delta、解鎖資訊 |
| `Dialog` | 確認、資訊、危險操作的共用對話框 |
| `BottomSheet` | 個人中心、SOS、任務選項等底部面板容器 |

### 實作原則

- 使用現有 Color、Typography、Spacing、Radius token；不得寫死色碼。
- 危險、成功、失敗、Rank、EXP、Mission、Reward 必須有語意 variant。
- 每個 primitive 只處理視覺和 interaction；不得含任務規則或 repository 呼叫。
- 每個元件應包含 loading、disabled、accessibility 的基本狀態。

### 驗收條件

- SOS、個人中心、任務詳情等既有畫面逐步改用 `Dialog`／`BottomSheet`。
- 任務列表與結果頁改用 `MissionCard`／`RewardSummary`。
- 新畫面不應自行複製狀態 Tag、進度條或彈窗樣式。

### 上線前備註

- UI primitive 的 API 在多個畫面使用後再調整，會有大範圍修改成本；先固定語意 variant 與 accessibility contract，再擴散使用。
- 深色模式、字體 fallback、最小觸控區與長文字換行必須在實機驗證，不可只以 Web 視覺作為驗收。

## Phase 5 — 遠端推播與 EAS 實機驗證

### 遠端推播不可延後事項

- **必修 gate：** 在部署任何遠端推播派送 Function 前，必須依序完成 **Blaze 方案啟用、帳單預算與警示設定、Firebase App Check 啟用與驗證**。Spark 無法部署 Cloud Functions；未設預算警示可能產生未預期費用，而未啟用 App Check 會讓 token 註冊與推播 API 更容易遭非官方 client 濫用。
- 在上述 gate 完成前，只能使用目前的本機通知；不得為求快速上線改成 client 直接寫入裝置 token、直接呼叫 Expo Push API，或直接建立 `notificationJobs`。
- Expo Push Token 必須和使用者、裝置、有效狀態分開儲存；登出、token 失效與刪帳時要撤銷／刪除。
- 推播內容只顯示最低限度提醒，禁止包含任務文案、伴侶姓名、完整日期、備註或其他鎖定畫面可見個資。
- 通知 job 的建立與派送由 server 管理；client 本機排程只能作為輔助，不是任務結果的權威來源。

### EAS／原生上線不可延後事項

- 在第一個 Android internal build 前，備份並限制 EAS／Google Play signing key 存取權限。
- 固定 Android package name 後，Google OAuth 的 SHA-1／SHA-256、Firebase Android app 與 redirect 設定必須逐一核對。
- 在實機測試登入、SecureStore、通知權限、通知點擊 deep link、登出後 token 清除；Expo Go／Web 成功不能視為原生驗收完成。

## Phase 6 — 完整重要日任務旅程與個人化建議

### 狀態與目標

狀態：**已確認需求，待排程實作。**

讓所有已設定日期都能驅動首頁倒數與五階段任務。重要日任務是首頁與任務區的主要內容；每日抽卡及週末挑戰降為輔助內容。任務內的行動建議與推薦必須使用已保存的喜好、飲食限制及地雷資料進行篩選。

### 日期範圍與首頁倒數

- 生日、交往紀念日、結婚紀念日及所有自訂日期，無論 `importance` 為 `survival` 或 `normal`，都必須參與首頁倒數候選。
- 首頁以「下一次發生時間最近」為排序依據顯示主要倒數，不得固定讓生日優先。
- 年度重複日期須計算下一次 occurrence；同日事件需有穩定且可測試的次要排序規則。
- 自訂重要日必須和內建日期使用相同的倒數與任務生成流程。
- 日期的 `importance` 只控制 Rank 影響，不控制是否顯示倒數或是否生成任務。

### 每個日期的五階段任務

每一個日期 occurrence 預設套用完整五個任務：

| 任務 | 開放時間 | Success 截止（不含） | 最終 Fail |
| --- | ---: | --- | --- |
| 訂餐廳 | D-29 | 事件日 +9 天 00:00 | 重要日當天 00:00 |
| 訂禮物 | D-15 | 事件日 +5 天 00:00 | 重要日當天 00:00 |
| 訂電影院 | D-9 | 事件日 +3 天 00:00 | 重要日當天 00:00 |
| 寫卡片 | D-5 | 事件日 +2 天 00:00 | 重要日當天 00:00 |
| 確認行程 | D-3 | 事件日 +1 天 00:00 | 重要日當天 00:00 |

- `successUntil = eventDate + successDays`，不得再額外加一天。
- `failAt = targetImportantDate 00:00`，不得由 `successUntil` 推算。
- 同一日期 occurrence 與 template 最多生成一個任務；必須以穩定 dedupe key 防止重複。
- 任務生成時快照日期 importance、努力程度、規則版本、喜好與地雷篩選版本，後續修改設定不得回溯改變既有任務。

### 未來可選的努力程度

日期設定未來保留「要投入多少努力」的選項。第一版完整旅程可先以 100% 為預設，但資料模型與生成規則不得假設永遠固定五個任務。

| 努力程度 | 產品意義 | 預定任務量 |
| --- | --- | ---: |
| 100% 努力 | 完整準備流程 | 五個任務 |
| 50% 活著就好 | 保留核心準備事項 | 訂禮物、寫卡片、確認行程 |
| 10% 不想努力了 | 最低維持方案 | 僅確認行程 |

- 選項應儲存在日期設定，而不是散落在 UI 判斷。
- 任務模板組合應由 versioned Content Config 決定，避免在畫面中硬寫百分比對應規則。
- 努力程度只控制生成哪些模板；目前不調整單一任務的 Reward。
- 任務生成時由 server 驗證允許的模板並快照努力程度，client 不得自行繞過組合限制。

### 首頁與任務區資訊層級

- 首頁第一優先顯示最近日期的倒數、準備狀態、最急迫未完成任務及進入任務的主要行動。
- 首頁應依任務狀態區分尚未開放、可成功完成、Late 與當日 Fail 風險，不只顯示通用警告。
- 任務區先依日期 occurrence 分組，再依任務急迫度、結果區間及開放時間排序。
- 重要日任務置於每日抽卡與週末挑戰之前；每日與週末內容不得搶走主要行動位置。
- 多個日期接近時，使用者仍應能查看其他日期及其任務，不可只保留最近一筆資料。

### 喜好、飲食與地雷接入

- 訂禮物、訂餐廳、訂電影院、寫卡片與確認行程的建議，都必須讀取 Relationship Preferences。
- `preferenceTags` 用於提高符合偏好的建議排序；`dietaryPreferences` 與 `landmines` 用於排除或明確警告不適合項目。
- 地雷屬硬性安全篩選時，不得只降低排序後仍呈現為主要推薦。
- 推薦結果需說明使用了哪些偏好分類，但不得把伴侶個資或完整重要日送入 Analytics。
- 推薦資料來源、是否先採內建靜態清單，以及未來外部服務的 adapter 邊界，需在實作前另行決定；不得由畫面直接呼叫外部 API。
- 當偏好資料不足或所有候選皆被排除時，必須提供可理解的空狀態與一般行動建議。

### 驗收條件

- 所有日期類型都能正確選出最近 occurrence，包含跨年、同日事件及閏日。
- 每個 occurrence 預設產生五個任務，且重新整理、重試及跨裝置不會重複生成。
- 所有任務都在重要日當天 00:00 Fail，且 server time／save timezone 是唯一判定來源。
- 首頁主要倒數、主要任務與任務區第一順位指向相同的最近事件。
- 每日與週末任務仍可使用，但視覺與排序均低於重要日任務。
- 測試證明地雷能排除候選，喜好能調整排序，資料不足時能安全 fallback。
- 新增或修改的日期選擇、任務生成、截止時間、排序及推薦篩選規則都有 Domain／Function unit tests。

## 每次開發前檢查

- 功能是否屬於已確認 MVP scope？
- UI 是否只負責顯示、點擊、loading、error？
- 規則是否在 Domain／Content Config，而非 View？
- 資料是否透過 repository interface？
- 對外文案是否在 `src/content/copy/`？
- 事件是否在 Analytics 白名單，且不含個資？
- 新增或修改規則後是否有 unit test？
